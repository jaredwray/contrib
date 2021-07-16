import { AppConfig } from '../config';

export async function isAuthorizedRequest(req, res) {
  if (req.body.key !== AppConfig.googleCloud.schedulerSecretKey) {
    res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
    return false;
  }
  return true;
}
