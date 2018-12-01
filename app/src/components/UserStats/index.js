// @flow
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { graphql } from 'react-apollo';
import GET_STATS from 'graphql/queries/getUserStats';

import { type Error } from 'types/apollo';
import { type UserStats as UserStatsType } from 'types/user';

import DerivedStateSplash from 'components/DerivedStateSplash';

import Colors from 'theme/colors';

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  statRow_first: {
    marginTop: 0,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statContent: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statSuperscript: {
    fontSize: 14,
    top: -4,
    marginRight: 4,
  },
  stat: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stat_success: {
    color: Colors.primary.green,
  },
  stat_error: {
    color: Colors.primary.red,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});

type Props = {
  userId: number,
  userStatsQuery: {
    loading: boolean,
    error: Error,
    userStats: UserStatsType,
  },
};

const UserStats = ({ userStatsQuery: { loading, error, userStats } }: Props): React.Node => (
  <DerivedStateSplash loading={loading} error={error}>
    {userStats && (
      <React.Fragment>
        <View style={[styles.statRow, styles.statRow_first]}>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.stat, userStats.won > 0 && styles.stat_success]}>{userStats.won}</Text>
            </View>
            <Text style={styles.statLabel}>Bets Won</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={[styles.stat, userStats.played > userStats.won && styles.stat_error]}>
                {userStats.played - userStats.won}
              </Text>
            </View>
            <Text style={styles.statLabel}>Bets Lost</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text
                style={[
                  styles.stat,
                  2 * userStats.won > userStats.played && styles.stat_success,
                  2 * userStats.won < userStats.played && styles.stat_error,
                ]}
              >
                {`${userStats.won}-${userStats.played - userStats.won}`}
              </Text>
            </View>
            <Text style={styles.statLabel}>Record</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statSuperscript}>$</Text>
              <Text style={styles.stat}>{userStats.amountWon}</Text>
            </View>
            <Text style={styles.statLabel}>Total Won</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statSuperscript}>$</Text>
              <Text style={styles.stat}>{userStats.amountLost}</Text>
            </View>
            <Text style={styles.statLabel}>Total Lost</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statSuperscript}>$</Text>
              <Text
                style={[
                  styles.stat,
                  userStats.amountWon > userStats.amountLost && styles.stat_success,
                  userStats.amountWon < userStats.amountLost && styles.stat_error,
                ]}
              >
                {userStats.amountWon === userStats.amountLost ? '0' : (
                  `${userStats.amountWon > userStats.amountLost ? '+' : '-'}${Math.abs(userStats.amountWon - userStats.amountLost)}`
                )}
              </Text>
            </View>
            <Text style={styles.statLabel}>Net</Text>
          </View>
        </View>
      </React.Fragment>
    )}
  </DerivedStateSplash>
);

UserStats.displayName = 'UserStats';
export default graphql(GET_STATS, { name: 'userStatsQuery', options: ({ userId }) => ({ variables: { userId } }) })(UserStats);
