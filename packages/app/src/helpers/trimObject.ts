export const trimObject = (object: object): any => {
  return Object.fromEntries(
    Object.entries(object).map(([key, val]) => {
      return typeof val === 'string' ? [key, val.trim()] : [key, val];
    }),
  );
};
