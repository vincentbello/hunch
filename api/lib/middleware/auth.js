import expressJwt from 'express-jwt';
import passport from 'passport';

const env = process.env.NODE_ENV || 'development';

export default function(req, res, next) {
  console.log('Operation name:', req.body.operationName);
  if (req.body.operationName === 'Login' && req.headers.access_token) {
    return passport.authenticate(process.env.FB_TOKEN_KEY, { session: false })(req, res, next);
  }

  return req.body.operationName === 'RefreshAuth' ? next() : expressJwt({
    secret: process.env.ACCESS_TOKEN_KEY,
    requestProperty: 'auth',
    getToken: req => req.headers['x-auth-token'] || null,
  })(req, res, next);
}
