#!/usr/bin/env node
import 'dotenv/config';
import debugModule from 'debug';
import http from 'http';
import minimist from 'minimist';
const debug = debugModule('node-api:server');

import models from '../../db/models';
import MySportsFeedsClient from '../../third-party/my-sports-feeds';

const argv = minimist(process.argv.slice(2));
const season = parseInt(argv.season || argv.s || new Date().getFullYear(), 10);
const league = (argv.league || argv.l || 'NBA').toUpperCase();
const now = new Date();

async function populateSchedules() {
  const teams = await models.Team.findAll({ where: { league } });
  const msfTeamIds = teams.reduce((ids, team) => ({ ...ids, [team.msfId]: team.id }), {});

  const { games } = await MySportsFeedsClient.getData(league.toLowerCase(), `${season - 1}-${season}-regular`, 'seasonal_games', 'json', {});
  console.log(`\n\n\nFound ${games.length} games for ${season}.`);
  const gameRows = games.map((game) => ({
    league,
    season,
    seasonType: 'REGULAR',
    completed: game.schedule.playedStatus === 'COMPLETED',
    homeScore: game.score.homeScoreTotal,
    awayScore: game.score.awayScoreTotal,
    startDate: game.schedule.startTime,
    msfId: game.schedule.id,
    homeTeamId: msfTeamIds[game.schedule.homeTeam.id],
    awayTeamId: msfTeamIds[game.schedule.awayTeam.id],
    createdAt: now,
    updatedAt: now,
  }));

  const createdGames = await models.Game.bulkCreate(gameRows);
  console.log(`\n\n\nSuccessfully created ${gameRows.length} total games.`);
  process.exit();
}

populateSchedules();
