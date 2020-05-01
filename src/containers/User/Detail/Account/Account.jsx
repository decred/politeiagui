import PropTypes from "prop-types";
import React from "react";
import AdminAccount from "./AdminAccount";
import UserAccount from "./UserAccount";
import OtherAccount from "./OtherAccount";

const Account = ({
  isAdmin, // from the logged in user
  isUserPageOwner,
  ...props
}) =>
  isAdmin ? (
    <AdminAccount isUserPageOwner={isUserPageOwner} {...props} />
  ) : !isAdmin && isUserPageOwner ? (
    <UserAccount {...props} />
  ) : (
    <OtherAccount isadmin={props.isadmin} />
  );

Account.propTypes = {
  newuserpaywalladdress: PropTypes.string,
  newuserpaywallamount: PropTypes.number,
  newuserpaywalltxnotbefore: PropTypes.number,
  failedloginattempts: PropTypes.number,
  newuserverificationtoken: PropTypes.any,
  newuserverificationexpiry: PropTypes.number,
  updatekeyverificationtoken: PropTypes.any,
  updatekeyverificationexpiry: PropTypes.number,
  resetpasswordverificationexpiry: PropTypes.number,
  resetpasswordverificationtoken: PropTypes.any,
  islocked: PropTypes.bool,
  id: PropTypes.string,
  isadmin: PropTypes.bool,
  isdeactivated: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isUserPageOwner: PropTypes.bool
};

export default Account;
