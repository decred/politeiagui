import React from "react";
import AdminView from "./AdminView";
import UserView from "./UserView";

const Proxy = ({ user, isAdmin }) => {
  if (isAdmin) return <AdminView user={user} />;
  return <UserView user={user} />;
};

export default Proxy;
