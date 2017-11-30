import compose from "lodash/fp/compose";
import reduce from "lodash/fp/reduce";

export const basicAction = type =>
  (payload, error) => ({
    type,
    error: !!error,
    payload: error ? error : payload,
  });

export const reduceTypes = types => compose(
  reduce((t, name) => ({ ...t, [name]: basicAction(types[name]) }), {}), Object.keys
)(types);
