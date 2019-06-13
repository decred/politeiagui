import { useEffect, useState } from "react";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import {
  changePasswordValidationSchema,
  changeUsernameValidationSchema
} from "./validation";

const mapStateToProps = {
  userId: compose(
    get(["match", "params", "userId"]),
    arg(1)
  ),
  user: sel.user
};

const mapDispatchToProps = {
  onFetchUser: act.onFetchUser
};

function validateUUID(str) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

export function useUserDetail(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return { ...fromRedux, validateUUID };
}

const mapChangePasswordStateToProps = {
  policy: sel.policy,
  isApiRequestingChangePassword: or(
    sel.isApiRequestingInit,
    sel.isApiRequestingChangePassword
  ),
  changePasswordResponse: sel.apiChangePasswordResponse
};

const mapChangePasswordDispatchToProps = {
  onChangePassword: act.onSaveChangePassword,
  onGetPolicy: act.onGetPolicy
};

export function useChangePassword(ownProps) {
  const { policy, ...fromRedux } = useRedux(
    ownProps,
    mapChangePasswordStateToProps,
    mapChangePasswordDispatchToProps
  );
  const [validationSchema, setValidationSchema] = useState(
    policy ? changePasswordValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        fromRedux.onGetPolicy();
      } else if (!validationSchema) {
        setValidationSchema(changePasswordValidationSchema(policy));
      }
    },
    [policy]
  );

  return { ...fromRedux, validationSchema };
}

const mapChangeUsernameStateToProps = {
  policy: sel.policy,
  isApiRequestingChangeUsername: or(
    sel.isApiRequestingInit,
    sel.isApiRequestingChangeUsername
  ),
  loggedInAsUsername: sel.loggedInAsUsername,
  changeUsernameResponse: sel.apiChangeUsernameResponse
};

const mapChangeUsernameDispatchToProps = {
  onChangeUsername: act.onSaveChangeUsername,
  onGetPolicy: act.onGetPolicy
};

export function useChangeUsername(ownProps) {
  const { policy, ...fromRedux } = useRedux(
    ownProps,
    mapChangeUsernameStateToProps,
    mapChangeUsernameDispatchToProps
  );
  const [validationSchema, setValidationSchema] = useState(
    policy ? changeUsernameValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        fromRedux.onGetPolicy();
      } else if (!validationSchema) {
        setValidationSchema(changeUsernameValidationSchema(policy));
      }
    },
    [policy]
  );

  return { ...fromRedux, validationSchema };
}
