// @flow
import AppSizes from 'theme/sizes';

export const SplashStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: AppSizes.screen.height,
  width: AppSizes.screen.width,
};

export const SplashStylesWithNav = {
  ...SplashStyles,
  height: AppSizes.screen.height - AppSizes.statusBarHeight - AppSizes.navbarHeight - AppSizes.homeIndicatorHeight,
};
