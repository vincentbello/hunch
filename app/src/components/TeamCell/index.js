// @flow
import * as React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { format } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import { type Team } from 'types/team';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Team: {
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  Team_muted: {
    opacity: 0.25,
  },
  Team__image: {
    height: 64,
    width: 64,
  },
  Team__label: {
    ...Typography.h4,
    fontWeight: 'bold',
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
  muted: boolean,
  selected: boolean,
  team: Team,
  onPress: () => void,
};

const TeamCell = ({ muted, selected, team, onPress }: Props): React.Node => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.Team, muted && styles.Team_muted]}>
      {team.imageUrl !== null && <Image style={styles.Team__image} source={{ uri: team.imageUrl }} />}
      <Text style={styles.Team__label}>{team.lastName}</Text>
      {selected && (
        <View style={styles.Team__selection}>
          <Icon style={styles.Team__selectionIcon} name="check" size={24} color={Colors.white} />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

TeamCell.defaultProps = {
  muted: false,
  selected: false,
  onPress() {},
};
TeamCell.displayName = 'TeamCell';

export default TeamCell;
