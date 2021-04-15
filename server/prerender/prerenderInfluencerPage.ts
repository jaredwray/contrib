import { NextFunction, Request, Response } from 'express';
import { IAppServices } from '../app/AppServices';
import { AppConfig } from '../config';

export async function prerenderInfluencerPage(services: IAppServices, req: Request, res: Response, next: NextFunction) {
  const influencer = await services.influencer.findInfluencer(req.params.influencerId);
  if (influencer) {
    const profileLink = `${AppConfig.app.url}/profiles/${influencer.id}`;
    const facebookAppId = AppConfig.facebook.appId;
    return res.render('influencer', { influencer, profileLink, facebookAppId });
  }
  next();
}
