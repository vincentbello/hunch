// @flow
import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { format } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import { type Game } from 'types/game';
import { type Team } from 'types/team';

import Image from 'components/Image';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Game: {
    flexDirection: 'row',
  },
  Game_contained: {
    height: 68,
    backgroundColor: Colors.white,
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
  Game__rowStack: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  Game__rowSubhead: {
    marginBottom: 2,
  },
  Game__rowLabel: {
    flex: 1,
    fontWeight: 'bold',
    ...Typography.base,
  },
  Game__rowLabel_large: {
    flex: 0,
    fontSize: 18,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  Game__metaContainer_bordered: {
    borderLeftWidth: 1,
    borderColor: Colors.cellBorder,
  },
  Game__metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  Game__metaText_emphasized: {
    fontWeight: 'bold',
  },
  Game__lightText: {
    color: Colors.white,
  },
  Game__metaRow: {
    fontSize: 12,
    color: '#DDDDDD',
    marginBottom: 4,
  },
});

type Props = {
  game: Game,
  light: boolean,
  muted: boolean,
  withContainer: boolean,
};

type TeamRowProps = {
  didLose: boolean,
  didWin: boolean,
  light: boolean,
  score: number | null,
  size: 'medium' | 'large',
  team: Team,
};

const defaultProps = {
  light: false,
  muted: false,
  size: 'medium',
};

const TeamRow = ({ didLose, didWin, light, score, size, team }: TeamRowProps): React.Node => {
  return (
    <View style={[styles.Game__row, didLose && styles.Game__row_muted]}>
      {team.imageUrl !== null && <Image rounded light={light} size={size === 'large' ? 'medium' : 'xsmall'} url={team.imageUrl} />}
      <View style={styles.Game__rowStack}>
        {size === 'large' && <Text style={[styles.Game__rowSubhead, light && styles.Game__lightText]}>{team.firstName}</Text>}
        <Text style={[styles.Game__rowLabel, light && styles.Game__lightText, size !== defaultProps.size && styles[`Game__rowLabel_${size}`]]}>{team.lastName}</Text>
      </View>
      {score !== null && <Text style={[styles.Game__rowMeta, didLose && styles.Game__rowMeta_offset]}>{score}</Text>}
      {didWin && <Icon style={styles.Game__rowIcon} name="chevron-left" size={12} />}
    </View>
  );
}

const GameCell = ({ game, light, muted, size, withContainer }: Props): React.Node => (
  <View>
    {size === 'large' && <Text style={styles.Game__metaRow}>{game.league}</Text>}
    <View style={[styles.Game, withContainer && styles.Game_contained, muted && styles.Game_muted]}>
      <View style={styles.Game__content}>
        <TeamRow
          didLose={game.completed && game.awayScore < game.homeScore}
          didWin={game.completed && game.awayScore > game.homeScore}
          light={light}
          score={game.awayScore}
          size={size}
          team={game.awayTeam}
        />
        <TeamRow
          didLose={game.completed && game.homeScore < game.awayScore}
          didWin={game.completed && game.homeScore > game.awayScore}
          light={light}
          score={game.homeScore}
          size={size}
          team={game.homeTeam}
        />
      </View>
      <View style={styles.Game__meta}>
        <View style={[styles.Game__metaContainer, size !== 'large' && styles.Game__metaContainer_bordered]}>
          <Text style={[styles.Game__metaText, game.completed && styles.Game__metaText_emphasized]}>
            {game.completed ? 'Final' : format(game.startDate, 'M/D, h:mm A')}
          </Text>
        </View>
      </View>
    </View>
    {size === 'large' && <Text style={styles.Game__metaRow}>{`${game.homeTeam.site} · ${game.homeTeam.city}, ${game.homeTeam.state}`}</Text>}
  </View>
);

GameCell.defaultProps = defaultProps;
GameCell.displayName = 'GameCell';

export default GameCell;
