export const pluralize = (count: number, text: string) => {
  if (count === 1) {
    return `${count} ${text}`;
  }
  return `${count} ${text}s`;
};
