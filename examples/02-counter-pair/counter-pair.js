import { html } from 'olmo/jsx';
import { onEvent } from 'olmo/html-events';
import { forwardTo } from 'olmo/signal';
import Type from 'olmo/actions';

import Counter from './counter';

// model
export function init(topInitialValue=0, bottomInitialValue=0) {
  return {
    top: Counter.init(topInitialValue),
    bottom: Counter.init(bottomInitialValue)
  };
}

// actions
export const Action = Type({
  Top: [Counter.Action],
  Bottom: [Counter.Action],
  Reset: []
});

// update
export function update(action, model) {
  return Action.case({

    Top: (counterAction) => init(
      Counter.update(counterAction, model.top), // update the top counter
      model.bottom                              // keep bottom counter as is
    ),

    Bottom: (counterAction) => init(
      model.top,                                 // keep top counter as is
      Counter.update(counterAction, model.bottom)// update bottom counter
    ),

    Reset: () => init()                          // reset both counters
  }, action);
}

export function view({address, model}) {
  const addressForTopCounter = forwardTo(address, Action.Top);
  const addressForBottomCounter = forwardTo(address, Action.Bottom);

  return (
    <div>
      Top counter:
      <Counter address={addressForTopCounter} model={model.top}/>

      Bottom counter:
      <Counter address={addressForBottomCounter} model={model.bottom}/>

      <button on-click={onEvent(address, Action.Reset)}>Reset counters</button>
    </div>
  );
}
