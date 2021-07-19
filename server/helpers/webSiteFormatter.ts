export const webSiteFormatter = (webSite: string) => {
  if (!webSite) return '';
  if (webSite.slice(-1) === '/') {
    webSite = webSite.slice(0, -1).toLowerCase();
  }
  return webSite.toLowerCase();
};
