import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { ConfigEnvironment } from '~/config/env';

import { EAuthProvider } from '~/modules/auth/models/auth.model';
import { AuthService } from '~/modules/auth/services/auth.service';
import { AppError } from '~/utils/app-error';

// config lay token o headers moi request
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ConfigEnvironment.jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await AuthService.getById(jwtPayload.id);

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

        if (!email)
          throw new AppError({
            id: 'middleware.passportjs',
            message: 'EMAIL_NOT_VALID',
            statusCode: StatusCodes.BAD_REQUEST,
          });

        const user = await AuthService.registerBySocial({
          data: { email, name: profile.displayName, password: '' },
          providerId: profile.id,
          provider: EAuthProvider.Google,
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

export default passport;
