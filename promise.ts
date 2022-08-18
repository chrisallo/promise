
type PromiseResolve = (value: any) => void;
type PromiseReject = (reason: any) => void;
type PromiseFinally = () => void;
type PromiseExecutor = (resolve: PromiseResolve, reject: PromiseReject) => void;

enum PromiseState {
  PENDING,
  FULFILLED,
  REJECTED,
}

export default class PromiseCompat {
  private _state: PromiseState = PromiseState.PENDING;
  private _value: any = null;
  private _reason: any = null;
  private _queue: { resolve?: PromiseResolve, reject?: PromiseReject }[] = [];

  constructor(exec: PromiseExecutor) {
    try {
      exec(
        value => {
          PromiseCompat._unwrap(value,
            unwrapped => this._markAsResolved(unwrapped),
            reason => this._markAsRejected(reason));
        },
        reason => this._markAsRejected(reason),
      );
    } catch (err) {
      this._markAsRejected(err);
    }
  }
  static all(iterable: any[]): PromiseCompat {
    return new PromiseCompat((resolve, reject) => {
      let fulfilled = 0;
      const results = new Array(iterable.length).fill(undefined);
      const finalize = (err?: any) => {
        if (!err) {
          fulfilled++;
          if (fulfilled === results.length) resolve(results);
        } else reject(err);
      };
      iterable.forEach((item: any, index: number) => {
        if (item instanceof PromiseCompat) {
          PromiseCompat.resolve(item)
            .then(value => {
              results[index] = value;
              finalize();
            })
            .catch(reason => finalize(reason));
        } else {
          results[index] = item;
          finalize();
        }
      });
    });
  }
  static resolve(value: any): PromiseCompat {
    return new PromiseCompat((resolve, reject) => PromiseCompat._unwrap(value, resolve, reject));
  }
  static reject(reason: any): PromiseCompat {
    return new PromiseCompat((_, reject) => reject(reason));
  }
  private static _unwrap(value: any, resolve: PromiseResolve, reject: PromiseReject): void {
    if (value instanceof PromiseCompat) {
      value
        .then(resolved => resolve(resolved))
        .catch(reason => reject(reason));
    } else {
      resolve(value);
    }
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
      this._reason = reason;
      this._flushTaskQueue();
    }
  }
  private _flushTaskQueue(): void {
    for (const { resolve = null, reject = null } of this._queue) {
      if (this._isFulfilled && resolve) resolve(this._value);
      else if (this._isRejected && reject) reject(this._reason);
    }
  }
  then(onFulfilled?: PromiseResolve, onRejected?: PromiseReject): PromiseCompat {
    switch (this._state) {
      case PromiseState.PENDING:
        return new PromiseCompat((resolve, reject) => {
          this._queue.push({
            resolve: value => {
              const fulfilled = onFulfilled ? onFulfilled(value) : undefined;
              PromiseCompat._unwrap(fulfilled, resolve, reject);
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
        if (onRejected) onRejected(this._reason);
        return PromiseCompat.reject(this._reason);
    }
  }
  catch(onRejected: PromiseReject): PromiseCompat {
    return this.then(undefined, onRejected);
  }
  finally(onFinally: PromiseFinally): PromiseCompat {
    return new PromiseCompat(() => {
      // TODO:
    });
  }
}