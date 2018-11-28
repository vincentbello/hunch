// @flow
import * as React from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

const style = StyleSheet.create({
  image: {
    height: 21,
    width: 150,
  },
  wrapper: {
    overflow: 'hidden',
  },
});

type State = {
  logoWidth: Animated.Value,
};

export default class TitleLogo extends React.Component<{}, State> {
  state = {
    logoWidth: new Animated.Value(21),
  };

  componentDidMount() {
    Animated.timing(this.state.logoWidth, {
      duration: 300,
      toValue: 150,
    }).start();
  }

  render(): React.Node {
    return (
      <Animated.View style={[style.wrapper, { width: this.state.logoWidth }]}>
        <Image style={style.image} source={require('../../../assets/brand/logo-text.png')} />
      </Animated.View>
    );
  }
}
