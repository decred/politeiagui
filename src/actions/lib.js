import compose from "lodash/fp/compose";
import reduce from "lodash/fp/reduce";

export const basicAction = type => (payload, error) => ({
  type,
  error: !!error,
  payload: error ? error : payload
});

export const reduceTypes = types =>
  compose(
    reduce((t, name) => ({ ...t, [name]: basicAction(types[name]) }), {}),
    Object.keys
  )(types);

export const callAfterMinimumWait = (callback, waitTimeMs) => {
  let args = null;
  let timedOut = false;

  const revisedCallback = function() {
    if (!timedOut) {
      args = arguments;
      return;
    }

    callback.apply(this, arguments);
  };

  setTimeout(() => {
    timedOut = true;
    if (args) {
      revisedCallback.apply(this, args);
    }
  }, waitTimeMs);

  return revisedCallback;
};
