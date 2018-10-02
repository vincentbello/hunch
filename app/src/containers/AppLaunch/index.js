// @flow
import * as React from 'react';
import { AsyncStorage, View, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Action } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as SessionState } from 'reducers/session';
import { type ReduxState as UserState } from 'reducers/user';

import { refreshAuth } from 'actions/user';

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

type ReduxProps = {
  refreshToken: string | null,
  user: UserState,
};

const mapStateToProps = ({ session, user }: ReduxState): ReduxProps => ({ refreshToken: session.refreshToken, user });

const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ refreshAuth }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: { refreshAuth: (refreshToken: string) => void },
};

class AppLaunchContainer extends React.Component<Props> {
  componentDidMount() {
    this.autoLogin();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.user.data === null && this.props.user.data !== null) return Actions.main();
    if (!prevProps.user.hasError && this.props.user.hasError) Actions.loginModal();
  }

  autoLogin = () => {
    const { actions, refreshToken } = this.props;
    if (refreshToken === null) {
      Actions.loginModal();
    } else {
      actions.refreshAuth(refreshToken);
    }
  };

  render(): React.Node {
    return (
      <View style={styles.Launch}>
        <Text style={styles.Launch__text}>Hunch</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLaunchContainer);