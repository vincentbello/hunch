import express from 'express';
import models from '../db/models';
import GameSerializer from '../serialization/Game';

const router = express.Router();

/* GET NBA games. */
router.get('/', function(req, res, next) {
  if (req.query.type !== 'upcoming') return res.sendStatus(400);

  models.Game.findAll({
    where: { league: req.query.league },
    include: [
      { model: models.Team, as: 'homeTeam' },
      { model: models.Team, as: 'awayTeam' },
    ],
  }).then(games => res.json(games.map(game => new GameSerializer(game).serialize())));
});

export default router;
