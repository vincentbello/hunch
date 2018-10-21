// @flow
import * as React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { format } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import { type Game } from 'types/game';
import { type Team } from 'types/team';

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
    flex: 7,
  },
  Game__row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
  },
  Game__row_muted: {
    opacity: 0.5,
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
  Game__rowMeta: {
    fontWeight: '800',
    ...Typography.base,
  },
  Game__rowMeta_offset: {
    marginRight: 11,
  },
  Game__rowIcon: {
    position: 'relative',
    right: -5,
  },
  Game__meta: {
    flex: 3,
  },
  Game__metaContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    borderLeftWidth: 1,
    borderColor: Colors.cellBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Game__metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  Game__metaText_emphasized: {
    fontWeight: 'bold',
  },
});

type Props = {
  game: Game,
  muted: boolean,
  onPress: () => void,
};

type TeamRowProps = {
  didLose: boolean,
  didWin: boolean,
  score: number | null,
  team: Team,
};

const TeamRow = ({ didLose, didWin, score, team }: TeamRowProps): React.Node => (
  <View style={[styles.Game__row, didLose && styles.Game__row_muted]}>
    {team.imageUrl !== null && <Image style={styles.Game__rowImage} source={{ uri: team.imageUrl }} />}
    <Text style={styles.Game__rowLabel}>{team.lastName}</Text>
    {score !== null && <Text style={[styles.Game__rowMeta, didLose && styles.Game__rowMeta_offset]}>{score}</Text>}
    {didWin && <Icon style={styles.Game__rowIcon} name="chevron-left" size={12} />}
  </View>
);

const GameCell = ({ game, muted, onPress }: Props): React.Node => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.Game, muted && styles.Game_muted]}>
      <View style={styles.Game__content}>
        <TeamRow
          team={game.awayTeam}
          didLose={game.completed && game.awayScore < game.homeScore}
          didWin={game.completed && game.awayScore > game.homeScore}
          score={game.awayScore}
        />
        <TeamRow
          team={game.homeTeam}
          didLose={game.completed && game.homeScore < game.awayScore}
          didWin={game.completed && game.homeScore > game.awayScore}
          score={game.homeScore}
        />
      </View>
      <View style={styles.Game__meta}>
        <View style={styles.Game__metaContainer}>
          <Text style={[styles.Game__metaText, game.completed && styles.Game__metaText_emphasized]}>
            {game.completed ? 'Final' : format(game.startDate, 'M/D, h:mm A')}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

GameCell.defaultProps = {
  muted: false,
  onPress() {},
};
GameCell.displayName = 'GameCell';

export default GameCell;
