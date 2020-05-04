import React, { useCallback } from "react";
import { Dropdown, DropdownItem } from "pi-ui";
import { useAdminDccActions } from "./hooks";
import AdminContent from "src/components/AdminContent";
import { isDccActive } from "../helpers";

const DccActions = ({ dcc, className }) => {
  if (!useAdminDccActions()) {
    throw Error(
      "Admin dccs actions requires an 'AdminActionsProvider' on a higher level of the component tree. "
    );
  }
  const { onApprove, onReject } = useAdminDccActions();

  const withDcc = useCallback(
    (fn) => () => {
      fn(dcc);
    },
    [dcc]
  );

  return isDccActive(dcc) ? (
    <AdminContent>
      <div className={className}>
        <Dropdown title="Approve/Reject DCC" itemsListClassName="full-width">
          <DropdownItem onClick={withDcc(onApprove)}>Approve</DropdownItem>
          <DropdownItem onClick={withDcc(onReject)}>Reject</DropdownItem>
        </Dropdown>
      </div>
    </AdminContent>
  ) : null;
};

export default DccActions;
