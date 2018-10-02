// @flow
import * as React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Feather';

import { type Game } from 'types/game';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Game: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: 'white',
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
  },
  Game_muted: {
    opacity: 0.25,
  },
  Game__content: {
    flex: 1,
  },
  Game__row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0
  },
  Game__rowImage: {
    height: 32,
    width: 32,
    marginRight: 8,
  },
  Game__rowLabel: {
    flex: 1,
    fontWeight: 'bold',
    ...Typography.base,
  },
  Game__meta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

type Props = {
  game: Game,
  muted: boolean,
  onPress: () => void,
};

const GameCell = ({ game, muted, onPress }: Props): React.Node => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.Game, muted && styles.Game_muted]}>
      <View style={styles.Game__content}>
        <View style={styles.Game__row}>
          {game.awayTeam.imageUrl !== null && <Image style={styles.Game__rowImage} source={{ uri: game.awayTeam.imageUrl }} />}
          <Text style={styles.Game__rowLabel}>{game.awayTeam.fullName}</Text>
        </View>
        <View style={styles.Game__row}>
          {game.homeTeam.imageUrl !== null && <Image style={styles.Game__rowImage} source={{ uri: game.homeTeam.imageUrl }} />}
          <Text style={styles.Game__rowLabel}>{game.homeTeam.fullName}</Text>
        </View>
        <View style={styles.Game__row}></View>
      </View>
      <Text style={styles.Game__meta}>05/02, 7:00PM</Text>
    </View>
  </TouchableOpacity>
);

GameCell.defaultProps = {
  muted: false,
  onPress() {},
};
GameCell.displayName = 'GameCell';

export default GameCell;
