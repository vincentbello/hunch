// @flow
import * as React from 'react';
import { AsyncStorage, View, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Action } from 'types/redux';
import { type UserState } from 'reducers/user';

import { fetchMe } from 'actions/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Launch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Launch__text: {
    fontSize: 36,
  },
});

type ReduxStateSlice = {
  user: UserState,
};

type ReduxProps = {
  user: UserState,
};

const mapStateToProps = ({ user }: ReduxStateSlice): ReduxProps => ({ user });

const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchMe }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: { fetchMe: () => void },
};

class AppLaunchContainer extends React.Component<Props> {
  componentDidMount() {
    AsyncStorage.getItem('AUTH_TOKEN')
      .then((token) => {
        if (token === null) {
          Actions.auth();
        } else {
          this.props.actions.fetchMe();
        }
      });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.user.data === null && this.props.user.data !== null) {
      console.log('AUTHENTICATED USER!!', this.props.user.data);
      Actions.bets();
    }
  }

  render(): React.Node {
    return (
      <View style={styles.Launch}>
        <Text style={styles.Launch__text}>Hunch</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLaunchContainer);
