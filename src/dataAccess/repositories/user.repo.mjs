import { UserModel } from './../models/index.mjs';
import { PasswordHelper, JwtHelper } from './../../helpers/index.mjs';
import { PublicAttributes } from '../../constants/index.mjs';

export const UserRepo = {
  create: async claim => {
    const hash = await PasswordHelper.hash(claim.password);
    try {
      const result = await UserModel.create({
        firstName: claim.firstName,
        lastName: claim.lastName,
        userName: claim.userName,
        email: claim.email.toLowerCase(),
        password: hash,
      });

      return {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        userName: result.userName,
        email: result.email,
      };
    } catch (err) {
      if (err.message === 'Validation error') {
        return undefined;
      }
      throw err;
    }
  },
  login: async claim => {
    const where = claim.userName ? { userName: claim.userName } : { email: claim.email };

    const user = await UserModel.findOne({
      where: where,
    });

    if (user === null) throw new Error('User does not exist!');
    const verify = await PasswordHelper.verify(claim.password, user.password);
    if (!verify) return undefined;

    const signUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const token = await JwtHelper.sign(signUser);

    return {
      userId: user.id,
      token,
    };
  },
  update: async (id, claim) => {
    const updateUser = {
      firstName: claim.firstName ? claim.firstName : undefined,
      lastName: claim.lastName ? claim.lastName : undefined,
      userName: claim.userName ? claim.userName : undefined,
      email: claim.email ? claim.email : undefined,
    };
    const dbObj = await UserModel.findByPk(id);

    if (claim.oldPassword && claim.newPassword) {
      const verify = await PasswordHelper.verify(claim.oldPassword, dbObj.password);
      if (!verify) return undefined;

      const hashedPassword = await PasswordHelper.hash(claim.newPassword);

      updateUser.password = hashedPassword;
    }

    const updated = await dbObj.update(updateUser);

    return {
      firstName: updated.firstName,
      lastName: updated.lastName,
      userName: updated.userName,
      email: updated.email,
    };
  },
  delete: async id => UserModel.destroy({ where: { id } }),
  get: async id =>
    UserModel.findOne({
      attributes: PublicAttributes,
      where: { id },
    }),
};
