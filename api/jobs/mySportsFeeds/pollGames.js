#!/usr/bin/env node
import 'dotenv/config';
import { Op } from 'sequelize';
import debugModule from 'debug';
import http from 'http';
import minimist from 'minimist';
const debug = debugModule('node-api:server');

import models from '../../db/models';
import MySportsFeedsClient from '../../third-party/my-sports-feeds';
import sleep from '../../utils/sleep';

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
    include: [
      { model: models.Team, as: 'homeTeam' },
      { model: models.Team, as: 'awayTeam' },
    ],
  });
  console.log(`\n\n\nFound ${games.length} games to update.`);

  let requestCounter = 0;
  const updatedGames = [];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    let boxscore;
    const msfClientParams = [
      game.league.toLowerCase(),
      `${game.season - 1}-${game.season}-${game.seasonType.toLowerCase()}`,
      'game_boxscore',
      'json',
      { game: game.msfId, force: true },
    ];

    try {
      boxscore = await MySportsFeedsClient.getData(...msfClientParams);
      requestCounter++;
      console.log(`\n\n\nFound box score for ${game.msfId}.`);
    } catch (err) {
      console.log(`${err.response.status === 404 ? 'No box score yet' : 'An error occurred'} for ${game.msfId}.`);

      if (i < games.length - 1) {
        console.log('\n\n\nWaiting 10 seconds for the next game...');
        await sleep(10 * 1000); // 10 seconds
      }

      continue;
    }

    try {
      const newData = {
        ...game,
        attrs: {
          completed: boxscore.game.playedStatus === 'COMPLETED',
          homeScore: boxscore.scoring.homeScoreTotal,
          awayScore: boxscore.scoring.awayScoreTotal,
          updatedAt: now,
        },
      };
      await models.Game.update(newData.attrs, { where: { id: game.id } });
      updatedGames[game.id] = newData;
    } catch (err) {
      console.log(`Error updating game ${game.id}.`, err);
    }

    if (i < games.length - 1) {
      console.log('\n\n\nWaiting 10 seconds for the next game...');
      await sleep(10 * 1000); // 10 seconds
    }

    if (requestCounter >= 200) {
      console.log('\n\n\nWaiting 5 minutes to make requests again...');
      await sleep(5 * 60 * 1000); // 5 minutes
      requestCounter = 0;
    }
  }

  const updatedGameIds = Object.keys(updatedGames);
  console.log(`\n\n\nSuccessfully updated ${updatedGameIds.length} games.`);

  const bets = await models.Bet.findAll({
    where: {
      gameId: {
        [Op.or]: updatedGameIds,
      },
    },
  });

  for (let i = 0; i < bets.length; i++) {
    const bet = bets[i];
    const updatedGame = updatedGames[bet.gameId];
    const winningTeamId = updatedGame.attrs.homeScore > updatedGame.attrs.awayScore ? updatedGame.homeTeamId : updatedGame.awayTeamId;
    const winnerId = winningTeamId === bet.bettorPickTeamId ? bet.bettorId : bet.betteeId;
    const loserId = winningTeamId === bet.bettorPickTeamId ? bet.betteeId : bet.bettorId;
    await models.Bet.update({
      active: false,
      winnerId,
      resolvedAt: now,
      updatedAt: now,
    }, { where: { id: bet.id } });
    // TODO: Notify winnerId
    // TODO: Notify loserId
  }
  console.log(`Found ${bets.length} bets.`);
};

pollGames();
