export type Address = {
    name: string,
    lines: string[],
    city: string,
    region: string,
    postCode: string,
    country: string
} 

export type TaggedAddress = Address & {
    tags: 'shipping' | 'billing' | 'primary' []
}
