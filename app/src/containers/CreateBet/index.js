// @flow
import * as React from 'react';
import { ActivityIndicator, Button, FlatList, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/Feather';
import { SocialIcon } from 'react-native-elements';

import { DATE_VIEW_TYPES } from 'constants/view-types';
import { fetchBets } from 'actions/bets';
import { fetchUpcomingGames } from 'actions/games';
import { fetchUsers } from 'actions/users';
import { createBet, setBetAmount, setBettee, setBettorPickTeam, setDateViewIndex, setGame } from 'actions/createBet';
import { getBetAmount, getBettee, getBettorPickTeam, getCreationPromiseState, getDateViewIndex, getDateViewType, getGame, getGames,
  getNewBetUsers } from 'selectors/createBet';
import Pill from 'components/Pill';
import GameCell from 'components/GameCell';
import TabView from 'components/TabView';
import TeamCell from 'components/TeamCell';
import UserCell from 'components/UserCell';

import { type ViewType } from 'types/bet';
import { type Game } from 'types/game';
import { type Action, type PromiseState } from 'types/redux';
import { type Team } from 'types/team';
import { type User, type UserGroupType } from 'types/user';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Sizes from 'theme/sizes';
import Typography from 'theme/typography';

type ReduxProps = {
  betAmount: number,
  bettee: User,
  bettorPickTeam: Team | null,
  creationPromiseState: PromiseState<>,
  dateViewIndex: number,
  dateViewType: string,
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
  creationPromiseState: getCreationPromiseState(state),
  dateViewIndex: getDateViewIndex(state),
  dateViewType: getDateViewType(state),
  game: getGame(state),
  games: getGames(state),
  user: state.user,
  users: getNewBetUsers(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({
      createBet,
      fetchBets,
      fetchUpcomingGames,
      fetchUsers,
      setBetAmount,
      setBettee,
      setBettorPickTeam,
      setDateViewIndex,
      setGame,
    }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    createBet: (betteeId: number, amount: number, gameId: number, bettorPickTeamId: number) => void,
    fetchBets: (viewType: ViewType) => void,
    fetchUpcomingGames: (league: string, date: string) => void,
    fetchUsers: (type: UserGroupType) => void,
    setBetAmount: (amount: number) => void,
    setBettee: (betteeId: number | null) => void,
    setBettorPickTeam: (bettorPickTeamId: number | null) => void,
    setDateViewIndex: (dateViewIndex: number) => void,
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
    borderColor: Colors.border,
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
  Create__sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 0,
    marginBottom: 4,
    height: 32,
  },
  Create__sectionHeaderText: {
    ...Typography.h3,
    fontWeight: '900',
    flex: 1,
  },
  Create__sectionHeaderIcon: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  Create__horizontalCellContainer: {
    flexDirection: 'row',
  },
  Create__horizontalCell: {
    flex: 1,
    marginLeft: 8,
  },
  Create__horizontalCell_last: {
    marginRight: 8,
  },
  Create__button: {
    padding: 16,
    marginBottom: Sizes.homeIndicatorHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  Create__button_disabled: {
    opacity: 0.25,
  },
  Create__buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

class CreateBetContainer extends React.Component<Props, State> {
  state = {
    betteeInputText: '',
  };

  componentWillMount() {
    if (!this.props.users.didFetch) this.props.actions.fetchUsers('friends');
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.dateViewType !== this.props.dateViewType && !this.props.games.didFetch) {
      this.fetchGames();
      return;
    }

    if (
      prevProps.creationPromiseState.isLoading &&
      !this.props.creationPromiseState.isLoading &&
      !this.props.creationPromiseState.hasError
    ) {
      this.props.actions.fetchBets('pending');
      Actions.pop();
    }
  }

  get isCreateButtonDisabled(): boolean {
    return (
      this.props.bettee === null ||
      this.props.betAmount <= 0 ||
      this.props.game === null ||
      this.props.bettorPickTeam === null ||
      this.props.creationPromiseState.isLoading
    );
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

  fetchGames = (): void => this.props.actions.fetchUpcomingGames('NBA'/** Hardcoded */, this.props.dateViewType);

  create = () => {
    const { actions, betAmount, bettee, bettorPickTeam, game } = this.props;
    if (bettee !== null && betAmount > 0 && game !== null && bettorPickTeam !== null) {
      actions.createBet(bettee.id, betAmount, game.id, bettorPickTeam.id);
    }
  };

  removeBettee = (): void => this.props.actions.setBettee(null);

  selectBettee = (userId: number) => {
    this.setState({ betteeInputText: '' });
    this.props.actions.setBettee(userId);

    if (!this.props.games.didFetch) this.fetchGames();
  };

  selectBettorPickTeam = (teamId: number) => {
    this.props.actions.setBettorPickTeam(this.props.bettorPickTeam === null || this.props.bettorPickTeam.id !== teamId ? teamId : null);
  };

  renderPickSelection = (): React.Node => {
    const { actions, bettorPickTeam, game } = this.props;
    if (game === null) return null;

    return (
      <React.Fragment>
        <View style={styles.Create__sectionHeader}>
          <Text style={styles.Create__sectionHeaderText}>My Pick</Text>
          {bettorPickTeam && (
            <Icon.Button
              style={styles.Create__sectionHeaderIcon}
              backgroundColor="transparent"
              color={Colors.brand.primary}
              iconStyle={{ marginRight: 0 }}
              name="x"
              size={18}
              onPress={(): void => actions.setBettorPickTeam(null)}
            />
          )}
        </View>
        <View style={styles.Create__horizontalCellContainer}>
          <View style={styles.Create__horizontalCell}>
            <TeamCell
              team={game.awayTeam}
              muted={bettorPickTeam !== null && game.awayTeam.id !== bettorPickTeam.id}
              selected={bettorPickTeam !== null && game.awayTeam.id === bettorPickTeam.id}
              onPress={(): void => this.selectBettorPickTeam(game.awayTeam.id)}
            />
          </View>
          <View style={[styles.Create__horizontalCell, styles.Create__horizontalCell_last]}>
            <TeamCell
              team={game.homeTeam}
              muted={bettorPickTeam !== null && game.homeTeam.id !== bettorPickTeam.id}
              selected={bettorPickTeam !== null && game.homeTeam.id === bettorPickTeam.id}
              onPress={(): void => this.selectBettorPickTeam(game.homeTeam.id)}
            />
          </View>
        </View>
      </React.Fragment>
    );
  };

  renderGamesList = (): React.Node => this.props.games.data !== null && (
    <FlatList
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

  renderGameSelection = (): React.Node => {
    return (
      <React.Fragment>
        <View style={styles.Create__sectionHeader}>
          <Text style={styles.Create__sectionHeaderText}>{this.props.game === null ? 'Select a Game' : 'Selected Game'}</Text>
          {this.props.game !== null && (
            <Icon.Button
              style={styles.Create__sectionHeaderIcon}
              backgroundColor="transparent"
              color={Colors.brand.primary}
              iconStyle={{ marginRight: 0 }}
              name="x"
              size={18}
              onPress={(): void => this.props.actions.setGame(null)}
            />
          )}
        </View>
        {this.props.game === null ? (
          <TabView
            navigationState={{
              index: this.props.dateViewIndex,
              routes: DATE_VIEW_TYPES,
            }}
            onIndexChange={this.props.actions.setDateViewIndex}
            renderScene={this.renderGamesList}
            small
          />
        ) : (
          <React.Fragment>
            <GameCell game={this.props.game} />
            {this.renderPickSelection()}
          </React.Fragment>
        )}
      </React.Fragment>
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
    const { isCreateButtonDisabled } = this;
    const { betAmount, bettee, creationPromiseState, game, games, users } = this.props;
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
        </View>
        <TouchableOpacity disabled={isCreateButtonDisabled} onPress={this.create}>
          <View style={[styles.Create__button, isCreateButtonDisabled && styles.Create__button_disabled]}>
            <Icon name="send" size={24} color={Colors.white} />
            <Text style={styles.Create__buttonText}>{creationPromiseState.isLoading ? 'Sending...' : 'Send Bet Request'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBetContainer);
