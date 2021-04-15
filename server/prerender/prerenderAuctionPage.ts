import { NextFunction, Request, Response } from 'express';
import { IAppServices } from '../app/AppServices';
import { AppConfig } from '../config';

export async function prerenderAuctionPage(services: IAppServices, req: Request, res: Response, next: NextFunction) {
  const auction = await services.auction.getAuction(req.params.auctionId);

  if (auction) {
    const auctionImageUrl =
      (auction.attachments.length && (auction.attachments[0].cloudflareUrl || auction.attachments[0].url)) || null;
    const facebookAppId = AppConfig.facebook.appId;
    return res.render('auction', { auction, auctionImageUrl, facebookAppId });
  }

  next();
}
