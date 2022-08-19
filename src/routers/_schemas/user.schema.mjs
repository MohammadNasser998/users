import Joi from 'joi';
import { schemaValidator } from '../../middlewares/schemaValidator.middleware.mjs';

export const UserRouteSchema = {
  create: schemaValidator.body(
    Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      userName: Joi.string().required(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().required(),
      features: Joi.object(),
    })
  ),
  login: schemaValidator.body(
    Joi.object({
      userName: Joi.string(),
      email: Joi.string().email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }).or('email', 'userName')
  ),
  update: schemaValidator.body(
    Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      userName: Joi.string(),
      email: Joi.string().email({ tlds: { allow: false } }),
      oldPassword: Joi.string(),
      newPassword: Joi.string(),
    }).and('oldPassword', 'newPassword')
  ),
};
