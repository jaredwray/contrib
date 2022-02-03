const REQUIRED_VALUES = ['state', 'city', 'zipCode', 'street'];

export const isValidAddressFields = (addressData): boolean => {
  if (!addressData) return false;

  let missedValues = [];

  REQUIRED_VALUES.forEach((value) => !addressData[value] && missedValues.push(value));

  return missedValues.length == 0;
};
