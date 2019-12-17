import * as act from "src/actions";
import useValidationSchema from "src/hooks/api/useValidationSchema";
import { useAction, useSelector } from "src/redux";
import * as sel from "src/selectors";
import { changeUsernameValidationSchema } from "./validation";

export function useChangeUsername() {
  const username = useSelector(sel.getUserUsername);
  const onChangeUsername = useAction(act.onSaveChangeUsername);
  const validationSchema = useValidationSchema(changeUsernameValidationSchema);

  return {
    username,
    onChangeUsername,
    validationSchema
  };
}
