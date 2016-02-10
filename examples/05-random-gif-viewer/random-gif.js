import { html } from 'snabbdom-jsx';

import Http from 'olmo/http';
import Task from 'olmo/task';
import Events from 'olmo/html-events';
import Effects from 'olmo/effects';
import ActionType from 'olmo/actions';
import Json from 'olmo/json';


// init
export function init(topic='funny cats') {
  const model = {topic, url: 'assets/waiting.gif'};
  const eff = getRandomGif(topic);
  return [model, eff];
}

function getRandomGif(topic) {
  return Effects.fromTask(
    Http.get(decodeImageUrl, getRandomUrl(topic)),
    Action.NewGif,
    Action.GifError
  );
}

function getRandomUrl(topic) {
  return Http.url('http://api.giphy.com/v1/gifs/random', [
    ['api_key', 'dc6zaTOxFJmzC'],
    ['tag', topic]
  ]);
}

function decodeImageUrl(resp) {
  return Json.at(['data', 'image_url'], Json.string, resp.value);
}


// action
const Action = ActionType({
  RequestMore: [],
  NewGif: ['url'],
  GifError: ['error']
});


// update
export const update = Action.case('RandomGif', {
  RequestMore: (action, model) => {
    return [model, getRandomGif(model.topic)];
  },

  NewGif: (action, model) => {
    const newModel = {...model, url: action.url};
    return [newModel, Effects.none()];
  },

  GifError: (action, model) => {
    console.log('I got error ', action);
    return [model, Effects.none()];
  }
});


// view
function view(address, model) {
  console.log(model.url);
  return (
    <div>
      <h1>{model.topic}</h1>
      <p><button on-click={Events.message(address, Action.RequestMore())}>More Please!</button></p>
      <img src={model.url}/>
    </div>
  );
}


export default {init, update, view};
