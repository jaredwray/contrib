import { ClientSession, Connection, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IInvitation, InvitationModel } from '../mongodb/InvitationModel';
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
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { Events } from '../../Events';
import { AppLogger } from '../../../logger';
import { EventHub } from '../../EventHub';
import { UrlShortenerService } from '../../Core';
import { InfluencerStatus } from '../../Influencer/dto/InfluencerStatus';

export class InvitationService {
  private readonly InvitationModel = InvitationModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly assistantService: AssistantService,
    private readonly userAccountService: UserAccountService,
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

  async inviteInfluencer(input: InviteInput): Promise<InfluencerProfile> {
    const session = await this.connection.startSession();
    let influencerProfile: InfluencerProfile = null;

    try {
      const { firstName, lastName, phoneNumber, welcomeMessage } = input;

      await session.withTransaction(async () => {
        const userAccount = await this.userAccountService.getAccountByPhoneNumber(phoneNumber, session);
        influencerProfile = await this.getOrCreateTransientInfluencer(input, session);

        if (userAccount) {
          influencerProfile = await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.ONBOARDED,
            userAccount,
            session,
          );

          const link = await this.urlShortenerService.shortenUrl(AppConfig.app.url);
          const message = `Hello, ${firstName}. You have been invited to Contrib at ${link}. Sign in with your phone number to begin.`;
          await this.twilioNotificationService.sendMessage(phoneNumber, message);
          await this.eventHub.broadcast(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });
        } else {
          if (await this.InvitationModel.exists({ phoneNumber })) {
            throw new AppError(`Invitation to ${phoneNumber} has already been sent`, ErrorCode.BAD_REQUEST);
          }
          const invitation = await this.createInfluencerInvitation(
            influencerProfile,
            {
              phoneNumber,
              firstName,
              lastName,
              welcomeMessage,
            },
            session,
          );
          const link = await this.makeInvitationLink(invitation.slug);
          influencerProfile = await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.INVITATION_PENDING,
            null,
            session,
          );
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
      await session.withTransaction(async () => {
        const account = await this.userAccountService.getAccountByPhoneNumber(input.phoneNumber);
        if (account) {
          assistant = await this.creatAssistantForExistingUser(input, account, session);
        } else {
          assistant = await this.createNewAssistant(input, session);
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

    return await this.influencerService.createTransientInfluencer({ name: `${firstName} ${lastName}` });
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
          invitation.accepted = true;
          invitation.updatedAt = new Date();
          await invitation.save();
          const influencerProfile = await this.influencerService.assignUserToInfluencer(
            invitation.parentEntityId,
            userAccount.mongodbId,
            session,
          );
          await this.eventHub.broadcast(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });
        });
      } else if (invitation.parentEntityType === InvitationParentEntityType.ASSISTANT) {
        await session.withTransaction(async () => {
          invitation.accepted = true;
          invitation.updatedAt = new Date();
          await invitation.save();
          const assistant = await this.assistantService.assignUserToAssistant(
            invitation.parentEntityId,
            userAccount.mongodbId,
            session,
          );
          await this.eventHub.broadcast(Events.ASSISTANT_ONBOARDED, { userAccount, assistant });
        });
      } else {
        AppLogger.error(`unexpected parent entity type ${invitation.parentEntityType} for invitation ${invitation.id}`);
      }
    } finally {
      session.endSession();
    }
  }

  private async makeInvitationLink(slug: string): Promise<string> {
    return this.urlShortenerService.shortenUrl(`${AppConfig.app.url}/invitation/${slug}`);
  }

  private async creatAssistantForExistingUser(
    { firstName, lastName, phoneNumber, influencerId }: InviteInput,
    userAccount: UserAccount,
    session: ClientSession,
  ): Promise<Assistant> {
    if (await this.assistantService.findAssistantByUserAccount(userAccount.mongodbId)) {
      throw new AppError(`${phoneNumber} is already using the system for the Assistant`, ErrorCode.BAD_REQUEST);
    }

    const influencer = await this.influencerService.findInfluencer(influencerId);
    if (!influencer) {
      throw new AppError(`Invalid influencerId #${influencerId}`, ErrorCode.BAD_REQUEST);
    }

    const assistant = await this.assistantService.createAssistant(
      {
        name: `${firstName} ${lastName}`,
        userAccount: userAccount.mongodbId,
        influencer: influencerId,
      },
      session,
    );

    await this.influencerService.assignAssistantsToInfluencer(influencerId, assistant.id);

    const link = await this.urlShortenerService.shortenUrl(AppConfig.app.url);
    const message = `Hello, ${firstName}. You have been invited to Contrib at ${link}. Sign in with your phone number to begin.`;
    await this.twilioNotificationService.sendMessage(userAccount.phoneNumber, message);

    await this.eventHub.broadcast(Events.ASSISTANT_ONBOARDED, { userAccount, assistant });

    return assistant;
  }

  private async createNewAssistant(
    { firstName, lastName, phoneNumber, welcomeMessage, influencerId }: InviteInput,
    session: ClientSession,
  ): Promise<Assistant> {
    if (await this.InvitationModel.exists({ phoneNumber })) {
      throw new AppError(`Invitation to ${phoneNumber} has already been sent`, ErrorCode.BAD_REQUEST);
    }

    const assistant = await this.assistantService.createAssistant(
      {
        name: `${firstName} ${lastName}`,
        userAccount: null,
        influencer: influencerId,
      },
      session,
    );

    await this.influencerService.assignAssistantsToInfluencer(influencerId, assistant.id);

    const invitation = await this.createAssistantInvitation(
      assistant,
      {
        phoneNumber,
        firstName,
        lastName,
        welcomeMessage,
        influencerId,
      },
      session,
    );

    const link = await this.makeInvitationLink(invitation.slug);
    const message = `Hello, ${firstName}! You have been invited to join Contrib at ${link}`;
    await this.twilioNotificationService.sendMessage(phoneNumber, message);
    return assistant;
  }

  private async createAssistantInvitation(
    parent: Assistant,
    { phoneNumber, firstName, lastName, welcomeMessage }: InviteInput,
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
          accepted: false,
          parentEntityType: InvitationParentEntityType.ASSISTANT,
          parentEntityId: Types.ObjectId(parent.id),
          createdAt: now,
          updatedAt: now,
        },
      ],
      { session },
    );
    return InvitationService.makeInvitation(invitation[0]);
  }

  private async createInfluencerInvitation(
    parent: InfluencerProfile | Assistant,
    { phoneNumber, firstName, lastName, welcomeMessage }: InviteInput,
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
          accepted: false,
          parentEntityType: InvitationParentEntityType.INFLUENCER,
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
