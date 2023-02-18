export const slugify = (str: string) => {
  return str
    .replace(/^\s+|\s+$/g, '') // trim
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
};
