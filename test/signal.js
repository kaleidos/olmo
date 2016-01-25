import test from 'tape';
import R from 'ramda';

import Signal from '../src/signal';

test('Mailbox should have `address` and `signal`', function(assert) {
  assert.plan(2);

  const inbox = Signal.Mailbox(null);

  assert.ok(R.has('signal', inbox), 'Mailbox does not have `signal`');
  assert.ok(R.has('address', inbox), 'Mailbox does not have `address`');
});
