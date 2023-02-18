import DataLoader from 'dataloader';

import { AssistantService } from './AssistantService';
import { Assistant } from '../dto/Assistant';

export class AssistantLoader {
  constructor(private readonly assistantService: AssistantService) {}

  getById = (id: string): Promise<Assistant> => this.loaderById.load(id);
  getByUserAccountId = (userAccountId: string): Promise<Assistant | null> =>
    this.loaderByUserAccountId.load(userAccountId);
  getByInfluencerId = (InfluencerId: string): Promise<Assistant | null> => this.loaderByInfluencerId.load(InfluencerId);

  private readonly loaderByInfluencerId = new DataLoader<string, Assistant>(async (influencerIds) => {
    console.log(influencerIds);
    console.log(await this.assistantService.getByInfluencerIds(influencerIds));
    const assistants = (await this.assistantService.getByInfluencerIds(influencerIds)).reduce(
      (assistants, assistant) =>
        assistant.influencerIds.map((influencerId) => ({
          ...assistants,
          [influencerId]: [...assistants[influencerId], assistant],
        })),
      {},
    );

    return influencerIds.map((influencerId) => assistants[influencerId] ?? null);
  });

  private readonly loaderByUserAccountId = new DataLoader<string, Assistant>(async (userAccountIds) => {
    const assistants = (await this.assistantService.getByUserAccountIds(userAccountIds)).reduce(
      (assistants, assistant) => ({
        ...assistants,
        [assistant.userAccount]: assistant,
      }),
      {},
    );

    return userAccountIds.map((userAccountId) => assistants[userAccountId] ?? null);
  });

  private readonly loaderById = new DataLoader<string, Assistant>(async (ids) => {
    const assistantsById = (await this.assistantService.getByIds(ids)).reduce(
      (byId, assistant) => ({
        ...byId,
        [assistant.id]: assistant,
      }),
      {},
    );
    return ids.map((id) => assistantsById[id] ?? null);
  });
}
