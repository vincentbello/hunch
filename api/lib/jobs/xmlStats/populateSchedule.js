#!/usr/bin/env node
import 'dotenv/config';
import debugModule from 'debug';
import http from 'http';
import minimist from 'minimist';
const debug = debugModule('node-api:server');

import XmlStatsClient from '../../third-party/xml-stats';
import models from '../../db/models';
import sleep from '../../utils/sleep';

const argv = minimist(process.argv.slice(2));
const season = parseInt(argv.season || argv.s || new Date().getFullYear(), 10);
const league = (argv.league || argv.l || 'NBA').toUpperCase();
const now = new Date();

async function populateSchedules() {
  const allGameIds = [];
  const teams = await models.Team.findAll({ where: { league } });
  const xmlStatTeamIds = teams.reduce((ids, team) => ({ ...ids, [team.xmlStatsId]: team.id }), {});

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const games = await XmlStatsClient.fetchGames(league, team.xmlStatsId, season);
    console.log(`\n\n\nFound ${games.length} games for ${team.lastName}`);

    const gameRows = games.reduce((rows, game) => {
      if (allGameIds.includes(game.event_id)) return rows;
      allGameIds.push(game.event_id);
      const completed = game.event_status === 'completed';
      const isHome = game.team_event_location_type === 'h';
      const homeTeamId = xmlStatTeamIds[isHome ? game.team.team_id : game.opponent.team_id];
      const awayTeamId = xmlStatTeamIds[isHome ? game.opponent.team_id : game.team.team_id];
      const homeScore = isHome ? game.team_points_scored : game.opponent_points_scored;
      const awayScore = isHome ? game.opponent_points_scored : game.team_points_scored;

      return [...rows, {
        league,
        season,
        seasonType: game.event_season_type.toUpperCase(),
        completed,
        homeScore: homeScore >= 0 ? homeScore : null,
        awayScore: awayScore >= 0 ? awayScore : null,
        startDate: new Date(game.event_start_date_time),
        xmlStatsId: game.event_id,
        homeTeamId,
        awayTeamId,
        createdAt: now,
        updatedAt: now,
      }];
    });
    const createdGames = await models.Game.bulkCreate(gameRows);
    console.log(`\n\n\nSuccessfully created ${createdGames.length} games for the ${team.lastName}.`)

    if (i < teams.length - 1) {
      console.log('\n\n\nWaiting 10 seconds for the next team...');
      await sleep(10 * 1000); // 10 seconds
    }
  }

  console.log(`\n\n\nSuccessfully created ${allGameIds.length} total games.`);
}

populateSchedules();
