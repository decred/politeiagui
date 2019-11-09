import { Message } from "pi-ui";
import React from "react";
import { useManageUser } from "../hooks.js";
import { useCredits } from "./hooks.js";
import AdminCredits from "./AdminCredits";
import AdminUserCredits from "./AdminUserCredits";
import UserCredits from "./UserCredits";

const Credits = () => {
  const { user } = useManageUser();
  const {
    loggedInAsUserId,
    isAdmin
  } = useCredits({ userid: user.id });

  const isUserPageOwner = user && loggedInAsUserId === user.id;

  const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);

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
