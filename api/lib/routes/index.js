import express from 'express';
import path from 'path';
import Sequelize, { Op } from 'sequelize';
import models from '../db/models';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendStatus(200);
});

/** GET privacy policy. */
router.get('/privacy', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'privacy_policy.html'));
});

export default router;
