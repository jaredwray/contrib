import * as DataLoader from 'dataloader';

import { InfluencerService } from './InfluencerService';
import { InfluencerProfile } from '../dto/InfluencerProfile';

export class InfluencerLoader {
  private readonly loaderByUserAccountId = new DataLoader<string, InfluencerProfile>(async (userAccountIds) => {
    const influencersByUserAccount = (
      await this.influencerService.listInfluencersByUserAccountIds(userAccountIds)
    ).reduce(
      (influencersByUserAccountId, influencerProfile) => ({
        ...influencersByUserAccountId,
        [influencerProfile.userAccount]: influencerProfile,
      }),
      {},
    );

    return userAccountIds.map((userAccountId) => influencersByUserAccount[userAccountId] ?? null);
  });

  constructor(private readonly influencerService: InfluencerService) {}

  getByUserAccountId(userAccountId: string): Promise<InfluencerProfile | null> {
    return this.loaderByUserAccountId.load(userAccountId);
  }
}
