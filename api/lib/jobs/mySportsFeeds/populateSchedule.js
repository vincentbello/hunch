#!/usr/bin/env node
import 'dotenv/config';
import debugModule from 'debug';
import http from 'http';
import minimist from 'minimist';
import differenceWith from 'lodash.differencewith';
const debug = debugModule('node-api:server');

import models from '../../db/models';
import MySportsFeedsClient from '../../third-party/my-sports-feeds';

const SEASON_TYPES = {
  REGULAR: 'regular',
  POST: 'playoff',
};

const argv = minimist(process.argv.slice(2));
const season = parseInt(argv.season || argv.s || new Date().getFullYear(), 10);
const league = (argv.league || argv.l || 'NBA').toUpperCase();
const seasonType = (argv.type || argv.t || 'REGULAR').toUpperCase();
const now = new Date();

const getNumWins = (games, teamId) =>
  games.reduce((acc, game) => {
    if (game.schedule.playedStatus !== 'COMPLETED') return acc;
    const isHome = game.schedule.homeTeam.id === teamId;
    const didHomeWin = game.score.homeScoreTotal > game.score.awayScoreTotal;
    return acc + Boolean(isHome && didHomeWin || !isHome && !didHomeWin);
  }, 0);

async function populateSchedules() {
  const teams = await models.Team.findAll({ where: { league } });
  const playoffMatchups = {};
  const msfTeamIds = teams.reduce((ids, team) => ({ ...ids, [team.msfId]: team.id }), {});
  const msfSeason = seasonType === 'REGULAR' ? `${season - 1}-${season}` : season;
  const msfSeasonType = SEASON_TYPES[seasonType] || 'regular';
  const existingGames = await models.Game.findAll({ where: { league, season, seasonType } });
  console.log(`\n\nFound ${existingGames.length} existing games.`);
  const { games } = await MySportsFeedsClient.getData(league.toLowerCase(), `${msfSeason}-${msfSeasonType}`, 'seasonal_games', 'json', {});
  console.log(`\n\n\nFound ${games.length} games for ${season}.`);
  let number = 0;

  const newGameRows = [];
  const updateGameRows = [];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const completed = game.schedule.playedStatus === 'COMPLETED';
    let number = null;

    if (seasonType === 'POST') {
      const key = `${[game.schedule.homeTeam.id, game.schedule.awayTeam.id].sort()}`;
      if (!(key in playoffMatchups)) playoffMatchups[key] = [];

      if (!completed) {
        const homeWins = getNumWins(playoffMatchups[key], game.schedule.homeTeam.id);
        const awayWins = getNumWins(playoffMatchups[key], game.schedule.awayTeam.id);
        const mostWinsSoFar = Math.max(homeWins, awayWins);
        const minGamesLeft = 4 - Math.max(homeWins, awayWins);
        const numGamesScheduled = playoffMatchups[key].length + 1;
        const numGamesPlayed = homeWins + awayWins;
        if (minGamesLeft < numGamesScheduled - numGamesPlayed) continue;
      }

      playoffMatchups[key].push(game);
      number = playoffMatchups[key].length;
    }

    const existing = existingGames.find(g => g.msfId === game.schedule.id);

    (existing ? updateGameRows : newGameRows).push({
      league,
      season,
      seasonType,
      completed,
      homeScore: game.score.homeScoreTotal,
      awayScore: game.score.awayScoreTotal,
      number,
      startDate: game.schedule.startTime,
      msfId: game.schedule.id,
      homeTeamId: msfTeamIds[game.schedule.homeTeam.id],
      awayTeamId: msfTeamIds[game.schedule.awayTeam.id],
      createdAt: now,
      updatedAt: now,
    });
  }

  const createdGames = await models.Game.bulkCreate(newGameRows);

  if (updateGameRows.length > 0) await Promise.all(updateGameRows.map(row => models.Game.update(row, { where: { msfId: row.msfId } })));

  // Clean up invalid games
  if (existingGames.length > 0) {
    // Games in existingGames that are not in games (no longer scheduled)
    const gamesToDelete = differenceWith(existingGames, games, (exGame, newGame) => exGame.msfId === newGame.schedule.id);
    await models.Game.destroy({ where: { msfId: gamesToDelete.map(g => g.msfId) }, force: true });
    console.log(`\n\n\nSuccessfully destroyed ${gamesToDelete.length} games that are no longer scheduled.`);
  }

  console.log(`\n\n\nSuccessfully created ${newGameRows.length} total games and updated ${updateGameRows.length} games.`);
  process.exit();
}

populateSchedules();
