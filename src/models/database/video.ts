// A Video is a URL-reference to a playable video along
// with metadata about the format for sizing/selection purposes.
export type Video = {
    url: string,
    format: string,
    resolution: string
}