export default function arrayMax<T>(array: T[], compare: (currentValue: T, prevMax: T) => boolean): T {
  let max = array[0];
  for (let i = 0; i < array.length; i++) {
    if (compare(array[i], max)) {
      max = array[i];
    }
  }
  return max;
}
