import * as act from "src/actions";
import useValidationSchema from "src/hooks/api/useValidationSchema";
import { useAction } from "src/redux";
import { changePasswordValidationSchema } from "../validation";

export default function useChangePassword() {
  const onChangePassword = useAction(act.onSaveChangePassword);
  const validationSchema = useValidationSchema(changePasswordValidationSchema);

  return { onChangePassword, validationSchema };
}
