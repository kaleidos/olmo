import Rx from 'rx';
import createHistory from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';

import { Mailbox } from './signal';

// type Action = PUSH | REPLACE | POP

// type Location = { pathname : String
//                 , search : String
//                 , action : Action
//                 , key : String }

const history = useQueries(createHistory)();

// location : Signal Location
export const location = Rx.Observable.create(function historyNextLocation(observer) {
  history.listen(location => observer.onNext(location));
});

// setPath : String -> Task error ()
export function setPath(path) {
  return Rx.Observable.create(function setPathObservable(observer) {
    try {
      history.push(path);
      observer.onNext();
      observer.onCompleted();
    } catch (error) {
      observer.onError(error);
    }
  });
}

// setLocation : Location -> Task error ()
export const setLocation = setPath;

// replacePath : String -> Task error ()
export function replacePath(path) {
  return Rx.Observable.create(function replacePathObservable(observer) {
    try {
      history.replace(path);
      observer.onNext();
      observer.onCompleted();
    } catch (error) {
      observer.onError(error);
    }
  });
}

// replaceLocation : Location -> Task error ()
export const replaceLocation = replacePath;

// go : Int -> Task error ()
export function go(steps) {
  return Rx.Observable.create(function goObservable(observer) {
    try {
      history.go(steps);
      observer.onNext();
      observer.onCompleted();
    } catch (error) {
      observer.onError(error);
    }
  });
}

// next : () -> Task error ()
export function next() {
  return go(1);
}

// previous : () -> Task error ()
export function previous() {
  return go(-1);
}

export default {
  location,
  setPath,
  replacePath,
  setLocation,
  replaceLocation,
  go,
  next,
  previous
};
