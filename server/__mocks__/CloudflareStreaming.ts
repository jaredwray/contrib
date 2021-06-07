import {ICloudflareStreaming} from "../app/CloudflareStreaming/ICloudflareStreaming";

export default class CloudflareStreaming implements ICloudflareStreaming {
  uploadToCloudflare(objectUrl: string, meta: { name: string; [p: string]: string }): Promise<string> {
    return Promise.resolve('');
  }
}
