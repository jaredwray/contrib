describe('AuctionPagedetails', () => {
  xit('component is defined', () => {
    // expect(wrapper).toHaveLength(1);
  });
});

// import { mount, ReactWrapper } from 'enzyme';
// import { act } from 'react-dom/test-utils';
// import { MockedProvider } from '@apollo/client/testing';
// import { ToastProvider } from 'react-toast-notifications';
// import { BrowserRouter as Router } from 'react-router-dom';
// import WatchBtn from 'src/components/buttons/WatchBtn';
// import ShareBtn from 'src/modules/auctions/AuctionPage/GeneralInformation/ShareBtn';
// import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
// import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
// import * as auth from 'src/helpers/useAuth';
//
// import AuctionDetails from '..';
//
// jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);
//
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useParams: () => ({
//     auctionId: 'testId',
//   }),
// }));
//
// const props: any = {
//   auction: AuctionQueryAuction,
// };
//
// const mockFn = jest.fn();
//
// const mocks = [
//   {
//     request: {
//       query: FollowAuctionMutation,
//       variables: {
//         auctionId: 'testId',
//       },
//     },
//     newData: () => {
//       mockFn();
//       return {
//         data: {
//           followAuction: {
//             user: 'testId',
//             createdAt: 'test Date',
//           },
//         },
//       };
//     },
//   },
//   {
//     request: {
//       query: UnfollowAuctionMutation,
//       variables: {
//         auctionId: 'testId',
//       },
//     },
//     newData: () => {
//       mockFn();
//       return {
//         data: {
//           unfollowAuction: {
//             id: 'testId',
//           },
//         },
//       };
//     },
//   },
// ];
// const errorMocks = [
//   {
//     request: {
//       query: FollowAuctionMutation,
//       variables: {},
//     },
//     newData: () => {
//       mockFn();
//       return {
//         data: {},
//       };
//     },
//   },
//   {
//     request: {
//       query: UnfollowAuctionMutation,
//       variables: {},
//     },
//     newData: () => {
//       mockFn();
//       return {
//         data: {},
//       };
//     },
//   },
// ];
//
// const withAuthUser = () => {
//   const spy = jest.spyOn(auth, 'useAuth');
//   spy.mockReturnValue({
//     isAuthenticated: true,
//   });
// };
//
// describe('AuctionDetails', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//   it('renders without crashing', () => {
//     let wrapper: ReactWrapper;
//     (wrapper = mount(
//       <Router>
//         <ToastProvider>
//           <MockedProvider>
//             <AuctionDetails {...props} />
//           </MockedProvider>
//         </ToastProvider>
//       </Router>,
//     )),
//       expect(wrapper).toHaveLength(1);
//   });
//
//   describe('when auction is not active', () => {
//     it('should not display WatchBtn', async () => {
//       let wrapper: ReactWrapper;
//       await act(async () => {
//         wrapper = mount(
//           <Router>
//             <ToastProvider>
//               <MockedProvider mocks={mocks}>
//                 <AuctionDetails {...props} />
//               </MockedProvider>
//             </ToastProvider>
//           </Router>,
//         );
//       });
//       expect(wrapper.find(WatchBtn)).toHaveLength(0);
//     });
//     it('should display ShareBtn', async () => {
//       let wrapper: ReactWrapper;
//       await act(async () => {
//         wrapper = mount(
//           <Router>
//             <ToastProvider>
//               <MockedProvider mocks={mocks}>
//                 <AuctionDetails {...props} />
//               </MockedProvider>
//             </ToastProvider>
//           </Router>,
//         );
//       });
//       expect(wrapper.find(ShareBtn)).toHaveLength(1);
//     });
//   });
//   describe('when auction is active', () => {
//     beforeEach(() => {
//       AuctionQueryAuction['isActive'] = true;
//       AuctionQueryAuction['isStopped'] = false;
//     });
//     it('should display ShareBtn', async () => {
//       let wrapper: ReactWrapper;
//       await act(async () => {
//         wrapper = mount(
//           <Router>
//             <ToastProvider>
//               <MockedProvider mocks={mocks}>
//                 <AuctionDetails {...props} />
//               </MockedProvider>
//             </ToastProvider>
//           </Router>,
//         );
//       });
//       expect(wrapper.find(ShareBtn)).toHaveLength(1);
//     });
//     describe('watch button', () => {
//       it('should display WatchBtn', async () => {
//         let wrapper: ReactWrapper;
//         await act(async () => {
//           wrapper = mount(
//             <Router>
//               <ToastProvider>
//                 <MockedProvider mocks={mocks}>
//                   <AuctionDetails {...props} />
//                 </MockedProvider>
//               </ToastProvider>
//             </Router>,
//           );
//         });
//         expect(wrapper.find(WatchBtn)).toHaveLength(1);
//       });
//       it('should redirect and not call followAuction mutation', async () => {
//         let wrapper: ReactWrapper;
//         await act(async () => {
//           wrapper = mount(
//             <Router>
//               <ToastProvider>
//                 <MockedProvider mocks={mocks}>
//                   <AuctionDetails {...props} />
//                 </MockedProvider>
//               </ToastProvider>
//             </Router>,
//           );
//         });
//         await act(async () => {
//           wrapper!.find(WatchBtn).prop('followHandler')!();
//         });
//         await new Promise((resolve) => setTimeout(resolve));
//         expect(mockFn).toHaveBeenCalledTimes(0);
//       });
//       it('should call followAuction mutation', async () => {
//         withAuthUser();
//         let wrapper: ReactWrapper;
//         await act(async () => {
//           wrapper = mount(
//             <Router>
//               <ToastProvider>
//                 <MockedProvider mocks={mocks}>
//                   <AuctionDetails {...props} />
//                 </MockedProvider>
//               </ToastProvider>
//             </Router>,
//           );
//         });
//         await act(async () => {
//           wrapper!.find(WatchBtn).prop('followHandler')!();
//         });
//         await new Promise((resolve) => setTimeout(resolve));
//         expect(mockFn).toHaveBeenCalledTimes(1);
//       });
//       it('should call UnfollowAuction mutation', async () => {
//         withAuthUser();
//         let wrapper: ReactWrapper;
//         await act(async () => {
//           wrapper = mount(
//             <Router>
//               <ToastProvider>
//                 <MockedProvider mocks={mocks}>
//                   <AuctionDetails {...props} />
//                 </MockedProvider>
//               </ToastProvider>
//             </Router>,
//           );
//         });
//         await act(async () => {
//           wrapper!.find(WatchBtn).prop('unfollowHandler')!();
//         });
//         await new Promise((resolve) => setTimeout(resolve));
//         expect(mockFn).toHaveBeenCalledTimes(1);
//       });
//       it('should not call followAuction mutation becouse of error', async () => {
//         withAuthUser();
//         let wrapper: ReactWrapper;
//         await act(async () => {
//           wrapper = mount(
//             <Router>
//               <ToastProvider>
//                 <MockedProvider mocks={errorMocks}>
//                   <AuctionDetails {...props} />
//                 </MockedProvider>
//               </ToastProvider>
//             </Router>,
//           );
//         });
//         await act(async () => {
//           wrapper!.find(WatchBtn).prop('followHandler')!();
//         });
//         await new Promise((resolve) => setTimeout(resolve));
//         expect(mockFn).toHaveBeenCalledTimes(0);
//       });
//       it('should not call UnfollowAuction mutation becouse of error', async () => {
//         withAuthUser();
//         let wrapper: ReactWrapper;
//         await act(async () => {
//           wrapper = mount(
//             <Router>
//               <ToastProvider>
//                 <MockedProvider mocks={errorMocks}>
//                   <AuctionDetails {...props} />
//                 </MockedProvider>
//               </ToastProvider>
//             </Router>,
//           );
//         });
//         await act(async () => {
//           wrapper!.find(WatchBtn).prop('unfollowHandler')!();
//         });
//         await new Promise((resolve) => setTimeout(resolve));
//         expect(mockFn).toHaveBeenCalledTimes(0);
//       });
//     });
//   });
// });
