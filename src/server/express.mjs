import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import morganLogger from '../logger/morganLogger.mjs';
import { UserRouter } from './../routers/index.mjs';
import { StatusCode } from '../constants/statusCodes.const.mjs';

Logger.info('app::initExpress', 'express app init');
export const app = express();
app.set('showStackError', true);

Logger.info('app::initExpress', 'express app init middleware');
app.use(express.json());
app.use(morganLogger(true));
app.use(morganLogger());
app.use(cors({ origin: AppConfigs.cors.origin }));
app.use(helmet());

Logger.info('app::initExpress', 'express app init routes');
app.use('/api/v1/users', UserRouter);

app.use((err, req, res, next) => {
  Logger.error(err);
  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: err.message, stack: err.stack });
});
