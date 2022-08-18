
import Promise from '../index';

describe('Promise.allSettled', () => {
  test('allSettled() sync', (done) => {
    Promise.allSettled([
      1,
      new Promise((resolve) => resolve(2)),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() async 1', (done) => {
    Promise.allSettled([
      new Promise((resolve) => { setTimeout(() => resolve(1), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() async 2', (done) => {
    Promise.allSettled([
      new Promise((resolve) => { setTimeout(() => resolve(1), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() async 3', (done) => {
    Promise.allSettled([
      new Promise((resolve) => { setTimeout(() => resolve(1), 30) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 10) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() async 4', (done) => {
    Promise.allSettled([
      new Promise((resolve) => { setTimeout(() => resolve(1), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 10) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() mixed 1', (done) => {
    Promise.allSettled([
      Promise.resolve(1),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() mixed 2', (done) => {
    Promise.allSettled([
      Promise.resolve(1),
      Promise.resolve(2),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() mixed 3', (done) => {
    Promise.allSettled([
      new Promise((resolve) => { setTimeout(() => resolve(1), 30) }),
      Promise.resolve(2),
      Promise.resolve(3),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,3].map(v => { return { status: 'fulfilled', value: v } }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() reject 1', (done) => {
    Promise.allSettled([
      new Promise((resolve) => { setTimeout(() => resolve(1), 10) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error'), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(3), 30) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,'error',3].map(v => {
        return v !== 'error' ? { status: 'fulfilled', value: v } : { status: 'rejected', reason: v };
      }));
      done();
    })
    .catch(err => done(err));
  });
  test('allSettled() reject 2', (done) => {
    Promise.allSettled([
      new Promise((resolve) => { setTimeout(() => resolve(1), 10) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error'), 20) }),
    ])
    .then(result => {
      expect(result).toStrictEqual([1,2,'error'].map(v => {
        return v !== 'error' ? { status: 'fulfilled', value: v } : { status: 'rejected', reason: v };
      }));
      done();
    })
    .catch(err => done(err));
  });
});