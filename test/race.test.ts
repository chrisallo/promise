
import Promise from '../index';

describe('Promise.race', () => {
  test('race() sync', (done) => {
    Promise.race([
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
  test('race() async 1', (done) => {
    Promise.race([
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
  test('race() async 2', (done) => {
    Promise.race([
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
  test('race() async 3', (done) => {
    Promise.race([
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
  test('race() async 4', (done) => {
    Promise.race([
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
  test('race() mixed 1', (done) => {
    Promise.race([
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
  test('race() mixed 2', (done) => {
    Promise.race([
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
  test('race() mixed 3', (done) => {
    Promise.race([
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
  test('race() reject 1', (done) => {
    Promise.race([
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
  test('race() reject 2', (done) => {
    Promise.race([
      new Promise((resolve) => { setTimeout(() => resolve(1), 20) }),
      new Promise((resolve) => { setTimeout(() => resolve(2), 30) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error'), 10) }),
    ])
    .then(() => {
      done('Should not happen');
    })
    .catch(err => {
      expect(err).toBe('error');
      done();
    });
  });
  test('race() reject all', (done) => {
    Promise.race([
      new Promise((resolve, reject) => { setTimeout(() => reject('error1'), 20) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error2'), 10) }),
      new Promise((resolve, reject) => { setTimeout(() => reject('error3'), 30) }),
    ])
    .then(() => {
      done('Should not happen');
    })
    .catch(err => {
      expect(err).toBe('error2');
      done();
    });
  });
});