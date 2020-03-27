import * as act from "src/actions";
import { useAction } from "src/redux";

export function useInviteContractor() {
  return {
    onInviteContractor: useAction(act.onInviteUserConfirm)
  };
}
