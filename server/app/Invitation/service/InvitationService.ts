import { UserAccount } from 'app/UserAccount/dto/UserAccount';
import { ClientSession, Connection, Types, PipelineStage } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { IInvitation, InvitationModel } from '../mongodb/InvitationModel';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';
import { AssistantModel } from '../../Assistant/mongodb/AssistantModel';
import { InfluencerService } from '../../Influencer';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { InviteInput } from '../dto/InviteInput';
import { NotificationService, MessageTemplate } from '../../NotificationService';
import { AppConfig } from '../../../config';
import { Invitation, InvitationStatus } from '../dto/Invitation';
import { InvitationsParams, InvitationFilters } from '../dto/InvitationsParams';
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
    private readonly notificationService: NotificationService,
    private readonly eventHub: EventHub,
    private readonly shortLinkService: ShortLinkService,
  ) {
    eventHub.subscribe(Events.USER_ACCOUNT_CREATED, async (userAccount) => {
      await this.maybeFinalizeInvitation(userAccount);
    });
  }

  async findInvitationBySlug(slug: string): Promise<Invitation | null> {
    const model = await this.InvitationModel.findOne({ slug }).exec();
    return this.makeInvitation(model);
  }

  private async updateInvitation(invitation: IInvitation, params: any, session?: any): Promise<void> {
    Object.assign(invitation, {
      ...params,
      updatedAt: this.timeNow(),
    });
    session ? await invitation.save({ session }) : await invitation.save();
  }

  async approve(id: string): Promise<Invitation | null> {
    const session = await this.connection.startSession();

    try {
      const invitation = await this.InvitationModel.findOne({ _id: id }).exec();
      const invitationObject = this.makeInvitation(invitation);
      const { firstName, phoneNumber } = invitation;

      await session.withTransaction(async () => {
        const userAccount = await this.userAccountService.getAccountByPhoneNumber(phoneNumber, session);

        if (userAccount && (await this.InfluencerModel.exists({ userAccount: userAccount.id }))) {
          await this.updateInvitation(invitation, { status: InvitationStatus.DONE, accepted: true }, session);
          return invitationObject;
        }

        const influencerProfile = await this.influencerService.createTransientInfluencer({ name: firstName }, session);
        const shortLink = await this.shortLinkService.createShortLink(
          { address: `invitation/${invitationObject.slug}` },
          session,
        );

        if (userAccount) {
          await this.updateInvitation(
            invitation,
            { status: InvitationStatus.DONE, accepted: true, parentEntityId: influencerProfile.id },
            session,
          );
          await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.ONBOARDED,
            userAccount,
            session,
          );

          await this.eventHub.broadcast(Events.INFLUENCER_ONBOARDED, { userAccount, influencerProfile });
        }

        if (!userAccount) {
          await this.updateInvitation(
            invitation,
            { status: InvitationStatus.PENDING, parentEntityId: influencerProfile.id },
            session,
          );
          await this.influencerService.updateInfluencerStatus(
            influencerProfile,
            InfluencerStatus.INVITATION_PENDING,
            null,
            session,
          );
        }

        await this.sendInviteMessage(invitation.id, firstName, phoneNumber, session, shortLink.slug);
      });

      return invitationObject;
    } finally {
      session.endSession();
    }
  }

  async decline(id: string): Promise<Invitation | null> {
    const invitation = await this.InvitationModel.findOne({ _id: id }).exec();
    await this.updateInvitation(invitation, { status: InvitationStatus.DECLINED });
    return this.makeInvitation(invitation);
  }

  private searchOptions(filters?: InvitationFilters): PipelineStage {
    if (filters?.query?.trim().toString() === '') return { $match: {} };

    const query = (filters.query || '').trim().replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const queryRegExp = new RegExp(query, 'i');

    return {
      $match: {
        $or: [
          { firstName: { $regex: queryRegExp } },
          { lastName: { $regex: queryRegExp } },
          { phoneNumber: { $regex: queryRegExp } },
        ],
      },
    };
  }

  public async invitations(params: InvitationsParams) {
    let scope;

    scope = this.InvitationModel.aggregate([
      {
        $addFields: {
          isProposed: {
            $cond: { if: { $eq: ['$status', InvitationStatus.PROPOSED] }, then: 1, else: -1 },
          },
          isPending: {
            $cond: { if: { $eq: ['$status', InvitationStatus.PENDING] }, then: 1, else: -1 },
          },
        },
      },
      this.searchOptions(params?.filters),
      { $sort: { isProposed: -1, isPending: -1, accepted: 1, createdAt: -1 } },
    ]);

    if (params.size) {
      scope = scope.skip(params.skip || 0).limit(params.size);
    }

    const items = await scope.exec();
    const totalItems = await this.InvitationModel.count(this.searchOptions(params?.filters)['$match']).exec();

    return {
      totalItems,
      items: items.map((item) => this.makeInvitation(item)),
      size: items.length,
      skip: params.skip || 0,
    };
  }

  async listInvitationsByParentEntityIds(parentEntityIds: readonly string[]): Promise<Invitation[]> {
    const models = await this.InvitationModel.find({ parentEntityId: { $in: parentEntityIds } });
    return models.map((model) => this.makeInvitation(model));
  }

  async inviteCharity(input: InviteInput): Promise<{ invitationId: string }> {
    const session = await this.connection.startSession();
    let returnObject = null;

    try {
      const { firstName, lastName, phoneNumber, welcomeMessage } = objectTrimmer(input);

      await session.withTransaction(async () => {
        const findedAccount = await this.UserAccountModel.findOne({ phoneNumber: phoneNumber });

        if (findedAccount && (await this.CharityModel.exists({ userAccount: findedAccount._id })))
          throw new AppError(`Account with phone number: ${phoneNumber} already has charity`, ErrorCode.BAD_REQUEST);

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
        const charity = await this.charityService.createCharity(session);

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

        if (findedAccount && (await this.InfluencerModel.exists({ userAccount: findedAccount._id })))
          throw new AppError(`Account with phone number: ${phoneNumber} already has influencer`, ErrorCode.BAD_REQUEST);

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

  async createProposed(input: InviteInput): Promise<{ invitationId: string | null }> {
    const userAccount = await this.UserAccountModel.findOne({ phoneNumber: input.phoneNumber });
    if (userAccount) return { invitationId: null };

    let invitation;
    invitation = await this.InvitationModel.findOne({ phoneNumber: input.phoneNumber });

    if (!invitation) {
      const now = this.timeNow();

      invitation = await this.InvitationModel.create({
        slug: uuidv4(),
        createdAt: now,
        updatedAt: now,
        status: InvitationStatus.PROPOSED,
        ...input,
      });
    }

    return { invitationId: invitation._id.toString() };
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
          (await this.AssistantModel.exists({ userAccount: findedAccount._id, influencer: influencerId }))
        )
          throw new AppError(
            `Account with phone number ${phoneNumber} is your assistant already`,
            ErrorCode.BAD_REQUEST,
          );

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
          if (await this.assistantService.findAssistantByUserAccount(userAccount.mongodbId))
            throw new AppError(`${phoneNumber} is already using the system for the Assistant`, ErrorCode.BAD_REQUEST);

          const influencer = await this.influencerService.findInfluencer({ _id: influencerId });
          if (!influencer) throw new AppError(`Invalid influencerId #${influencerId}`, ErrorCode.BAD_REQUEST);
          if (findedAccount && influencer.userAccount.toString() === findedAccount._id.toString())
            throw new AppError(`You cannot invite itself`, ErrorCode.BAD_REQUEST);

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
    slug?: string,
  ): Promise<string> {
    try {
      if (!slug) {
        const invitation = await this.InvitationModel.findById(invitationId, null, { session });
        const populatedInvitation = await invitation.populate({ path: 'shortLink', model: this.ShortLinkModel });
        slug = populatedInvitation.shortLink.slug;
      }

      const link = await ShortLinkService.makeLink({ slug });

      await this.notificationService.sendMessageLater(phoneNumber, MessageTemplate.INVITED, {
        name,
        link,
      });

      return link;
    } catch (error) {
      AppLogger.error(`Can not send verification message to phone number: ${phoneNumber}. Error: ${error.message}`);
      throw new AppError(`Can not send verification message`, ErrorCode.BAD_REQUEST);
    }
  }

  private async getOrCreateTransientInfluencer(
    { influencerId, firstName, lastName }: InviteInput,
    session: ClientSession,
  ): Promise<InfluencerProfile | null> {
    if (!influencerId)
      return await this.influencerService.createTransientInfluencer(
        { name: `${firstName.trim()} ${lastName.trim()}` },
        session,
      );

    const profile = await this.influencerService.findInfluencer({ _id: influencerId }, session);

    if (!profile) throw new AppError('requested influencer profile does not exist');
    if (profile.status !== InfluencerStatus.TRANSIENT || profile.userAccount)
      throw new AppError('given influencer has already been invited');

    return profile;
  }

  private async maybeFinalizeInvitation(userAccount: UserAccount): Promise<void> {
    const session = await this.InvitationModel.startSession();
    try {
      const invitation = await this.InvitationModel.findOne({ phoneNumber: userAccount.phoneNumber }, null, {
        session,
      });

      if (!invitation) return;
      if (invitation.accepted)
        throw new Error(
          `user account with ${userAccount.phoneNumber} has been created, but invitation to the same phone number is already accepted`,
        );

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
    Object.assign(invitation, {
      accepted: true,
      updatedAt: this.timeNow(),
    });
    return await invitation.save();
  }

  private async createInvitation(
    parent: InfluencerProfile | Assistant | Charity,
    { phoneNumber, firstName, lastName, welcomeMessage, accepted, parentEntityType }: InviteInput,
    session: ClientSession,
  ): Promise<Invitation> {
    const now = this.timeNow();
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
          parentEntityId: parent.id,
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

    return this.makeInvitation(invitation);
  }

  private timeNow = () => dayjs().second(0);

  private status(model: IInvitation): string {
    if (model.status) return model.status;
    if (model.accepted) return InvitationStatus.DONE;

    return InvitationStatus.PENDING;
  }

  private makeInvitation(model: IInvitation): Invitation | null {
    if (!model) return null;

    const { _id, parentEntityId, status, ...rest } = 'toObject' in model ? model.toObject() : model;

    return {
      id: model._id.toString(),
      parentEntityId: parentEntityId?.toString(),
      status: this.status(model),
      ...rest,
    };
  }
}
