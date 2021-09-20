import { customStyles } from '../customStyles';

test('customStyles', () => {
  expect(customStyles(() => {}, true).control({}, {})).toEqual({
    '&:hover': { BorderColor: '#96af9b' },
    borderColor: '#96af9b',
    borderRadius: '10px',
    cursor: 'pointer',
  });
  expect(customStyles(() => {}, true).menu({})).toEqual({
    borderRadius: '10px',
    borderColor: '#5a7864',
    marginTop: '4px',
    zIndex: 2,
  });
  expect(customStyles(() => {}, true).menuList({})).toEqual({
    border: '1px solid',
    borderColor: '#5a7864',
    borderRadius: '10px',
  });
  expect(customStyles(() => {}, true).menuPortal({})).toEqual({
    borderColor: '#5a7864',
  });
  expect(customStyles(() => {}, true).input({})).toEqual({
    height: '40px',
    padding: '10px 10px 10px 5px',
    color: '#5a7864',
    fontSize: '1.25rem',
    lineHeight: '1.25',
  });
  expect(customStyles(() => {}, true).option({}, {})).toEqual({
    color: '#5a7864',
    cursor: 'pointer',
    padding: '15px',
    paddingLeft: '36px',
    backgroundImage: '',
    backgroundRepeat: `no-repeat;`,
    backgroundPosition: `left 5px top 16px;`,
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  });
  expect(customStyles(() => {}, true).valueContainer({})).toEqual({
    width: '0px',
    marginRight: '10px',
  });
  expect(customStyles(() => {}, true).placeholder({})).toEqual({
    color: '#caccc6',
    paddingLeft: '5px',
  });
  expect(customStyles(() => {}, true).singleValue({})).toEqual({
    color: '#5a7864',
    paddingLeft: '5px',
  });
  expect(customStyles(() => {}, true).indicatorSeparator({})).toEqual({
    display: 'none',
  });
  expect(customStyles(() => {}, true).indicatorsContainer({})).toEqual({
    width: '50px',
    height: '50px',
    backgroundColor: '#5a7864',
    justifyContent: 'center',
    borderRadius: '0 9px 9px 0',
    border: '1px solid',
    borderColor: '#5a7864',
    borderLeftColor: '#ffffff',
  });
  expect(customStyles(() => {}, true).dropdownIndicator({})).toEqual({
    color: '#ffffff',
    '&:hover': {
      color: '#ffffff',
    },
    transform: 'rotate(180deg)',
  });
});
