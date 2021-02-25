export default function ResizedImageUrl(url: string, size: number) {
  if (!url.startsWith('https://storage.googleapis.com/')) {
    return url;
  }

  const match = url.match(/(\S+)\.(\w{3,4})/);

  return match ? `${match[1]}_${size}.${match[2]}` : '';
}
