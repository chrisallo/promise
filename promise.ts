
type PromiseResolve = (value: any) => void;
type PromiseReject = (reason: any) => void;
type PromiseFinally = () => void;
type PromiseExecutor = (resolve: PromiseResolve, reject: PromiseReject) => void;

enum PromiseState {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
export interface PromiseSettledResult {
  status: PromiseState;
  value?: any;
  reason?: any;
}
export class AggregateError extends Error {
  constructor(
    public errors: Error[],
    message?: string,
  ) {
    super(message ?? 'All Promises rejected');
    this.name = 'AggregateError';
  }
}

const iterate = ({ iterable, onresolve, onreject }: {
  iterable: any[];
  onresolve: (value: any, index: number, completed: number) => void;
  onreject: (reason: any, index: number, completed: number) => void;
}) => {
  let processed = 0;
  iterable.forEach((item: any, index: number) => {
    PromiseCompat.resolve(item)
      .then(value => onresolve(value, index, ++processed))
      .catch(reason => onreject(reason, index, ++processed));
  });
};

export default class PromiseCompat {
  private _state: PromiseState = PromiseState.PENDING;
  private _value: any = null;
  private _queue: { resolve?: PromiseResolve, reject?: PromiseReject }[] = [];

  constructor(exec: PromiseExecutor) {
    try {
      exec(
        value => {
          if (value instanceof PromiseCompat) {
            PromiseCompat.resolve(value)
              .then(resolved => this._markAsResolved(resolved))
              .catch(reason => this._markAsRejected(reason));
          } else this._markAsResolved(value);
        },
        reason => this._markAsRejected(reason),
      );
    } catch (err) {
      this._markAsRejected(err);
    }
  }
  static all(iterable: any[]): PromiseCompat {
    return new PromiseCompat((resolve, reject) => {
      const results = new Array(iterable.length);
      iterate({
        iterable,
        onresolve: (value: any, index: number, completed: number) => {
          results[index] = value;
          if (completed === iterable.length) resolve(results);
        },
        onreject: (reason: any) => reject(reason),
      });
    });
  }
  static allSettled(iterable: any[]): PromiseCompat {
    return new PromiseCompat((resolve) => {
      const results: PromiseSettledResult[] = new Array(iterable.length);
      iterate({
        iterable,
        onresolve: (value: any, index: number, completed: number) => {
          results[index] = { status: PromiseState.FULFILLED, value };
          if (completed === iterable.length) resolve(results);
        },
        onreject: (reason: any, index: number, completed: number) => {
          results[index] = { status: PromiseState.REJECTED, reason };
          if (completed === iterable.length) resolve(results);
        }
      });
    });
  }
  static any(iterable: any): PromiseCompat {
    return new PromiseCompat((resolve, reject) => {
      const errors: Error[] = new Array(iterable.length);
      iterate({
        iterable,
        onresolve: (value: any, _: number, completed: number) => {
          if (completed === 1) resolve(value);
        },
        onreject: (reason: any, index: number, completed: number) => {
          errors[index] = reason;
          if (completed === iterable.length) reject(new AggregateError(errors));
        }
      });
    });
  }
  static race(iterable: any[]): PromiseCompat {
    return new PromiseCompat((resolve, reject) => {
      iterate({
        iterable,
        onresolve: (value: any, _: number, completed: number) => {
          if (completed === 1) resolve(value);
        },
        onreject: (reason: any, _: number, completed: number) => {
          if (completed === 1) reject(reason);
        }
      });
    });
  }
  static resolve(value: any): PromiseCompat {
    return new PromiseCompat((resolve, reject) => {
      if (value instanceof PromiseCompat) {
        value
          .then(resolved => {
            PromiseCompat.resolve(resolved)
              .then(resolved => resolve(resolved))
              .catch(reason => reject(reason));
          })
          .catch(reason => reject(reason));
      } else resolve(value);
    });
  }
  static reject(reason: any): PromiseCompat {
    return new PromiseCompat((_, reject) => reject(reason));
  }
  private _markAsResolved(value: any): void {
    if (this._state === PromiseState.PENDING) {
      this._state = PromiseState.FULFILLED;
      this._value = value;
      this._flushRequestQueue();
    }
  }
  private _markAsRejected(reason: any): void {
    if (this._state === PromiseState.PENDING) {
      this._state = PromiseState.REJECTED;
      this._value = reason;
      this._flushRequestQueue();
    }
  }
  private _flushRequestQueue(): void {
    for (const { resolve = null, reject = null } of this._queue) {
      if (this._state === PromiseState.FULFILLED && resolve) resolve(this._value);
      else if (this._state === PromiseState.REJECTED && reject) reject(this._value);
    }
  }
  then(onFulfilled?: PromiseResolve, onRejected?: PromiseReject): PromiseCompat {
    switch (this._state) {
      case PromiseState.PENDING:
        return new PromiseCompat((resolve, reject) => {
          this._queue.push({
            resolve: value => {
              const fulfilled = onFulfilled ? onFulfilled(value) : undefined;
              PromiseCompat.resolve(fulfilled)
                .then(resolved => resolve(resolved))
                .catch(reason => reject(reason));
            },
            reject: reason => {
              if (onRejected) onRejected(reason);
              reject(reason);
            },
          });
        });

      case PromiseState.FULFILLED:
        const fulfilled = onFulfilled ? onFulfilled(this._value) : undefined;
        return PromiseCompat.resolve(fulfilled);

      case PromiseState.REJECTED:
        if (onRejected) onRejected(this._value);
        return PromiseCompat.reject(this._value);
    }
  }
  catch(onRejected: PromiseReject): PromiseCompat {
    return this.then(undefined, onRejected);
  }
  finally(onFinally: PromiseFinally): PromiseCompat {
    switch (this._state) {
      case PromiseState.PENDING:
        return new PromiseCompat((resolve, reject) => {
          this._queue.push({
            resolve: value => { onFinally(); resolve(value) },
            reject: reason => { onFinally(); reject(reason) },
          });
        });

      case PromiseState.FULFILLED:
      case PromiseState.REJECTED:
        onFinally();
        return this;
    }
  }
}