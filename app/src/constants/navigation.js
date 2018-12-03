// @flow
import Colors from 'theme/colors';

export default {
  // App Details
  appName: 'Hunch',

  // Build Configuration - eg. Debug or Release?
  DEV: __DEV__,

  // URLs
  urls: {},

  // Navbar Props
  navbarProps: {
    hideNavBar: false,
    // titleStyle: AppStyles.navbarTitle,
    // navigationBarStyle: { backgroundColor: 'blue' },
    // leftButtonIconStyle: AppStyles.navbarButton,
    // rightButtonIconStyle: AppStyles.navbarButton,
    // sceneStyle: {
    //   backgroundColor: AppColors.background,
    //   paddingTop: AppSizes.navbarHeight,
    // },
  },

  transparentNavbarProps: {
    hideNavBar: false,
    navigationBarStyle: {
      backgroundColor: Colors.transparent,
      borderBottomColor: Colors.transparent,
    },
  },
};
