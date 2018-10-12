import express from 'express';
import { Op } from 'sequelize';
import models from '../db/models';
import GameSerializer from '../serialization/Game';

const router = express.Router();

/* GET NBA games. */
router.get('/', function(req, res, next) {
  if (req.query.type !== 'upcoming') return res.sendStatus(400);
  const now = new Date(new Date().setFullYear(new Date().getFullYear() - 1)); // Date placeholder

  models.Game.findAll({
    where: {
      startDate: {
        [Op.gte]: now,
      },
      league: req.query.league,
    },
    limit: 15,
    order: [['startDate', 'ASC']],
    include: [
      { model: models.Team, as: 'homeTeam' },
      { model: models.Team, as: 'awayTeam' },
    ],
  }).then(games => res.json(games.map(game => new GameSerializer(game).serialize())));
});

export default router;
