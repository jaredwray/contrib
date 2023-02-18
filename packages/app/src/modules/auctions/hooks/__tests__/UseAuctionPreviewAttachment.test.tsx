import useAuctionPreviewAttachment from '../useAuctionPreviewAttachment';

const imageAttachment = [
  {
    id: 'test',
    uid: 'test',
    url: 'url',
    type: 'IMAGE',
    cloudflareUrl: 'test',
    thumbnail: 'test',
    originalFileName: 'test',
  },
];
const videoAttachment = [
  {
    id: 'test',
    uid: 'test',
    url: 'url',
    type: 'VIDEO',
    cloudflareUrl: 'link',
    thumbnail: 'thumbnail',
    originalFileName: 'test',
  },
];
const EmptAttachments: any[] = [];

test('it should return "url"', () => {
  expect(useAuctionPreviewAttachment(imageAttachment)).toBe('url');
});
test('it should return "thumbnail+?width"', () => {
  expect(useAuctionPreviewAttachment(videoAttachment)).toBe('thumbnail?width=800');
});
test('it should return " "', () => {
  expect(useAuctionPreviewAttachment(EmptAttachments)).toBe('/content/img/default-auction-preview.webp');
});
