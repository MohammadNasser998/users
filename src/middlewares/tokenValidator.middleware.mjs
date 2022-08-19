import jsonWebToken from 'jsonwebtoken';
import { StatusCode } from '../constants/statusCodes.const.mjs';

export const tokenValidator = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(StatusCode.UNAUTHORIZED);
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(StatusCode.UNAUTHORIZED);

  try {
    req.user = jsonWebToken.verify(token, AppConfigs.security.token.secret);
  } catch {
    return res.sendStatus(StatusCode.UNAUTHORIZED);
  }
  next();
};
