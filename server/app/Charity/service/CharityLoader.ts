import * as DataLoader from 'dataloader';

import { CharityService } from './CharityService';
import { Charity } from '../dto/Charity';

export class CharityLoader {
  constructor(private readonly charityService: CharityService) {}

  getByIds(charityIds: string[]): Promise<Charity[]> {
    return this.charityService.listCharitiesByIds(charityIds);
  }
}
