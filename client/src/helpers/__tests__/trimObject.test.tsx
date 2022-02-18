import { trimObject } from '../trimObject';

test('it should return object with trimmed value', () => {
  const trimmedObject = trimObject({ name: ' test' });
  expect(trimmedObject.name).toBe('test');
});
