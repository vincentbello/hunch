// @flow
import * as React from 'react';
import { ActivityIndicator, Button, FlatList, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/Feather';
import { SocialIcon } from 'react-native-elements';

import { fetchGames } from 'actions/games';
import { fetchUsers } from 'actions/users';
import { setBetAmount, setBettee, setBettorPickTeam, setGame } from 'actions/createBet';
import { getBetAmount, getBettee, getBettorPickTeam, getGame, getGames, getNewBetUsers } from 'selectors/createBet';
import Pill from 'components/Pill';
import GameCell from 'components/GameCell';
import UserCell from 'components/UserCell';

import { type Game } from 'types/game';
import { type Action, type PromiseState } from 'types/redux';
import { type Team } from 'types/team';
import { type User, type UserGroupType } from 'types/user';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxProps = {
  betAmount: number,
  bettee: User,
  bettorPickTeam: Team | null,
  game: Game | null,
  games: PromiseState<Array<Game>>,
  user: UserState,
  users: PromiseState<Array<User>>,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  betAmount: getBetAmount(state),
  bettee: getBettee(state),
  bettorPickTeam: getBettorPickTeam(state),
  game: getGame(state),
  games: getGames(state),
  user: state.user,
  users: getNewBetUsers(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchGames, fetchUsers, setBetAmount, setBettee, setBettorPickTeam, setGame }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchGames: (league: string, type: string) => void,
    fetchUsers: (type: UserGroupType) => void,
    setBetAmount: (amount: number) => void,
    setBettee: (betteeId: number | null) => void,
    setBettorPickTeam: (bettorPickTeamId: number | null) => void,
    setGame: (gameId: number | null) => void,
  },
};

type State = {
  betteeInputText: string,
};

const styles = StyleSheet.create({
  Create: {
    flex: 1,
  },
  Create__container: {
    flex: 1,
  },
  Create__header: {
    height: 48,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.primary.gray,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  Create__headerInput: {
    fontSize: 16,
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
  Create__list: {
    marginTop: 8,
  },
  Create__section: {},
  Create__sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
  },
  Create__sectionHeaderText: {
    ...Typography.h4,
    fontWeight: 'bold',
    flex: 1,
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
    if (!data) return [];

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

    if (!this.props.games.didFetch) this.props.actions.fetchGames('NBA'/** Hardcoded */, 'upcoming');
  };

  renderSelectedGame = (): React.Node => this.props.game !== null && (
    <View style={styles.Create__section}>
      <View style={styles.Create__sectionHeader}>
        <Text style={styles.Create__sectionHeaderText}>Selected Game</Text>
        <Icon.Button
          backgroundColor="transparent"
          color={Colors.brand.primary}
          iconStyle={{ marginRight: 0 }}
          name="x"
          size={18}
          onPress={(): void => this.props.actions.setGame(null)}
        />
      </View>
      <GameCell game={this.props.game} />
    </View>
  );

  renderGameSelection = (): React.Node => {
    if (this.props.game !== null) return this.renderSelectedGame();

    return this.props.games.data !== null && (
      <FlatList
        style={styles.Create__list}
        data={this.props.games.data}
        keyExtractor={(game: Game): string => `${game.id}`}
        renderItem={({ item }): React.Node => (
          <GameCell
            game={item}
            onPress={(): void => this.props.actions.setGame(item.id)}
          />
        )}
      />
    );
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
    const { betAmount, bettee, game, games, users } = this.props;
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
                style={styles.Create__headerMetaText}
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
            style={[styles.Create__header, styles.Create__headerInput]}
            autoFocus
            placeholder="Name"
            value={this.state.betteeInputText}
            onChangeText={this.onBetteeInputChange}
          />
        )}
        <View style={[styles.Create__container, (users.isLoading || games.isLoading) && SplashStyles]}>
          {(users.isLoading || games.isLoading) ? (
            <ActivityIndicator size="large" color={Colors.brand.primary} />
          ) : (
            bettee ? this.renderGameSelection() : this.renderUsers()
          )}
          <Button
            style={styles.Create__button}
            color={Colors.brand.primary}
            disabled={!bettee || !game || betAmount <= 0}
            title="Create Bet"
            onPress={(): void => console.log('CREATE BET')}
          />
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBetContainer);
