import { Events } from './Events';

type Observer = (data: any) => void;

export class EventHub {
  private observers: { [key in Events]?: Observer[] } = {};

  public subscribe(event: Events, handler: (payload: any) => void): void {
    this.observers[event] = [...(this.observers[event] ?? []), handler];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async broadcast(event: Events, payload: any): Promise<void> {
    if (this.observers[event]) {
      for await (const handler of this.observers[event]) {
        await handler(payload);
      }
    }
  }
}
