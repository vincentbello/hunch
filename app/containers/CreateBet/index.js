// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { fetchUsers } from 'actions/users';
import { getNewBetUsers } from 'selectors/users';
import UserCell from 'components/UserCell';

import { type Action, type PromiseState } from 'types/redux';
import { type User, type UserGroupType } from 'types/user';
import { type State as ReduxState } from 'types/state';
import { type UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxProps = {
  user: UserState,
  users: PromiseState<Array<User>>,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  user: state.user,
  users: getNewBetUsers(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchUsers }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchUsers: (type: UserGroupType) => void,
  },
};

const styles = StyleSheet.create({
  Users: {
    flex: 1,
  },
});

class CreateBetContainer extends React.Component<Props> {
  componentWillMount() {
    if (!this.props.users.didFetch) this.props.actions.fetchUsers('friends');
  }

  renderUsers = (): React.Node => this.props.users.data !== null && (
    <FlatList
      data={this.props.users.data}
      keyExtractor={(user: User): string => `${user.id}`}
      renderItem={({ item }): React.Node => (
        <UserCell
          user={item}
          onPress={(): void => alert('CLICKED USER')}
        />
      )}
    />
  );

  render(): React.Node {
    const { users } = this.props;
    return (
      <View style={[styles.Users, users.isLoading && SplashStyles]}>
        {users.isLoading ? (
          <ActivityIndicator size="large" color={Colors.brand.primary} />
        ) : this.renderUsers()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBetContainer);
