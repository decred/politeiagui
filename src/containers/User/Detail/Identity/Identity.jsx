import React from "react";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import OtherIdentity from "./OtherIdentity";
import UserIdentity from "./UserIdentity";

const Identity = ({ user, ...props }) => {
  const { currentUserID } = useUserIdentity();
  const isUserPageOwner = user && currentUserID === user.userid;
  return isUserPageOwner ? (
    <UserIdentity user={user} {...props} />
  ) : (
    <OtherIdentity user={user} {...props} />
  );
};

export default Identity;
