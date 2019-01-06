// @flow
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
  stats: StatsGroup,
};

const UserStats = ({ stats }: Props): React.Node => (
  <React.Fragment>
    <View style={[styles.statRow, styles.statRow_first]}>
      <View style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={[styles.stat, stats.won > 0 && styles.stat_success]}>{stats.won}</Text>
        </View>
        <Text style={styles.statLabel}>Hunches Won</Text>
      </View>
      <View style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={[styles.stat, stats.played > stats.won && styles.stat_error]}>
            {stats.played - stats.won}
          </Text>
        </View>
        <Text style={styles.statLabel}>Hunches Lost</Text>
      </View>
      <View style={styles.statCard}>
        <View style={styles.statContent}>
          <Text
            style={[
              styles.stat,
              2 * stats.won > stats.played && styles.stat_success,
              2 * stats.won < stats.played && styles.stat_error,
            ]}
          >
            {`${stats.won}-${stats.played - stats.won}`}
          </Text>
        </View>
        <Text style={styles.statLabel}>Record</Text>
      </View>
    </View>
    <View style={styles.statRow}>
      <View style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={styles.statSuperscript}>$</Text>
          <Text style={styles.stat}>{stats.amountWon}</Text>
        </View>
        <Text style={styles.statLabel}>Total Won</Text>
      </View>
      <View style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={styles.statSuperscript}>$</Text>
          <Text style={styles.stat}>{stats.amountLost}</Text>
        </View>
        <Text style={styles.statLabel}>Total Lost</Text>
      </View>
      <View style={styles.statCard}>
        <View style={styles.statContent}>
          <Text style={styles.statSuperscript}>$</Text>
          <Text
            style={[
              styles.stat,
              stats.amountWon > stats.amountLost && styles.stat_success,
              stats.amountWon < stats.amountLost && styles.stat_error,
            ]}
          >
            {stats.amountWon === stats.amountLost ? '0' : (
              `${stats.amountWon > stats.amountLost ? '+' : '-'}${Math.abs(stats.amountWon - stats.amountLost)}`
            )}
          </Text>
        </View>
        <Text style={styles.statLabel}>Net</Text>
      </View>
    </View>
  </React.Fragment>
);

UserStats.displayName = 'UserStats';
export default UserStats;
