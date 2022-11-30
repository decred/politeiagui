import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";

function validateSliceService(sliceService) {
  if (!sliceService) throw TypeError("`sliceService` param must be defined");
  const { onSetup, effect } = sliceService;
  if (!onSetup && !effect) {
    throw TypeError(
      "slices services must have either an `effect`, or `onSetup` defined"
    );
  }

  const props = Object.keys(sliceService);
  if (props.includes("onSetup") && !isFunction(onSetup))
    throw TypeError("`onSetup` must be a function");
  if (props.includes("effect") && !isFunction(effect))
    throw TypeError("`effect` must be a function");

  return true;
}

export function validateSliceServices({ name, services } = {}) {
  if (!name || !isString(name)) throw TypeError("`name` must be a string");
  if (!isObject(services) || isEmpty(services)) {
    throw TypeError(
      "`services` must be an object with `onSetup` and/or `effect` props"
    );
  }
  return Object.values(services).every(validateSliceService);
}
