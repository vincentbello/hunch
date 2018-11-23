// @flow
const app = {
  background: '#E9EBEE',
  darkBackground: '#CCCCCC',
  cardBackground: '#FFFFFF',
  listItemBackground: '#FFFFFF',
  disabled: '#9E9E9E',
};

const brand = {
  brand: {
    primary: '#3593F2',
    secondary: '#F19935',
  },
};

const text = {
  textPrimary: '#222222',
  textSecondary: '#777777',
  textTertiary: '#DDDDDD',
  headingPrimary: brand.brand.primary,
  headingSecondary: brand.brand.primary,
};

const borders = {
  border: '#D0D1D5',
  cellBorder: '#EEEEEE',
};

const iconButton = {
  iconButton: {
    underlay: '#CDCDCD',
  },
};

const tabbar = {
  tabbar: {
    background: '#FFFFFF',
    iconDefault: '#BABDC2',
    iconSelected: brand.brand.primary,
  },
};

const thirdParty = {
  thirdParty: {
    cashApp: '#28C101',
    facebook: '#3B5998',
    iMessage: '#007AFF',
    venmo: '#3D95CE',
  },
};

const misc = {
  primary: {
    orange: '#FFA352',
    blue: '#8CB2D9',
    green: '#73C028',
    red: '#F25F57',
    purple: '#D28BDE',
    gray: '#AAAAAA',
  },
  gold: '#FFD700',
  white: '#FFFFFF',
  transparent: 'transparent',
};

export default {
  ...app,
  ...brand,
  ...iconButton,
  ...text,
  ...borders,
  ...tabbar,
  ...thirdParty,
  ...misc,
};
