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

export default function TitleLogo(): React.Node {
  const [width] = React.useState((): Animated.Value => new Animated.Value(21));
  React.useEffect(() => {
    Animated.timing(width, {
      duration: 300,
      toValue: 150,
    }).start();
  }, []);

  return (
    <Animated.View style={[style.wrapper, { width }]}>
      <Image style={style.image} source={require('../../../assets/brand/logo-text.png')} />
    </Animated.View>
  );
}
