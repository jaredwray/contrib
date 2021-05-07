import DataLoader from 'dataloader';

import { CharityService } from './CharityService';
import { Charity } from '../dto/Charity';

export class CharityLoader {
  private readonly loaderByUserAccountId = new DataLoader<string, Charity>(async (userAccountIds) => {
    const charitiesByUserAccount = (await this.charityService.listCharitiesByUserAccountIds(userAccountIds)).reduce(
      (charitiesByUserAccountId, charity) => ({
        ...charitiesByUserAccountId,
        [charity.userAccount]: charity,
      }),
      {},
    );

    return userAccountIds.map((userAccountId) => charitiesByUserAccount[userAccountId] ?? null);
  });
  private readonly loaderById = new DataLoader<string, Charity>(async (ids) => {
    const charitiesById = (await this.charityService.listCharitiesByIds(ids)).reduce(
      (byId, charity) => ({
        ...byId,
        [charity.id]: charity,
      }),
      {},
    );
    return ids.map((id) => charitiesById[id] ?? null);
  });
  constructor(private readonly charityService: CharityService) {}

  async getByUserAccountId(userAccountId: string): Promise<Charity | null> {
    const charity = await this.loaderByUserAccountId.load(userAccountId);

    if (charity) {
      return await this.charityService.maybeUpdateStripeLink(charity);
    } else {
      return null;
    }
  }

  async getById(id: string): Promise<Charity> {
    const charity = await this.loaderById.load(id);
    if (charity) {
      return await this.charityService.maybeUpdateStripeLink(charity);
    } else {
      return null;
    }
  }
}
