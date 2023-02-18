export default function resizedImageUrl(url: string | undefined, size: number) {
  if (!url) return '';
  if (!url.startsWith('https://storage.googleapis.com/')) return url;

  const match = url.match(/(\S+)\.(\w{3,4})/);

  return match ? `${match[1]}_${size}.${match[2]}` : '';
}
