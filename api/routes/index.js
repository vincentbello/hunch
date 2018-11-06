import express from 'express';
import Sequelize, { Op } from 'sequelize';
import models from '../db/models';

const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const users = await models.findAll({
    where: {
      active: true,
      id: {
        [Op.ne]: 4,
      },
    },
  });
  res.sendStatus(200);
});

export default router;
