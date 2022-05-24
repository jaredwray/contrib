import Dinero, { DineroObject } from 'dinero.js';

export const toFormatedMoney = (value: DineroObject, format = '$0,0') => Dinero(value).toFormat(format);
