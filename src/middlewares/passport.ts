import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { ConfigEnvironment } from '~/config/env';
import { logger } from '~/config/logger';
import { EAuthProvider, EUserGender } from '~/modules/auth/models/user.model';

import { UserService } from '~/modules/auth/services/user.service';
import { AppError } from '~/utils/app-error';

// config lay token o headers moi request
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ConfigEnvironment.jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await UserService.getById(jwtPayload.id);

      if (!user) {
        throw new AppError({
          id: 'middleware.passportjs',
          message: 'UNAUTHORIZE',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      if (user) return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }),
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: ConfigEnvironment.googleClientId,
      clientSecret: ConfigEnvironment.googleClientSecret,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value || '';

        logger.info('profile google', profile);

        if (!email)
          throw new AppError({
            id: 'middleware.passportjs',
            message: 'EMAIL_NOT_VALID',
            statusCode: StatusCodes.BAD_REQUEST,
          });

        const user = await UserService.registerBySocial(EAuthProvider.Google, {
          email,
          name: profile.displayName,
          gender: EUserGender.NA,
          username: email,
          password: '',
          phoneNumber: '',
          avatar: '',
          website: '',
          bio: '',
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

export default passport;
