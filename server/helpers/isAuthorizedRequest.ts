import { AppConfig } from '../config';
import { AppLogger } from '../logger';

export function isAuthorizedRequest(req, res) {
  if (req.body?.key !== AppConfig.googleCloud.schedulerSecretKey) {
    res.status(401).send('UNAUTHORIZED');
    AppLogger.error(
      `Unauthorized request received!\nPath: ${req.route.path};\nBody: ${JSON.stringify(req.body, null, 2)}`,
    );
    return false;
  }
  return true;
}
