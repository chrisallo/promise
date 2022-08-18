
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
      let processed = 0;
      const results = new Array(iterable.length).fill(undefined);
      iterable.forEach((item: any, index: number) => {
        PromiseCompat.resolve(item)
          .then(value => {
            results[index] = value;
            processed++;
            if (processed === iterable.length) resolve(results);
          })
          .catch(reason => {
            reject(reason);
          });
      });
    });
  }
  static allSettled(iterable: any[]): PromiseCompat {
    return new PromiseCompat((resolve) => {
      let processed = 0;
      const results = new Array<PromiseSettledResult>(iterable.length)
        .fill({ status: PromiseState.PENDING });
      const checkCompletion = () => {
        processed++;
        if (processed === iterable.length) resolve(results);
      };
      iterable.forEach((item: any, index: number) => {
        PromiseCompat.resolve(item)
          .then(value => {
            results[index] = {
              status: PromiseState.FULFILLED,
              value,
            };
            checkCompletion();
          })
          .catch(reason => {
            results[index] = {
              status: PromiseState.REJECTED,
              reason,
            };
            checkCompletion();
          });
      });
    });
  }
  static any(iterable: any): PromiseCompat {
    return new PromiseCompat((resolve, reject) => {
      let resolved = false,
        rejected = 0;
      const errors = new Array(iterable.length).fill(undefined);
      iterable.forEach((item: any, index: number) => {
        PromiseCompat.resolve(item)
          .then(value => {
            if (!resolved) {
              resolved = true;
              resolve(value);
            }
          })
          .catch(reason => {
            errors[index] = reason;
            rejected++;
            if (rejected === iterable.length) reject(new AggregateError(errors));
          });
      });
    });
  }
  static race(iterable: any[]): PromiseCompat {
    return new PromiseCompat((resolve, reject) => {
      let completed = false;
      iterable.forEach((item: any) => {
        PromiseCompat.resolve(item)
          .then(value => {
            if (!completed) {
              completed = true;
              resolve(value);
            }
          })
          .catch(reason => {
            if (!completed) {
              completed = true;
              reject(reason);
            }
          });
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
  private get _isPending(): boolean { return this._state === PromiseState.PENDING; }
  private get _isFulfilled(): boolean { return this._state === PromiseState.FULFILLED; }
  private get _isRejected(): boolean { return this._state === PromiseState.REJECTED; }

  private _markAsResolved(value: any): void {
    if (this._isPending) {
      this._state = PromiseState.FULFILLED;
      this._value = value;
      this._flushTaskQueue();
    }
  }
  private _markAsRejected(reason: any): void {
    if (this._isPending) {
      this._state = PromiseState.REJECTED;
      this._value = reason;
      this._flushTaskQueue();
    }
  }
  private _flushTaskQueue(): void {
    for (const { resolve = null, reject = null } of this._queue) {
      if (this._isFulfilled && resolve) resolve(this._value);
      else if (this._isRejected && reject) reject(this._value);
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
    return this.then(onFinally, onFinally);
  }
}