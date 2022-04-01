import 'intersection-observer';

import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { ContribApolloProvider } from 'src/apollo/ContribApolloProvider';
import { AuthProvider } from 'src/components/helpers/AuthProvider/AuthProvider';
import { ScrollToTop } from 'src/components/helpers/ScrollToTop';
import { UserAccountProvider } from 'src/components/helpers/UserAccountProvider';
import PrivateRoute from 'src/components/routing/PrivateRoute';
import ShortLinkPage from 'src/components/routing/ShortLinkPage';
import WithStripe from 'src/components/wrappers/WithStripe';
import AdminAuctionPage from 'src/modules/admin/auctions/AdminAuctionPage';
import AdminAuctionsPage from 'src/modules/admin/auctions/AdminAuctionsPage';
import Charities from 'src/modules/admin/Charities';
import Influencers from 'src/modules/admin/Influencers';
import AuctionDeliveryInfoPage from 'src/modules/auctions/AuctionDeliveryInfoPage';
import AuctionPage from 'src/modules/auctions/AuctionPage';
import AllAuctionsPage from 'src/modules/auctions/AuctionsPage';
import EditAuctionAttachmentsPage from 'src/modules/auctions/editAuction/AuctionAttachmentsPage';
import EditAuctionBidsStepPage from 'src/modules/auctions/editAuction/BidsStepPage';
import EditAuctionBuyNowPricePage from 'src/modules/auctions/editAuction/BuyNowPricePage';
import EditAuctionCharityPage from 'src/modules/auctions/editAuction/CharityPage';
import EditAuctionDescriptionPage from 'src/modules/auctions/editAuction/DescriptionPage';
import AuctionDonePage from 'src/modules/auctions/editAuction/DonePage';
import EditAuctionDurationPage from 'src/modules/auctions/editAuction/DurationPage';
import EditFairMarketValuePage from 'src/modules/auctions/editAuction/FairMarketValuePage';
import EditAuctionPrivatePage from 'src/modules/auctions/editAuction/PrivateAuction';
import EditStartPricePage from 'src/modules/auctions/editAuction/StartPricePage';
import EditAuctionPage from 'src/modules/auctions/editAuction/TitlePage';
import AllCharitiesPage from 'src/modules/charity/CharitiesPage';
import { CharityProfileEditPage } from 'src/modules/charity/CharityProfileEditPage';
import { CharityProfilePage } from 'src/modules/charity/CharityProfilePage';
import DeliveryAddressPage from 'src/modules/delivery/DeliveryAddressPage';
import DeliveryPaymentPage from 'src/modules/delivery/DeliveryPaymentPage';
import DeliveryStatusPage from 'src/modules/delivery/DeliveryStatusPage';
import Page404 from 'src/modules/errors/Page404';
import HomePage from 'src/modules/Home';
import Assistants from 'src/modules/Influencer/Assistants';
import AllInfluencersPage from 'src/modules/Influencer/InfluerncersPage';
import InternalScripts from 'src/modules/InternalScripts';
import InvitationPage from 'src/modules/Invitation';
import LogInPage from 'src/modules/LogInPage';
import PhoneNumberConfirmation from 'src/modules/phoneNumber/Confirmation';
import PhoneNumberVerification from 'src/modules/phoneNumber/Verification';
import Privacy from 'src/modules/Privacy';
import Terms from 'src/modules/Terms';
import UserProfilePage from 'src/modules/UserProfile';

import 'src/index.scss';
import { mergeUrlPath } from './helpers/mergeUrlPath';
import { AfterLogin } from './modules/AfterLogin';
import { InfluencerProfileEditPage } from './modules/Influencer/InfluencerProfileEditPage';
import { InfluencerProfilePage } from './modules/Influencer/InfluencerProfilePage';
import { InfluencerOnboardingBasicPage } from './modules/Influencer/Onboarding/InfluencerOnboardingBasicPage';
import { InfluencerOnboardingCharitiesPage } from './modules/Influencer/Onboarding/InfluencerOnboardingCharitiesPage';
import { InfluencerOnboardingDonePage } from './modules/Influencer/Onboarding/InfluencerOnboardingDonePage';

export const history = createBrowserHistory();

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider apiUrl={mergeUrlPath(process.env.REACT_APP_API_AUDIENCE, '/api/v1/auth/')}>
        <Router history={history}>
          <ScrollToTop />
          <ContribApolloProvider>
            <UserAccountProvider>
              <>
                <InternalScripts />
                <Switch>
                  <Route exact component={HomePage} path="/" />
                  <Route exact component={AfterLogin} path="/after-login" />
                  <Route exact component={Privacy} path="/privacy-policy" />
                  <Route exact component={Privacy} path="/privacy" />
                  <Route exact component={Terms} path="/terms" />
                  <Route exact component={PhoneNumberVerification} path="/phone-verification" />
                  <Route exact component={PhoneNumberConfirmation} path="/phone-confirmation" />
                  <Route exact component={InvitationPage} path="/invitation/:slug" />

                  <PrivateRoute component={UserProfilePage} path="/profile" role="user" />

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

                  <Route exact component={AllInfluencersPage} path="/influencers" />
                  <PrivateRoute component={InfluencerProfileEditPage} path="/profiles/me/edit" role="influencer" />
                  <PrivateRoute
                    component={InfluencerProfileEditPage}
                    path="/profiles/:influencerId/edit"
                    role="admin"
                  />
                  <PrivateRoute component={InfluencerProfilePage} path="/profiles/me" role="influencer" />
                  <Route exact component={InfluencerProfilePage} path="/profiles/:influencerId" />

                  <Route exact component={AllCharitiesPage} path="/charities" />
                  <PrivateRoute component={CharityProfileEditPage} path="/charity/me/edit" role="charity" />
                  <PrivateRoute component={CharityProfileEditPage} path="/charity/:charityId/edit" role="admin" />
                  <PrivateRoute component={CharityProfilePage} path="/charity/me" role="charity" />
                  <Route exact component={CharityProfilePage} path="/charity/:charityId" />

                  <PrivateRoute component={Assistants} path="/assistants/me" role="influencer" />
                  <PrivateRoute component={Assistants} path="/assistants/:influencerId" role="admin" />

                  <Route exact component={AllAuctionsPage} path="/auctions" />
                  <PrivateRoute component={EditAuctionPage} path="/auctions/:ownerId/new" role="admin" />
                  <PrivateRoute component={EditAuctionPage} path="/auctions/:auctionId/title" role="influencer" />
                  <PrivateRoute component={EditAuctionPage} path="/auctions/new" role="influencer" />
                  <PrivateRoute
                    component={EditAuctionDescriptionPage}
                    path="/auctions/:auctionId/description"
                    role="influencer"
                  />
                  <PrivateRoute
                    component={EditAuctionAttachmentsPage}
                    path="/auctions/:auctionId/attachments"
                    role="influencer"
                  />
                  <PrivateRoute
                    component={EditStartPricePage}
                    path="/auctions/:auctionId/price/starting"
                    role="influencer"
                  />
                  <PrivateRoute
                    component={EditAuctionBuyNowPricePage}
                    path="/auctions/:auctionId/price/buying"
                    role="influencer"
                  />
                  <PrivateRoute
                    component={EditAuctionBidsStepPage}
                    path="/auctions/:auctionId/bids-step"
                    role="influencer"
                  />
                  <PrivateRoute
                    component={EditFairMarketValuePage}
                    path="/auctions/:auctionId/price/fmv"
                    role="influencer"
                  />
                  <PrivateRoute
                    component={EditAuctionDurationPage}
                    path="/auctions/:auctionId/duration"
                    role="influencer"
                  />
                  <PrivateRoute component={EditAuctionPrivatePage} path="/auctions/:auctionId/private" role="admin" />
                  <PrivateRoute
                    component={EditAuctionCharityPage}
                    path="/auctions/:auctionId/charity"
                    role="influencer"
                  />
                  <Route component={DeliveryAddressPage} path="/auctions/:auctionId/delivery/address" />
                  <Route
                    component={() => (
                      <WithStripe>
                        <DeliveryPaymentPage />
                      </WithStripe>
                    )}
                    path="/auctions/:auctionId/delivery/payment"
                  />
                  <Route component={DeliveryStatusPage} path="/auctions/:auctionId/delivery/status" />
                  <PrivateRoute
                    component={AuctionDeliveryInfoPage}
                    path="/auctions/:auctionId/delivery/info"
                    role="influencer"
                  />
                  <Route exact component={AuctionPage} path="/auctions/:auctionId" />
                  <PrivateRoute component={AuctionDonePage} path="/auctions/:auctionId/done" role="influencer" />
                  <Route component={ShortLinkPage} path="/go/:slug" />
                  <Route component={LogInPage} path="/log-in" />
                  <Route component={Page404} path="*" />
                </Switch>
              </>
            </UserAccountProvider>
          </ContribApolloProvider>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
