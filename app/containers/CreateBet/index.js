// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { fetchUsers } from 'actions/users';
import { setBetAmount, setBettee } from 'actions/createBet';
import { getBetAmount, getBettee, getNewBetUsers } from 'selectors/createBet';
import Pill from 'components/Pill';
import UserCell from 'components/UserCell';

import { type Action, type PromiseState } from 'types/redux';
import { type User, type UserGroupType } from 'types/user';
import { type State as ReduxState } from 'types/state';
import { type UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxProps = {
  betAmount: number,
  bettee: User,
  user: UserState,
  users: PromiseState<Array<User>>,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  betAmount: getBetAmount(state),
  bettee: getBettee(state),
  user: state.user,
  users: getNewBetUsers(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchUsers, setBetAmount, setBettee }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchUsers: (type: UserGroupType) => void,
    setBetAmount: (amount: number) => void,
    setBettee: (betteeId: number | null) => void,
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
    height: 48,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.primary.gray,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    padding: 8,
  },
  Create__headerMain: {
    flex: 1,
    flexDirection: 'row',
  },
  Create__headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Create__headerMetaText: {
    color: Colors.primary.green,
    fontSize: 20,
    fontWeight: '900',
  },
  Create__headerMetaInput: {
    // flex: 1,
  },
});

class CreateBetContainer extends React.Component<Props, State> {
  state = {
    betteeInputText: '',
  };

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

  onAmountInputChange = (amountInputText: string) => {
    this.props.actions.setBetAmount(parseInt(amountInputText, 10) || 0);
  };

  onBetteeInputChange = (betteeInputText: string) => {
    this.setState({ betteeInputText });
  };

  removeBettee = (): void => this.props.actions.setBettee(null);

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
    const { betAmount, bettee, users } = this.props;
    return (
      <View style={styles.Create}>
        {bettee ? (
          <View style={styles.Create__header}>
            <View style={styles.Create__headerMain}>
              <Pill
                canRemove
                label={bettee.fullName}
                onRemove={this.removeBettee}
              />
            </View>
            <View style={styles.Create__headerMeta}>
              <Text style={styles.Create__headerMetaText}>$</Text>
              <TextInput
                style={[styles.Create__headerMetaText, styles.Create__headerMetaInput]}
                autoFocus
                keyboardType="number-pad"
                placeholder="0"
                value={`${betAmount === 0 ? '' : betAmount}`}
                onChangeText={this.onAmountInputChange}
              />
            </View>
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
        {!bettee && (
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
