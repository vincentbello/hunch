import express from 'express';
import { endOfDay, max, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import models from '../db/models';
import GameSerializer from '../serialization/Game';

const router = express.Router();

/* GET NBA games. */
router.get('/upcoming', function(req, res, next) {
  if (!req.query.date || !req.query.league) return res.sendStatus(400);
  const { date, league } = req.query;
  const dateObj = new Date(date.substr(4), parseInt(date.substr(0, 2), 10) - 1, date.substr(2, 2));

  models.Game.findAll({
    where: {
      startDate: {
        [Op.gte]: max(startOfDay(dateObj), new Date()),
        [Op.lte]: endOfDay(dateObj),
      },
      league,
    },
    order: [['startDate', 'ASC']],
    include: [
      { model: models.Team, as: 'homeTeam' },
      { model: models.Team, as: 'awayTeam' },
    ],
  }).then(games => res.json(games.map(game => new GameSerializer(game).serialize())));
});

export default router;
