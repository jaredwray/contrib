export interface ICloudflareStreaming {
  uploadToCloudflare(objectURL: string, meta: { name: string; [p: string]: string }): Promise<string>;
}
