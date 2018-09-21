import express from 'express';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import models from '../db/models';
import UserSerializer from '../serialization/User';

const router = express.Router();

const authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: req => req.headers['x-auth-token'] || null,
});

router.route('/facebook').post(passport.authenticate('facebook-token', { session: false }), function(req, res, next) {
  if (!req.user) return res.send(401, 'Not authenticated!');

  // Prepare token for API
  req.auth = { id: req.user.id };

  // Generate token
  req.token = jwt.sign({ id: req.auth.id }, 'my-secret', { expiresIn: 60 * 120 });

  // Send token
  res.setHeader('x-auth-token', req.token);
  res.json(new UserSerializer(req.user).serialize());
});

router.get('/me', authenticate, function(req, res, next) {
  models.User.findById(req.auth.id).then(user => {
    req.user = user;
    res.json(new UserSerializer(user).serialize());
  })
});

export default router;
