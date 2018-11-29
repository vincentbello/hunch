// @flow
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { distanceInWordsToNow, format } from 'date-fns';

import { type User } from 'types/user';
import DerivedStateSplash from 'components/DerivedStateSplash';
import Image from 'components/Image';

import Colors from 'theme/colors';
import { BoxStyles } from 'theme/app';
import Typography from 'theme/typography';

const GET_STATS = gql`
  query FullUserStats($userId: Int!) {
    userStats(userId: $userId) {
      won
      played
      amountWon
      amountLost
    }
  }
`;

const styles = StyleSheet.create({
  user: {
    margin: 8,
  },
  section: {
    ...BoxStyles,
    marginBottom: 8,
    padding: 8,
  },
  section_row: {
    flexDirection: 'row',
  },
  sectionHeader: {
    ...Typography.h4,
    fontWeight: '900',
    marginBottom: 2,
  },
  headerContent: {
    marginLeft: 8,
    flex: 1,
  },
  headerTitle: {
    ...Typography.h2,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerMeta: {
    ...Typography.h5,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
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
  user: User,
};

const UserCard = ({ user }: Props): React.Node => (
  <View style={styles.user}>
    <View style={[styles.section, styles.section_row]}>
      <Image bordered rounded size="large" url={user.imageUrl} />
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{user.fullName}</Text>
        <Text style={styles.headerMeta}>
          {`Member since ${format(user.createdAt, 'MMMM D, YYYY')}`}
        </Text>
        <Text style={styles.headerMeta}>
          {`Last seen ${distanceInWordsToNow(user.lastLoginAt, { addSuffix: true })}`}
        </Text>
      </View>
    </View>
    <Text style={styles.sectionHeader}>Statistics</Text>
    <View style={styles.section}>
      <Query query={GET_STATS} variables={{ userId: user.id }}>
        {({ loading, error, data: { userStats } }): React.Node => (
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
        )}
      </Query>
    </View>
  </View>
);

UserCard.displayName = 'UserCard';
export default UserCard;
