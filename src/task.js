import Rx from 'rx';

export const empty = Rx.Observable.empty;
export const create = Rx.Observable.create;

export function of(f) {
  return Rx.Observable.create(observer => {
    try {
      f();
      observer.onCompleted();
    } catch (error) {
      observer.onError(error);
    }
  });
}

export default {
  empty,
  of,
  create
};
