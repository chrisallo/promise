
import Promise from '../index';

describe('finally', () => {
  test('finally() by sync resolve', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      resolve(value);
    })
    .then(val => {
      expect(val).toBe(value);
    })
    .finally(() => done());
  });
  test('finally() by sync resolve chain', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      resolve(value);
    })
    .then((val: number) => val + 20)
    .then(val => {
      expect(val).toBe(value + 20);
    })
    .finally(() => done());
  });
  test('finally() by nested sync resolve', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      resolve(new Promise((resolve) => resolve(value)));
    })
    .then(val => {
      expect(val).toBe(value);
    })
    .finally(() => done());
  });
  test('finally() by async resolve', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(value), 100);
    })
    .then(val => {
      expect(val).toBe(value);
    })
    .finally(() => done());
  });
  test('finally() by async resolve chain', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(value), 100);
    })
    .then((val: number) => val + 20)
    .then(val => {
      expect(val).toBe(value + 20);
    })
    .finally(() => done());
  });
  test('finally() by async nested resolve', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(new Promise((resolve) => resolve(value))), 100);
    })
    .then(val => {
      expect(val).toBe(value);
    })
    .finally(() => done());
  });
  test('finally() by reject', (done) => {
    const error = 'error';
    new Promise((resolve, reject) => {
      reject(error);
    })
    .catch(reason => {
      expect(reason).toBe(error);
    })
    .finally(() => done());
  });
});