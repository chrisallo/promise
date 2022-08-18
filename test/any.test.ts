
import Promise from '../index';
import { AggregateError } from '../promise';

describe('Promise.any', () => {
  test('any() sync', (done) => {
    Promise.any([
      1,
      new Promise((resolve) => resolve(2)),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toBe(1);
      done();
    })
    .catch(err => done(err));
  });
  test('any() async 1', (done) => {
    Promise.any([
      new Promise((resolve) => { setTimeout(() => resolve(1), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toBe(1);
      done();
    })
    .catch(err => done(err));
  });
  test('any() async 2', (done) => {
    Promise.any([
      new Promise((resolve) => { setTimeout(() => resolve(1), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toBe(2);
      done();
    })
    .catch(err => done(err));
  });
  test('any() async 3', (done) => {
    Promise.any([
      new Promise((resolve) => { setTimeout(() => resolve(1), 30) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 10) }),
    ])
    .then(result => {
      expect(result).toBe(3);
      done();
    })
    .catch(err => done(err));
  });
  test('any() async 4', (done) => {
    Promise.any([
      new Promise((resolve) => { setTimeout(() => resolve(1), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 10) }),
    ])
    .then(result => {
      expect(result).toBe(3);
      done();
    })
    .catch(err => done(err));
  });
  test('any() mixed 1', (done) => {
    Promise.any([
      Promise.resolve(1),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toBe(1);
      done();
    })
    .catch(err => done(err));
  });
  test('any() mixed 2', (done) => {
    Promise.any([
      Promise.resolve(1),
      Promise.resolve(2),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toBe(1);
      done();
    })
    .catch(err => done(err));
  });
  test('any() mixed 3', (done) => {
    Promise.any([
      new Promise((resolve) => { setTimeout(() => resolve(1), 30) }),
      Promise.resolve(2),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toBe(2);
      done();
    })
    .catch(err => done(err));
  });
  test('any() reject 1', (done) => {
    Promise.any([
      new Promise((resolve) => { setTimeout(() => resolve(1), 10) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error'), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toBe(1);
      done();
    })
    .catch(err => {
      done('Should not happen');
    });
  });
  test('any() reject 2', (done) => {
    Promise.any([
      new Promise((resolve) => { setTimeout(() => resolve(1), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 20) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error'), 30) }),
    ])
    .then(result => {
      expect(result).toBe(1);
      done();
    })
    .catch(err => {
      done('Should not happen');
    });
  });
  test('any() reject all', (done) => {
    Promise.any([
      new Promise((resolve, reject) => { setTimeout(() => reject('error1'), 10) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error2'), 30) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error3'), 20) }),
    ])
    .then(() => {
      done('Should not happen');
    })
    .catch(err => {
      expect(err).toBeInstanceOf(AggregateError);
      expect((err as AggregateError).errors).toStrictEqual([ 'error1', 'error2', 'error3' ]);
      done();
    });
  });
});