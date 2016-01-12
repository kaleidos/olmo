This is the most simple example, it shows the architecture in its most simple variant.

Each time a button is clicked a new action is sent to the actions stream, then that action is passed to the update function along with the current model to obtain the new model that is going to be passed to the view to obtain the virtual dom that's going to be rendered.

Important points of this example:

* The update function is completely synchronous.
``` JavaScript
newModel = update(action, currentModel)
```

* The `AppSimple` constructor receives just the initial model as its `init` argument.
``` JavaScript
AppSimple({ init: Counter.init() ...})
```
