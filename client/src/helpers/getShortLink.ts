export function getShortLink(slug: string): string {
  const url = new URL(process.env.REACT_APP_PLATFORM_URL!);
  url.pathname = `/go/${slug}`;
  return url.toString();
}
