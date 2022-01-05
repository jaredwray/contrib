import dayjs from 'dayjs';
import { Storage } from '@google-cloud/storage';
import { ClientSession, Connection, ObjectId } from 'mongoose';
import { IAssistant, AssistantModel } from '../mongodb/AssistantModel';
import { CharityService } from '../../Charity';
import { Assistant } from '../dto/Assistant';
import { AssistantStatus } from '../dto/AssistantStatus';
import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';

interface AssistantInput {
  name: string;
  userAccount: string | null;
  influencer: string | null;
}

export class AssistantService {
  private readonly assistantModel = AssistantModel(this.connection);

  constructor(private readonly connection: Connection) {}

  async createAssistant({ name, userAccount, influencer }: AssistantInput, session: ClientSession): Promise<Assistant> {
    const assistant = await this.assistantModel.create(
      [
        {
          name,
          userAccount,
          influencer,
          status: userAccount ? AssistantStatus.ONBOARDED : AssistantStatus.INVITATION_PENDING,
        },
      ],
      { session },
    );
    return AssistantService.makeAssistant(assistant[0]);
  }

  async findAssistant(id: string): Promise<Assistant | null> {
    const assistant = await this.assistantModel.findById(id).exec();
    return (assistant && AssistantService.makeAssistant(assistant)) ?? null;
  }

  async findAssistantByUserAccount(userAccount: string): Promise<Assistant | null> {
    const assistant = await this.assistantModel.findOne({ userAccount }).exec();
    return (assistant && AssistantService.makeAssistant(assistant)) ?? null;
  }

  async assignUserToAssistant(id: ObjectId, userAccountId: string, session: ClientSession): Promise<Assistant> {
    const assistant = await this.assistantModel.findById(id, null, { session }).exec();

    if (!assistant) {
      throw new Error(`cannot assign user to assistant: assistant ${id} is not found`);
    }
    if (assistant.status !== AssistantStatus.INVITATION_PENDING) {
      throw new Error(`cannot assign user to assistant: assistant ${id} status is ${assistant.status} `);
    }
    if (assistant.userAccount) {
      throw new Error(`cannot assign user to assistant: assistant ${id} already has a user account assigned`);
    }

    Object.assign(assistant, {
      userAccount: userAccountId,
      status: AssistantStatus.ONBOARDED,
      onboardedAt: this.timeNow(),
      updatedAt: this.timeNow(),
    });
    await assistant.save();

    return AssistantService.makeAssistant(assistant);
  }

  async listAssistants(skip: number, size: number): Promise<Assistant[]> {
    const models = await this.assistantModel.find().skip(skip).limit(size).sort({ id: 'asc' }).exec();

    return models.map((m) => AssistantService.makeAssistant(m));
  }

  async listAssistantsById(ids: readonly string[]): Promise<Assistant[]> {
    const models = await this.assistantModel.find({ _id: { $in: ids } });
    return models.map((m) => AssistantService.makeAssistant(m));
  }

  async listAssistantsByUserAccountIds(userAccountIds: readonly string[]): Promise<Assistant[]> {
    const models = await this.assistantModel.find({ userAccount: { $in: userAccountIds } });
    return models.map((assistant) => AssistantService.makeAssistant(assistant));
  }

  private timeNow(): String {
    return dayjs().second(0).toISOString();
  }

  public static makeAssistant(model: IAssistant): Assistant {
    return {
      id: model._id.toString(),
      name: model.name,
      status: model.status,
      userAccount: model.userAccount?.toString() ?? null,
      influencerId: model.influencer?.toString() ?? null,
    };
  }
}
