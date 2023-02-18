import { AuctionAttachment } from 'src/types/Auction';

interface AttachmentsStateInterface {
  uploaded: AuctionAttachment[];
  loading: File[];
}

export default AttachmentsStateInterface;
