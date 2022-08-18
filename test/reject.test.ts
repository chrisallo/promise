
import Promise from '../index';

describe('Promise.reject', () => {
  test('reject() with null', (done) => {
    Promise.reject(null)
      .then(() => done('Should not happen!'))
      .catch(err => {
        expect(err).toBeNull();
        done();
      });
  });
  test('reject() with undefined', (done) => {
    Promise.reject(undefined)
      .then(() => done('Should not happen!'))
      .catch(err => {
        expect(err).toBeUndefined();
        done();
      });
  });
  test('reject() with literal', (done) => {
    const value = 104;
    Promise.reject(value)
      .then(() => done('Should not happen!'))
      .catch(err => {
        expect(err).toBe(value);
        done();
      });
  });
  test('reject() with object', (done) => {
    const value = { a: 4, b: 'abc' };
    Promise.reject(value)
      .then(() => done('Should not happen!'))
      .catch(err => {
        expect(err).toBe(value);
        done();
      });
  });
  test('reject() with array', (done) => {
    const value = [1, 10, 20, 'abc', 40, null, {x:20}];
    Promise.reject(value)
      .then(() => done('Should not happen!'))
      .catch(err => {
        expect(err).toBe(value);
        done();
      });
  });
  test('reject() with Promise sync', (done) => {
    const value = new Promise((resolve, reject) => {
      resolve(100);
    });
    Promise.reject(value)
      .then(() => done('Should not happen!'))
      .catch(err => {
        expect(err).toBe(value);
        done();
      });
  });
  test('reject() with Promise async', (done) => {
    const value = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(100);
      }, 100);
    });
    Promise.reject(value)
      .then(() => done('Should not happen!'))
      .catch(err => {
        expect(err).toBe(value);
        done();
      });
  });
});