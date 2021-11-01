import { CloudTasksClient } from '@google-cloud/tasks';

import { AppConfig } from '../config';

export class CloudTaskService {
  private readonly cloudTaskClient = new CloudTasksClient({
    projectId: AppConfig.googleCloud.task.googleProjectId,
    credentials: JSON.parse(AppConfig.googleCloud.keyDump),
  });

  public generateGoogleTaskTarget(type: string): string {
    const appURL = new URL(AppConfig.app.url);

    if (!AppConfig.environment.serveClient) {
      appURL.port = AppConfig.app.port.toString();
    }
    return `${appURL.toString()}${AppConfig.googleCloud.task[type]}`;
  }

  public async createTask(returnURL: string, payload: { [key: string]: any }): Promise<void> {
    if (AppConfig.app.url === 'http://127.0.0.1:3000') {
      return;
    }

    const parent = this.cloudTaskClient.queuePath(
      AppConfig.googleCloud.task.googleProjectId,
      AppConfig.googleCloud.task.location,
      AppConfig.googleCloud.task.queue,
    );

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: returnURL,
        body: null,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      },
    };

    if (!payload) {
      throw new Error('Cannot create task without payload');
    }
    task.httpRequest.body = Buffer.from(
      JSON.stringify({
        ...payload,
        api_token: AppConfig.googleCloud.task.googleTaskApiToken,
      }),
    ).toString('base64');

    const request = { parent, task };
    await this.cloudTaskClient.createTask(request as any);
  }
}
