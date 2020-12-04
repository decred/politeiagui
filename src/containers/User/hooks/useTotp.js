import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import isEqual from "lodash/isEqual";

const ERROR_CODE_INVALID_PARAMS = 77;

const isInvalidParamsError = (error) =>
  error && error.errorCode === ERROR_CODE_INVALID_PARAMS;

export default function useTotp() {
  const onSetTotp = useAction(act.onSetTotp);
  const onVerifyTotp = useAction(act.onVerifyTotp);
  const userTotp = useSelector(sel.userTotp);

  const [state, send, { VERIFY, REJECT, RESOLVE, FETCH }] = useFetchMachine({
    actions: {
      initial: () => {
        if (!userTotp) {
          onSetTotp()
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        return send(RESOLVE, { totp: userTotp });
      },
      load: () => {
        if (!userTotp) {
          return;
        }
        return send(RESOLVE, { totp: userTotp });
      },
      error: (err) => {
        if (isInvalidParamsError(err) && !state.alreadySet) {
          return send(RESOLVE, { alreadySet: true, error: null });
        }
        return;
      },
      done: () => {
        if (!isEqual(userTotp, state.totp)) {
          return send(RESOLVE, { totp: userTotp });
        }
        return;
      }
    },
    initialValues: {
      status: "idle",
      loading: true,
      alreadySet: false,
      verifying: true
    }
  });

  return {
    ...state,
    onSetTotp,
    onVerifyTotp,
    loading: state.loading || state.verifying
  };
}
