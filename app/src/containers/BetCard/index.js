// @flow
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { compose, graphql, Query } from 'react-apollo';
import GET_BET from 'graphql/queries/getBet';
import GET_GAME from 'graphql/queries/getGame';

import { type Error } from 'types/apollo';
import { type Bet } from 'types/bet';
import { type Game } from 'types/game';
import { type User } from 'types/user';

import Colors from 'theme/colors';
import Typography from 'theme/typography';
import AppSizes from 'theme/sizes';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import GameCard from 'components/GameCard';
import Image from 'components/Image';
import DerivedStateSplash from 'components/DerivedStateSplash';

type ExternalProps = {
  betId: number,
  betQuery: {
    loading: boolean,
    error: Error,
    bet: Bet,
  },
};

type Props = ExternalProps & CurrentUserProps;

const styles = StyleSheet.create({
  Bet: {
    marginTop: 8,
  },
  Bet__section: {
    backgroundColor: Colors.white,
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
  },
  Bet__sectionHeader: {
    ...Typography.h4,
    fontWeight: '900',
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 2,
  },
  Bet__section_row: {
    flexDirection: 'row',
  },
  Bet__user: {
    alignItems: 'center',
    width: 90,
  },
  Bet__userLabel: {
    fontWeight: '800',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  Bet__userMeta: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  Bet__userBadge: {
    marginTop: 4,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    borderRadius: 4,
    padding: 4,
  },
  Bet__userBadgeText: {
    fontWeight: '900',
    fontSize: 10,
    color: Colors.brand.primary,
  },
  Bet__main: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});

class BetCardContainer extends React.Component<Props> {
  static displayName = 'BetCardContainer';

  renderBet = (bet: Bet): React.Node => (
    <View style={styles.Bet}>
      <View style={[styles.Bet__section, styles.Bet__section_row]}>
        {this.renderUser(bet.bettor, true)}
        <View style={styles.Bet__main}>
          <Text>{bet.wager}</Text>
        </View>
        {this.renderUser(bet.bettee)}
      </View>
      <Text style={styles.Bet__sectionHeader}>Game</Text>
      <View style={styles.Bet__section}>
        <Query query={GET_GAME} variables={{ id: bet.game.id }}>
          {({ loading, error, data: { game } }): React.Node => (
            <DerivedStateSplash error={error} loading={loading}>
              {game && <GameCard game={game} />}
            </DerivedStateSplash>
          )}
        </Query>
      </View>
    </View>
  );

  renderUser = (user: User, isBettor: boolean = false): React.Node => (
    <View style={styles.Bet__user}>
      <Image rounded size="large" url={user.imageUrl} />
      <Text style={styles.Bet__userLabel}>{user.fullName}</Text>
      <Text style={styles.Bet__userMeta}>Record: {isBettor ? '7-4' : '3-9'}</Text>
      {isBettor && (
        <View style={styles.Bet__userBadge}>
          <Text style={styles.Bet__userBadgeText}>CHALLENGER</Text>
        </View>
      )}
    </View>
  );

  render(): React.Node {
    const { loading, error, bet } = this.props.betQuery;
    return (
      <DerivedStateSplash error={error} loading={loading}>
        {bet && this.renderBet(bet)}
      </DerivedStateSplash>
    );
  }
}

export default compose(
  graphql(GET_BET, { name: 'betQuery', options: ({ betId }) => ({ variables: { betId } }) }),
  withCurrentUser,
)(BetCardContainer);
