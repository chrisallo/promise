
import Promise from '../index';

describe('then', () => {
  test('then() sync', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      resolve(value);
    })
    .then(val => {
      expect(val).toBe(value);
      done();
    });
  });
  test('then() sync chain', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      resolve(value);
    })
    .then((val: number) => val + 20)
    .then(val => {
      expect(val).toBe(value + 20);
      done();
    });
  });
  test('then() sync nested', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      resolve(new Promise((resolve) => resolve(value)));
    })
    .then(val => {
      expect(val).toBe(value);
      done();
    });
  });
  test('then() async', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(value), 100);
    })
    .then(val => {
      expect(val).toBe(value);
      done();
    });
  });
  test('then() async chain', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(value), 100);
    })
    .then((val: number) => val + 20)
    .then(val => {
      expect(val).toBe(value + 20);
      done();
    });
  });
  test('then() async nested', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(new Promise((resolve) => resolve(value))), 100);
    })
    .then(val => {
      expect(val).toBe(value);
      done();
    });
  });
});