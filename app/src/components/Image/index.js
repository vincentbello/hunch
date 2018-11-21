// @flow
import * as React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Image: {},
  Image_bordered: {
    borderWidth: 1,
    borderColor: Colors.primary.gray,
  },
  Image_empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  Image__emptyIcon: {

  },
});

type Props = {
  light: boolean,
  rounded: boolean,
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
  light: false,
  rounded: false,
  size: 'medium',
};

const CustomImage = ({ light, rounded, size, url }: Props): React.Node => {
  const dimension = SIZES[size];
  const style = [styles.Image, (rounded && !light) && styles.Image_bordered, {
    height: dimension,
    width: dimension,
    borderRadius: rounded ? dimension / 2 : 0,
  }];
  if (url !== null) return <Image style={style} source={{ uri: url }} />;

  return (
    <View style={[...style, styles.Image_empty]}>
      <Icon name="user" size={dimension * 2 / 3} color={Colors.textSecondary} style={styles.Image__emptyIcon} />
    </View>
  );
};
CustomImage.defaultProps = defaultProps;
CustomImage.displayName = 'Image';
export default CustomImage;
