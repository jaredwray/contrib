import { AuctionAttachment } from 'src/types/Auction';

interface AttachmentsStateInterface {
  images: { uploaded: AuctionAttachment[]; loading: File[] };
  videos: { uploaded: AuctionAttachment[]; loading: File[] };
}

export default AttachmentsStateInterface;
