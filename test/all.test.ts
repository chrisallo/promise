
import Promise from '../index';

describe('Promise.all', () => {
  test('all() sync', (done) => {
    Promise.all([
      1,
      new Promise((resolve) => resolve(2)),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
  test('all() async 1', (done) => {
    Promise.all([
      new Promise((resolve) => { setTimeout(() => resolve(1), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
  test('all() async 2', (done) => {
    Promise.all([
      new Promise((resolve) => { setTimeout(() => resolve(1), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
  test('all() async 3', (done) => {
    Promise.all([
      new Promise((resolve) => { setTimeout(() => resolve(1), 30) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 10) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
  test('all() async 4', (done) => {
    Promise.all([
      new Promise((resolve) => { setTimeout(() => resolve(1), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 10) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
  test('all() mixed 1', (done) => {
    Promise.all([
      Promise.resolve(1),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
  test('all() mixed 2', (done) => {
    Promise.all([
      Promise.resolve(1),
      Promise.resolve(2),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
  test('all() mixed 3', (done) => {
    Promise.all([
      new Promise((resolve) => { setTimeout(() => resolve(1), 30) }),
      Promise.resolve(2),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3]);
      done();
    })
    .catch(err => done(err));
  });
});