// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { fetchUsers } from 'actions/users';
import { setBettee } from 'actions/createBet';
import { getBettee, getNewBetUsers } from 'selectors/createBet';
import UserCell from 'components/UserCell';

import { type Action, type PromiseState } from 'types/redux';
import { type User, type UserGroupType } from 'types/user';
import { type State as ReduxState } from 'types/state';
import { type UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxProps = {
  bettee: User,
  user: UserState,
  users: PromiseState<Array<User>>,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  bettee: getBettee(state),
  user: state.user,
  users: getNewBetUsers(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchUsers, setBettee }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchUsers: (type: UserGroupType) => void,
    setBettee: (betteeId: number) => void,
  },
};

type State = {
  betteeInputText: string,
};

const styles = StyleSheet.create({
  Create: {
    flex: 1,
  },
  Create__header: {
    height: 40,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.primary.gray,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 15,
    padding: 8,
  },
  Create__pill: {
    color: Colors.white,
    backgroundColor: Colors.brand.primary,
    borderRadius: 4,
    padding: 4,
    overflow: 'hidden',
  },
});

class CreateBetContainer extends React.Component<Props, State> {
  state = { betteeInputText: '' };

  componentWillMount() {
    if (!this.props.users.didFetch) this.props.actions.fetchUsers('friends');
  }

  get filteredUsers(): Array<User> {
    const { data } = this.props.users;
    if (data === null) return [];

    const filterStr = this.state.betteeInputText.trim().toLowerCase();
    if (filterStr.length === 0) return data;

    return data.filter((user: User): boolean => (
      user.firstName.toLowerCase().startsWith(filterStr) || user.lastName.toLowerCase().startsWith(filterStr)
    ));
  }

  onBetteeInputChange = (betteeInputText: string) => {
    this.setState({ betteeInputText });
  };

  selectBettee = (userId: number) => {
    this.setState({ betteeInputText: '' });
    this.props.actions.setBettee(userId);
  };

  renderUsers = (): React.Node => (
    <FlatList
      data={this.filteredUsers}
      keyExtractor={(user: User): string => `${user.id}`}
      renderItem={({ item }): React.Node => (
        <UserCell
          user={item}
          onPress={(): void => this.selectBettee(item.id)}
        />
      )}
    />
  );

  render(): React.Node {
    const { bettee, users } = this.props;
    return (
      <View style={styles.Create}>
        {bettee ? (
          <View style={styles.Create__header}>
            <Text style={styles.Create__pill}>{bettee.fullName}</Text>
          </View>
        ) : (
          <TextInput
            style={styles.Create__header}
            autoFocus
            placeholder="Name"
            value={this.state.betteeInputText}
            onChangeText={this.onBetteeInputChange}
          />
        )}
        {bettee ? (
          <Text>Selected bettee</Text>
        ) : (
          <View style={users.isLoading && SplashStyles}>
            {users.isLoading ? (
              <ActivityIndicator size="large" color={Colors.brand.primary} />
            ) : this.renderUsers()}
          </View>
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBetContainer);
