import DataLoader from 'dataloader';

import { AssistantService } from './AssistantService';
import { Assistant } from '../dto/Assistant';

export class AssistantLoader {
  private readonly loaderByUserAccountId = new DataLoader<string, Assistant>(async (userAccountIds) => {
    const assistantsByUserAccount = (await this.assistantService.listAssistantsByUserAccountIds(userAccountIds)).reduce(
      (assistantsByUserAccountId, assistant) => ({
        ...assistantsByUserAccountId,
        [assistant.userAccount]: assistant,
      }),
      {},
    );

    return userAccountIds.map((userAccountId) => assistantsByUserAccount[userAccountId] ?? null);
  });
  private readonly loaderById = new DataLoader<string, Assistant>(async (ids) => {
    const assistantsById = (await this.assistantService.listAssistantsById(ids)).reduce(
      (byId, assistant) => ({
        ...byId,
        [assistant.id]: assistant,
      }),
      {},
    );
    return ids.map((id) => assistantsById[id] ?? null);
  });

  constructor(private readonly assistantService: AssistantService) {}

  async getByUserAccountId(userAccountId: string): Promise<Assistant | null> {
    return this.loaderByUserAccountId.load(userAccountId);
  }
  async getById(id: string): Promise<Assistant> {
    return this.loaderById.load(id);
  }
}
