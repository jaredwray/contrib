import { NextFunction, Request, Response } from 'express';
import { IAppServices } from '../app/AppServices';
import { AppConfig } from '../config';
import { isCrawler } from './isCrawler';

export async function prerenderAuctionPage(
  services: IAppServices,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!isCrawler(req)) return next();

  const auction = await services.auctionService.getAuction(req.params.auctionId);
  if (!auction) return;

  const auctionImageUrl =
    (auction.attachments.length && (auction.attachments[0].cloudflareUrl || auction.attachments[0].url)) || null;
  const facebookAppId = AppConfig.facebook.appId;
  return res.render('auction', { auction, auctionImageUrl, facebookAppId });
}
