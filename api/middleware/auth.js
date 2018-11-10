import expressJwt from 'express-jwt';
import passport from 'passport';

const env = process.env.NODE_ENV || 'development';

export default function(req, res, next) {
  if (req.headers.access_token) {
    return passport.authenticate(process.env.FB_TOKEN_KEY, { session: false });
  }

  if (env === 'development') {
    console.log('REQ HEADERS', req.headers);
    req.auth = { id: 4 };
    return next();
  }

  return expressJwt({
    secret: process.env.ACCESS_TOKEN_KEY,
    requestProperty: 'auth',
    getToken: req => req.headers['x-auth-token'] || null,
  });
}
