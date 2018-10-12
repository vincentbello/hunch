#!/usr/bin/env node
import 'dotenv/config';
import { Op } from 'sequelize';
import debugModule from 'debug';
import http from 'http';
import minimist from 'minimist';
const debug = debugModule('node-api:server');

import XmlStatsClient from '../third-party/xml-stats';
import models from '../db/models';
import sleep from '../utils/sleep';

const argv = minimist(process.argv.slice(2));
const league = (argv.league || argv.l || 'NBA').toUpperCase();
const now = new Date();

async function pollGames() {
  const games = await models.Game.findAll({
    where: {
      completed: false,
      startDate: {
        [Op.lte]: now,
      },
    },
  });

  const updatedIds = [];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    let boxscore;

    try {
      boxscore = await XmlStatsClient.fetchGame(game.league, game.xmlStatsId);
      console.log(`\n\n\nFound box score for ${game.xmlStatsId}.`);
    } catch (err) {
      console.log(`${err.response.status === 404 ? 'No box score yet' : 'An error occurred'} for ${game.xmlStatsId}.`);

      if (i < games.length - 1) {
        console.log('\n\n\nWaiting 10 seconds for the next game...');
        await sleep(10 * 1000); // 10 seconds
      }

      continue;
    }

    try {
      await models.Game.update({
        completed: true,
        homeScore: boxscore.home_totals.points,
        awayScore: boxscore.away_totals.points,
        updatedAt: now,
      }, { where: { id: game.id } });
      updatedIds.push(game.id);
    } catch (err) {
      console.log(`Error updating game ${game.id}.`, err);
    }

    if (i < games.length - 1) {
      console.log('\n\n\nWaiting 10 seconds for the next game...');
      await sleep(10 * 1000); // 10 seconds
    }
  }

  // TODO: Resolve bets!

  console.log(`\n\n\nSuccessfully updated ${updatedIds.length} games.`)
}

pollGames();
