import Rx from 'rx';
import Cookies from 'js-cookie';

export function set(name, value, options) {
  return Rx.Observable.create(function setCookieObservable(observer) {
    try {
      Cookies.set(name, value, options);
      observer.onNext();
      observer.onCompleted();
    } catch(error) {
      observer.onError(error);
    }
  });
}

export function get(name) {
  console.log("set cookie",name);
  return Rx.Observable.create(function getCookieObservable(observer) {
    try {
      const cookie = Cookies.get(name);
      observer.onNext(cookie);
      observer.onCompleted();
    } catch(error) {
      observer.onError(error);
    }
  });
}

export function remove(name, options) {
  return Rx.Observable.create(function removeCookieObservable(observer) {
    try {
      Cookies.remove(name, options);
      observer.onNext();
      observer.onCompleted();
    } catch(error) {
      observer.onError(error);
    }
  });
}

export function getJSON(name) {
  return Rx.Observable.create(function getJsonCookieObservable(observer) {
    try {
      const cookie = Cookies.getJSON(name);
      observer.onNext(cookie);
      observer.onCompleted();
    } catch(error) {
      observer.onError(error);
    }
  });
}

export default {
  set,
  get,
  remove,
  getJSON
};
