import Events from 'olmo/html-events';
import { forwardTo } from 'olmo/signal';
import ActionType from 'olmo/actions';

import { html } from 'snabbdom-jsx';

import Counter from './counter';


// model
export function init(countersWithID=[], nextID=1) {
  return { countersWithID, nextID };
}

function nextID(prevID) {
  return prevID + 1;
}


// actions
export const Action = ActionType({
  Add: [],
  Modify: ['id', 'counterAction'],
  RemoveFirst: [],
  Reset: []
});


// update
export const update = Action.case('CounterList', {

  Add: (action, model) => {
    const counter = Counter.init();
    const id = model.nextID;
    const counterWithID = {id, counter};

    return init(
      model.countersWithID.concat(counterWithID),
      nextID(id)
    );
  },

  Modify: (action, model) => {
    return init(
      model.countersWithID.map(counterWithID => {
        const {id, counter} = counterWithID;
        if (id === action.id) {
          return {
            id,
            counter: Counter.update(action.counterAction, counter)
          };
        } else {
          return counterWithID
        }
      }),
      model.nextID
    );
  },

  RemoveFirst: (action, model) => {
    return init(
      model.countersWithID.slice(1),
      model.nextID
    );
  }

});


export function view(address, model) {
  const listOfCounters = model.countersWithID.map(counterWithID => {
    const {id, counter} = counterWithID;
    const counterAddress = forwardTo(address, Action.Modify(id));

    return (
      <li>
        {Counter.view(counterAddress, counter)}
      </li>
    )
  });

  return (
    <div>
      <button on-click={Events.message(address, Action.Add())}>Add Counter</button>
      <button on-click={Events.message(address, Action.RemoveFirst())}>Remove First</button>
      <ul>
        {listOfCounters}
      </ul>
    </div>
  );
}

export default {init, view, update};
