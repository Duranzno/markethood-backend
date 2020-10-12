/* eslint-disable @typescript-eslint/ban-types */
export const trimUndefined = (o: object) =>
  Object.fromEntries(Object.entries(o).filter(([, val]) => Boolean(val)));
/* eslint-enable @typescript-eslint/ban-types */
