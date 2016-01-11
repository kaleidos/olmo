import Rx from 'rx';
import R from 'ramda';
import Maybe from 'data.maybe';

import snabbdom from 'snabbdom';
import classModule from 'snabbdom/modules/class';
import propsModule from 'snabbdom/modules/props';
import styleModule from 'snabbdom/modules/style';
import eventsModule from 'snabbdom/modules/eventlisteners';

import Signal from './signal';
import Effects from './effects';


const render = snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  eventsModule
]);


// runApp : (App model action, HtmlElement) -> Task Never ()
export function runApp(app, rootElement) {
  return Rx.Observable.merge(
    app.html.scan(render),
    app.effects
  ).subscribe();
}

// type Conf model action = { init : (model, Effect action)
//                          , update : (action, model) -> (model, Effect action)
//                          , view : {Address action, model} -> VirtualDOM
//                          , inputs: [Signal action] }

// type App model action = { model : model
//                         , effects : Signal action
//                         , html : Signal VirtualDOM }

// App : Conf model action -> App model action
export function App(config) {
  const inbox = Signal.Mailbox([]);
  const singleton = (action) => [action];
  const singletonMap = (signal) => signal.map(singleton);
  const address = Signal.forwardTo(inbox.address, singleton);
  const modelWithEffect = config.init;

  function updateStep([oldModel, accumulatedEffects], action) {
    const [newModel, additionalEffects] = config.update(action, oldModel);
    const newEffects = accumulatedEffects.merge(additionalEffects);

    return [newModel, newEffects];
  }

  function update(actions, [model]) {
    return R.reduce(updateStep, [model, Effects.none()], actions);
  }

  const inputs = Rx.Observable.merge(...R.prepend(
    inbox.signal,
    R.map(singletonMap, config.inputs)
  ));
  const effectsAndModel = inputs.scan(R.flip(update), config.init);

  const model = effectsAndModel.map(R.nth(0));

  const html = model
          .map(model => config.view({model, address}))
          .debounce(1, Rx.Scheduler.RequestAnimationFrame);

  const effects = effectsAndModel
          .map(R.nth(1))
          .mergeAll()
          .map(action => Signal.send(address, action))

  return {
    model,
    html,
    effects
  };
}

// type ConfSimple model action = { init : model
//                                , update : (action, model) -> model
//                                , view : {Address action, model} -> VirtualDOM }

// AppSimple : ConfSimple model action -> App model action
export function AppSimple(config) {
  const inbox = Signal.Mailbox(Maybe.Nothing());
  const address = Signal.forwardTo(inbox.address, Maybe.Just);

  const inputs = inbox.signal.filter(Maybe.isJust);
  const model = inputs.scan(R.flip(config.update), config.init);
  const html = model.map(model => config.view({model, address}));

  return {
    model,
    html,
    effects: Effects.none()
  };
}

export default {
  App,
  AppSimple,
  runApp
};
