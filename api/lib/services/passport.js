import jwt from 'jsonwebtoken';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';

import FB from './facebook';
import models from '../db/models';

export default () => {
  // Passport config
  passport.use(new FacebookTokenStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    profileFields: ['id', 'displayName', 'name', 'emails', 'friends'],
  }, (fbToken, refreshToken, profile, done) => {
    models.User.findOrBuild({ where: { fbId: profile.id } }).spread((instance, initialized) => {
      const { id, gender, emails, photos, name: { familyName: lastName, givenName: firstName }, friends, _json } = profile;

      FB.api('oauth/access_token', {
        client_id: process.env.FB_CLIENT_ID,
        client_secret: process.env.FB_CLIENT_SECRET,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: fbToken,
      }, function (res) {
        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        }

        const fbAccessToken = res.access_token;
        console.log(res);
        var fbExpiresAt = res.expires ? res.expires : 0;
        console.log('TOKENS', fbToken, fbAccessToken, fbExpiresAt);

        const newProfile = {
          fbId: id,
          fbAccessToken,
          gender,
          firstName,
          lastName,
          active: true,
          fbExpiresAt,
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
          models.User.populateFbFriendships(newUser.id, _json.friends.data.map(friend => friend.id));
          return done(null, newUser);
        }));
      });
    });
  }));
};
