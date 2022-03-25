import { mount, ReactWrapper } from 'enzyme';
import { auction } from 'src/helpers/testHelpers/auction';

import FollowBtn from '..';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

describe('FollowBtn', () => {
  let props;
  let wrapper: ReactWrapper;
  const unfollowHandler = jest.fn();
  const followHandler = jest.fn();

  describe('on text click', () => {
    const clickOnWatchThisText = () => {
      wrapper.find('.test-watchThisText').simulate('click');
    };
    describe('when loading=true', () => {
      beforeEach(() => {
        props = {
          auction,
          loading: true,
          unfollowHandler,
          followHandler,
        };
        wrapper = mount(<FollowBtn {...props} />);
        clickOnWatchThisText();
      });

      xit('does nothing', () => {
        expect(followHandler).not.toBeCalled();
        expect(unfollowHandler).not.toBeCalled();
      });
    });
    //
    //     describe('when disabled=true', () => {
    //       beforeEach(() => {
    //         props = {
    //           auction,
    //           disabled: true,
    //           unfollowHandler,
    //           followHandler,
    //         };
    //         wrapper = mount(<FollowBtn {...props} />);
    //         clickOnWatchThisText();
    //       });
    //
    //       it('does nothing', () => {
    //         expect(followHandler).not.toBeCalled();
    //         expect(unfollowHandler).not.toBeCalled();
    //       });
    //     });
    //
    //     describe('when not disabled or loading, but followed', () => {
    //       beforeEach(() => {
    //         props = {
    //           auction,
    //           followed: true,
    //           unfollowHandler,
    //           followHandler,
    //         };
    //         wrapper = mount(<FollowBtn {...props} />);
    //         clickOnWatchThisText();
    //       });
    //
    //       it('calls unfollowHandler', () => {
    //         expect(unfollowHandler).toBeCalled();
    //         expect(followHandler).not.toBeCalled();
    //       });
    //     });
    //
    //     describe('when not disabled or loading, but unfollowed', () => {
    //       beforeEach(() => {
    //         props = {
    //           auction,
    //           followed: false,
    //           unfollowHandler,
    //           followHandler,
    //         };
    //         wrapper = mount(<FollowBtn {...props} />);
    //         clickOnWatchThisText();
    //       });
    //
    //       it('calls unfollowHandler', () => {
    //         expect(unfollowHandler).not.toBeCalled();
    //         expect(followHandler).toBeCalled();
    //       });
    //     });
  });
});
