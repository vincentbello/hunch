// @flow
import * as React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { format } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import { type Game } from 'types/game';
import { type Team } from 'types/team';

import TeamCell from 'components/TeamCell';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Game: {},
  Game__content: {
    flexDirection: 'row',
  },
  Game__row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
  },
  Game__row_muted: {
    opacity: 0.5,
  },
  Game__cell: {
    flex: 1,
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
    width: 96,
    marginLeft: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Game__metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  Game__metaText_first: {
    marginBottom: 4,
  },
  Game__metaText_emphasized: {
    fontWeight: 'bold',
  },
});

type Props = {
  game: Game,
};

const GameCard = ({ game }: Props): React.Node => (
  <View style={styles.Game}>
    <View style={styles.Game__content}>
      <View style={styles.Game__cell}>
        <TeamCell
          away
          didLose={game.completed && game.awayScore < game.homeScore}
          didWin={game.completed && game.awayScore > game.homeScore}
          score={game.awayScore}
          team={game.awayTeam}
          muted={false}
        />
      </View>
      <View style={styles.Game__meta}>
        <Text style={[styles.Game__metaText, styles.Game__metaText_first, game.completed && styles.Game__metaText_emphasized]}>
          {game.completed ? 'Final' : format(game.startDate, 'M/D, h:mm A')}
        </Text>
        <Text style={styles.Game__metaText}>{game.homeTeam.site}</Text>
        <Text style={styles.Game__metaText}>{`${game.homeTeam.city}, ${game.homeTeam.state}`}</Text>
      </View>
      <View style={styles.Game__cell}>
        <TeamCell
          didLose={game.completed && game.awayScore < game.homeScore}
          didWin={game.completed && game.awayScore > game.homeScore}
          score={game.homeScore}
          team={game.homeTeam}
          muted={false}
        />
      </View>
    </View>
  </View>
);

GameCard.displayName = 'GameCard';
export default GameCard;
