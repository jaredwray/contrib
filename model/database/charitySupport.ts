// A CharitySupport provides just enough information as to which Charity
// an item is being Auctioned for as well as a percentage breakdown of 
// the proceeds for cases where proceeds are being split. An Athlete can
// also have a default for their new auctions which can be highlighted on
// their page.
export type CharitySupport = {
    id: string,
    name: string,
    breakdown: number,  // As a percentage
}