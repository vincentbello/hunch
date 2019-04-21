import jwt from 'jsonwebtoken';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';

import models from '../db/models';

export default () => {
  // Passport config
  passport.use(new FacebookTokenStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    profileFields: ['id', 'displayName', 'name', 'emails', 'friends'],
  }, (fbAccessToken, refreshToken, profile, done) => {
    models.User.findOrBuild({ where: { fbId: profile.id } }).spread((instance, initialized) => {
      const { id, gender, emails, photos, name: { familyName: lastName, givenName: firstName }, friends, _json } = profile;
      const newProfile = {
        fbId: id,
        fbAccessToken,
        gender,
        firstName,
        lastName,
        active: true,
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        currentLoginAt: new Date(),
        loginCount: initialized ? 1 : instance.loginCount + 1,
      };

      if (gender.length > 0) newProfile.gender = gender;
      if (emails.length > 0) newProfile.email = emails[0].value;
      if (photos.length > 0) newProfile.imageUrl = photos[0].value;
      if (initialized) newProfile.createdAt = new Date();

      instance.update(newProfile).then((user) => user.update({
        // Access token: expires in 2 hours
        accessToken: jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: 60 * 120 }),
        // Refresh token: expires in 90 days
        refreshToken: jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: 60 * 60 * 24 * 90 }),
      }).then(newUser => {
        const friends = _json.friends ? _json.friends.data : [];
        models.User.populateFbFriendships(newUser.id, friends.map(friend => friend.id));
        return done(null, newUser);
      }));
    });
  }));
};
