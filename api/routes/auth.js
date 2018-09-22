import express from 'express';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import models from '../db/models';
import UserSerializer from '../serialization/User';

const router = express.Router();

// Authenticate all requests
const authenticate = expressJwt({
  secret: 'my-secret-access-token',
  requestProperty: 'auth',
  getToken: req => req.headers['x-auth-token'] || null,
});

// Log out, revoke access by destroying the user tokens
router.post('/revoke', authenticate, function (req, res, next) {
  const { userId } = req.body;
  if (userId !== req.auth.id) return res.sendStatus(401);

  models.User.findById(req.auth.id).then(user => {
    user.set('accessToken', '');
    user.set('refreshToken', '');
    user.save().then(() => res.sendStatus(200));
  });
});

// Authenticate and retrieve the access token in exchange of the refresh token
// router.post('/refresh', );

// Authenticate and retrieve the access and refresh tokens via FB auth
router.route('/facebook').post(passport.authenticate('facebook-token', { session: false }), function(req, res, next) {
  if (!req.user) return res.send(401, 'Not authenticated!');

  // Prepare token for API
  req.auth = { id: req.user.id };

  // Send tokens
  res.setHeader('x-auth-token', req.user.accessToken);
  res.setHeader('r-auth-token', req.user.refreshToken);
  res.json(new UserSerializer(req.user).serialize());
});

// Refresh auth
router.post('/refresh', authenticate, function(req, res, next) {
  const { refreshToken } = req.body;
  models.User.findById(req.auth.id).then(user => {
    if (refreshToken !== user.refreshToken) return res.sendStatus(401);

    // Refresh access token
    user.set('accessToken', jwt.sign({ id: user.id }, 'my-secret-access-token', { expiresIn: 60 * 120 }));
    user.save().then(updatedUser => {
      req.user = updatedUser;

      res.setHeader('x-auth-token', req.user.accessToken);
      res.setHeader('r-auth-token', req.user.refreshToken);
      res.json(new UserSerializer(user).serialize());
    });
  })
});

export default router;
