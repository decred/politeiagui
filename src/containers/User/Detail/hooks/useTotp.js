import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import useFetchMachine from "src/hooks/utils/useFetchMachine";

const ERROR_CODE_INVALID_PARAMS = 24;
const DEFAULT_TOTP_TYPE = 1;

const isInvalidParamsError = (error) =>
  error && error.errorCode === ERROR_CODE_INVALID_PARAMS;

export default function useTotp() {
  const onSetTotp = useAction(act.onSetTotp);
  const userTotp = useSelector(sel.userTotp);

  const [state, send, { VERIFY, REJECT, RESOLVE, FETCH }] = useFetchMachine({
    actions: {
      initial: () => {
        if (!userTotp) {
          onSetTotp(DEFAULT_TOTP_TYPE)
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
        console.log("VERIFY", userTotp);
        if (userTotp.key && userTotp.image) {
          return send(RESOLVE, { totp: userTotp });
        }
        return;
      },
      error: (err) => {
        if (isInvalidParamsError(err) && !state.alreadySet) {
          console.log("erro de parametro invalido, necessita verificar");
          return send(RESOLVE, { alreadySet: true, error: null });
        }
        return;
      },
      done: () => {
        console.log("resolved state", state);
        return;
      }
    },
    initialValues: {
      status: "idle",
      loading: true,
      alreadySet: false
    }
  });
  return { ...state, onSetTotp };
}
