// @flow
import * as React from 'react';
import { Animated, AsyncStorage, Easing, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { distanceInWordsToNow } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const styles = StyleSheet.create({
  Spinner: {},
});

export default class Spinner extends React.Component<{}, { spinValue: Animated.Value }> {
  static displayName = 'Spinner';

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
      <AnimatedIcon style={{ ...styles.Spinner, transform: [{ rotate }] }} name="loader" size={36} color={Colors.brand.primary} />
    );
  }
}
