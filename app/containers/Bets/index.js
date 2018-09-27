// @flow
import * as React from 'react';
import { AsyncStorage, Linking, View, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBets } from 'selectors/bets';
import { fetchBets } from 'actions/bets';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxProps = {
  bets: PromiseState<Array<Bet>>,
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  bets: getBets(state, { listType: 'active' }),
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchBets }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchBets: (listType: string) => void,
  },
};

class BetsContainer extends React.Component<Props> {
  componentWillMount() {
    this.props.actions.fetchBets('active');
  }

  render(): React.Node {
    const { bets } = this.props;
    return (
      <View>
        <Text>{bets.data ? bets.data.length : 'Loading'} Bets</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetsContainer);
