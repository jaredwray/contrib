import { ConfigService } from '@nestjs/config';
import { MockAppLogger } from '../../test/mock-app-logger';
import { Twilio } from 'twilio';
import { PhoneVerificationService } from './phone-verification.service';
import { mocked } from 'ts-jest/utils';
import { BaseError } from '../errors/base-error';

const mockedCreateVerification = jest.fn();
const mockedCheckVerification = jest.fn();
jest.mock('twilio', () => {
  return {
    Twilio: jest.fn().mockImplementation(() => {
      return {
        verify: {
          services: () => {
            return {
              verifications: {
                create: mockedCreateVerification,
              },
              verificationChecks: {
                create: mockedCheckVerification,
              },
            };
          },
        },
      };
    }),
  };
});

const MockedTwilio = mocked(Twilio, true);
const phoneNumber = '+375441234567';

beforeEach(() => {
  MockedTwilio.mockClear();
});

describe('createVerification', () => {
  it('creates confirmation', async () => {
    const mockLogger = new MockAppLogger();
    const cs = new ConfigService({});
    const service = new PhoneVerificationService(mockLogger, cs);
    await service.createVerification(phoneNumber);
    expect(mockedCreateVerification).toHaveBeenCalledWith({ to: phoneNumber, channel: 'sms' });
  });
});

describe('confirmVerification', () => {
  const otp = '123456';

  describe('when successfully confirmed', () => {
    beforeEach(() => {
      mockedCheckVerification.mockReturnValueOnce({ status: 'approved' });
    });

    it('verifies confirmation', async () => {
      const mockLogger = new MockAppLogger();
      const cs = new ConfigService({});
      const service = new PhoneVerificationService(mockLogger, cs);
      await service.confirmVerification(phoneNumber, otp);
      expect(mockedCheckVerification).toHaveBeenCalledWith({ to: phoneNumber, code: otp });
    });
  });

  describe('when returned status is not approved', () => {
    beforeEach(() => {
      mockedCheckVerification.mockReturnValueOnce({ status: 'pending' });
    });

    it('throws error', async () => {
      const mockLogger = new MockAppLogger();
      const cs = new ConfigService({});
      const service = new PhoneVerificationService(mockLogger, cs);
      try {
        await service.confirmVerification(phoneNumber, otp);
      } catch (e) {
        expect(mockedCheckVerification).toHaveBeenCalledWith({ to: phoneNumber, code: otp });
        console.log(e);
        expect(e).toEqual(new BaseError(`wrong confirmation code for: ${phoneNumber}`, 'phone_confirmation_exception'));
      }
    });
  });
});
