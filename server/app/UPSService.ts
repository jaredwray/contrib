import Dinero from 'dinero.js';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

import { UserAccountAddress } from 'app/UserAccount/dto/UserAccountAddress';
import { AuctionParcel } from './Auction/dto/AuctionParcel';

import { AppConfig } from '../config';
import { AppLogger } from '../logger';
import { AppError } from '../errors/AppError';

export class UPSDeliveryService {
  private readonly http = axios.create();

  constructor() {}

  public static get requestHeader() {
    return AppConfig.delivery.UPSRequestHeader;
  }

  public static get ContribDeliveryData() {
    return AppConfig.delivery.UPSContribDeliveryData;
  }

  public static get ContribCardData() {
    return AppConfig.delivery.UPSContribCardData;
  }

  public static get deliveryRateUrl(): string {
    return AppConfig.delivery.UPSTestEnviroment
      ? 'https://wwwcie.ups.com/ship/v1/rating/Rate?additionalinfo=timeintransit'
      : 'https://onlinetools.ups.com/ship/v1/rating/Rate?additionalinfo=timeintransit';
  }

  public static get shippingUrl(): string {
    return AppConfig.delivery.UPSTestEnviroment
      ? 'https://wwwcie.ups.com/ship/v1701/shipments'
      : 'https://onlinetools.ups.com/ship/v1701/shipments';
  }

  private static handleErrors(error): void {
    if (error.response) {
      throw new AppError(`${error.response.headers.errordescription}`);
    } else if (error.request) {
      // The request was made but no response was received
      //f `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      AppLogger.error(`The request was made but no response was received, error: ${error.message}`);
      throw new AppError('Something went wrong. Please try again later');
    } else {
      AppLogger.error(`Unhandled error when made reauest, error:${error.message}`);
      throw new AppError('Something went wrong. Please try again later');
    }
  }

  private static deliveryPriceBodyRequest(
    parcel: AuctionParcel,
    address: UserAccountAddress,
    deliveryMethod: string,
  ): object {
    const { width: ParcelWidth, length: ParcelLength, height: ParcelHeight, weight: ParcelWeight } = parcel;

    const {
      name: RecipientName,
      state: RecipientState,
      city: RecipientCity,
      zipCode: RecipientZipCode,
      street: RecipientStreet,
    } = address;

    const {
      city: ContribCity,
      state: ContribState,
      zipCode: ContribZipCode,
      address: ContribAddress,
      shipperNumber: ContribShipperNumber,
    } = UPSDeliveryService.ContribDeliveryData;

    return {
      RateRequest: {
        Request: {
          SubVersion: '1703',
        },
        Shipment: {
          ShipmentRatingOptions: {
            UserLevelDiscountIndicator: 'TRUE',
          },
          DeliveryTimeInformation: {
            PackageBillType: '03',
          },
          Shipper: {
            Name: 'Contrib',
            ShipperNumber: ContribShipperNumber,
            Address: {
              AddressLine: ContribAddress,
              City: ContribCity,
              StateProvinceCode: ContribState,
              PostalCode: ContribZipCode,
              CountryCode: 'US',
            },
          },
          ShipTo: {
            Name: RecipientName,
            Address: {
              AddressLine: RecipientStreet,
              City: RecipientCity,
              StateProvinceCode: RecipientState,
              PostalCode: RecipientZipCode,
              CountryCode: 'US',
            },
          },
          ShipFrom: {
            Name: 'Contrib',
            Address: {
              AddressLine: ContribAddress,
              City: ContribCity,
              StateProvinceCode: ContribState,
              PostalCode: ContribZipCode,
              CountryCode: 'US',
            },
          },
          Service: {
            Code: deliveryMethod,
          },
          Package: {
            PackagingType: {
              Code: '02',
              Description: 'Package',
            },
            Dimensions: {
              UnitOfMeasurement: {
                Code: 'IN',
              },
              Length: ParcelLength,
              Width: ParcelWidth,
              Height: ParcelHeight,
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: 'LBS',
              },
              Weight: ParcelWeight,
            },
          },
        },
      },
    };
  }

  private static shippingBodyRequest(
    parcel: AuctionParcel,
    address: UserAccountAddress,
    deliveryMethod: string,
  ): object {
    const paymentCard = UPSDeliveryService.ContribCardData;
    const {
      type: CardType,
      number: CardNumber,
      expirationDate: CardExpirationDate,
      securityCode: CardSecurityCode,
    } = paymentCard;

    const { width: ParcelWidth, length: ParcelLength, height: ParcelHeight, weight: ParcelWeight } = parcel;

    const {
      name: RecipientName,
      state: RecipientState,
      city: RecipientCity,
      zipCode: RecipientZipCode,
      street: RecipientStreet,
    } = address;

    const {
      city: ContribCity,
      state: ContribState,
      zipCode: ContribZipCode,
      address: ContribAddress,
      shipperNumber: ContribShipperNumber,
    } = UPSDeliveryService.ContribDeliveryData;

    return {
      ShipmentRequest: {
        Shipment: {
          Shipper: {
            Name: 'Contrib',
            ShipperNumber: ContribShipperNumber,
            Address: {
              AddressLine: ContribAddress,
              City: ContribCity,
              StateProvinceCode: ContribState,
              PostalCode: ContribZipCode,
              CountryCode: 'US',
            },
          },
          ShipTo: {
            Name: RecipientName,
            Address: {
              AddressLine: RecipientStreet,
              City: RecipientCity,
              StateProvinceCode: RecipientState,
              PostalCode: RecipientZipCode,
              CountryCode: 'US',
            },
          },
          ShipFrom: {
            Name: 'Contrib',
            Address: {
              AddressLine: ContribAddress,
              City: ContribCity,
              StateProvinceCode: ContribState,
              PostalCode: ContribZipCode,
              CountryCode: 'US',
            },
          },
          PaymentInformation: {
            ShipmentCharge: {
              Type: '01',
              BillShipper: {
                CreditCard: {
                  Type: CardType,
                  Number: CardNumber,
                  ExpirationDate: CardExpirationDate,
                  SecurityCode: CardSecurityCode,
                },
              },
            },
          },
          ItemizedChargesRequestedIndicator: '',
          Service: {
            Code: deliveryMethod,
          },
          ShipmentRatingOptions: {
            RateChartIndicator: '0',
          },
          Package: {
            Packaging: {
              Code: '02',
            },
            Dimensions: {
              UnitOfMeasurement: {
                Code: 'IN',
              },
              Length: ParcelLength,
              Width: ParcelWidth,
              Height: ParcelHeight,
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: 'LBS',
              },
              Weight: ParcelWeight,
            },
          },
        },
      },
    };
  }

  public async getDeliveryPrice(
    parcel: AuctionParcel,
    address: UserAccountAddress,
    deliveryMethod: string,
  ): Promise<{ deliveryPrice: Dinero.Dinero; timeInTransit: Dayjs }> {
    try {
      const request = UPSDeliveryService.deliveryPriceBodyRequest(parcel, address, deliveryMethod);

      const responce = await this.http.post(UPSDeliveryService.deliveryRateUrl, request, {
        headers: UPSDeliveryService.requestHeader,
      });

      const shipmentRate = responce.data.RateResponse.RatedShipment;
      const totalCharges = shipmentRate.TotalCharges;
      const timeInTransit = shipmentRate.TimeInTransit.ServiceSummary.EstimatedArrival.Arrival.Date;

      return {
        deliveryPrice: Dinero({
          amount: Number((totalCharges.MonetaryValue * 100).toFixed(2)),
          currency: totalCharges.CurrencyCode as Dinero.Currency,
        }),
        timeInTransit: dayjs(timeInTransit.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).add(4, 'days'),
      };
    } catch (error) {
      UPSDeliveryService.handleErrors(error);
    }
  }

  public async shippingRegistration(
    parcel: AuctionParcel,
    address: UserAccountAddress,
    deliveryMethod: string,
  ): Promise<{ deliveryPrice: Dinero.Dinero; identificationNumber: string; shippingLabel: string }> {
    try {
      const request = UPSDeliveryService.shippingBodyRequest(parcel, address, deliveryMethod);

      const responce = await this.http.post(UPSDeliveryService.shippingUrl, request, {
        headers: UPSDeliveryService.requestHeader,
      });

      const shipmentResults = responce.data.ShipmentResponse.ShipmentResults;
      const totalCharges = shipmentResults.ShipmentCharges.TotalCharges;
      const identificationNumber = shipmentResults.ShipmentIdentificationNumber;
      const shippingLabel = shipmentResults.PackageResults.ShippingLabel.GraphicImage;

      return {
        deliveryPrice: Dinero({
          amount: Number((totalCharges.MonetaryValue * 100).toFixed(2)),
          currency: totalCharges.CurrencyCode as Dinero.Currency,
        }),
        identificationNumber,
        shippingLabel,
      };
    } catch (error) {
      UPSDeliveryService.handleErrors(error);
    }
  }
}
