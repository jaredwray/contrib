import { IHandlebarsService } from '../app/Message/service/HandlebarsService';

export default class HanlebarsServiceMock implements IHandlebarsService {
  renderTemplate(currentPath: string, context: { [p: string]: any }): Promise<string> {
    return Promise.resolve('');
  }
}
