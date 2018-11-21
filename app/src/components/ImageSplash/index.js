// @flow
import * as React from 'react';
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import AppSizes from 'theme/sizes';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const SPLASH_HEIGHT = 180;

const styles = StyleSheet.create({
  Splash__image: {
    height: SPLASH_HEIGHT,
    width: AppSizes.screen.width,
  },
  Splash__overlay: {
    height: SPLASH_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
});

type Props = {
  children: React.Node,
  dimmed: boolean,
  source: {},
};

const ImageSplash = ({ children, dimmed, source }: Props): React.Node => (
  <ImageBackground source={source} style={styles.Splash__image}>
    {dimmed ? <View style={styles.Splash__overlay}>{children}</View> : children}
  </ImageBackground>
);

ImageSplash.defaultProps = { dimmed: false };
ImageSplash.displayName = 'ImageSplash';
export default ImageSplash;
