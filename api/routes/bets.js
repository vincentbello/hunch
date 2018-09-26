import express from 'express';
import { Op } from 'sequelize';
import models from '../db/models';
import BetSerializer from '../serialization/Bet';

const router = express.Router();

/* GET active bets for the authenticated user. */
router.get('/active', function(req, res, next) {
  models.Bet.findAll({
    where: {
      active: true,
      [Op.or]: [
        { bettorId: req.auth.id },
        { betteeId: req.auth.id },
      ],
    },
    include: [
      { model: models.Game, as: 'game' },
      { model: models.User, as: 'bettor' },
      { model: models.User, as: 'bettee' },
    ],
  }).then(bets => res.json(bets.map(bet => new BetSerializer(bet).serialize())));
});

export default router;
