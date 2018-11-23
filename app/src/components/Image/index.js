// @flow
import * as React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Image: {},
  wrapper: {
    borderWidth: 1,
    padding: 3,
    borderColor: Colors.primary.gray,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper_dotted: {
    borderStyle: 'dashed',
  },
  Image_bordered: {
    borderWidth: 1,
    borderColor: Colors.primary.gray,
  },
  Image_dotted: {
    borderStyle: 'dashed',
  },
  Image_empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  Image_muted: {
    opacity: 0.75,
  },
});

type Props = {
  bordered: boolean,
  dotted: boolean,
  light: boolean,
  muted: boolean,
  rounded: boolean,
  padded: boolean,
  size: 'xsmall' | 'small' | 'medium' | 'large',
  url: string | null,
};

const SIZES = {
  xsmall: 32,
  small: 36,
  medium: 50,
  large: 72,
};

const defaultProps = {
  bordered: false,
  light: false,
  muted: false,
  padded: false,
  rounded: false,
  size: 'medium',
};

const CustomImage = ({ bordered, dotted, light, muted, padded, rounded, size, url }: Props): React.Node => {
  const dimension = SIZES[size];
  const borderRadius = rounded ? dimension / 2 : 0;
  const style = [styles.Image, muted && styles.Image_muted, bordered && styles.Image_bordered, {
    height: dimension,
    width: dimension,
    borderRadius,
  }];
  const image = url === null ? (
    <View style={[...style, styles.Image_empty]}>
      <Icon name="user" size={dimension * 2 / 3} color={Colors.textSecondary} />
    </View>
  ) : (
    <Image style={style} source={{ uri: url }} />
  );
  return padded ? (
    <View style={[styles.wrapper, dotted && styles.wrapper_dotted, rounded && { borderRadius: borderRadius + 3 }]}>
      {image}
    </View>
   ) : image;
};
CustomImage.defaultProps = defaultProps;
CustomImage.displayName = 'Image';
export default CustomImage;
