
import Promise from '../index';

describe('catch', () => {
  test('catch() sync', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      reject(value);
    })
    .catch(err => {
      expect(err).toBe(value);
      done();
    });
  });
  test('catch() async', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      setTimeout(() => reject(value), 100);
    })
    .catch(err => {
      expect(err).toBe(value);
      done();
    });
  });
  test('catch() nested', (done) => {
    const value = 100;
    new Promise((resolve, reject) => {
      resolve(new Promise((resolve, reject) => reject(value)));
    })
    .catch(err => {
      expect(err).toBe(value);
      done();
    });
  });
});