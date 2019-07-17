import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import { useEffect, useState } from "react";
import usePolicy from "src/hooks/usePolicy";
import * as act from "src/actions";
import {
  MANAGE_USER_CLEAR_USER_PAYWALL,
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_REACTIVATE,
  MANAGE_USER_UNLOCK
} from "src/constants";
import { arg, or } from "src/lib/fp";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";
import {
  changePasswordValidationSchema,
  changeUsernameValidationSchema
} from "./validation";

const mapStateToProps = {
  userId: compose(
    get(["match", "params", "userid"]),
    arg(1)
  ),
  isAdmin: sel.isAdmin,
  user: sel.user,
  loading: sel.isApiRequestingUser,
  loggedInAsUserId: sel.userid
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
  isApiRequestingChangePassword: or(
    sel.isApiRequestingInit,
    sel.isApiRequestingChangePassword
  ),
  changePasswordResponse: sel.apiChangePasswordResponse
};

const mapChangePasswordDispatchToProps = {
  onChangePassword: act.onSaveChangePassword
};

export function useChangePassword(ownProps) {
  const fromRedux = useRedux(
    ownProps,
    mapChangePasswordStateToProps,
    mapChangePasswordDispatchToProps
  );
  const { policy } = usePolicy();
  const [validationSchema, setValidationSchema] = useState(
    policy ? changePasswordValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!!policy && !validationSchema) {
        setValidationSchema(changePasswordValidationSchema(policy));
      }
    },
    [policy, validationSchema]
  );

  return { ...fromRedux, validationSchema };
}

const mapChangeUsernameStateToProps = {
  isApiRequestingChangeUsername: or(
    sel.isApiRequestingInit,
    sel.isApiRequestingChangeUsername
  ),
  username: sel.getUserUsername,
  changeUsernameResponse: sel.apiChangeUsernameResponse
};

const mapChangeUsernameDispatchToProps = {
  onChangeUsername: act.onSaveChangeUsername
};

export function useChangeUsername(ownProps) {
  const fromRedux = useRedux(
    ownProps,
    mapChangeUsernameStateToProps,
    mapChangeUsernameDispatchToProps
  );
  const { policy } = usePolicy();
  const [validationSchema, setValidationSchema] = useState(
    policy ? changeUsernameValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!!policy && !validationSchema) {
        setValidationSchema(changeUsernameValidationSchema(policy));
      }
    },
    [policy, validationSchema]
  );

  return { ...fromRedux, validationSchema };
}

const mapManageUserStateToProps = {
  user: sel.user,
  isApiRequestingUpdateUserKey: sel.isApiRequestingUpdateUserKey,
  isApiRequestingMarkAsPaid: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) === MANAGE_USER_CLEAR_USER_PAYWALL,
  isApiRequestingMarkNewUserAsExpired: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) === MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  isApiRequestingMarkUpdateKeyAsExpired: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) === MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  isApiRequestingMarkResetPasswordAsExpired: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) ===
      MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  isApiRequestingUnlockUser: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) === MANAGE_USER_UNLOCK,
  isApiRequestingDeactivateUser: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) === MANAGE_USER_DEACTIVATE,
  isApiRequestingReactivateUser: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) === MANAGE_USER_REACTIVATE,
  manageUserResponse: sel.manageUserResponse
};

const mapManageUserDispatchToProps = {
  onManageUser: act.onManageUserv2
};

export function useManageUser(ownProps) {
  const { ...fromRedux } = useRedux(
    ownProps,
    mapManageUserStateToProps,
    mapManageUserDispatchToProps
  );
  return { ...fromRedux, validateUUID };
}

export function useMarkAsExpiredConfirmModal() {
  const [
    showMarkAsExpiredConfirmModal,
    setShowMarkAsExpiredConfirmModal
  ] = useState(false);
  const openMarkAsExpiredConfirmModal = () =>
    setShowMarkAsExpiredConfirmModal(true);
  const closeMarkAsExpiredConfirmModal = () =>
    setShowMarkAsExpiredConfirmModal(false);
  return {
    showMarkAsExpiredConfirmModal,
    openMarkAsExpiredConfirmModal,
    closeMarkAsExpiredConfirmModal
  };
}

export function useActivationModal() {
  const [showActivationConfirmModal, setShowActivationConfirmModal] = useState(
    false
  );
  const openActivationModal = e => {
    e.preventDefault();
    setShowActivationConfirmModal(true);
  };
  const closeActivationModal = () => {
    setShowActivationConfirmModal(false);
  };
  return {
    showActivationConfirmModal,
    openActivationModal,
    closeActivationModal
  };
}

export function useMarkAsPaidModal() {
  const [showMarkAsPaidConfirmModal, setShowMarkAsPaidConfirmModal] = useState(
    false
  );
  const openMarkAsPaidModal = e => {
    e.preventDefault();
    setShowMarkAsPaidConfirmModal(true);
  };
  const closeMarkAsPaidModal = () => {
    setShowMarkAsPaidConfirmModal(false);
  };
  return {
    showMarkAsPaidConfirmModal,
    openMarkAsPaidModal,
    closeMarkAsPaidModal
  };
}
