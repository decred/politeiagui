import { useAction } from "src/redux";
import * as act from "src/actions";
import { DCC_OPPOSE_ACTION, DCC_SUPPORT_ACTION } from "../constants";

export const useDccActions = (dccToken) => {
  const onSupportOpposeDcc = useAction(act.onSupportOpposeDcc);
  const onSupportDcc = () => onSupportOpposeDcc(dccToken, DCC_SUPPORT_ACTION);
  const onOpposeDcc = () => onSupportOpposeDcc(dccToken, DCC_OPPOSE_ACTION);

  return {
    onSupportDcc,
    onOpposeDcc
  };
};
