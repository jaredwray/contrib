import { AuctionAttachment } from '../../../types/Auction';

export default function useAuctionPreviewAttachment(attachments: AuctionAttachment[]): string {
  if (attachments?.length) {
    const [previewAttachment] = attachments;
    if (previewAttachment.type === 'VIDEO') {
      return `${previewAttachment.thumbnail}?width=800`;
    }
    return previewAttachment.url;
  }
  return '/content/img/default-auction-preview.webp';
}
