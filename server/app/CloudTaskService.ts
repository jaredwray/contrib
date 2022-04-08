import { CloudTasksClient } from '@google-cloud/tasks';

import { AppConfig } from '../config';
import { AppLogger } from '../logger';

export class CloudTaskService {
  private readonly cloudTaskClient = new CloudTasksClient({
    projectId: AppConfig.googleCloud.task.googleProjectId,
    credentials: JSON.parse(AppConfig.googleCloud.keyDump),
  });

  public target(type: string): string {
    const appURL = new URL(AppConfig.app.url.origin);

    if (!AppConfig.environment.serveClient) {
      appURL.port = AppConfig.app.port.toString();
    }

    return `${appURL}${AppConfig.googleCloud.task[type]}`;
  }

  public async createTask(returnURL: string, payload: object): Promise<void> {
    if (AppConfig.environment.isLocal) return;
    if (!payload) throw new Error('Cannot create task without payload');

    const parent = this.cloudTaskClient.queuePath(
      AppConfig.googleCloud.task.googleProjectId,
      AppConfig.googleCloud.task.location,
      AppConfig.googleCloud.task.queue,
    );

    const body = Buffer.from(
      JSON.stringify({
        ...payload,
        api_token: AppConfig.googleCloud.task.googleTaskApiToken,
      }),
    ).toString('base64');
    const task = {
      httpRequest: {
        body,
        httpMethod: 'POST',
        url: returnURL,
        headers: { 'Content-Type': 'application/octet-stream' },
      },
    };

    try {
      await this.cloudTaskClient.createTask({ parent, task } as any);
    } catch (error) {
      AppLogger.warn(`Cannot create google task: ${error.message}`);
    }
  }
}
