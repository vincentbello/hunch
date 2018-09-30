import express from 'express';
import models from '../db/models';
import UserSerializer from '../serialization/User';

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.query.type !== 'friends') return res.sendStatus(400);

  models.User.findAll({ where: { active: true } }).then(users => {
    res.json(users.map(user => new UserSerializer(user).serialize()));
  });
});

export default router;
