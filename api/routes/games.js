import express from 'express';
import models from '../db/models';
import GameSerializer from '../serialization/Game';

const router = express.Router();

/* GET completed games. */
router.get('/', function(req, res, next) {
  models.Game.findAll({
    where: { completed: true },
    include: [
      { model: models.Team, as: 'homeTeam' },
      { model: models.Team, as: 'awayTeam' },
    ],
  }).then(games => res.json(games.map(game => new GameSerializer(game).serialize())));
});

export default router;
