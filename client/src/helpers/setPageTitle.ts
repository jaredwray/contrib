export const setPageTitle = (title: string) => {
  document.title = `Contrib${title ? ` | ${title}` : ''}`;
};
