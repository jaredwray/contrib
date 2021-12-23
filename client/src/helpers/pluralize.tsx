export const pluralize = (count: number, text: string) => {
  let result = `${count} ${text}`;
  if (count !== 1) result += 's';

  return result;
};
