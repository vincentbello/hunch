// @flow
import * as React from 'react';
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import AppSizes from 'theme/sizes';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Splash__image: {
    width: AppSizes.screen.width,
  },
  Splash__overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
});

type Props = {
  children: React.Node,
  height: number,
  dimmed: boolean,
  source: {},
};

const ImageSplash = ({ children, dimmed, height, source }: Props): React.Node => (
  <ImageBackground source={source} style={[styles.Splash__image, { height }]}>
    {dimmed ? <View style={[styles.Splash__overlay, { height }]}>{children}</View> : children}
  </ImageBackground>
);

ImageSplash.defaultProps = { dimmed: false, height: 200 };
ImageSplash.displayName = 'ImageSplash';
export default ImageSplash;
