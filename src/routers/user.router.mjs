import expressRouter from 'express-async-router';

import { tokenValidator } from '../middlewares/index.mjs';
import { UserRouteSchema } from './_schemas/index.mjs';
import { UserRepo } from '../dataAccess/index.mjs';
import { StatusCode } from '../constants/index.mjs';
export const UserRouter = new expressRouter.AsyncRouter({ mergeParams: true });

UserRouter.post('/register', UserRouteSchema.create, async (req, res) => {
  const created = await UserRepo.create(req.body);
  if (!created) return res.status(StatusCode.CONFLICT).json({ errors: { message: 'email or username already exist!' } });

  res.status(StatusCode.CREATED).json(created);
});

UserRouter.post('/login', UserRouteSchema.login, async (req, res) => {
  const user = await UserRepo.login(req.body);
  if (user === undefined)
    return res.status(StatusCode.UNAUTHORIZED).send({
      errors: { message: 'invalid email or password!' },
    });
  res.json(user);
});

UserRouter.put('/', [tokenValidator, UserRouteSchema.update], async (req, res) => {
  const updated = await UserRepo.update(req.user.id, req.body);
  if (!updated) return res.status(StatusCode.CONFLICT).json({ errors: { message: 'something went wrong!' } });

  res.status(StatusCode.OK).json(updated);
});

UserRouter.delete('/', tokenValidator, async (req, res) => res.status(StatusCode.NO_CONTENT).json(await UserRepo.delete(req.user.id)));

UserRouter.get('/', tokenValidator, async (req, res) => res.status(StatusCode.OK).json(await UserRepo.get(req.user.id)));
