import React from "react";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import OtherIdentity from "./OtherIdentity";
import UserIdentity from "./UserIdentity";

const Identity = (props) => {
  const {
    loggedInAsUserId,
    user
  } = useUserIdentity();

  const isUserPageOwner = user && loggedInAsUserId === user.id;
  return isUserPageOwner ? (
    <UserIdentity {...props} />
  ) : (
    <OtherIdentity {...props} />
  );
};

export default Identity;
