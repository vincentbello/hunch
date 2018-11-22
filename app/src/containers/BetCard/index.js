// @flow
import * as React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { compose, graphql, Query } from 'react-apollo';
import GET_BET from 'graphql/queries/getBet';
import GET_GAME from 'graphql/queries/getGame';

import { type Error } from 'types/apollo';
import { type Bet } from 'types/bet';
import { type Game } from 'types/game';
import { type Message } from 'types/message';
import { type User } from 'types/user';

import Colors from 'theme/colors';
import Typography from 'theme/typography';
import AppSizes from 'theme/sizes';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import DerivedStateSplash from 'components/DerivedStateSplash';
import GameCell from 'components/GameCell';
import Image from 'components/Image';
import ImageSplash from 'components/ImageSplash';
import FeedMessage from 'components/FeedMessage';

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
    marginTop: 0,
  },
  game: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 36,
  },
  content: {
    zIndex: 1,
    top: -8,
    marginBottom: -8,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
  },
  sectionHeader: {
    ...Typography.h4,
    fontWeight: '900',
    marginBottom: 2,
  },
  section_row: {
    flexDirection: 'row',
  },
  amount: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountSuperscript: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 2,
    top: -2,
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  user: {
    alignItems: 'center',
    flex: 1,
    marginLeft: 6,
    marginRight: 0,
    top: -26,
    marginBottom: -26,
    zIndex: 2,
  },
  user_left: {
    marginRight: 6,
    marginLeft: 0,
  },
  userTeam: {
    top: -18,
    left: -24,
    marginBottom: -24,
  },
  userTeam_left: {
    right: -24,
    left: 'auto',
  },
  userSubhead: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    marginBottom: -4,
  },
  userLabel: {
    fontWeight: '800',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  userMeta: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  userBadge: {
    marginTop: 4,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    borderRadius: 4,
    padding: 4,
  },
  userBadgeText: {
    fontWeight: '900',
    fontSize: 10,
    color: Colors.brand.primary,
  },
  feed: {
    // marginTop:
  },
});

class BetCardContainer extends React.Component<Props> {
  static displayName = 'BetCardContainer';

  renderBet = (bet: Bet): React.Node => (
    <Query query={GET_GAME} variables={{ id: bet.game.id }}>
      {({ loading, error, data: { game } }): React.Node => (
        <View style={styles.Bet}>
          <ImageSplash dimmed height={280} source={require('../../../assets/nba-splash.png')}>
            <DerivedStateSplash error={error} loading={loading}>
              {game && (
                <View style={styles.game}>
                  <GameCell game={game} large light />
                </View>
              )}
            </DerivedStateSplash>
          </ImageSplash>
          <View style={styles.content}>
            <View style={[styles.section, styles.section_row]}>
              {this.renderUser(bet.bettor, bet.bettorPickTeamId, game, true)}
              {this.renderAmount(bet.amount)}
              {this.renderUser(bet.bettee, bet.bettorPickTeamId, game)}
            </View>
            {bet.wager && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Trash Talk</Text>
                {this.renderMessages([{ id: 1, author: bet.bettor, content: bet.wager }], bet.bettor.id)}
              </View>
            )}
          </View>
        </View>
      )}
    </Query>
  );

  renderAmount = (amount: number): React.Node => (
    <View style={styles.amount}>
      <Text style={styles.amountSuperscript}>$</Text>
      <Text style={styles.amountText}>{amount}</Text>
    </View>
  );

  renderUser = (user: User, bettorPickTeamId: number, game: ?Game, isBettor: boolean = false): React.Node => {
    let pickedTeam = null;
    if (game) {
      pickedTeam = (game.homeTeam.id === bettorPickTeamId && isBettor) || (game.homeTeam.id !== bettorPickTeamId && !isBettor) ? game.homeTeam : game.awayTeam;
    }

    return (
      <View style={[styles.user, isBettor && styles.user_left]}>
        <Image rounded padded size="large" url={user.imageUrl} />
        {pickedTeam !== null && (
          <View style={[styles.userTeam, isBettor && styles.userTeam_left]}>
            <Image
              rounded
              padded
              size="xsmall"
              url={pickedTeam.imageUrl}
            />
            {/* TODO: XOR */}
          </View>
        )}
        {pickedTeam && <Text style={styles.userSubhead}>Picked the {pickedTeam.lastName}</Text>}
        <Text style={styles.userLabel}>{user.fullName}</Text>
        <Text style={styles.userMeta}>
          {`Record: ${isBettor ? '7-4' : '3-9'}`}
          {/* TODO: Aggregations */}
        </Text>
        {isBettor && (
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>CHALLENGER</Text>
          </View>
        )}
      </View>
    );
  };

  renderMessages = (messages: Array<Message>): React.Node => (
    <View style={styles.feed}>
      <FlatList
        data={messages}
        keyExtractor={(message: Message): string => `${message.id}`}
        renderItem={({ item, index }): React.Node => (
          <FeedMessage
            message={item}
            byMe={item.author.id === this.props.currentUser.id}
          />
        )}
      />
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
