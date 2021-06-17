import { UserAccount } from 'app/UserAccount/dto/UserAccount';
import { ClientSession, Connection, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IInvitation, InvitationModel } from '../mongodb/InvitationModel';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';
import { AssistantModel } from '../../Assistant/mongodb/AssistantModel';
import { InfluencerService } from '../../Influencer';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { InviteInput } from '../graphql/model/InviteInput';
import { TwilioNotificationService } from '../../../twilio-client';
import { AppConfig } from '../../../config';
import { Invitation } from '../dto/Invitation';
import { InvitationParentEntityType } from '../mongodb/InvitationParentEntityType';
import { AppError, ErrorCode } from '../../../errors';
import { Assistant } from '../../Assistant/dto/Assistant';
import { AssistantService } from '../../Assistant';
import { UserAccountService } from '../../UserAccount';
import { Events } from '../../Events';
import { AppLogger } from '../../../logger';
import { EventHub } from '../../EventHub';
import { UrlShortenerService } from '../../Core';
import { InfluencerStatus } from '../../Influencer/dto/InfluencerStatus';
import { Charity } from '../../Charity/dto/Charity';
import { CharityService } from '../../Charity';
import { CharityStatus } from '../../Charity/dto/CharityStatus';

export class InvitationService {
  private readonly InvitationModel = InvitationModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly InfluencerModel = InfluencerModel(this.connection);
  private readonly AssistantModel = AssistantModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly assistantService: AssistantService,
    private readonly userAccountService: UserAccountService,
    private readonly charityService: CharityService,
    private readonly influencerService: InfluencerService,
    private readonly twilioNotificationService: TwilioNotificationService,
    private readonly eventHub: EventHub,
    private readonly urlShortenerService: UrlShortenerService,
  ) {
    eventHub.subscribe(Events.USER_ACCOUNT_CREATED, async (userAccount) => {
      await this.maybeFinalizeInvitation(userAccount);
    });
  }

  async findInvitationBySlug(slug: string): Promise<Invitation | null> {
    const model = await this.InvitationModel.findOne({ slug }).exec();
    return InvitationService.makeInvitation(model);
  }

  async listInvitationsByParentEntityIds(parentEntityIds: readonly string[]): Promise<Invitation[]> {
    const models = await this.InvitationModel.find({
      parentEntityId: { $in: parentEntityIds },
    });
    return models.map((model) => InvitationService.makeInvitation(model));
  }

  async inviteCharity(input: InviteInput): Promise<Charity> {
    const session = await this.connection.startSession();
    let charity: Charity = null;

    try {
      const { firstName, lastName, phoneNumber, welcomeMessage } = input;

      await session.withTransaction(async () => {
        const findedAccount = await this.UserAccountModel.findOne({ phoneNumber: phoneNumber });
        if (
          findedAccount &&
          (await this.CharityModel.exists({
            userAccount: findedAccount._id.toString(),
          }))
        ) {
          throw new AppError(`Account with phone number: ${phoneNumber} already has charity`, ErrorCode.BAD_REQUEST);
        }

        const userAccount = await this.userAccountService.getAccountByPhoneNumber(phoneNumber, session);
        charity = await this.charityService.createCharity({ name: 'My Charity Name' }, session);

        const inviteInput = {
          phoneNumber,
          firstName,
          lastName,
          welcomeMessage,
          parentEntityType: InvitationParentEntityType.CHARITY,
        };

        if (userAccount) {
          const invitation = await this.createInvitation(
            charity,
            {
              ...inviteInput,
              accepted: true,
            },
            session,
          );

          charity = await this.charityService.updateCharityStatus({
            charity,
            userAccount,
            status: CharityStatus.PENDING_ONBOARDING,
            session,
          });

          const link = await this.makeInvitationLink(invitation.slug);
          const message = `Hello, ${firstName}. You have been invited to Contrib at ${link}. Sign in with your phone number to begin.`;
          await this.twilioNotificationService.sendMessage(phoneNumber, message);
          await this.eventHub.broadcast(Events.CHARITY_ONBOARDED, { charity, session });
        } else {
          const invitation = await this.createInvitation(charity, inviteInput, session);

          charity = await this.charityService.updateCharityStatus({
            charity,
            status: CharityStatus.PENDING_INVITE,
            session,
          });

          const link = await this.makeInvitationLink(invitation.slug);
          const message = `Hello, ${firstName}! You have been invited to join Contrib at ${link}`;
          await this.twilioNotificationService.sendMessage(phoneNumber, message);
        }
      });
      return charity;
    } finally {
      session.endSession();
    }
  }

  async inviteInfluencer(input: InviteInput): Promise<InfluencerProfile> {
    const session = await this.connection.startSession();
    let influencerProfile: InfluencerProfile = null;

    try {
      const { firstName, lastName, phoneNumber, welcomeMessage } = input;

      await session.withTransaction(async () => {
        const findedAccount = await this.UserAccountModel.findOne({ phoneNumber: phoneNumber });
        if (
          await this.InvitationModel.exists({ phoneNumber, parentEntityType: InvitationParentEntityType.INFLUENCER })
        ) {
          throw new AppError(`Invitation to ${phoneNumber} has already been sent`, ErrorCode.BAD_REQUEST);
        }
        if (
          findedAccount &&
          (await this.InfluencerModel.exists({
            userAccount: findedAccount._id.toString(),
          }))
        ) {
          throw new AppError(`Account with phone number: ${phoneNumber} already has influencer`, ErrorCode.BAD_REQUEST);
        }

        const userAccount = await this.userAccountService.getAccountByPhoneNumber(phoneNumber, session);
        influencerProfile = await this.getOrCreateTransientInfluencer(input, session);

        const inviteInput = {
          phoneNumber,
          firstName,
          lastName,
          welcomeMessage,
          parentEntityType: InvitationParentEntityType.INFLUENCER,
        };

        if (userAccount) {
          const invitation = await this.createInvitation(
            influencerProfile,
            {
              ...inviteInput,
              accepted: true,
            },
            session,
          );

          influencerProfile = await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.ONBOARDED,
            userAccount,
            session,
          );

          const link = await this.makeInvitationLink(invitation.slug);
          const message = `Hello, ${firstName}. You have been invited to Contrib at ${link}. Sign in with your phone number to begin.`;
          await this.twilioNotificationService.sendMessage(phoneNumber, message);
          await this.eventHub.broadcast(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });
        } else {
          const invitation = await this.createInvitation(influencerProfile, inviteInput, session);

          influencerProfile = await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.INVITATION_PENDING,
            null,
            session,
          );

          const link = await this.makeInvitationLink(invitation.slug);
          const message = `Hello, ${firstName}! You have been invited to join Contrib at ${link}`;
          await this.twilioNotificationService.sendMessage(phoneNumber, message);
        }
      });

      return influencerProfile;
    } finally {
      session.endSession();
    }
  }

  async inviteAssistant(input: InviteInput): Promise<Assistant> {
    const session = await this.connection.startSession();
    let assistant: Assistant = null;

    try {
      const { firstName, lastName, phoneNumber, welcomeMessage, influencerId } = input;

      await session.withTransaction(async () => {
        const findedAccount = await this.UserAccountModel.findOne({ phoneNumber: phoneNumber });
        if (
          await this.InvitationModel.exists({ phoneNumber, parentEntityType: InvitationParentEntityType.ASSISTANT })
        ) {
          throw new AppError(`Invitation to ${phoneNumber} has already been sent`, ErrorCode.BAD_REQUEST);
        }
        if (
          findedAccount &&
          (await this.AssistantModel.exists({
            userAccount: findedAccount._id.toString(),
          }))
        ) {
          throw new AppError(`Account with phone number: ${phoneNumber} already has assistant`, ErrorCode.BAD_REQUEST);
        }

        const userAccount = await this.userAccountService.getAccountByPhoneNumber(phoneNumber);

        const inviteInput = {
          phoneNumber,
          firstName,
          lastName,
          welcomeMessage,
          parentEntityType: InvitationParentEntityType.ASSISTANT,
        };

        if (userAccount) {
          if (await this.assistantService.findAssistantByUserAccount(userAccount.mongodbId)) {
            throw new AppError(`${phoneNumber} is already using the system for the Assistant`, ErrorCode.BAD_REQUEST);
          }

          const influencer = await this.influencerService.findInfluencer(influencerId);

          if (!influencer) {
            throw new AppError(`Invalid influencerId #${influencerId}`, ErrorCode.BAD_REQUEST);
          }

          assistant = await this.assistantService.createAssistant(
            {
              name: `${firstName} ${lastName}`,
              userAccount: userAccount.mongodbId,
              influencer: influencerId,
            },
            session,
          );

          const invitation = await this.createInvitation(
            assistant,
            {
              ...inviteInput,
              accepted: true,
            },
            session,
          );

          await this.influencerService.assignAssistantsToInfluencer(influencerId, assistant.id);

          const link = await this.makeInvitationLink(invitation.slug);
          const message = `Hello, ${firstName}. You have been invited to Contrib at ${link}. Sign in with your phone number to begin.`;
          await this.twilioNotificationService.sendMessage(phoneNumber, message);
          await this.eventHub.broadcast(Events.ASSISTANT_ONBOARDED, { userAccount, assistant });
        } else {
          assistant = await this.assistantService.createAssistant(
            {
              name: `${firstName} ${lastName}`,
              userAccount: null,
              influencer: influencerId,
            },
            session,
          );

          const invitation = await this.createInvitation(assistant, inviteInput, session);

          await this.influencerService.assignAssistantsToInfluencer(influencerId, assistant.id);

          const link = await this.makeInvitationLink(invitation.slug);
          const message = `Hello, ${firstName}! You have been invited to join Contrib at ${link}`;
          await this.twilioNotificationService.sendMessage(phoneNumber, message);
        }
      });

      return assistant;
    } finally {
      session.endSession();
    }
  }

  private async getOrCreateTransientInfluencer(
    { influencerId, firstName, lastName }: InviteInput,
    session: ClientSession,
  ): Promise<InfluencerProfile | null> {
    if (influencerId) {
      const profile = await this.influencerService.findInfluencer(influencerId, session);

      if (!profile) {
        throw new AppError('requested influencer profile does not exist');
      }

      if (profile.status !== InfluencerStatus.TRANSIENT || profile.userAccount) {
        throw new AppError('given influencer has already been invited');
      }

      return profile;
    }

    return await this.influencerService.createTransientInfluencer({ name: `${firstName} ${lastName}` }, session);
  }

  private async maybeFinalizeInvitation(userAccount: UserAccount): Promise<void> {
    const session = await this.InvitationModel.startSession();
    try {
      const invitation = await this.InvitationModel.findOne({ phoneNumber: userAccount.phoneNumber }, null, {
        session,
      });

      if (!invitation) {
        return;
      }

      if (invitation.accepted) {
        throw new Error(
          `user account with ${userAccount.phoneNumber} has been created, but invitation to the same phone number is already accepted`,
        );
      }

      if (invitation.parentEntityType === InvitationParentEntityType.INFLUENCER) {
        await session.withTransaction(async () => {
          await this.acceptInvitation(invitation);
          const influencerProfile = await this.influencerService.assignUserToInfluencer(
            invitation.parentEntityId,
            userAccount.mongodbId,
            session,
          );
          await this.eventHub.broadcast(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });
        });
      } else if (invitation.parentEntityType === InvitationParentEntityType.ASSISTANT) {
        await this.acceptInvitation(invitation);
        await session.withTransaction(async () => {
          const assistant = await this.assistantService.assignUserToAssistant(
            invitation.parentEntityId,
            userAccount.mongodbId,
            session,
          );
          await this.eventHub.broadcast(Events.ASSISTANT_ONBOARDED, { userAccount, assistant });
        });
      } else if (invitation.parentEntityType === InvitationParentEntityType.CHARITY) {
        await this.acceptInvitation(invitation);
        await session.withTransaction(async () => {
          const charity = await this.charityService.assignUserToCharity(
            invitation.parentEntityId,
            userAccount.mongodbId,
            session,
          );
          await this.eventHub.broadcast(Events.CHARITY_ONBOARDED, { charity, session });
        });
      } else {
        AppLogger.error(`unexpected parent entity type ${invitation.parentEntityType} for invitation ${invitation.id}`);
      }
    } finally {
      session.endSession();
    }
  }

  private async acceptInvitation(invitation: IInvitation): Promise<IInvitation> {
    invitation.accepted = true;
    invitation.updatedAt = new Date();
    return await invitation.save();
  }

  private async makeInvitationLink(slug: string): Promise<string> {
    return this.urlShortenerService.shortenUrl(`${AppConfig.app.url}/invitation/${slug}`);
  }

  private async createInvitation(
    parent: InfluencerProfile | Assistant | Charity,
    { phoneNumber, firstName, lastName, welcomeMessage, accepted, parentEntityType }: InviteInput,
    session: ClientSession,
  ): Promise<Invitation> {
    const now = new Date();
    const slug = uuidv4();
    const invitation = await InvitationModel(this.connection).create(
      [
        {
          slug,
          firstName,
          lastName,
          phoneNumber,
          welcomeMessage,
          accepted: accepted ?? false,
          parentEntityType,
          parentEntityId: Types.ObjectId(parent.id),
          createdAt: now,
          updatedAt: now,
        },
      ],
      { session },
    );
    return InvitationService.makeInvitation(invitation[0]);
  }

  private static makeInvitation(model: IInvitation): Invitation | null {
    if (!model) {
      return null;
    }
    return {
      id: model._id.toString(),
      slug: model.slug,
      firstName: model.firstName,
      lastName: model.lastName,
      welcomeMessage: model.welcomeMessage,
      phoneNumber: model.phoneNumber,
      accepted: model.accepted,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
      parentEntityId: model.parentEntityId.toString(),
      parentEntityType: model.parentEntityType,
    };
  }
}
