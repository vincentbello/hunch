// @flow
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import GET_BET from 'graphql/queries/getBet';

import { type Bet } from 'types/bet';
import { type User } from 'types/user';
import { type ReduxState as UserState } from 'reducers/user';

import Colors from 'theme/colors';
import Typography from 'theme/typography';
import AppSizes from 'theme/sizes';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import Image from 'components/Image';
import DerivedStateSplash from 'components/DerivedStateSplash';
import { Query } from 'react-apollo';

type ExternalProps = {
  betId: number,
};

type Props = ExternalProps & CurrentUserProps;

const styles = StyleSheet.create({
  Bet: {
    backgroundColor: Colors.white,
    borderRadius: 2,
    margin: 8,
    padding: 8,
  },
  Bet__header: {
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
      <View style={styles.Bet__header}>
        {this.renderUser(bet.bettor, true)}
        <View style={styles.Bet__main}>
          <Text>{bet.wager}</Text>
        </View>
        {this.renderUser(bet.bettee)}
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
    const { betId } = this.props;
    return (
      <Query query={GET_BET} variables={{ betId }}>
        {({ loading, error, data }): React.Node => (
          <DerivedStateSplash error={error} loading={loading}>
            {data && data.bet && this.renderBet(data.bet)}
          </DerivedStateSplash>
        )}
      </Query>
    );
  }
}

export default withCurrentUser(BetCardContainer);
