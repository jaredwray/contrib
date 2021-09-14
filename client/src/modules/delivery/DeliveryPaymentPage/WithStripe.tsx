import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '');

export const withStripe = (Component: any) => {
  const stripeOptions = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap',
      },
    ],
  };
  return (
    <Elements options={stripeOptions} stripe={stripePromise}>
      <Component />
    </Elements>
  );
};
