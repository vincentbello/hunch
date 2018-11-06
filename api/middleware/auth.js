import expressJwt from 'express-jwt';
const env = process.env.NODE_ENV || 'development';

export default function(req, res, next) {
  if (env === 'development') {
    req.auth = { id: 4 };
    return next();
  }

  return expressJwt({
    secret: process.env.ACCESS_TOKEN_KEY,
    requestProperty: 'auth',
    getToken: req => req.headers['x-auth-token'] || null,
  });
}
