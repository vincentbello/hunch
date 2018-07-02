// @flow
const app = {
  background: '#E9EBEE',
  darkBackground: '#CCCCCC',
  cardBackground: '#FFFFFF',
  listItemBackground: '#FFFFFF',
};

const brand = {
  brand: {
    primary: '#6699CC',
    secondary: '#17233D',
  },
};

const text = {
  textPrimary: '#222222',
  textSecondary: '#777777',
  headingPrimary: brand.brand.primary,
  headingSecondary: brand.brand.primary,
};

const borders = {
  border: '#D0D1D5',
};

const tabbar = {
  tabbar: {
    background: '#FFFFFF',
    iconDefault: '#BABDC2',
    iconSelected: brand.brand.primary,
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
  white: '#FFFFFF',
  transparent: 'transparent',
};

export default {
  ...app,
  ...brand,
  ...text,
  ...borders,
  ...tabbar,
  ...misc,
};
