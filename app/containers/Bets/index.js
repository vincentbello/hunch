// @flow
import * as React from 'react';
import { Linking, View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Action } from 'types/redux';
import { type UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxStateSlice = {
  user: UserState,
};

type ReduxProps = {
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxStateSlice): ReduxProps => ({
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({}, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {},
};

class BetsContainer extends React.Component<Props> {
  componentDidMount() {
    console.log('Fetch bets');
  }

  render(): React.Node {
    return (
      <View>
        <Text>All Bets</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetsContainer);
