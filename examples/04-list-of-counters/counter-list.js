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
  Remove: ['id']
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

  Remove: (action, model) => {
    return init(
      model.countersWithID.filter(counterWithID => counterWithID.id !== action.id),
      model.nextID
    );
  }

});


export function view(address, model) {
  const listOfCounters = model.countersWithID.map(counterWithID => {
    const {id, counter} = counterWithID;
    const counterAddress = forwardTo(address, Action.Modify(id));
    const context = {
      address: counterAddress,
      remove: Events.message(address, Action.Remove(id))
    };

    return (
      <li>
        {Counter.viewWithRemoveButton(context, counter)}
      </li>
    )
  });

  return (
    <div>
      <button on-click={Events.message(address, Action.Add())}>Add Counter</button>
      <ul>
        {listOfCounters}
      </ul>
    </div>
  );
}

export default {init, view, update};
