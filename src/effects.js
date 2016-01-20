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
  return effect.flatMap(action => Signal.send(address, action));
}

export function merge(effects) {
  return Rx.Observable.merge(...effects);
}

export function sendAsEffect(address, msg, effMsg) {
  return Signal.send(address, msg).map(() => effMsg);
}

export default {
  none,
  fromTask,
  toTask,
  merge,
  sendAsEffect,
};
