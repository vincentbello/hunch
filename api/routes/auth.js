import express from 'express';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import models from '../db/models';
import authMiddleware from '../middleware/auth';
import UserSerializer from '../serialization/User';

const router = express.Router();
const now = new Date();

router.post('/device', authMiddleware, function (req, res, next) {
  const { os, token } = req.body;
  console.log('DEVICE TOKEN', token);
  models.Device.findOrBuild({ where: { userId: req.auth.id, token } }).spread((instance, initialized) => {
    if (!initialized) return res.sendStatus(200);

    instance.update({
      type: os.toUpperCase(),
      token,
      allowedNotifications: true, // Placeholder
      userId: req.auth.id,
      createdAt: now,
      updatedAt: now,
    }).then(res.sendStatus(200));
  });
});

// Log out, revoke access by destroying the user tokens
router.post('/revoke', authMiddleware, function (req, res, next) {
  const { userId } = req.body;
  if (userId !== req.auth.id) return res.sendStatus(401);

  models.User.findById(req.auth.id).then(user => {
    user.set('accessToken', '');
    user.set('refreshToken', '');
    user.save().then(() => res.sendStatus(200));
  });
});

// Authenticate and retrieve the access and refresh tokens via FB auth
router.route('/facebook').post(passport.authenticate(process.env.FB_TOKEN_KEY, { session: false }), function(req, res, next) {
  if (!req.user) return res.send(401, 'Not authenticated!');

  // Prepare token for API
  req.auth = { id: req.user.id };

  // Send tokens
  res.setHeader('x-auth-token', req.user.accessToken);
  res.setHeader('r-auth-token', req.user.refreshToken);
  res.json(new UserSerializer(req.user).serialize());
});

// Authenticate and retrieve the access token in exchange of the refresh token
router.post('/refresh', function(req, res, next) {
  const { refreshToken } = req.body;
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    if (!decoded.id) return res.sendStatus(401);
  } catch (err) {
    return res.sendStatus(401);
  }

  models.User.findById(decoded.id).then(user => {
    if (user === null || refreshToken !== user.refreshToken) return res.sendStatus(401);

    // Refresh access token
    user.set('accessToken', jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: 60 * 120 }));
    user.save().then(updatedUser => {
      req.user = updatedUser;

      res.setHeader('x-auth-token', req.user.accessToken);
      res.setHeader('r-auth-token', req.user.refreshToken);
      res.json(new UserSerializer(user).serialize());
    });
  })
});

export default router;
