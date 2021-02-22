export class StripeService {
  public chargePayment(): Promise<string> {
    return new Promise<string>((res) => {
      setTimeout(() => res('NOOP'), 1000);
    });
  }
}
