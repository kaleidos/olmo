import Rx from 'rx';

export const merge = Rx.Observable.merge;

// type Mailbox a = { signal : Signal a, address : a -> Task Never ()}
// Mailbox: a -> Mailbox a
export function Mailbox(initialValue) {
  const signal = new Rx.BehaviorSubject(initialValue);

  function address(message) {
    return signal.onNext(message);
  }

  return {
    signal,
    address
  };
}

// send : (Address a, a) -> a -> Task Never ()
export function send(address, message) {
  return Rx.Observable.create(observer => {
    address(message);
    observer.onCompleted();
  });
}

export function forwardTo(address, tagMessage) {
  return function forwardedAddress(message) {
    return sendSync(address, tagMessage(message));
  };
}

export function sendSync(address, message) {
  address(message);
}

export default {
  Mailbox,
  forwardTo,
  send,
  sendSync,
  merge
};
