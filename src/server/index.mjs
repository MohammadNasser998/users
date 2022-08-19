import '../dataAccess/index.mjs';
import { app } from './express.mjs';

try {
  app.listen(AppConfigs.port, err => {
    Logger.info('app::initExpress', `users service running on port ${AppConfigs.port}`);
    if (err) throw err;
  });
} catch (ex) {
  Logger.error('app::initExpress', ex.message, undefined, ex);
  process.exit(-1);
}
