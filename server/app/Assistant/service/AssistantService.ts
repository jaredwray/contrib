import dayjs from 'dayjs';
import { Storage } from '@google-cloud/storage';
import { ClientSession, Connection, ObjectId } from 'mongoose';
import { IAssistant, AssistantModel } from '../mongodb/AssistantModel';
import { CharityService } from '../../Charity';
import { Assistant, AssistantStatus } from '../dto/Assistant';
import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';

interface AssistantInput {
  name: string;
  userAccount?: string;
  influencerId?: string;
}

export class AssistantService {
  private readonly assistantModel = AssistantModel(this.connection);

  constructor(private readonly connection: Connection) {}

  async create({ name, userAccount, influencerId }: AssistantInput, session: ClientSession): Promise<Assistant> {
    const [assistant] = await this.assistantModel.create(
      [
        {
          name,
          userAccount,
          influencers: [influencerId],
          status: userAccount ? AssistantStatus.ONBOARDED : AssistantStatus.INVITATION_PENDING,
        },
      ],
      { session },
    );
    return AssistantService.makeAssistant(assistant);
  }

  async addInfluencer(assistant: IAssistant, influencerId: string, session: ClientSession): Promise<IAssistant> {
    Object.assign(assistant, {
      influencers: new Set([...assistant.influencers, influencerId]),
      updatedAt: this.timeNow(),
    });
    await assistant.save({ session });

    return assistant;
  }

  async find(id: string): Promise<Assistant | null> {
    const assistant = await this.assistantModel.findById(id).exec();
    return AssistantService.makeAssistant(assistant);
  }

  async findByUserAccount(userAccount: string): Promise<Assistant | null> {
    const assistant = await this.assistantModel.findOne({ userAccount }).exec();
    return AssistantService.makeAssistant(assistant);
  }

  async assignUserToAssistant(id: ObjectId, userAccountId: string, session: ClientSession): Promise<Assistant> {
    const assistant = await this.assistantModel.findById(id, null, { session }).exec();

    if (!assistant) throw new Error(`cannot assign user to assistant: assistant ${id} is not found`);
    if (assistant.status !== AssistantStatus.INVITATION_PENDING)
      throw new Error(`cannot assign user to assistant: assistant ${id} status is ${assistant.status} `);
    if (assistant.userAccount)
      throw new Error(`cannot assign user to assistant: assistant ${id} already has a user account assigned`);

    Object.assign(assistant, {
      userAccount: userAccountId,
      status: AssistantStatus.ONBOARDED,
      onboardedAt: this.timeNow(),
      updatedAt: this.timeNow(),
    });
    await assistant.save();

    return AssistantService.makeAssistant(assistant);
  }

  async all(skip: number, size: number): Promise<Assistant[]> {
    const models = await this.assistantModel.find().skip(skip).limit(size).sort({ id: 'asc' }).exec();
    return models.map((m) => AssistantService.makeAssistant(m));
  }

  async getByIds(ids: readonly string[]): Promise<Assistant[]> {
    const models = await this.assistantModel.find({ _id: { $in: ids } });
    return models.map((m) => AssistantService.makeAssistant(m));
  }

  async getByUserAccountIds(userAccountIds: readonly string[]): Promise<Assistant[]> {
    const models = await this.assistantModel.find({ userAccount: { $in: userAccountIds } });
    return models.map((assistant) => AssistantService.makeAssistant(assistant));
  }

  async getByInfluencerIds(influencerIds: readonly string[]): Promise<Assistant[]> {
    const models = await this.assistantModel.find({ influencers: { $in: { influencerIds } } });
    return models.map((assistant) => AssistantService.makeAssistant(assistant));
  }

  private timeNow = () => dayjs().second(0);

  public static makeAssistant(model: IAssistant): Assistant {
    if (!model) return null;

    const { _id, userAccount, influencer, influencers, ...rest } = 'toObject' in model ? model.toObject() : model;

    return {
      id: model._id.toString(),
      userAccount: userAccount?.toString(),
      influencerId: influencer?.toString(),
      influencerIds: influencers?.map((item) => item.toString()),
      ...rest,
    };
  }
}
