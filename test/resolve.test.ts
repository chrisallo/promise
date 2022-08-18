
import Promise from '../index';

describe('Promise.resolve', () => {
  test('resolve() with null', (done) => {
    Promise.resolve(null)
      .then(val => {
        expect(val).toBeNull();
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with undefined', (done) => {
    Promise.resolve(undefined)
      .then(val => {
        expect(val).toBeUndefined();
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with literal', (done) => {
    const value = 104;
    Promise.resolve(value)
      .then(val => {
        expect(val).toBe(value);
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with object', (done) => {
    const value = { a: 4, b: 'abc' };
    Promise.resolve(value)
      .then(val => {
        expect(val).toBe(value);
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with array', (done) => {
    const value = [1, 10, 20, 'abc', 40, null, {x:20}];
    Promise.resolve(value)
      .then(val => {
        expect(val).toBe(value);
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with Promise sync', (done) => {
    const value = new Promise((resolve, reject) => {
      resolve(100);
    });
    Promise.resolve(value)
      .then(val => {
        expect(val).toBe(100);
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with Promise async', (done) => {
    const value = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(100);
      }, 100);
    });
    Promise.resolve(value)
      .then(val => {
        expect(val).toBe(100);
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with Promise nested', (done) => {
    const value = new Promise((resolve, reject) => {
      resolve(new Promise((resolve) => {
        setTimeout(() => resolve(100), 100);
      }));
    });
    Promise.resolve(value)
      .then(val => {
        expect(val).toBe(100);
        done();
      })
      .catch(err => done(err));
  });
  test('resolve() with Promise error', (done) => {
    const value = new Promise((resolve, reject) => {
      reject('error');
    });
    Promise.resolve(value)
      .then(val => {
        done('Should not happen!');
      })
      .catch(err => {
        expect(err).toBe('error');
        done();
      });
  });
});