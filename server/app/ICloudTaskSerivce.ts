export interface ICloudTaskService {
  createTask(returnURL: string, payload: { [key: string]: any }): Promise<void>;
}
