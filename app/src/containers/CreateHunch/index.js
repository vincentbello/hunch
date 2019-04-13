// @flow
import * as React from 'react';
import { FlatList, Keyboard, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { compose, graphql, Mutation, Query } from 'react-apollo';
import memoize from 'fast-memoize';
import Icon from 'react-native-vector-icons/Feather';
import CREATE_HUNCH_REQUEST from 'graphql/mutations/createHunchRequest';
import GET_HUNCHES from 'graphql/queries/getHunches';
import GET_GAME from 'graphql/queries/getGame';
import GET_USERS from 'graphql/queries/getUsers';
import GET_UPCOMING_GAMES from 'graphql/queries/getUpcomingGames';

import { DATE_VIEW_TYPES } from 'constants/view-types';
import { clearForm, setHunchAmount, setBettee, setBettorPickTeam, setDateViewIndex, setGame, setHunchWager } from 'actions/createHunch';
import { getHunchAmount, getBettee, getBettorPickTeamId, getDateViewIndex, getDateViewType, getGameId, getHunchWager } from 'selectors/createHunch';
import AmountInput from 'components/AmountInput';
import GameCell from 'components/GameCell';
import DerivedStateSplash from 'components/DerivedStateSplash';
import Splash from 'components/Splash';
import TabView from 'components/TabView';
import TeamCell from 'components/TeamCell';
import UserCell from 'components/UserCell';

import { type Game } from 'types/game';
import { type Action, type PromiseState } from 'types/redux';
import { type User } from 'types/user';
import { type ReduxState } from 'types/state';

import Colors from 'theme/colors';
import Sizes from 'theme/sizes';
import Typography from 'theme/typography';

const onHunchCreate = (cache, { data: { createHunchRequest } }) => {
  const pendingHunchesQuery = { query: GET_HUNCHES, variables: { hunchListType: 'PENDING' } };
  try {
    const { hunches: pendingHunches } = cache.readQuery(pendingHunchesQuery);
    cache.writeQuery({ ...pendingHunchesQuery, data: { hunches: [...pendingHunches, createHunchRequest] } });
  } catch (err) {}
};

type ReduxProps = {
  hunchAmount: number,
  bettee: User,
  bettorPickTeamId: number | null,
  dateViewIndex: number,
  dateViewType: string,
  gameId: number | null,
  wager: string,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  hunchAmount: getHunchAmount(state),
  bettee: getBettee(state),
  bettorPickTeamId: getBettorPickTeamId(state),
  dateViewIndex: getDateViewIndex(state),
  dateViewType: getDateViewType(state),
  gameId: getGameId(state),
  wager: getHunchWager(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ clearForm, setHunchAmount, setBettee, setHunchWager, setBettorPickTeam, setDateViewIndex, setGame }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    clearForm: () => void,
    setHunchAmount: (amount: number) => void,
    setBettee: (bettee: User | null) => void,
    setBettorPickTeam: (bettorPickTeamId: number | null) => void,
    setHunchWager: (wager: string) => void,
    setDateViewIndex: (dateViewIndex: number) => void,
    setGame: (gameId: number | null) => void,
  },
  preselectedBettee?: User,
};

type State = {
  betteeInputText: string,
  keyboardOffset: number,
  isAmountInputFocused: boolean,
  isWagerInputFocused: boolean,
};

const styles = StyleSheet.create({
  Create: {
    flex: 1,
  },
  Create__container: {
    flex: 1,
  },
  Create__container_focus: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 200,
  },
  Create__header: {
    height: 50,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  Create__headerInput: {
    fontSize: 16,
    padding: 8,
  },
  Create__headerMain: {
    flex: 1,
    flexDirection: 'row',
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
    padding: 4,
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
  Create__footer: {
    marginBottom: 4,
  },
  Create__footerInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

const initialState = {
  betteeInputText: '',
  keyboardOffset: 0,
  isAmountInputFocused: false,
  isWagerInputFocused: false,
};

class CreateHunchContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.getFilteredFriends = memoize(this.getFilteredFriends);
    this.state = initialState;
  }

  componentWillMount() {
    if (this.props.preselectedBettee) this.selectBettee(this.props.preselectedBettee);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.onKeyboardShown);
  }

  get amountInputValue(): string {
    return `${this.props.hunchAmount === 0 ? '' : this.props.hunchAmount}`;
  }

  get hunchVariables(): {} {
    const { hunchAmount, bettee, bettorPickTeamId, gameId, wager } = this.props;
    if (!this.isFormCompleted) return { variables: {} };
    return {
      variables: {
        amount: hunchAmount,
        betteeId: bettee.id,
        gameId,
        bettorPickTeamId,
        type: 'MONEY_LINE', // Placeholder
        wager,
      },
    };
  }

  get isFormCompleted(): boolean {
    return (
      this.props.bettee !== null &&
      this.props.hunchAmount > 0 &&
      this.props.gameId !== null &&
      this.props.bettorPickTeamId !== null
    );
  }

  getFilteredFriends = (str: string): Array<User> => {
    const { users } = this.props.friends;
    if (str.length === 0) return users;

    const filterStr = str.trim().toLowerCase();
    return users.filter((user: User): boolean => (
      user.firstName.toLowerCase().startsWith(filterStr) || user.lastName.toLowerCase().startsWith(filterStr)
    ));
  };

  onAmountInputChange = (amountInputText: string) => {
    this.props.actions.setHunchAmount(parseInt(amountInputText, 10) || 0);
  };

  onHunchCreated = () => {
    Actions.pop();
    setTimeout(this.props.actions.clearForm, 1000);
  };

  onBetteeInputChange = (betteeInputText: string): void => this.setState({ betteeInputText });

  onKeyboardShown = (evt) => {
    if (this.state.isWagerInputFocused) {
      this.setState({ keyboardOffset: evt.endCoordinates.height - Sizes.homeIndicatorHeight });
    }
  };

  removeBettee = () => {
    this.setState({ ...initialState });
    this.props.actions.setBettee(null);
  };

  selectBettee = (user: User) => {
    this.props.actions.setBettee(user);
    this.setState({ betteeInputText: '', isAmountInputFocused: true });
  };

  selectBettorPickTeam = (teamId: number) => {
    this.props.actions.setBettorPickTeam(this.props.bettorPickTeamId === null || this.props.bettorPickTeamId !== teamId ? teamId : null);
  };

  renderRemoveButton = (onPress: () => void): React.Node => (
    <Icon.Button
      style={styles.Create__sectionHeaderIcon}
      backgroundColor="transparent"
      color={Colors.brand.primary}
      iconStyle={{ marginRight: 0 }}
      name="x"
      size={18}
      underlayColor={Colors.iconButton.underlay}
      onPress={onPress}
    />
  );

  renderPickSelection = (game: Game): React.Node => {
    const { actions, bettorPickTeamId } = this.props;
    return (
      <React.Fragment>
        <View style={styles.Create__sectionHeader}>
          <Text style={styles.Create__sectionHeaderText}>My Pick</Text>
          {bettorPickTeamId && this.renderRemoveButton((): void => actions.setBettorPickTeam(null))}
        </View>
        <View style={styles.Create__horizontalCellContainer}>
          <View style={styles.Create__horizontalCell}>
            <TouchableOpacity onPress={(): void => this.selectBettorPickTeam(game.awayTeam.id)}>
              <TeamCell
                team={game.awayTeam}
                muted={bettorPickTeamId !== null && game.awayTeam.id !== bettorPickTeamId}
                selected={bettorPickTeamId !== null && game.awayTeam.id === bettorPickTeamId}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.Create__horizontalCell, styles.Create__horizontalCell_last]}>
            <TouchableOpacity onPress={(): void => this.selectBettorPickTeam(game.homeTeam.id)}>
              <TeamCell
                team={game.homeTeam}
                muted={bettorPickTeamId !== null && game.homeTeam.id !== bettorPickTeamId}
                selected={bettorPickTeamId !== null && game.homeTeam.id === bettorPickTeamId}
              />
            </TouchableOpacity>
          </View>
        </View>
      </React.Fragment>
    );
  };

  renderGamesList = (): React.Node => (
    <Query query={GET_UPCOMING_GAMES} variables={{ date: this.props.dateViewType, league: 'NBA' }}>
      {({ loading, error, data: { upcomingGames } }): React.Node => (
        <DerivedStateSplash loading={loading} error={error}>
          {upcomingGames && (
            upcomingGames.length === 0 ? (
              <Splash heading={this.props.dateViewIndex === 0 ? 'No more games today.' : 'No games.'} visualName="slash" grow />
            ) : (
              <FlatList
                data={upcomingGames}
                keyExtractor={(game: Game): string => `${game.id}`}
                renderItem={({ item }): React.Node => (
                  <TouchableOpacity onPress={(): void => this.props.actions.setGame(item.id)}>
                    <GameCell game={item} withContainer />
                  </TouchableOpacity>
                )}
              />
            )
          )}
        </DerivedStateSplash>
      )}
    </Query>
  );

  renderGameSelection = (): React.Node => {
    const { actions, dateViewIndex, gameId } = this.props;
    return (
      <React.Fragment>
        <View style={styles.Create__sectionHeader}>
          <Text style={styles.Create__sectionHeaderText}>{gameId === null ? 'Select a Game' : 'Selected Game'}</Text>
          {gameId !== null && this.renderRemoveButton((): void => actions.setGame(null))}
        </View>
        {gameId === null ? (
          <TabView
            navigationState={{
              index: dateViewIndex,
              routes: DATE_VIEW_TYPES,
            }}
            onIndexChange={actions.setDateViewIndex}
            renderScene={this.renderGamesList}
            scrollable
            small
          />
        ) : (
          <Query query={GET_GAME} variables={{ id: gameId }}>
            {({ data: { game } }): React.Node => (
              game ? (
                <React.Fragment>
                  <GameCell game={game} withContainer />
                  {this.renderPickSelection(game)}
                </React.Fragment>
              ) : null
            )}
          </Query>
        )}
      </React.Fragment>
    );
  };

  renderUsers = (): React.Node => (
    <DerivedStateSplash loading={this.props.friends.loading} error={this.props.friends.error}>
      {this.props.friends.users && (
        <FlatList
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          data={this.getFilteredFriends(this.state.betteeInputText)}
          keyExtractor={(user: User): string => `${user.id}`}
          renderItem={({ item }): React.Node => (
            <UserCell
              inList
              size="small"
              user={item}
              onPress={(): void => this.selectBettee(item)}
            />
          )}
        />
      )}
    </DerivedStateSplash>
  );

  renderWagerInput = (): React.Node => (
    <View style={[styles.Create__header, styles.Create__headerInput, styles.Create__footer]}>
      <Icon name="edit-3" size={18} color={Colors.textSecondary} />
      <TextInput
        style={styles.Create__footerInput}
        placeholder="Talk some trash..."
        onChangeText={this.props.actions.setHunchWager}
        onBlur={(): void => this.setState({ keyboardOffset: 0, isWagerInputFocused: false })}
        onFocus={(): void => this.setState({ isWagerInputFocused: true })}
        value={this.props.wager}
      />
      {this.state.isWagerInputFocused && (
        <Icon.Button
          style={styles.Create__sectionHeaderIcon}
          backgroundColor="transparent"
          color={Colors.brand.primary}
          iconStyle={{ marginRight: 0 }}
          name="chevrons-down"
          size={18}
          underlayColor={Colors.iconButton.underlay}
          onPress={Keyboard.dismiss}
        />
      )}
    </View>
  );

  render(): React.Node {
    const { amountInputValue, isFormCompleted } = this;
    const { bettee } = this.props;
    const { betteeInputText, isAmountInputFocused } = this.state;
    return (
      <View style={styles.Create}>
        {bettee ? (
          <View style={styles.Create__header}>
            <View style={styles.Create__headerMain}>
              <View style={styles.Create__headerMain}>
                <View style={{ flex: 1 }}>
                  <UserCell
                    emphasized
                    size="small"
                    user={bettee}
                    renderMeta={(): React.Node => this.renderRemoveButton(this.removeBettee)}
                  />
                </View>
              </View>
            </View>
            {!isAmountInputFocused && (
              <AmountInput
                bettee={bettee}
                value={amountInputValue}
                toggleFocus={(): void => this.setState({ isAmountInputFocused: true })}
              />
            )}
          </View>
        ) : (
          <TextInput
            style={[styles.Create__header, styles.Create__headerInput]}
            autoFocus
            placeholder="Name"
            value={betteeInputText}
            onChangeText={this.onBetteeInputChange}
          />
        )}
        <View style={[styles.Create__container, isAmountInputFocused && styles.Create__container_focus]}>
          {bettee && isAmountInputFocused ? (
            <AmountInput
              bettee={bettee}
              isFocused
              value={amountInputValue}
              onChange={this.onAmountInputChange}
              toggleFocus={(): void => this.setState({ isAmountInputFocused: !isAmountInputFocused })}
            />
          ) : (
            bettee ? this.renderGameSelection() : this.renderUsers()
          )}
        </View>
        <View style={{ top: -this.state.keyboardOffset, zIndex: 1, backgroundColor: Colors.background }}>
          {bettee && !isAmountInputFocused && this.renderWagerInput()}
          <Mutation mutation={CREATE_HUNCH_REQUEST} update={onHunchCreate} onCompleted={this.onHunchCreated}>
            {(createHunchRequest, { called, loading }): React.Node => (
              <TouchableOpacity disabled={called || !isFormCompleted} onPress={(): void => createHunchRequest(this.hunchVariables)}>
                <View style={[styles.Create__button, (called || !isFormCompleted) && styles.Create__button_disabled]}>
                  <Icon name="send" size={24} color={Colors.white} />
                  <Text style={styles.Create__buttonText}>
                    {called ? `${loading ? 'Sending...' : 'Sent!'}` : `Send${bettee ? ` ${bettee.firstName} a` : ''} Hunch Request`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </Mutation>
        </View>
      </View>
    );
  }
}

export default compose(
  graphql(GET_USERS, { name: 'friends', options: { variables: { userListType: 'FRIENDS' } } }),
  connect(mapStateToProps, mapDispatchToProps),
)(CreateHunchContainer);
