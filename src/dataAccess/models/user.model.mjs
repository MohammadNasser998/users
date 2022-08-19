import { DatabaseConnector } from '../connectors/index.mjs';
import { UserSchema } from './_schemas/index.mjs';
import { Tables } from '../../constants/index.mjs';

export const UserModel = DatabaseConnector.define(Tables.USERS, UserSchema, { underscored: true, timestamps: true });
