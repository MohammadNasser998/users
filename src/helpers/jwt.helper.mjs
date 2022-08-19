import jsonWebToken from 'jsonwebtoken';

export const JwtHelper = {
  sign: async claim => jsonWebToken.sign(claim, AppConfigs.security.token.secret, { expiresIn: AppConfigs.security.token.expiry }),
};
