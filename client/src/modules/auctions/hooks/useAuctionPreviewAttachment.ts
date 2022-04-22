import { AuctionAttachment } from 'src/types/Auction';

export default function useAuctionPreviewAttachment(attachments: AuctionAttachment[]): string {
  if (!attachments?.length) return '/content/img/default-auction-preview.webp';

  const [previewAttachment] = attachments;

  if (previewAttachment.type === 'VIDEO') return `${previewAttachment.thumbnail}?width=800`;

  return previewAttachment.url;
}
