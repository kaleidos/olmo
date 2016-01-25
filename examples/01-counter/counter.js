import Events from 'olmo/html-events';
import ActionType from 'olmo/actions';

import { html } from 'snabbdom-jsx';


// model
export function init(initialValue=0) {
  return initialValue;
}

// actions
export const Action = ActionType({
  Increment: [],
  Decrement: []
});

// update
export const update = Action.case('Counter', {

  Increment: (action, model) => model + 1,

  Decrement: (action, model) => model - 1,

});


export function view(address, model) {
  return (
    <div>
      <p>{model}</p>
      <p>
        <button on-click={Events.message(address, Action.Decrement())}>Decrement</button>
        <button on-click={Events.message(address, Action.Increment())}>Increment</button>
      </p>
    </div>
  );
}

export default {init, update, view};
