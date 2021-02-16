import * as DataLoader from 'dataloader';

import { UserAccountService } from './UserAccountService';
import { UserAccount } from '../dto/UserAccount';

export class UserAccountLoader {
  private readonly loaderById = new DataLoader<string, UserAccount>(async (ids) => {
    const userAccountsById = (await this.userAccountService.listAccountsById(ids)).reduce(
      (byId, account) => ({
        ...byId,
        [account.mongodbId]: account,
      }),
      {},
    );
    return ids.map((id) => userAccountsById[id] ?? null);
  });

  constructor(private readonly userAccountService: UserAccountService) {}

  async getById(id: string): Promise<UserAccount> {
    return this.loaderById.load(id);
  }
}
