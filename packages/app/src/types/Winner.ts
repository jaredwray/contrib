export interface Address {
  city: string;
  country: string;
  name: string;
  state: string;
  street: string;
  zipCode: string;
}
export interface Winner {
  address: Address;
  mongodbId: string;
}
