import StartApp from 'olmo/start-app';
import Signal from 'olmo/signal';
import Task from 'olmo/task';

import snabbdom from 'snabbdom';
import snabbdomProps from 'snabbdom/modules/props';
import snabbdomEvents from 'snabbdom/modules/eventlisteners';

import CounterList from './counter-list';


const patch = snabbdom.init([snabbdomProps, snabbdomEvents]);

function render([oldHtml, newHtml]) {
  return Task.of(() => patch(oldHtml, newHtml));
}

export default function App() {
  var {html, model, tasks} = StartApp.AppSimple({
    init: CounterList.init(),
    update: CounterList.update,
    view: CounterList.view
  });

  return {
    html,
    model,
    // tasks perform side-effects
    tasks: Signal.merge(
      tasks,
      // rendering is just a side-effect
      html
        .startWith(document.getElementById('root'))
        .pairwise()
        .flatMap(render)
    )
  };
}
