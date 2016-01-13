import Rx from 'rx';

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

export default {
  none,
  fromTask
};
