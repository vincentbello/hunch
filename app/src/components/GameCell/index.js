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
  content: {
    flex: 7,
  },
  content_large: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
  },
  row_muted: {
    opacity: 0.65,
  },
  rowStack: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  rowSubhead: {
    marginBottom: 2,
    fontSize: 13,
  },
  rowLabel: {
    flex: 1,
    fontWeight: 'bold',
    ...Typography.base,
  },
  rowLabel_large: {
    flex: 0,
    fontSize: 18,
  },
  rowMeta: {
    fontWeight: '800',
    ...Typography.base,
  },
  rowMeta_offset: {
    marginRight: 11,
  },
  rowIcon: {
    position: 'relative',
    right: -5,
  },
  meta: {
    flex: 3,
  },
  metaContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaContainer_bordered: {
    borderLeftWidth: 1,
    borderColor: Colors.cellBorder,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaText_emphasized: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  metaText_light: {
    color: Colors.textTertiary,
  },
  metaText_stacked: {
    marginTop: 4,
  },
  lightText: {
    color: Colors.white,
  },
  metaRow: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textTertiary,
    marginBottom: 4,
  },
});

type Props = {
  game: Game,
  large: boolean,
  light: boolean,
  muted: boolean,
  withContainer: boolean,
};

type TeamRowProps = {
  didLose: boolean,
  didWin: boolean,
  large: boolean,
  light: boolean,
  score: number | null,
  team: Team,
};

const defaultProps = {
  large: false,
  light: false,
  muted: false,
};

const TeamRow = ({ didLose, didWin, large, light, score, team }: TeamRowProps): React.Node => {
  return (
    <View style={[styles.row, didLose && styles.row_muted]}>
      {team.imageUrl !== null && <Image rounded light={light} size={large ? 'medium' : 'xsmall'} url={team.imageUrl} />}
      <View style={styles.rowStack}>
        {large && <Text style={[styles.rowSubhead, light && styles.lightText]}>{team.firstName}</Text>}
        <Text style={[styles.rowLabel, light && styles.lightText, large && styles.rowLabel_large]}>
          {team.lastName}
        </Text>
      </View>
      {score !== null && <Text style={[styles.rowMeta, didLose && styles.rowMeta_offset]}>{score}</Text>}
      {didWin && <Icon style={styles.rowIcon} name="chevron-left" size={12} />}
    </View>
  );
};

const GameStatus = (props: { game: Game, stacked: boolean, light: boolean }): React.Node => (
  <React.Fragment>
    <Text style={[styles.metaText, props.light && styles.metaText_light, props.game.completed && styles.metaText_emphasized]}>
      {props.game.completed ? 'Final' : format(props.game.startDate, props.stacked ? 'MMM D, YYYY' : 'M/D, h:mm A')}
    </Text>
    {props.stacked && (
      <Text style={[styles.metaText, styles.metaText_stacked, props.light && styles.metaText_light]}>
        {format(props.game.startDate, props.game.completed ? 'MMM D, YYYY' : 'h:mm A')}
      </Text>
    )}
  </React.Fragment>
);

const GameCell = ({ game, large, light, muted, withContainer }: Props): React.Node => (
  <View>
    {large && <Text style={styles.metaRow}>{game.league}</Text>}
    <View style={[styles.Game, withContainer && styles.Game_contained, muted && styles.Game_muted]}>
      <View style={[large && styles.content]}>
        <TeamRow
          didLose={game.completed && game.awayScore < game.homeScore}
          didWin={game.completed && game.awayScore > game.homeScore}
          large={large}
          light={light}
          score={game.awayScore}
          team={game.awayTeam}
        />
        <TeamRow
          didLose={game.completed && game.homeScore < game.awayScore}
          didWin={game.completed && game.homeScore > game.awayScore}
          large={large}
          light={light}
          score={game.homeScore}
          team={game.homeTeam}
        />
      </View>
      <View style={!large && styles.meta}>
        <View style={[styles.metaContainer, !large && styles.metaContainer_bordered]}>
          <GameStatus game={game} light={light} stacked={large} />
        </View>
      </View>
    </View>
    {large && <Text style={styles.metaRow}>{`${game.homeTeam.site} · ${game.homeTeam.city}, ${game.homeTeam.state}`}</Text>}
  </View>
);

GameCell.defaultProps = defaultProps;
GameCell.displayName = 'GameCell';

export default GameCell;
