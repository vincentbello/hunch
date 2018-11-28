// @flow
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;
const iPhoneX = Platform.OS === 'ios' && screenHeight === 812;

export default {
  // Window Dimensions
  screen: {
    height: screenHeight,
    width: screenWidth,

    widthHalf: screenWidth * 0.5,
    widthThird: screenWidth * 0.333,
    widthTwoThirds: screenWidth * 0.666,
    widthQuarter: screenWidth * 0.25,
    widthThreeQuarters: screenWidth * 0.75,
  },
  homeIndicatorHeight: iPhoneX ? 34 : 0,
  navbarHeight: (Platform.OS === 'ios') ? 64 : 54,
  statusBarHeight: (Platform.OS === 'ios') ? 16 : 0,
  topOffset: iPhoneX ? 12 : 0,
  tabbarHeight: 51,

  padding: 20,
  paddingSml: 10,

  borderRadius: 2,
};
