import R from 'ramda';

import Signal from './signal';

// type Options = { preventDefault : Bool
//                , stopPropagation : Bool }

const defaultOptions = {
  preventDefault: false,
  stopPropagation: false
};

const preventDefaultOptions = {
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

// targetHref : Event -> String
function targetHref(event) {
  return event.target.pathname;
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
export function decodeOn(decoder, options) {
  return function performDecodeOn(address, handler) {
    return on(
      options,
      decoder,
      arg => Signal.send(address, handler(arg))
    );
  };
}

// messageOn : Options -> (Address a, a) -> Task Never ()
export function messageOn(options) {
  return function performMessageOn(address, message) {
    return on(
      options,
      R.identity,
      ignoredArg => Signal.send(address, message)
    );
  };
}

// value : (Address a, String -> a) -> Task Never ()
export const value = decodeOn(targetValue, defaultOptions);

// check : (Address a, Bool -> a) -> Task Never ()
export const check = decodeOn(targetChecked, defaultOptions);

// submit : (Address a, a) -> Task Never ()
export const submit = messageOn(preventDefaultOptions);

// message : (Address a, a) -> Task Never ()
export const message = messageOn(defaultOptions);

// onLink : (Address a, String -> a) -> Task Never ()
export const link = decodeOn(targetHref, preventDefaultOptions);

export default {
  on,
  messageOn,
  decodeOn,

  value,
  check,
  submit,
  message,
  link
};
