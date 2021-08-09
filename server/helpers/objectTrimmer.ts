export const objectTrimmer = (object: object) => {
  return Object.fromEntries(
    Object.entries(object).map(([key, val]) => {
      return typeof val === 'string' ? [key, val.trim()] : [key, val];
    }),
  );
};
