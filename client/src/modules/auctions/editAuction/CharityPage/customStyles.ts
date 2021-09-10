import { SetStateAction } from 'react';

export const selectStyles = {
  color: '#f0f0ee',
  sageColor: '#5a7864',
  whiteColor: '#ffffff',
  lightSageColor: '#96af9b',
  lightGrayColor: '#caccc6',
  barelyGrayColor: ' #f0f0ee',
};

export const customStyles = (setmenuIsOpen: (_: SetStateAction<boolean>) => void, menuIsOpen: boolean) => {
  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '10px',
      borderColor: selectStyles.sageColor,
      marginTop: '4px',
    }),
    menuList: (provided: any) => ({
      ...provided,
      border: '1px solid',
      borderColor: selectStyles.sageColor,
      borderRadius: '10px',
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      borderColor: selectStyles.sageColor,
    }),
    input: (provided: any) => {
      return {
        ...provided,
        height: '40px',
        padding: '10px 10px 10px 5px',
        color: selectStyles.sageColor,
        fontSize: '1.25rem',
        lineHeight: '1.25',
      };
    },
    control: (provided: any, state: any) => {
      setmenuIsOpen(state.menuIsOpen);
      return {
        ...provided,
        borderColor: state.isFocused ? selectStyles.sageColor : selectStyles.lightSageColor,
        '&:hover': {
          BorderColor: selectStyles.lightSageColor,
        },
        borderRadius: '10px',
        cursor: 'pointer',
      };
    },
    option: (provided: any, state: any) => {
      return {
        ...provided,
        color: selectStyles.sageColor,
        cursor: 'pointer',
        padding: '15px 36px 15px 15px',
        backgroundColor: state.isSelected ? selectStyles.barelyGrayColor : selectStyles.whiteColor,
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      };
    },
    valueContainer: (provided: any) => ({
      ...provided,
      width: '0px',
      marginRight: '10px',
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: selectStyles.lightGrayColor,
      paddingLeft: '5px',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: selectStyles.sageColor,
      paddingLeft: '5px',
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none',
    }),
    indicatorsContainer: (provided: any) => {
      return {
        ...provided,
        width: '50px',
        height: '50px',
        backgroundColor: menuIsOpen ? selectStyles.sageColor : selectStyles.whiteColor,
        justifyContent: 'center',
        borderRadius: '0 9px 9px 0',
        border: '1px solid',
        borderColor: menuIsOpen ? selectStyles.sageColor : selectStyles.whiteColor,
        borderLeftColor: !menuIsOpen ? selectStyles.sageColor : selectStyles.whiteColor,
      };
    },
    dropdownIndicator: (provided: any) => {
      return {
        ...provided,
        color: menuIsOpen ? selectStyles.whiteColor : selectStyles.sageColor,
        '&:hover': {
          color: menuIsOpen ? selectStyles.whiteColor : selectStyles.sageColor,
        },
        transform: menuIsOpen ? 'rotate(180deg)' : 'none',
      };
    },
  };
  return customStyles;
};
