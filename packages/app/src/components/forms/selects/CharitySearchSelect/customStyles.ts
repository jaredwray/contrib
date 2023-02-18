import IconSelected from 'src/assets/images/verified.svg';

export const Colors = {
  primary: '#f0f0ee',
  sage: '#5a7864',
  white: '#ffffff',
  lightSage: '#96af9b',
  lightGray: '#caccc6',
  barelyGray: '#f0f0ee',
};

export const customStyles = (floating: boolean) => {
  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '10px',
      borderColor: Colors.sage,
      marginTop: '4px',
      zIndex: 2,
    }),
    menuList: (provided: any) => ({
      ...provided,
      border: '1px solid',
      borderColor: Colors.sage,
      borderRadius: '10px',
      paddingTop: '0px',
      paddingBottom: '0px',
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      borderColor: Colors.sage,
    }),
    input: (provided: any) => {
      const floatingStyles =
        (floating && {
          height: '32px',
          padding: 0,
          color: '#5a7864',
          fontSize: '14px',
          lineHeight: '18px',
          fontWeight: '600',
          marginTop: '12px',
          paddingLeft: '2px',
        }) ||
        {};

      return {
        ...provided,
        height: '40px',
        padding: '10px 10px 10px 5px',
        color: Colors.sage,
        fontSize: '1.25rem',
        lineHeight: '1.25',
        ...floatingStyles,
      };
    },
    control: (provided: any, state: any) => {
      return {
        ...provided,
        borderColor: state.isFocused ? Colors.sage : Colors.lightSage,
        '&:hover': {
          BorderColor: Colors.lightSage,
        },
        borderRadius: '10px',
        cursor: 'pointer',
      };
    },
    option: (provided: any, state: any) => {
      return {
        ...provided,
        color: Colors.sage,
        cursor: 'pointer',
        padding: '15px',
        paddingLeft: '36px',
        backgroundImage: state.isSelected ? `url(${IconSelected})` : '',
        backgroundRepeat: `no-repeat;`,
        backgroundPosition: `left 5px top 16px;`,
        backgroundColor: state.isSelected ? Colors.barelyGray : Colors.white,
        '&:hover': {
          backgroundColor: '#e9ecef',
        },
      };
    },
    valueContainer: (provided: any) => {
      const floatingStyles = (floating && { marginRight: 0 }) || {};

      return {
        ...provided,
        width: '0px',
        marginRight: '10px',
        ...floatingStyles,
      };
    },

    placeholder: (provided: any) => {
      return {
        ...provided,
        color: Colors.lightGray,
        paddingLeft: '5px',
        '@media(max-width: 992px)': {
          ...provided['@media (max-width: 992px)'],
          fontSize: '1rem',
        },
      };
    },
    singleValue: (provided: any) => {
      const floatingStyles =
        (floating && {
          color: '#5a7864',
          fontSize: '14px',
          lineHeight: '18px',
          fontWeight: '600',
          marginTop: '12px',
          paddingLeft: '2px',
        }) ||
        {};

      return {
        ...provided,
        color: Colors.sage,
        paddingLeft: '5px',
        ...floatingStyles,
      };
    },
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none',
    }),
    indicatorsContainer: (provided: any) => {
      return {
        ...provided,
        width: '50px',
        height: '50px',
        backgroundColor: Colors.white,
        justifyContent: 'center',
        borderRadius: '0 9px 9px 0',
        border: '1px solid',
        borderColor: Colors.white,
        borderLeftColor: Colors.sage,
        display: floating ? 'none' : 'block',
      };
    },
    dropdownIndicator: (provided: any) => {
      return {
        ...provided,
        color: Colors.sage,
        '&:hover': {
          color: Colors.sage,
        },
        transform: 'none',
      };
    },
  };
  return customStyles;
};
