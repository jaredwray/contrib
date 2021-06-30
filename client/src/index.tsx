import 'intersection-observer';
import React from 'react';

import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { ContribApolloProvider } from 'src/apollo/ContribApolloProvider';
import IntercomStateManager from 'src/components/IntercomStateManager';
import NewRelicInitializer from 'src/components/NewRelicInitializer';
import PrivateRoute from 'src/components/PrivateRoute';
import { UserAccountProvider } from 'src/components/UserAccountProvider';
import AdminAuctionPage from 'src/modules/admin/auctions/AdminAuctionPage';
import AdminAuctionsPage from 'src/modules/admin/auctions/AdminAuctionsPage';
import Charities from 'src/modules/admin/Charities';
import Influencers from 'src/modules/admin/Influencers';
import AuctionPage from 'src/modules/auctions/AuctionPage';
import Auctions from 'src/modules/auctions/AuctionsPage';
import EditAuctionBasicPage from 'src/modules/auctions/editAuction/BasicPage/Edit';
import NewAuctionBasicPage from 'src/modules/auctions/editAuction/BasicPage/New';
import EditAuctionDetailsPage from 'src/modules/auctions/editAuction/DetailsPage';
import AuctionDonePage from 'src/modules/auctions/editAuction/DonePage';
import EditAuctionMediaPage from 'src/modules/auctions/editAuction/MediaPage';
import NewAuctionWizardPage from 'src/modules/auctions/NewAuctionPage';
import { CharityProfileEditPage } from 'src/modules/charity/CharityProfileEditPage';
import { CharityProfilePage } from 'src/modules/charity/CharityProfilePage';
import Page404 from 'src/modules/errors/Page404';
import HomePage from 'src/modules/Home';
import Assistants from 'src/modules/Influencer/Assistants';
import InvitationPage from 'src/modules/Invitation';
import PhoneNumberConfirmation from 'src/modules/phoneNumber/Confirmation';
import PhoneNumberVerification from 'src/modules/phoneNumber/Verification';
import Privacy from 'src/modules/Privacy';
import Terms from 'src/modules/Terms';

import 'src/index.scss';
import { mergeUrlPath } from './helpers/mergeUrlPath';
import { AfterLogin } from './modules/AfterLogin';
import { InfluencerProfileEditPage } from './modules/Influencer/InfluencerProfileEditPage';
import { InfluencerProfilePage } from './modules/Influencer/InfluencerProfilePage';
import { InfluencerOnboardingBasicPage } from './modules/Influencer/Onboarding/InfluencerOnboardingBasicPage';
import { InfluencerOnboardingCharitiesPage } from './modules/Influencer/Onboarding/InfluencerOnboardingCharitiesPage';
import { InfluencerOnboardingDonePage } from './modules/Influencer/Onboarding/InfluencerOnboardingDonePage';

export const history = createBrowserHistory();

const onRedirectCallback = (appState: AppState) => {
  history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
  <ToastProvider>
    <Auth0Provider
      audience={process.env.REACT_APP_API_AUDIENCE}
      cacheLocation={'localstorage'}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      redirectUri={mergeUrlPath(process.env.REACT_APP_PLATFORM_URL, '/after-login')}
      onRedirectCallback={onRedirectCallback}
    >
      <Router history={history}>
        <ContribApolloProvider>
          <UserAccountProvider>
            <>
              <IntercomStateManager />
              <NewRelicInitializer />
              <Switch>
                <Route exact component={HomePage} path="/" />
                <Route exact component={AfterLogin} path="/after-login" />
                <Route exact component={Privacy} path="/privacy-policy" />
                <Route exact component={Privacy} path="/privacy" />
                <Route exact component={Terms} path="/terms" />
                <Route exact component={PhoneNumberVerification} path="/phone-verification" />
                <Route exact component={PhoneNumberConfirmation} path="/phone-confirmation" />
                <Route exact component={InvitationPage} path="/invitation/:slug" />

                <PrivateRoute component={InfluencerOnboardingBasicPage} path="/onboarding/basic" role="influencer" />
                <PrivateRoute
                  component={InfluencerOnboardingCharitiesPage}
                  path="/onboarding/charities"
                  role="influencer"
                />
                <PrivateRoute component={InfluencerOnboardingDonePage} path="/onboarding/done" role="influencer" />

                <PrivateRoute component={Charities} path="/admin/charities" role="admin" />
                <PrivateRoute component={Influencers} path="/admin/influencers" role="admin" />
                <PrivateRoute component={AdminAuctionPage} path="/admin/auctions/:auctionId" role="admin" />
                <PrivateRoute component={AdminAuctionsPage} path="/admin/auctions" role="admin" />

                <PrivateRoute component={InfluencerProfileEditPage} path="/profiles/me/edit" role="influencer" />
                <PrivateRoute component={InfluencerProfileEditPage} path="/profiles/:influencerId/edit" role="admin" />
                <PrivateRoute component={InfluencerProfilePage} path="/profiles/me" role="influencer" />
                <Route exact component={InfluencerProfilePage} path="/profiles/:influencerId" />

                <PrivateRoute component={CharityProfileEditPage} path="/charity/me/edit" role="charity" />
                <PrivateRoute component={CharityProfileEditPage} path="/charity/:charityId/edit" role="admin" />
                <PrivateRoute component={CharityProfilePage} path="/charity/me" role="charity" />
                <Route exact component={CharityProfilePage} path="/charity/:charityId" />

                <PrivateRoute component={Assistants} path="/assistants/me" role="influencer" />
                <PrivateRoute component={Assistants} path="/assistants/:influencerId" role="admin" />

                <Route exact component={Auctions} path="/auctions" />
                <PrivateRoute component={NewAuctionBasicPage} path="/auctions/:ownerId/new/basic" role="admin" />
                <PrivateRoute component={NewAuctionBasicPage} path="/auctions/new/basic" role="influencer" />
                <PrivateRoute component={NewAuctionWizardPage} path="/auctions/new" role="influencer" />
                <PrivateRoute component={EditAuctionBasicPage} path="/auctions/:auctionId/basic" role="influencer" />
                <PrivateRoute component={EditAuctionMediaPage} path="/auctions/:auctionId/media" role="influencer" />
                <PrivateRoute
                  component={EditAuctionDetailsPage}
                  path="/auctions/:auctionId/details"
                  role="influencer"
                />
                <PrivateRoute
                  component={EditAuctionMediaPage}
                  path="/auctions/:ownerId/:auctionId/media"
                  role="admin"
                />
                <Route exact component={AuctionPage} path="/auctions/:auctionId" />
                <PrivateRoute component={AuctionDonePage} path="/auctions/:auctionId/done" role="influencer" />

                <Route component={Page404} path="*" />
              </Switch>
            </>
          </UserAccountProvider>
        </ContribApolloProvider>
      </Router>
    </Auth0Provider>
  </ToastProvider>,
  document.getElementById('root'),
);
