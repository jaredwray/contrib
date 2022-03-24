describe('skipped tests', () => {
  xit('skipped', () => {});
});

// import React from 'react';
// import { act } from 'react-dom/test-utils';
// import { mount, ReactWrapper } from 'enzyme';
// import { InMemoryCache } from '@apollo/client';
// import { MemoryRouter } from 'react-router-dom';
// import { MockedProvider } from '@apollo/client/testing';
// import { ToastProvider } from 'react-toast-notifications';
//
// import Layout from 'src/components/layouts/Layout';
// import { AuctionQuery } from 'src/apollo/queries/auctions';
// import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
// import AuctionDonePage from 'src/modules/auctions/editAuction/DonePage';
//
// const mockHistoryFn = jest.fn();
//
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useParams: () => ({
//     auctionId: 'testId',
//   }),
//   useHistory: () => ({
//     replace: mockHistoryFn,
//     location: { pathname: '/' },
//   }),
//   useRouteMatch: () => ({ url: '/auctions/testId/done' }),
// }));
// jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());
// jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);
//
// const cache = new InMemoryCache();
// const cache2 = new InMemoryCache();
// const nullDataCache = new InMemoryCache();
//
// cache.writeQuery({
//   query: AuctionQuery,
//   variables: { id: 'testId' },
//   data: {
//     auction: AuctionQueryAuction,
//   },
// });
// cache2.writeQuery({
//   query: AuctionQuery,
//   variables: { id: 'testId' },
//   data: {
//     auction: { ...AuctionQueryAuction, status: 'DRAFT' },
//   },
// });
// nullDataCache.writeQuery({
//   query: AuctionQuery,
//   variables: { id: 'testId' },
//   data: { auction: null },
// });
// describe('DonePage ', () => {
//   document.execCommand = jest.fn();
//   it('component return null', async () => {
//     let wrapper: ReactWrapper;
//     window.prompt = () => {};
//     await act(async () => {
//       wrapper = mount(
//         <MemoryRouter>
//           <MockedProvider>
//             <AuctionDonePage />
//           </MockedProvider>
//         </MemoryRouter>,
//       );
//     });
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve));
//       wrapper.update();
//     });
//     expect(wrapper!.find(Layout)).toHaveLength(0);
//   });
//   it('component is defined and has Layout', async () => {
//     let wrapper: ReactWrapper;
//     await act(async () => {
//       wrapper = mount(
//         <MemoryRouter>
//           <ToastProvider>
//             <MockedProvider cache={cache}>
//               <AuctionDonePage />
//             </MockedProvider>
//           </ToastProvider>
//         </MemoryRouter>,
//       );
//     });
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve));
//       wrapper.update();
//     });
//     expect(wrapper!).toHaveLength(1);
//     expect(wrapper!.find(Layout)).toHaveLength(1);
//   });
//   it('component should redirect to 404 page', async () => {
//     let wrapper: ReactWrapper;
//     await act(async () => {
//       wrapper = mount(
//         <MemoryRouter>
//           <ToastProvider>
//             <MockedProvider cache={nullDataCache}>
//               <AuctionDonePage />
//             </MockedProvider>
//           </ToastProvider>
//         </MemoryRouter>,
//       );
//     });
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve));
//       wrapper.update();
//     });
//     expect(mockHistoryFn).toBeCalled();
//   });
//   it('component should redirect to home page when auction status is DRAFT', async () => {
//     let wrapper: ReactWrapper;
//     await act(async () => {
//       wrapper = mount(
//         <MemoryRouter>
//           <ToastProvider>
//             <MockedProvider cache={cache2}>
//               <AuctionDonePage />
//             </MockedProvider>
//           </ToastProvider>
//         </MemoryRouter>,
//       );
//     });
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve));
//       wrapper.update();
//     });
//     expect(mockHistoryFn).toBeCalled();
//   });
// });
