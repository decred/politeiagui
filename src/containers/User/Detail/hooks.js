import { useEffect, useState, useMemo } from "react";
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
import usePolicy from "src/hooks/api/usePolicy";
import { or } from "src/lib/fp";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";
import {
  changePasswordValidationSchema,
  changeUsernameValidationSchema
} from "./validation";

const mapDispatchToProps = {
  onFetchUser: act.onFetchUser
};

function validateUUID(str) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

export function useUserDetail(ownProps) {
  const userid = ownProps.userid || ownProps.match.params.userid;
  const userSelector = useMemo(() => sel.makeGetUserByID(userid), [userid]);
  const mapStateToProps = useMemo(
    () => ({
      user: userSelector,
      isAdmin: sel.currentUserIsAdmin,
      loading: sel.isApiRequestingUser,
      loggedInAsUserId: sel.currentUserID
    }),
    [userSelector]
  );
  const { user, isAdmin, loading, loggedInAsUserId, onFetchUser } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  useEffect(
    function handleFetchUser() {
      if (!validateUUID(userid)) {
        throw new Error("Invalid user ID");
      }
      const userMissingData = user && !user.identities;
      if (!loading && (!user || userMissingData)) {
        onFetchUser(userid);
      }
    },
    [user, userid, loading, onFetchUser]
  );

  return { user, isAdmin, loading, loggedInAsUserId };
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
  user: sel.currentUser,
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
