import * as act from "src/actions";
import { useAction } from "src/redux";

export function useInviteContractor() {
  const onInviteContractor = useAction(act.onInviteUserConfirm);

  return { onInviteContractor };
}
