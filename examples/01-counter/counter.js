import { html } from 'olmo/jsx';
import { onEvent } from 'olmo/html-events';
import Type from 'olmo/actions';

// model
export function init(initialValue=0) {
  return initialValue;
}

// actions
export const Action = Type({
  Increment: [],
  Decrement: []
});

// update
export function update(action, model) {
  return Action.case({
    Increment: () => model + 1,
    Decrement: () => model - 1
  }, action);
}

export function view({address, model}) {
  return (
    <div>
      <p>{model}</p>
      <p>
        <button on-click={onEvent(address, Action.Decrement)}>Decrement</button>
        <button on-click={onEvent(address, Action.Increment)}>Increment</button>
      </p>
    </div>
  );
}
