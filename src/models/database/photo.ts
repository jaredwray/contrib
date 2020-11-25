// A Photo is a URL-reference to a viewable photo
// with metadata about the format for sizing/selection purposes.
export type Photo = {
    url: string,
    format: string,
    resolution: string,
    tags: PhotoTag[]
}

enum PhotoTag {
    AvatarMedium = 'avatar-med',
    AvatarLarge = 'avatar-large'
}