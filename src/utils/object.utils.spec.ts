import test from 'ava';

import { trimUndefined } from './object.utils';

test('Trim Undefined', (t) => {
  //Expect
  const undefinedObject = { undefinedMember: undefined, nullMember: null };
  const definedObject = { firstFilled: 1, secondFilled: 2 };
  //Act
  const res = trimUndefined({ ...definedObject, ...undefinedObject });
  //Assert
  t.deepEqual(
    res,
    definedObject,
    'trimUndefined is giving problems' + JSON.stringify(res)
  );
});
