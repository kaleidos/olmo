import Rx from 'rx';
import R from 'ramda';
import Maybe from 'data.maybe';

import Signal from './signal';
import Effects from './effects';
import Task from './task';


// type Conf model action = { init : (model, Effect action)
//                          , update : (action, model) -> (model, Effect action)
//                          , view : {Address action, model} -> VirtualDOM
//                          , inputs: [Signal action] }

// type App model action = { model : model
//                         , tasks : Signal (Task Never ())
//                         , html : Signal VirtualDOM }

// runApp : App model action -> RxSubscription
export function runApp(app) {
  return Rx.Observable.merge(
    app.html,
    app.model,
    app.tasks
  ).subscribe();
}

// App : Conf model action -> App model action
export function App(config) {
  const inbox = Signal.Mailbox([]);
  const singleton = (action) => [action];
  const singletonMap = (signal) => signal.map(singleton);
  const address = Signal.forwardTo(inbox.address, singleton);

  function updateStep([oldModel, accumulatedEffects], action) {
    const [newModel, additionalEffects] = config.update(action, oldModel);
    if (R.isNil(newModel)) throw new Error(`Invalid model '${newModel}' returned by update function handling action '${action.type}'`);
    if (R.isNil(additionalEffects)) throw new Error(`Invalid effect '${additionalEffects}' returned by update function handling action '${action.type}'`);
    const newEffects = accumulatedEffects.merge(additionalEffects);

    return [newModel, newEffects];
  }

  function update(actions, [model]) {
    return R.reduce(updateStep, [model, Effects.none()], actions);
  }

  const listInputs = R.prepend(inbox.signal, R.map(singletonMap, config.inputs));
  const inputs = Rx.Observable.merge(...listInputs);
  const effectsAndModel = inputs
          .startWith(config.init)
          .scan(R.flip(update))
  ;

  const model = effectsAndModel
          .map(R.nth(0))
          .shareReplay();

  const html = model
          .map(m => config.view(address, m))
          .debounce(1, Rx.Scheduler.RequestAnimationFrame)
          .shareReplay()
  ;

  const tasks = effectsAndModel
          .flatMap(([_, effect]) => Effects.toTask(address, effect))
  ;

  return {
    model,
    html,
    tasks
  };
}

// type ConfSimple model action = { init : model
//                                , update : (action, model) -> model
//                                , view : {Address action, model} -> VirtualDOM }

// AppSimple : ConfSimple model action -> App model action
export function AppSimple(config) {
  const inbox = Signal.Mailbox(Maybe.Nothing());
  const address = Signal.forwardTo(inbox.address, Maybe.Just);

  const inputs = inbox.signal;

  function update(maybeAction, model) {
    return maybeAction
      .map(action => config.update(action, model))
      .getOrElse(model)
    ;
  }

  const model = inputs.scan(R.flip(update), config.init).shareReplay();
  const html = model.map(model => config.view(address, model)).shareReplay();
  const tasks = Task.empty();

  return {
    model,
    html,
    tasks
  };
}

export default {
  App,
  AppSimple,
  runApp
};
