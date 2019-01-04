// @flow
import * as React from 'react';
import { FlatList, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { compose, graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import GET_HUNCH from 'graphql/queries/getHunch';
import GET_GAME from 'graphql/queries/getGame';
import { noop } from 'utils/functions';

import { type Error } from 'types/apollo';
import { type Hunch } from 'types/hunch';
import { type Game } from 'types/game';
import { type Message } from 'types/message';
import { type User } from 'types/user';

import Colors from 'theme/colors';
import Typography from 'theme/typography';
import AppSizes from 'theme/sizes';

import Icon from 'react-native-vector-icons/FontAwesome';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import DerivedStateSplash from 'components/DerivedStateSplash';
import HunchActions from 'components/HunchActions';
import GameCell from 'components/GameCell';
import Image from 'components/Image';
import ImageSplash from 'components/ImageSplash';
import FeedMessage from 'components/FeedMessage';
import PaymentActions from 'components/PaymentActions';

const GET_USER_STATS = gql`
  query FullUserStats($userId: Int!) {
    userStats(userId: $userId) {
      overall {
        won
        played
      }
    }
  }
`;

type ExternalProps = {
  hunchId: number,
  hunchQuery: {
    loading: boolean,
    error: Error,
    hunch: Hunch,
  },
};

type Props = ExternalProps & CurrentUserProps;

const styles = StyleSheet.create({
  Hunch: {
    marginTop: -AppSizes.navbarHeight - AppSizes.homeIndicatorHeight,
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
  section_centered: {
    alignItems: 'center',
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
    fontWeight: '900',
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
  userLabelContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    marginRight: 6,
  },
  userLabel: {
    fontWeight: '800',
    fontSize: 15,
  },
  userLabel_muted: {
    opacity: 0.75,
  },
  userMeta: {
    flexDirection: 'row',
  },
  userMetaText: {
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
  splashText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  splashSubhead: {
    fontSize: 16,
  },
  splashSubhead_padded: {
    marginBottom: 8,
  },
});

class HunchCardContainer extends React.PureComponent<Props> {
  static displayName = 'HunchCardContainer';

  renderHunch = (hunch: Hunch): React.Node => (
    <Query query={GET_GAME} variables={{ id: hunch.game.id }}>
      {({ loading, error, data: { game } }): React.Node => (
        <ScrollView style={styles.Hunch}>
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
              {this.renderUser(hunch.bettor, hunch, game, true)}
              {this.renderAmount(hunch.amount)}
              {this.renderUser(hunch.bettee, hunch, game)}
            </View>
            {this.renderActions(hunch)}
            {Boolean(hunch.wager) && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Trash Talk</Text>
                {this.renderMessages([{ id: 1, author: hunch.bettor, content: hunch.wager }], hunch.bettor.id)}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </Query>
  );

  renderActions = (hunch: Hunch): React.Node => {
    if (hunch.active || ![hunch.bettor.id, hunch.bettee.id].includes(this.props.currentUser.id)) return null;

    const isBettor = hunch.bettor.id === this.props.currentUser.id;
    const other = isBettor ? hunch.bettee : hunch.bettor;
    const didWin = hunch.winnerId === this.props.currentUser.id;
    const didLose = hunch.winnerId !== null && hunch.winnerId !== this.props.currentUser.id;
    return (
      <View style={[styles.section, styles.section_centered]}>
        <Text style={styles.splashText}>
          {hunch.winnerId !== null ?
            (didWin ? '🎉 You won!' : '😤 You lost...') :
            (isBettor ? `You challenged ${other.firstName}.` : `${other.firstName} challenged you.`)
          }
        </Text>
        {hunch.responded ? (
          <React.Fragment>
            <Text style={[styles.splashSubhead, didLose && styles.splashSubhead_padded]}>
              {didWin ? `${other.firstName} owes you $${hunch.amount}.` : `You owe ${other.firstName} $${hunch.amount}.`}
            </Text>
            {didLose && <PaymentActions user={other} />}
          </React.Fragment>
        ) : (
          <HunchActions hunch={hunch} isBettor={isBettor} onCancel={Actions.pop} />
        )}
      </View>
    );
  };

  renderAmount = (amount: number): React.Node => (
    <View style={styles.amount}>
      <Text style={styles.amountSuperscript}>$</Text>
      <Text style={styles.amountText}>{amount}</Text>
    </View>
  );

  renderUser = (user: User, hunch: Hunch, game: ?Game, isBettor: boolean = false): React.Node => {
    let pickedTeam = null;
    if (game) {
      pickedTeam = (game.homeTeam.id === hunch.bettorPickTeamId && isBettor) || (game.homeTeam.id !== hunch.bettorPickTeamId && !isBettor) ? game.homeTeam : game.awayTeam;
    }
    const didWin = hunch.winnerId === user.id;
    const didLose = hunch.winnerId !== null && hunch.winnerId !== user.id;
    const inactive = !isBettor && !hunch.responded;
    const isCurrentUser = user.id === this.props.currentUser.id;

    return (
      <TouchableOpacity
        activeOpacity={isCurrentUser ? 1 : 0.9}
        style={[styles.user, isBettor && styles.user_left]}
        onPress={isCurrentUser ? noop : (): void => Actions.userCard({ userId: user.id })}
      >
        <Image dotted={inactive} muted={didLose} rounded padded size="large" url={user.imageUrl} />
        {pickedTeam !== null && (
          <View style={[styles.userTeam, isBettor && styles.userTeam_left]}>
            <Image
              dotted={inactive}
              muted={didLose}
              rounded
              padded
              size="xsmall"
              url={pickedTeam.imageUrl}
            />
            {/* TODO: XOR */}
          </View>
        )}
        {pickedTeam && (
          <Text style={styles.userSubhead}>{inactive ? 'Pending response' : `Picked the ${pickedTeam.lastName}`}</Text>
        )}
        <View style={styles.userLabelContainer}>
          {didWin && <Icon style={styles.userIcon} name="star" size={20} color={Colors.gold} />}
          <Text style={[styles.userLabel, didLose && styles.userLabel_muted]}>{user.fullName}</Text>
        </View>
        <View style={styles.userMeta}>
          <Text style={styles.userMetaText}>Record: </Text>
          <Query query={GET_USER_STATS} variables={{ userId: user.id }}>
            {({ data: { userStats } }): React.Node => (userStats ? (
              <Text style={styles.userMetaText}>
                {`${userStats.overall.won}-${userStats.overall.played - userStats.overall.won}`}
              </Text>
            ) : null)}
          </Query>
        </View>
        {isBettor && (
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>CHALLENGER</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  renderMessages = (messages: Array<Message>): React.Node => (
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
  );

  render(): React.Node {
    const { loading, error, hunch } = this.props.hunchQuery;
    return (
      <DerivedStateSplash error={error} loading={loading}>
        {Boolean(hunch) && this.renderHunch(hunch)}
      </DerivedStateSplash>
    );
  }
}

export default compose(
  graphql(GET_HUNCH, { name: 'hunchQuery', options: ({ hunchId }) => ({ variables: { hunchId } }) }),
  withCurrentUser,
)(HunchCardContainer);