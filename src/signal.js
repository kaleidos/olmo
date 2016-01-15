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

// forwardTo : (Address a, a -> a) -> a -> Task Never ()
export function forwardTo(address, tagMessage) {
  return function forwardedAddress(message) {
    return send(address, tagMessage(message));
  };
}

// send : (Address a, a) -> a -> Task Never ()
export function send(address, message) {
  try {
    address(message);
  } catch(error) {
    throw new Error(`A non-failing task has failed: ${error}`);
  }
}

export default {
  Mailbox,
  forwardTo,
  send,
  merge
};
