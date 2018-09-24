import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import FacebookTokenStrategy from 'passport-facebook-token';

import models from './db/models';
import UserSerializer from './serialization/User';

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import usersRouter from './routes/users';

// Passport config
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
  models.User.findOrBuild({ where: { fbId: profile.id } }).spread((instance, initialized) => {
    const { id, gender, emails, photos, name: { familyName: lastName, givenName: firstName } } = profile;
    const newProfile = {
      fbId: id,
      gender,
      firstName,
      lastName,
      active: true,
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      currentLoginAt: new Date(),
      loginCount: initialized ? 1 : instance.loginCount + 1,
      // Access token: expires in 2 hours
      accessToken: jwt.sign({ id: instance.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: 60 * 120 }),
      // Refresh token: expires in 90 days
      refreshToken: jwt.sign({ id: instance.id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: 60 * 60 * 24 * 90 }),
    };

    if (gender.length > 0) newProfile.gender = gender;
    if (emails.length > 0) newProfile.email = emails[0].value;
    if (photos.length > 0) newProfile.imageUrl = photos[0].value;
    if (initialized) newProfile.createdAt = new Date();

    instance.update(newProfile).then(user => done(null, user));
  });
}));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Use cors
app.use(cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'r-auth-token'],
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

export default app;
