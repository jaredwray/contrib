import DataLoader from 'dataloader';

import { CharityService } from './CharityService';
import { Charity } from '../dto/Charity';

export class CharityLoader {
  private readonly loaderByCharityId = new DataLoader<string, Charity>(async (charityIds) =>
    this.charityService.listCharitiesByIds(charityIds),
  );

  constructor(private readonly charityService: CharityService) {}

  getById(charityId: string): Promise<Charity> {
    return this.loaderByCharityId.load(charityId);
  }
}
