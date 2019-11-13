import { Message } from "pi-ui";
import React from "react";
import { useCredits } from "./hooks.js";
import AdminCredits from "./AdminCredits";
import AdminUserCredits from "./AdminUserCredits";
import UserCredits from "./UserCredits";

const Credits = ({ user }) => {
  const {
    currentUserID,
    isAdmin
  } = useCredits({ userid: user.userid });

  const isUserPageOwner = user && currentUserID === user.userid;

  const isAdminOrTheUser = user && (isAdmin || currentUserID === user.userid);

  return !isAdminOrTheUser ? (
    <Message kind="error">
      Only admins or the user himself can access this route.
    </Message>
  ) : isAdmin && !isUserPageOwner ? (
    <AdminCredits />
  ) : !isAdmin && isUserPageOwner ? (
    <UserCredits />
  ) : (
    <AdminUserCredits />
  );
};

export default Credits;
