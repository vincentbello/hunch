// @flow
import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { format } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import { type Team } from 'types/team';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

import Image from 'components/Image';

const styles = StyleSheet.create({
  Team: {
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 4,
    alignItems: 'center',
    overflow: 'hidden',
  },
  Team_muted: {
    opacity: 0.25,
  },
  Team__label: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Team__labelHeading: {
    ...Typography.h4,
    lineHeight: 16,
    fontWeight: 'bold',
  },
  Team__labelSubhead: {
    ...Typography.h5,
    lineHeight: 12,
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '500',
  },
  Team__selection: {
    position: 'absolute',
    right: -32,
    top: -32,
    width: 64,
    height: 64,
    backgroundColor: Colors.primary.green,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  Team__selectionIcon: {
    transform: [{ rotate: '-45deg' }],
    fontWeight: 'bold',
  }
});

type Props = {
  away: boolean,
  muted: boolean,
  selected: boolean,
  team: Team,
};

const TeamCell = ({ away, muted, selected, team }: Props): React.Node => (
  <View style={[styles.Team, muted && styles.Team_muted]}>
    <Image url={team.imageUrl} />
    <View style={styles.Team__label}>
      <Text style={styles.Team__labelSubhead}>{team.firstName}</Text>
      <Text style={styles.Team__labelHeading}>{team.lastName}</Text>
    </View>
    {selected && (
      <View style={styles.Team__selection}>
        <Icon style={styles.Team__selectionIcon} name="check" size={24} color={Colors.white} />
      </View>
    )}
  </View>
);

TeamCell.defaultProps = {
  away: false,
  muted: false,
  selected: false,
};
TeamCell.displayName = 'TeamCell';

export default TeamCell;
