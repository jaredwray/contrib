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
  private readonly loaderByCharityId = new DataLoader<string, Charity>(
    async (userAccountIds) => await this.charityService.listCharitiesByUserAccountIds(userAccountIds),
  );

  constructor(private readonly charityService: CharityService) {}

  async getByUserAccountId(userAccountId: string): Promise<Charity | null> {
    const charity = await this.loaderByUserAccountId.load(userAccountId);

    if (charity) {
      return await this.charityService.maybeUpdateStripeLink(charity);
    } else {
      return null;
    }
  }

  async getById(charityId: string): Promise<Charity> {
    const charity = await this.loaderByCharityId.load(charityId);

    if (charity) {
      return await this.charityService.maybeUpdateStripeLink(charity);
    } else {
      return null;
    }
  }
}
