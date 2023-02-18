import { AppConfig } from '../config';
import { AppLogger } from '../logger';

export function isAuthorizedRequest(req, res) {
  if (req.body?.key === AppConfig.googleCloud.schedulerSecretKey) return true;

  AppLogger.error(
    `Unauthorized request received!\nPath: ${req.route.path};\nBody: ${JSON.stringify(req.body, null, 2)}`,
  );
  res.status(401).send('UNAUTHORIZED');

  return false;
}
