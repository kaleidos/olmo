import { html } from 'olmo/jsx';
import { onEvent } from 'olmo/html-events';
import { forwardTo } from 'olmo/signal';
import Type from 'olmo/actions';

import Counter from './counter';

// Take a look at Enhanced Object Literals if you see object syntax confusing
// https://babeljs.io/docs/learn-es2015/#enhanced-object-literals

// model
export function init(countersWithID=[], nextID=1) {
  return { countersWithID, nextID };
}

// actions
export const Action = Type({
  Add: [],
  Modify: [Number, Counter.Action], // Number because counter id is a number
  RemoveFirst: [],
  Reset: []
});

// update
export function update(action, model) {
  return Action.case({

    Add: () => {
      const newCounter = Counter.init();
      const newID = model.nextID;
      const newCounterWithID = {id: newID, counter: newCounter};
      const newNextID = model.nextID + 1;

      return init(
        model.countersWithID.concat(newCounterWithID),
        newNextID
      );
    },

    Modify: (counterID, counterAction) => {
      const newCounterWithID = model.countersWithID.map(counterWithID => {
        const {id, counter} = counterWithID;
        const newCounter = counter;
        if (counterID === id)
          return {
            id,
            counter: Counter.update(counterAction, counter)
          };
        else
          return {
            id,
            counter
          };
      });
      const nextID = model.nextID;

      return init(
        newCounterWithID,
        nextID
      );
    },

    RemoveFirst: () => {
      const newCountersWithID = model.countersWithID.slice(1);
      const nextID = model.nextID;

      return init(
        newCountersWithID,
        nextID
      );
    }
  }, action);
}

export function view({address, model}) {
  const listOfCounters = model.countersWithID.map(counterWithID => {
    const {id, counter} = counterWithID;
    const counterAddress = forwardTo(address, Action.Modify(id));

    return (
      <li>
        <Counter address={counterAddress} model={counter}/>
      </li>
    )
  });

  return (
    <div>
      <button on-click={onEvent(address, Action.Add)}>Add Counter</button>
      <button on-click={onEvent(address, Action.RemoveFirst)}>Remove First</button>
      <ul>
        {listOfCounters}
      </ul>
    </div>
  );
}
