import R from 'ramda';

import Signal from './signal';

// type Options = { preventDefault : Bool
//                , stopPropagation : Bool }

const defaultOptions = {
  preventDefault: false,
  stopPropagation: false
};

const onSubmitOptions = {
    ...defaultOptions,
  preventDefault: true
};


// handleEventOptions : Options -> Event -> Event
function handleEventOptions(options) {
  return function setEventOptions(event) {
    if (options.stopPropagation)
      event.stopPropagation();

    if (options.preventDefault)
      event.preventDefault();

    return event;
  };
}

// targetValue : Event -> String
function targetValue(event) {
  return event.target.value;
}

// targetChecked : Event -> Bool
function targetChecked(event) {
  return event.target.checked;
}

// on : (Options, Decoder v, v -> a) -> Event -> a
export function on(options, decoder, handler) {
  return R.pipe(
    handleEventOptions(options),
    decoder,
    handler
  );
}

// decodeOn : (Decoder v, Options) -> (Address a, v -> a) -> Task Never ()
export function decodeOn(decode, options) {
  return function performDecodeOn(address, handler) {
    return on(
      options,
      R.identity,
      arg => Signal.send(address, handler(arg))
    );
  };
}

// messageOn : Options -> (Address a, () -> a) -> Task Never ()
export function messageOn(options) {
  return function performMessageOn(address, handler) {
    return on(
      options,
      R.identity,
      ignoredArg => Signal.send(address, handler())
    );
  };
}

// onValue : (Address a, String -> a) -> Task Never ()
export const onValue = decodeOn(targetValue, defaultOptions);

// onCheck : (Address a, Bool -> a) -> Task Never ()
export const onCheck = decodeOn(targetChecked, defaultOptions);

// onSubmit : (Address a, () -> a) -> Task Never ()
export const onSubmit = messageOn(onSubmitOptions);

// onEvent : (Address a, () -> a) -> Task Never ()
export const onEvent = messageOn(defaultOptions);

export default {
  on,
  messageOn,
  decodeOn,

  onValue,
  onCheck,
  onSubmit,
  onEvent
};
