import express from 'express';
import { Op } from 'sequelize';
import models from '../db/models';
import BetSerializer from '../serialization/Bet';

const router = express.Router();

/* GET active bets for the authenticated user. */
router.get('/', function(req, res, next) {
  if (!['active', 'completed', 'requested'].includes(req.query.type)) return res.sendStatus(400);

  const where = {
    active: {
      active: true,
      [Op.or]: [
        { bettorId: req.auth.id },
        { betteeId: req.auth.id },
      ],
    },
    completed: {
      accepted: true,
      active: false,
      [Op.or]: [
        { bettorId: req.auth.id },
        { betteeId: req.auth.id },
      ],
    },
    requested: {
      betteeId: req.auth.id,
      responded: false,
    },
  }[req.query.type];

  models.Bet.findAll({
    where,
    include: [
      { model: models.Game, as: 'game' },
      { model: models.User, as: 'bettor' },
      { model: models.User, as: 'bettee' },
    ],
  }).then(bets => res.json(bets.map(bet => new BetSerializer(bet).serialize())));
});

router.post('/', function(req, res, next) {
  const { betteeId, amount, gameId, bettorPickTeamId, type } = req.body;
  models.Bet.create({
    type,
    amount,
    wager: 'Here is a fun bet!', // Placeholder
    active: false,
    gameId,
    bettorId: req.auth.id,
    betteeId: betteeId,
    bettorPickTeamId,
  }).then(bet => res.json(new BetSerializer(bet).serialize()));
});

function getBet(req, res, next) {
  models.Bet.findById(req.params.betId, {
    include: [
      { model: models.Game, as: 'game' },
      { model: models.User, as: 'bettor' },
      { model: models.User, as: 'bettee' },
    ],
  }).then(bet => res.json(new BetSerializer(bet).serialize()));
}

router.patch('/:betId/response', function(req, res, next) {
  const { accepted } = req.body;
  models.Bet.update({ accepted, active: accepted, responded: true }, { where: { id: req.params.betId } })
    .then(() => getBet(req, res, next));
});

/** Get a specific bet by ID */
router.get('/:betId', getBet);

export default router;
