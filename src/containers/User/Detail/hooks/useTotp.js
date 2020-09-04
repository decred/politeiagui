import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import useFetchMachine from "src/hooks/utils/useFetchMachine";

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
        return send(VERIFY);
      },
      load: () => {
        if (!userTotp) {
          return;
        }
        return send(VERIFY);
      },
      verify: () => {
        if (userTotp.key && userTotp.image) {
          return send(RESOLVE, { totp: userTotp });
        }
        return;
      },
      error: (err) => {
        if (isInvalidParamsError(err) && !state.alreadySet) {
          return send(RESOLVE, { alreadySet: true, error: null });
        }
        return;
      },
      done: () => {
        return;
      }
    },
    initialValues: {
      status: "idle",
      loading: true,
      alreadySet: false,
      verifying: true,
      totp: {}
    }
  });

  return {
    ...state,
    onSetTotp,
    onVerifyTotp,
    loading: state.loading || state.verifying
  };
}
