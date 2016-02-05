import Events from 'olmo/html-events';
import ActionType from 'olmo/actions';
import { forwardTo } from 'olmo/signal';

import { html } from 'snabbdom-jsx';

import Counter from './counter';


// model
export function init(topInitialValue=0, bottomInitialValue=0) {
  return {
    top: Counter.init(topInitialValue),
    bottom: Counter.init(bottomInitialValue)
  };
}

// actions
export const Action = ActionType({
  Top: ['counterAction'],
  Bottom: ['counterAction'],
  Reset: []
});

// update
export const update = Action.case('CounterPair', {

  Top: (action, model) => init(
    Counter.update(action.counterAction, model.top),
    model.bottom
  ),

  Bottom: (action, model) => init(
    model.top,
    Counter.update(action.counterAction, model.bottom)
  ),

  Reset: () => init()

});


export function view(address, model) {
  const addressForTopCounter = forwardTo(address, Action.Top);
  const addressForBottomCounter = forwardTo(address, Action.Bottom);

  return (
    <div>
      Top counter: {Counter.view(addressForTopCounter, model.top)}
      Bottom counter: {Counter.view(addressForBottomCounter, model.bottom)}

      <button on-click={Events.message(address, Action.Reset())}>Reset counters</button>
    </div>
  );
}

export default {init, view, update};
