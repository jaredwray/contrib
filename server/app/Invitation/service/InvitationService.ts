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
import { ShortLinkService, ShortLinkModel } from '../../ShortLink';
import { Events } from '../../Events';
import { AppLogger } from '../../../logger';
import { EventHub } from '../../EventHub';
import { InfluencerStatus } from '../../Influencer/dto/InfluencerStatus';
import { Charity } from '../../Charity/dto/Charity';
import { CharityService } from '../../Charity';
import { CharityStatus } from '../../Charity/dto/CharityStatus';
import { objectTrimmer } from '../../../helpers/objectTrimmer';

export class InvitationService {
  private readonly InvitationModel = InvitationModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly InfluencerModel = InfluencerModel(this.connection);
  private readonly AssistantModel = AssistantModel(this.connection);
  private readonly ShortLinkModel = ShortLinkModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly assistantService: AssistantService,
    private readonly userAccountService: UserAccountService,
    private readonly charityService: CharityService,
    private readonly influencerService: InfluencerService,
    private readonly twilioNotificationService: TwilioNotificationService,
    private readonly eventHub: EventHub,
    private readonly shortLinkService: ShortLinkService,
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

  async inviteCharity(input: InviteInput): Promise<{ invitationId: string }> {
    const session = await this.connection.startSession();
    let returnObject = null;

    try {
      const { firstName, lastName, phoneNumber, welcomeMessage } = objectTrimmer(input);

      await session.withTransaction(async () => {
        const findedAccount = await this.UserAccountModel.findOne({ phoneNumber: phoneNumber });

        if (
          findedAccount &&
          (await this.CharityModel.exists({
            userAccount: findedAccount._id,
          }))
        ) {
          throw new AppError(`Account with phone number: ${phoneNumber} already has charity`, ErrorCode.BAD_REQUEST);
        }

        const findedInvitation = await this.InvitationModel.findOne({
          phoneNumber,
          parentEntityType: InvitationParentEntityType.CHARITY,
        });

        if (findedInvitation) {
          await this.sendInviteMessage(findedInvitation._id.toString(), firstName, phoneNumber, session);
          returnObject = { invitationId: findedInvitation._id.toString() };
          return;
        }

        const userAccount = await this.userAccountService.getAccountByPhoneNumber(phoneNumber, session);
        const charity = await this.charityService.createCharity({ name: 'My Charity Name' }, session);

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

          await this.charityService.updateCharityStatus({
            charity,
            userAccount,
            status: CharityStatus.PENDING_ONBOARDING,
            session,
          });

          await this.sendInviteMessage(invitation.id, firstName, phoneNumber, session);

          await this.eventHub.broadcast(Events.CHARITY_ONBOARDED, { charity, session });
          returnObject = { invitationId: invitation.id };
        } else {
          const invitation = await this.createInvitation(charity, inviteInput, session);

          await this.charityService.updateCharityStatus({
            charity,
            status: CharityStatus.PENDING_INVITE,
            session,
          });

          await this.sendInviteMessage(invitation.id, firstName, phoneNumber, session);
          returnObject = { invitationId: invitation.id };
        }
      });
      return returnObject;
    } finally {
      session.endSession();
    }
  }

  async inviteInfluencer(input: InviteInput): Promise<{ invitationId: string }> {
    const session = await this.connection.startSession();
    let returnObject = null;
    try {
      const { firstName, lastName, phoneNumber, welcomeMessage } = objectTrimmer(input);

      await session.withTransaction(async () => {
        const findedAccount = await this.UserAccountModel.findOne({ phoneNumber: phoneNumber });

        if (
          findedAccount &&
          (await this.InfluencerModel.exists({
            userAccount: findedAccount._id,
          }))
        ) {
          throw new AppError(`Account with phone number: ${phoneNumber} already has influencer`, ErrorCode.BAD_REQUEST);
        }

        const findedInvitation = await this.InvitationModel.findOne({
          phoneNumber,
          parentEntityType: InvitationParentEntityType.INFLUENCER,
        });

        if (findedInvitation) {
          await this.sendInviteMessage(findedInvitation._id.toString(), firstName, phoneNumber, session);
          returnObject = { invitationId: findedInvitation._id.toString() };
          return;
        }

        const userAccount = await this.userAccountService.getAccountByPhoneNumber(phoneNumber, session);
        const influencerProfile = await this.getOrCreateTransientInfluencer(input, session);

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

          await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.ONBOARDED,
            userAccount,
            session,
          );

          await this.sendInviteMessage(invitation.id, firstName, phoneNumber, session);

          await this.eventHub.broadcast(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });
          returnObject = { invitationId: invitation.id };
        } else {
          const invitation = await this.createInvitation(influencerProfile, inviteInput, session);
          await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.INVITATION_PENDING,
            null,
            session,
          );

          await this.sendInviteMessage(invitation.id, firstName, phoneNumber, session);
          returnObject = { invitationId: invitation.id };
        }
      });

      return returnObject;
    } finally {
      session.endSession();
    }
  }

  async resendInviteMessage(influencerId: string) {
    const session = await this.connection.startSession();
    let returnObject;
    try {
      await session.withTransaction(async () => {
        const inviteObject = await this.InvitationModel.findOne({ parentEntityId: influencerId });

        const { phoneNumber, firstName } = inviteObject;
        const link = await this.sendInviteMessage(inviteObject._id.toString(), firstName, phoneNumber, session);

        returnObject = {
          link,
          phoneNumber,
          firstName,
        };
      });

      return returnObject;
    } catch (error) {
      AppLogger.error(
        `Something went wrong, when resend invite message for influencer #${influencerId}, error: ${error.message}`,
      );
      throw new AppError('Something went wrong. Please, try again later');
    } finally {
      session.endSession();
    }
  }

  async inviteAssistant(input: InviteInput): Promise<{ invitationId: string }> {
    const session = await this.connection.startSession();
    let returnObject = null;

    try {
      const { firstName, lastName, phoneNumber, welcomeMessage, influencerId } = objectTrimmer(input);

      await session.withTransaction(async () => {
        const findedAccount = await this.UserAccountModel.findOne({ phoneNumber: phoneNumber });

        if (
          findedAccount &&
          (await this.AssistantModel.exists({
            userAccount: findedAccount._id,
          }))
        ) {
          throw new AppError(`Account with phone number: ${phoneNumber} already has assistant`, ErrorCode.BAD_REQUEST);
        }

        const findedInvitation = await this.InvitationModel.findOne({
          phoneNumber,
          parentEntityType: InvitationParentEntityType.ASSISTANT,
        });

        if (findedInvitation) {
          await this.sendInviteMessage(findedInvitation._id.toString(), firstName, phoneNumber, session);
          returnObject = { invitationId: findedInvitation._id.toString() };
          return;
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

          const influencer = await this.influencerService.findInfluencer({ _id: influencerId });

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

          const invitation = await this.createInvitation(
            assistant,
            {
              ...inviteInput,
              accepted: true,
            },
            session,
          );

          await this.influencerService.assignAssistantsToInfluencer(influencerId, assistant.id);

          await this.sendInviteMessage(invitation.id, firstName, phoneNumber, session);

          await this.eventHub.broadcast(Events.ASSISTANT_ONBOARDED, { userAccount, assistant });
          returnObject = { invitationId: invitation.id };
        } else {
          const assistant = await this.assistantService.createAssistant(
            {
              name: `${firstName} ${lastName}`,
              userAccount: null,
              influencer: influencerId,
            },
            session,
          );

          const invitation = await this.createInvitation(assistant, inviteInput, session);
          await this.influencerService.assignAssistantsToInfluencer(influencerId, assistant.id);

          await this.sendInviteMessage(invitation.id, firstName, phoneNumber, session);
          returnObject = { invitationId: invitation.id };
        }
      });

      return returnObject;
    } finally {
      session.endSession();
    }
  }

  private async sendInviteMessage(
    invitationId: string,
    name: string,
    phoneNumber: string,
    session: ClientSession,
  ): Promise<string> {
    try {
      const invitation = await this.InvitationModel.findById(invitationId, null, { session });
      const populatedInvitation = await invitation
        .populate({ path: 'shortLink', model: this.ShortLinkModel })
        .execPopulate();

      const link = await this.shortLinkService.makeLink({ slug: populatedInvitation.shortLink.slug });
      const message = `Hello, ${name}! You have been invited to join Contrib at ${link}. Sign in with your phone number to begin.`;

      await this.twilioNotificationService.sendMessage(phoneNumber, message);

      return link;
    } catch (error) {
      AppLogger.error(`Can not send verification message to phone number: ${phoneNumber}. Error: ${error.message}`);
      if (error.message.startsWith("The 'To' number")) {
        throw new AppError(`${error.message.replace("The 'To' number", 'The number')}`, ErrorCode.BAD_REQUEST);
      }
      throw new AppError(`Can not send verification message`, ErrorCode.BAD_REQUEST);
    }
  }
  private async getOrCreateTransientInfluencer(
    { influencerId, firstName, lastName }: InviteInput,
    session: ClientSession,
  ): Promise<InfluencerProfile | null> {
    if (influencerId) {
      const profile = await this.influencerService.findInfluencer({ _id: influencerId }, session);

      if (!profile) {
        throw new AppError('requested influencer profile does not exist');
      }

      if (profile.status !== InfluencerStatus.TRANSIENT || profile.userAccount) {
        throw new AppError('given influencer has already been invited');
      }

      return profile;
    }

    return await this.influencerService.createTransientInfluencer(
      { name: `${firstName.trim()} ${lastName.trim()}` },
      session,
    );
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

  private async createInvitation(
    parent: InfluencerProfile | Assistant | Charity,
    { phoneNumber, firstName, lastName, welcomeMessage, accepted, parentEntityType }: InviteInput,
    session: ClientSession,
  ): Promise<Invitation> {
    const now = new Date();
    const slug = uuidv4();
    const [invitation] = await this.InvitationModel.create(
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

    const shortLink = await this.shortLinkService.createShortLink(
      { address: `invitation/${invitation.slug}` },
      session,
    );
    Object.assign(invitation, { shortLink: shortLink.id });
    await invitation.save({ session });

    return InvitationService.makeInvitation(invitation);
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
