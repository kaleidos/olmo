import R from 'ramda';

const defaultHandlerName = '_';
const NoAction = ['NoAction', []];

export function ActionType(spec) {
  return R.mergeAll(R.prepend(NoAction, R.toPairs(spec)).map(buildActionConstructor));
}

function buildActionConstructor([actionName, actionFields]) {
  function actionGuard(name, handlers) {
    if (typeof handlers === 'undefined') {
      throw new Error(`'Action.case' second param 'handlers' cannot be undefined.`)
    }
    return function update(action, model) {
      let handler;
      if (R.hasIn(action.type, handlers)) {
        handler = handlers[action.type];
      } else if (R.has(defaultHandlerName, handlers)) {
        handler = handlers[defaultHandlerName];
      } else {
        throw new Error(`Unhandled action '${action.type}' in '${name}'`);
      }
      return handler(action, model);
    };
  }
  return {
    [actionName]: R.curryN(
      actionFields.length,
      (...args) => R.merge(R.zipObj(actionFields, args), {type: actionName})
    ),

    getUpdateFor: actionGuard,
    case: actionGuard
  };
}

export default ActionType;
