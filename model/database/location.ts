// A location describes a rough physical location of an item in an Auction or
// where a Charity of Athlete is based. It is useful for shipping and showing
// map content etc.
export type Location = {
    country: string,
    city: string,
    zip: number,
    // TODO: Geo-loc for maps?
}