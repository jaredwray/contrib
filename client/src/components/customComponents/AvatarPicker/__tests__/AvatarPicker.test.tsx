import { mount } from 'enzyme';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { Button } from 'react-bootstrap';

import { UpdateInfluencerProfileAvatarMutation } from 'src/apollo/queries/profile';
import { AvatarPicker } from 'src/components/customComponents/AvatarPicker';

describe('AvatarPicker', () => {
  const props: any = {
    item: {
      avatarUrl: 'test',
      favoriteCharities: [],
      id: 'test',
      name: 'test',
      profileDescription: 'test',
      sport: 'test',
      status: 'test',
      team: 'test',
    },
    updateMutation: UpdateInfluencerProfileAvatarMutation,
    itemId: 'test',
  };

  let wrapper: any;

  describe('render', () => {
    global.URL.createObjectURL = jest.fn();

    beforeEach(() => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider>
            <AvatarPicker {...props} />
          </MockedProvider>
        </ToastProvider>,
      );
    });

    it('component is defined', () => {
      expect(wrapper).toHaveLength(1);
    });

    describe('change input value with correct img', () => {
      it('should update profile image', () => {
        wrapper.find('input').simulate('change', { target: { files: [{ size: 200000, name: 'testName.png' }] } });
      });
    });

    describe('change input value with big size img', () => {
      it('should handle error about big size', () => {
        wrapper.find('input').simulate('change', { target: { files: [{ size: 20000000000, name: 'testName.png' }] } });
      });
    });

    describe('change input value with incorrect type img', () => {
      it('should handle error incorrect type', () => {
        wrapper.find('input').simulate('change', { target: { files: [{ size: 200000, name: 'testName.vmv' }] } });
      });
    });

    describe('click on upload button', () => {
      it('should call click on ref value', () => {
        jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { click: jest.fn() } });
        wrapper.find(Button).simulate('click');
      });
    });
  });
});
