import { createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from "lodash/isEqual";

// create a "selector creator" that uses lodash.isEqual instead of ===
export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);
