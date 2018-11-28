// @flow
import * as React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const ICON_SIZES = {
  small: 18,
  medium: 24,
  large: 36,
};

const styles = StyleSheet.create({
  Spinner: {},
});

type Props = {
  size: 'small' | 'medium' | 'large',
};

export default class Spinner extends React.Component<Props, { spinValue: Animated.Value }> {
  static displayName = 'Spinner';

  static defaultProps = {
    size: 'large',
  };

  state = {
    spinValue: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.loop(Animated.timing(this.state.spinValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();
  }

  render(): React.Node {
    const rotate = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <AnimatedIcon
        style={{ ...styles.Spinner, transform: [{ rotate }] }}
        name="loader"
        size={ICON_SIZES[this.props.size]}
        color={Colors.brand.primary}
      />
    );
  }
}
