In this example you can see how to reuse components inside another components.

Important points of this example:

* Using the `forwardTo` function we can *tag* actions comming from child components in order to propagate the updates to the appropiate components. For example:
``` JavaScript
addressForTopCounter = forwardTo(address, Action.Top);
```
This is just saying that any action that's fired in the component with the `addressForTopCounter` address will be *packed* inside another action called `Top`. Later in the update function we can propagate the appropiate updates to the top or bottom counter depending on if they come packaged in the `Top` or `Bottom` contexts.
