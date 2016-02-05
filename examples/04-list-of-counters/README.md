In this example you can see how to dynamically create and update other components.

Important points of this example:

* The use partially applying "action creators" thanks to the use of algebraic data types (ADT):
``` JavaScript
Modify: ['id', 'counterAction']
...
Action.Modify(id)
```

Note: There's not typechecking involve inside of the ADTs, and the strings 'id' and 'counterAction' are attribute names that are going to be present inside the action object passed to the update function.
