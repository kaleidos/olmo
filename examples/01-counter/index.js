import { runApp, AppSimple } from 'olmo/start-app';
import {init, update, view} from './counter';

const app = AppSimple({
  init: init(),
  update: update,
  view: view
});

runApp(
  app,
  document.getElementById('root')
);