export function makeClicksByDay(clicks) {
  let currentClickDate = null;
  let currentClickObject = null;
  let resultArray = [];

  for (let clickObect of clicks) {
    let date = clickObect.date.split('T')[0];
    if (currentClickDate === date) {
      currentClickObject.clicks += clickObect.clicks;
    }
    if (currentClickDate !== date) {
      currentClickDate = date;
      currentClickObject = {
        date: date + 'T00:00:00+0000',
        clicks: clickObect.clicks,
      };
      resultArray = [...resultArray, currentClickObject];
    }
  }
  return resultArray;
}
