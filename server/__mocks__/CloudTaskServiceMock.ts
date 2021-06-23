import { ICloudTaskService } from '../app/ICloudTaskSerivce';

export default class CloudTaskServiceMock implements ICloudTaskService {
  createTask(returnURL: string, payload: { [p: string]: any }): Promise<void> {
    return Promise.resolve(undefined);
  }
}
