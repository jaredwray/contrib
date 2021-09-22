import Pagination from '../Pagination';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

import { mount } from 'enzyme';

describe('Should render correctly "Pagination"', () => {
  const props: any = {
    totalItems: 4,
    pageSize: 2,
    pageSkip: 3,
    perPage: 3,
    changeFilters: jest.fn(),
  };
  const props2: any = {
    ...props,
    totalItems: 25,
    pageSkip: 5,
  };
  const props3: any = {
    ...props,
    totalItems: 25,
    pageSkip: 21,
  };
  const props4: any = {
    ...props,
    totalItems: 45,
    pageSkip: 21,
  };
  const props5: any = {
    ...props,
    totalItems: 0,
  };
  const props6: any = {
    totalItems: 1,
    pageSize: 1,
    pageSkip: 0,
    perPage: 3,
    changeFilters: jest.fn(),
  };

  it('component is defined', () => {
    const wrapper = mount(<Pagination {...props} />);
    expect(wrapper).toHaveLength(1);
  });
  it('currentPage <= PAGINATION_LIMIT && totalPages > TOTAL_LIMIT', () => {
    const wrapper = mount(<Pagination {...props2} />);
    expect(wrapper).toHaveLength(1);
  });
  it('currentPage >= totalPages - PAGINATION_LIMIT && totalPages > TOTAL_LIMIT', () => {
    const wrapper = mount(<Pagination {...props3} />);
    expect(wrapper).toHaveLength(1);
  });
  it('currentPage > PAGINATION_LIMIT && currentPage <= totalPages - PAGINATION_LIMIT && totalPages > TOTAL_LIMIT', () => {
    const wrapper = mount(<Pagination {...props4} />);
    expect(wrapper).toHaveLength(1);
    wrapper.find('Button').at(0).simulate('click');
    wrapper.find('Button').at(1).simulate('click');
    expect(props.changeFilters).toHaveBeenCalledTimes(2);
    expect(wrapper.find('button')).toHaveLength(9);
    wrapper.find('button').at(4).simulate('click');
    expect(props.changeFilters).toHaveBeenCalledTimes(3);
  });
  it('component should return null', () => {
    const wrapper = mount(<Pagination {...props5} />);
    expect(wrapper.find('#pagination')).toHaveLength(0);
  });
  it('component should return null', () => {
    const wrapper = mount(<Pagination {...props6} />);
    expect(wrapper.find('#pagination')).toHaveLength(0);
  });
});
