import express from 'express';
import { addMonths, endOfDay, max, parse, startOfDay, subYears } from 'date-fns';
import { Op } from 'sequelize';
import models from '../db/models';
import GameSerializer from '../serialization/Game';

const router = express.Router();

/* GET NBA games. */
router.get('/upcoming', function(req, res, next) {
  if (!req.query.date || !req.query.league) return res.sendStatus(400);
  const { date, league } = req.query;
  const dateObj = new Date(date.substr(4), parseInt(date.substr(0, 2), 10) - 1, date.substr(2, 2));
  const targetDate = subYears(addMonths(dateObj, 1), 1); // Offset for testing
  const now = subYears(addMonths(new Date(), 1), 1); // Offset for testing

  models.Game.findAll({
    where: {
      startDate: {
        [Op.gte]: max(startOfDay(targetDate), now),
        [Op.lte]: endOfDay(targetDate),
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
