#!/usr/bin/env node
import 'dotenv/config';
import { Op } from 'sequelize';
import debugModule from 'debug';
import http from 'http';
import minimist from 'minimist';
const debug = debugModule('node-api:server');

import models from '../../db/models';
import MySportsFeedsClient from '../../third-party/my-sports-feeds';
import Notification from '../../services/Notification';
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
        ...game.toJSON(),
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

  const hunches = await models.Hunch.findAll({
    where: {
      active: true,
      gameId: {
        [Op.or]: updatedGameIds,
      },
    },
    include: [
      { model: models.User, as: 'bettor' },
      { model: models.User, as: 'bettee' },
    ],
  });

  console.log(`\n\n\nFound ${hunches.length} hunches to update.`);

  for (let i = 0; i < hunches.length; i++) {
    const hunch = hunches[i];
    const updatedGame = updatedGames[hunch.gameId];
    const didHomeTeamWin = updatedGame.attrs.homeScore > updatedGame.attrs.awayScore;
    const winningTeamId = didHomeTeamWin ? updatedGame.homeTeam.id : updatedGame.awayTeam.id;
    const winningTeam = didHomeTeamWin ? updatedGame.homeTeam : updatedGame.awayTeam;
    const losingTeam = didHomeTeamWin ? updatedGame.awayTeam : updatedGame.homeTeam;
    const winner = winningTeamId === hunch.bettorPickTeamId ? hunch.bettor : hunch.bettee;
    const loser = winningTeamId === hunch.bettorPickTeamId ? hunch.bettee : hunch.bettor;

    await models.Hunch.update({
      active: false,
      winnerId: winner.id,
      resolvedAt: now,
      updatedAt: now,
    }, { where: { id: hunch.id } });
    console.log(`\n\nResolved hunch ${hunch.id}`);

    // Get device tokens
    const devices = await models.Device.findAll({
      where: {
        userId: {
          [Op.or]: [winner.id, loser.id],
        },
        allowedNotifications: true,
      },
      include: [{ model: models.User, as: 'user' }],
    });

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      const didWinHunch = device.user.id === winner.id;
      const gameResultText = `The ${winningTeam.lastName} beat the ${losingTeam.lastName}.`;
      const winnerNotificationHeader = `🎉 You won your Hunch!`;
      const loserNotificationHeader = `😤 You lost your Hunch.`;
      const winnerNotificationText = `${loser.firstName} owes you $${hunch.amount}!`;
      const loserNotificationText = `Pay up! You owe ${winner.firstName} $${hunch.amount}.`;
      const notificationHeader = didWinHunch ? winnerNotificationHeader : loserNotificationHeader;
      const notificationBody = `${gameResultText} ${didWinHunch ? winnerNotificationText : loserNotificationText}`;

      const notification = new Notification({
        alert: notificationHeader,
        title: notificationHeader,
        body: notificationBody,
        payload: { hunchId: hunch.id },
      });
      console.log(`\n\nSending notification to ${device.user.fullName}`);
      const result = await notification.send(device.token);
      console.log(`\n\nSuccessfully sent notification to ${device.user.fullName}!`);
    }
    // TODO: Batch winner and loser tokens
  }
  console.log(`Found ${hunches.length} hunches.`);
  process.exit();
};

pollGames();
