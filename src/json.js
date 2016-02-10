import R from 'ramda';

export const at = R.curry(function at(path, decoder, value) {
  return R.path(path, decoder(value));
});

export const string = JSON.parse;

export default {at, string};
