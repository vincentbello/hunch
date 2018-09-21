import express from 'express';
import models from '../db/models';
import UserSerializer from '../serialization/User';

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.User.findAll().then((users) => {
    res.json(users.map(user => new UserSerializer(user).serialize()));
  });
});

export default router;
