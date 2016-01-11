import { html } from 'olmo/jsx';

// model
export function init(initialValue=0) {
  return initialValue;
}

// update
export function update(action, model) {
  return model;
}

export function view({address, model}) {
  return <p>hola</p>;
}
