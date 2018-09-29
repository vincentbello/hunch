// @flow
import * as React from 'react';
import { Linking, View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { authenticate } from 'actions/user';

import { FB_APP_ID } from 'constants/third-party';

import { type Action } from 'types/redux';
import { type State as ReduxState } from 'types/state';
import { type UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxProps = {
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({}, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {},
};

class CreateBetContainer extends React.Component<Props> {
  render(): React.Node {
    return (
      <View style={SplashStyles}>
        <Text>Create Bet Here</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBetContainer);
