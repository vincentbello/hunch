// @flow
import * as React from 'react';
import { Animated, Button, Easing, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);
const ANIMATION_DURATION = 200;

const styles = StyleSheet.create({
  Input: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Input__input: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  Input__superscript: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginRight: 2,
  },
  Input__superscript_focus: {
    top: -4,
    marginRight: 4,
  },
  Input__label: {
    marginTop: 24,
    marginBottom: 4,
    fontSize: 16,
  },
});

type Props = {
  isFocused: boolean,
  value: string,
  onChange: (value: string) => void,
  toggleFocus: () => void,
};

type State = {
  fontSize: number,
  superScriptFontSize: number,
};

class AmountInput extends React.Component<Props, State> {
  static defaultProps = {
    isFocused: false,
    toggleFocus() {},
  };

  state = {
    fontSize: new Animated.Value(20),
    superScriptFontSize: new Animated.Value(14),
  };

  componentDidMount() {
    if (this.props.isFocused) this.animate(true);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isFocused !== this.props.isFocused) this.animate(this.props.isFocused);
  }

  animate = (big: boolean) => {
    const { fontSize, superScriptFontSize } = this.state;
    Animated.parallel([
      Animated.timing(fontSize, { duration: ANIMATION_DURATION, easing: Easing.inOut(Easing.ease), toValue: big ? 56 : 20 }),
      Animated.timing(superScriptFontSize, { duration: ANIMATION_DURATION, easing: Easing.inOut(Easing.ease), toValue: big ? 24 : 14 }),
    ]).start();
  };

  renderContent = (): React.Node => {
    const { isFocused, value, onChange } = this.props;
    const { fontSize, superScriptFontSize } = this.state;
    const inputStyle = { ...styles.Input__input, fontSize };
    const superScriptStyle = [
      inputStyle,
      { ...styles.Input__superscript, fontSize: superScriptFontSize },
      isFocused && styles.Input__superscript_focus,
    ];
    return (
      <React.Fragment>
        <Animated.Text style={superScriptStyle}>$</Animated.Text>
        {isFocused ? (
          <AnimatedInput
            style={inputStyle}
            autoFocus
            editable={isFocused}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="0"
            value={value}
            onChangeText={onChange}
          />
        ) : (
          <Animated.Text style={inputStyle}>{value}</Animated.Text>
        )}
      </React.Fragment>
    );
  };

  render(): React.Node {
    const { isFocused, value, toggleFocus } = this.props;
    return (
      <View style={{ alignItems: 'center' }}>
        {isFocused ? (
          <View style={styles.Input}>{this.renderContent()}</View>
        ) : (
          <TouchableOpacity style={styles.Input} onPress={toggleFocus}>
            {this.renderContent()}
          </TouchableOpacity>
        )}
        {isFocused && (
          <React.Fragment>
            <Text style={styles.Input__label}>How much do you want to bet Fooington?</Text>
            <Button
              disabled={value.length === 0}
              title="Next"
              onPress={toggleFocus}
            />
          </React.Fragment>
        )}
      </View>
    );
  }
}

export default AmountInput;
