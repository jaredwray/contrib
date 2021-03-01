import { Redirect } from 'react-router-dom';

/**
 * A separate page where Auth0 callback leads to.
 *
 * While it only redirects to home page, there is a {@link UserAccountProvider} up the component tree
 * which ensures profile is loaded, and redirects to onboarding if needed.
 *
 * This prevents irritating screen flickering while app is guessing whether onboarding is needed.
 *
 * @see UserAccountProvider
 */

export function AfterLogin() {
  return <Redirect to="/" />;
}
