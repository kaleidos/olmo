In this example you can see how to dynamically create and update other components.

Important points of this example:

* The use partially applying "action creators" thanks to the use of algebraic data types:
``` JavaScript
Modify: [Number, Counter.Action]
...
Action.Modify(id)
```
