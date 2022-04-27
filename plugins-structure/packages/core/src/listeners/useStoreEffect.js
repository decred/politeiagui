import { useEffect } from "react";
import { addStoreEffect } from "./listeners";

export function useStoreEffect(fn, actionCreators) {
  useEffect(() => addStoreEffect(fn, actionCreators), [fn, actionCreators]);
}
