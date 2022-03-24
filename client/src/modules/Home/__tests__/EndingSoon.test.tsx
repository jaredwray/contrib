describe('skipped tests', () => {
  xit('skipped', () => {});
});

// import React from 'react';
// import { MockedProvider } from '@apollo/client/testing';
// import { mount, ReactWrapper } from 'enzyme';
// import { AuctionsListQuery } from 'src/apollo/queries/auctions';
// import { auction } from 'src/helpers/testHelpers/auction';
// import { MemoryRouter } from 'react-router-dom';
// import { InMemoryCache } from '@apollo/client';
// import EndingSoon from '../EndingSoon';
// import { ToastProvider } from 'react-toast-notifications';
// import { act } from 'react-dom/test-utils';
// import { AuctionStatus } from 'src/types/Auction';
// import Slider from 'src/components/customComponents/Slider';
//
// jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());
// const cache = new InMemoryCache();
// const secondCache = new InMemoryCache();
//
// cache.writeQuery({
//   query: AuctionsListQuery,
//   variables: {
//     size: 10,
//     skip: 0,
//     filters: {
//       status: [AuctionStatus.ACTIVE],
//     },
//   },
//   data: {
//     auctions: {
//       items: [auction],
//       size: 1,
//       skip: 0,
//       totalItems: 1,
//     },
//   },
// });
//
// secondCache.writeQuery({
//   query: AuctionsListQuery,
//   variables: {
//     size: 10,
//     skip: 0,
//     filters: {
//       status: [AuctionStatus.ACTIVE],
//     },
//   },
//   data: {
//     auctions: {
//       items: [],
//       size: 1,
//       skip: 0,
//       totalItems: 1,
//     },
//   },
// });
// describe('EndingSoon ', () => {
//   it('component return null', async () => {
//     let wrapper: ReactWrapper;
//     await act(async () => {
//       wrapper = mount(
//         <MockedProvider>
//           <EndingSoon />
//         </MockedProvider>,
//       );
//     });
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve));
//       wrapper.update();
//     });
//     expect(wrapper!.find('section')).toHaveLength(0);
//   });
//   it('component is defined and have section', async () => {
//     let wrapper: ReactWrapper;
//     await act(async () => {
//       wrapper = mount(
//         <MemoryRouter>
//           <ToastProvider>
//             <MockedProvider cache={cache}>
//               <EndingSoon />
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
//     expect(wrapper!.find('section')).toHaveLength(1);
//   });
//   it('component should not have slider', async () => {
//     let wrapper: ReactWrapper;
//     await act(async () => {
//       wrapper = mount(
//         <MemoryRouter>
//           <ToastProvider>
//             <MockedProvider cache={secondCache}>
//               <EndingSoon />
//             </MockedProvider>
//           </ToastProvider>
//         </MemoryRouter>,
//       );
//     });
//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve));
//       wrapper.update();
//     });
//     expect(wrapper!.find(Slider)).toHaveLength(0);
//   });
// });
