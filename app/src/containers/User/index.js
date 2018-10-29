// @flow
import * as React from 'react';
import { Linking, View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import { type Action } from 'types/redux';
import { type ReduxState as UserState } from 'reducers/user';

import Image from 'components/Image';

import Colors from 'theme/colors';
import { BoxStyles, SplashStylesWithNav } from 'theme/app';
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

const styles = StyleSheet.create({
  User: {
    margin: 8,
  },
  User__header: {
    ...BoxStyles,
    marginBottom: 8,
    flexDirection: 'row',
    padding: 8,
  },
  User__headerContent: {
    marginLeft: 8,
    flex: 1,
  },
  User__headerTitle: {
    ...Typography.h2,
    fontWeight: 'bold',
  },
});

class UserContainer extends React.Component<Props> {
  static displayName = 'UserContainer';

  render(): React.Node {
    const { user } = this.props;
    if (user.data === null) return null;

    return (
      <View style={styles.User}>
        <View style={styles.User__header}>
          <Image rounded size="large" url={user.data.imageUrl} />
          <View style={styles.User__headerContent}>
            <Text style={styles.User__headerTitle}>{user.data.fullName}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
