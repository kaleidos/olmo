This is the most simple example. Each time a button is clicked a new action is sent to the actions stream, then that action is passed to the update function along with the current model to obtain the new model that is going to be passed to the view to obtain the virtual dom that's going to be rendered.

Important points of this example:

* You define actions like if they where algebraic data types with: `ActionType({...})`.
* You can build your `update` function by `.case` your action type: `Action.case('Some descriptive name for debugging', {...})`.
* Rendering is up to you, see `app.js` to check how you can use the `.html` stream to render your app stages.
