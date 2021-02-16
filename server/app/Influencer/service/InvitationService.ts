import { ClientSession, Connection, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

import { IInvitation, InvitationModel } from '../mongodb/InvitationModel';
import { InfluencerService } from './InfluencerService';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { InviteInfluencerInput } from '../graphql/model/InviteInfluencerInput';
import { TwilioNotificationService } from '../../../twilio-client';
import { AppConfig } from '../../../config';
import { Invitation } from '../dto/Invitation';
import { InvitationParentEntityType } from '../mongodb/InvitationParentEntityType';
import { AppError } from '../../../errors/AppError';
import { ErrorCode } from '../../../errors/ErrorCode';
import { UserAccountService } from '../../UserAccount';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { Events } from '../../Events';
import { AppLogger } from '../../../logger';

export class InvitationService {
  private readonly InvitationModel = InvitationModel(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly userAccountService: UserAccountService,
    private readonly influencerService: InfluencerService,
    private readonly twilioNotificationService: TwilioNotificationService,
    private readonly eventHub: EventEmitter,
  ) {
    eventHub.on(Events.USER_ACCOUNT_CREATED, (userAccount) => {
      this.maybeFinalizeInvitation(userAccount).catch((error) => {
        AppLogger.error(`error finalizing invitation for user account: ${error.name}: ${error.message}`, {
          stack: error.stack,
          userAccount: userAccount,
        });
      });
    });
  }

  async findInvitationBySlug(slug: string): Promise<Invitation | null> {
    const model = await this.InvitationModel.findOne({ slug }).exec();
    return InvitationService.makeInvitation(model);
  }

  async listInvitationsByInfluencerIds(influencerIds: readonly string[]): Promise<Invitation[]> {
    const models = await this.InvitationModel.find({
      parentEntityType: InvitationParentEntityType.INFLUENCER,
      parentEntityId: { $in: influencerIds },
    });
    return models.map((model) => InvitationService.makeInvitation(model));
  }

  async inviteInfluencer(input: InviteInfluencerInput): Promise<InfluencerProfile> {
    const session = await this.connection.startSession();
    let influencerProfile: InfluencerProfile = null;

    try {
      await session.withTransaction(async () => {
        const account = await this.userAccountService.getAccountByPhoneNumber(input.phoneNumber);
        if (account) {
          influencerProfile = await this.creatInfluencerProfileForExistingUser(input, account, session);
        } else {
          influencerProfile = await this.createNewInfluencerProfile(input, session);
        }
      });

      return influencerProfile;
    } finally {
      session.endSession();
    }
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
          this.eventHub.emit(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });
        });
      } else {
        AppLogger.error(`unexpected parent entity type ${invitation.parentEntityType} for invitation ${invitation.id}`);
      }
    } finally {
      session.endSession();
    }
  }

  private static makeInvitationLink(slug: string): string {
    const baseUrl = AppConfig.app.url.replace(/\/$/, '');
    return `${baseUrl}/invitation/${slug}`;
  }

  private async creatInfluencerProfileForExistingUser(
    { firstName, lastName, phoneNumber }: InviteInfluencerInput,
    userAccount: UserAccount,
    session: ClientSession,
  ): Promise<InfluencerProfile> {
    if (await this.influencerService.findInfluencerByUserAccount(userAccount.mongodbId)) {
      throw new AppError(`${phoneNumber} is already using the system as an Influencer`, ErrorCode.BAD_REQUEST);
    }

    const influencerProfile = this.influencerService.createInfluencer(
      {
        name: `${firstName} ${lastName}`,
        avatarUrl: 'https://placekitten.com/500/500',
        userAccount: userAccount.mongodbId,
      },
      session,
    );

    const message = `Hello, ${firstName}. You have been invited to Contrib at ${AppConfig.app.url}. Sign in with your phone number to begin.`;
    await this.twilioNotificationService.sendMessage(userAccount.phoneNumber, message);

    this.eventHub.emit(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });

    return influencerProfile;
  }

  private async createNewInfluencerProfile(
    { firstName, lastName, phoneNumber, welcomeMessage }: InviteInfluencerInput,
    session: ClientSession,
  ): Promise<InfluencerProfile> {
    const influencerProfile = await this.influencerService.createInfluencer(
      {
        name: `${firstName} ${lastName}`,
        avatarUrl: 'https://placekitten.com/500/500',
        userAccount: null,
      },
      session,
    );

    if (await this.InvitationModel.exists({ phoneNumber })) {
      throw new AppError(`Invitation to ${phoneNumber} has already been sent`, ErrorCode.BAD_REQUEST);
    }

    const invitation = await this.createInvitation(
      influencerProfile,
      {
        phoneNumber,
        firstName,
        lastName,
        welcomeMessage,
      },
      session,
    );

    const link = InvitationService.makeInvitationLink(invitation.slug);
    const message = `Hello, ${firstName}! You have been invited to join Contrib at ${link}`;
    await this.twilioNotificationService.sendMessage(phoneNumber, message);
    return influencerProfile;
  }

  private async createInvitation(
    influencer: InfluencerProfile,
    { phoneNumber, firstName, lastName, welcomeMessage }: InviteInfluencerInput,
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
          parentEntityId: Types.ObjectId(influencer.id),
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
      accepted: model.accepted,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
      parentEntityId: model.parentEntityId.toString(),
      parentEntityType: model.parentEntityType,
    };
  }
}
