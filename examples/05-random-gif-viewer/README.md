This is the first example showing how to handle external effects. Basically the signature for your `init` and `update` function changes:

* `init` returns the tuple `[model, effect]`.
* `update` returns the tuple `[model, effect]`.
