import Rx from 'rx';

import Signal from './signal';


export const none = Rx.Observable.empty;

export function fromTask(task, successCallback, failureCallback) {
  return Rx.Observable.create(function fromTaskObservable(observer) {
    task.subscribe(
      (result) => observer.onNext(successCallback(result)),
      (error) => observer.onNext(failureCallback(error)),
      () => observer.onCompleted()
    );
  });
}

export function toTask(address, effect) {
  return Rx.Observable.create(function toTaskObservable(observer) {
    effect.subscribe(
      action => {
        Signal.send(address, action);
        observer.onCompleted();
      },
      error => {
        observer.onError(error);
      }
    );
  });
}

export function merge(effects) {
  return Rx.Observable.merge(...effects);
}

export default {
  none,
  fromTask,
  toTask,
  merge
};
