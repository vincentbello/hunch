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
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
  },
  row_large: {
    marginBottom: 4,
  },
  row_muted: {
    opacity: 0.65,
  },
  rowStack: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  rowSubhead: {
    marginBottom: 2,
    fontSize: 13,
  },
  rowLabel: {
    fontWeight: 'bold',
    ...Typography.base,
  },
  rowLabel_large: {
    flex: 0,
    fontSize: 18,
  },
  rowMeta: {
    fontSize: 14,
    fontWeight: '800',
  },
  rowMeta_large: {
    fontSize: 20,
    fontWeight: '900',
  },
  rowMeta_offset: {
    marginRight: 11,
  },
  rowMeta_largeOffset: {
    marginRight: 17,
  },
  rowIcon: {
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
    marginTop: 4,
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
    <View style={[styles.row, large && styles.row_large, didLose && styles.row_muted]}>
      <Image rounded light={light} size={large ? 'medium' : 'xsmall'} url={team.imageUrl} />
      <View style={styles.rowStack}>
        {large && <Text style={[styles.rowSubhead, light && styles.lightText]}>{team.firstName}</Text>}
        <Text style={[styles.rowLabel, light && styles.lightText, large && styles.rowLabel_large]}>
          {team.lastName}
        </Text>
      </View>
      {score !== null && (
        <Text
          style={[
            styles.rowMeta,
            light && styles.lightText,
            large && styles.rowMeta_large,
            didLose && styles.rowMeta_offset,
            large && didLose && styles.rowMeta_largeOffset,
          ]}
        >
          {score}
        </Text>
      )}
      {didWin && (
        <Icon color={light ? Colors.white : Colors.textPrimary} style={styles.rowIcon} name="chevron-left" size={large ? 18 : 12} />
      )}
    </View>
  );
};

const GameStatus = (props: { game: Game, stacked: boolean, light: boolean }): React.Node => {
  const hasStarted = props.game.completed || props.game.inProgress;
  return (
    <React.Fragment>
      <Text style={[styles.metaText, props.light && styles.metaText_light, hasStarted && styles.metaText_emphasized]}>
        {hasStarted ? (props.game.completed ? 'Final' : 'In Progress') : format(props.game.startDate, props.stacked ? 'MMM D, YYYY' : 'M/D, h:mm A')}
      </Text>
      {props.stacked && (
        <Text style={[styles.metaText, styles.metaText_stacked, props.light && styles.metaText_light]}>
          {format(props.game.startDate, hasStarted ? 'MMM D, YYYY' : 'h:mm A')}
        </Text>
      )}
    </React.Fragment>
  );
};

const GameCell = ({ game, large, light, muted, withContainer }: Props): React.Node => (
  <View>
    {large && <Text style={styles.metaRow}>{game.league}</Text>}
    <View style={[styles.Game, withContainer && styles.Game_contained, muted && styles.Game_muted]}>
      <View style={styles.content}>
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
      <View style={[!large && styles.meta]}>
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
