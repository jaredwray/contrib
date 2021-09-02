export const deliveryMethods = [
  { value: '03', label: 'UPS Ground' },
  { value: '12', label: 'UPS 3 Day Select' },
  { value: '02', label: 'UPS 2nd Day Air' },
  { value: '13', label: 'UPS Next Day Air Saver' },
];

export const cardTypes = [
  {
    value: '01',
    label: 'American Express',
    code: {
      name: 'CID',
      size: 4,
    },
  },

  { value: '07', label: 'Bravo' },
  { value: '21', label: 'Carte Bleue' },
  {
    value: '03',
    label: 'Discover',
    code: {
      name: 'CID',
      size: 3,
    },
  },
  {
    value: '13',
    label: 'Dankort',
  },
  {
    value: '08',
    label: 'Diners Club',
    code: {
      name: 'CVV',
      size: 3,
    },
  },

  {
    value: '14',
    label: 'Hipercard',
    code: {
      name: 'CVC',
      size: 3,
    },
  },
  {
    value: '15',
    label: 'JCB',
    code: {
      name: 'CVV',
      size: 3,
    },
  },
  {
    value: '04',
    label: 'MasterCard',
    code: {
      name: 'CVC',
      size: 3,
    },
  },
  { value: '05', label: 'Optima' },

  { value: '17', label: 'Postepay' },
  {
    value: '18',
    label: 'UnionPay',
    code: {
      name: 'CVN',
      size: 3,
    },
  },
  {
    value: '06',
    label: 'Visa',
    code: {
      name: 'CVV',
      size: 3,
    },
  },
  { value: '19', label: 'Visa Electron' },
  { value: '20', label: 'VPAY' },
];
