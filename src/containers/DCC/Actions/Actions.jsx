import React, { useCallback } from "react";
import {
  Button,
  classNames,
  useMediaQuery,
  Dropdown,
  DropdownItem
} from "pi-ui";
import { useAdminDccActions } from "./hooks";
import AdminContent from "src/componentsv2/AdminContent";
import { isDccActive } from "../helpers";

const DccActions = ({ dcc, extended }) => {
  if (!useAdminDccActions()) {
    throw Error(
      "Admin dccs actions requires an 'AdminActionsProvider' on a higher level of the component tree. "
    );
  }
  const mobile = useMediaQuery("(max-width: 560px)");
  const { onApprove, onReject } = useAdminDccActions();

  const withDcc = useCallback(
    fn => () => {
      fn(dcc);
    },
    [dcc]
  );

  const approveButton = (
    <Button onClick={withDcc(onApprove)}>Approve</Button>
  );
  const rejectButton = (
    <Button
      onClick={withDcc(onReject)}
      className={classNames("margin-right-s")}
      noBorder
      kind="secondary"
    >
      Reject
    </Button>
  );

  return isDccActive(dcc) && (
    <AdminContent>
      <div className="margin-top-m">
        {!extended && !mobile ? (
          <div className="justify-right">
            {rejectButton}
            {approveButton}
          </div>
        ) : (
          <Dropdown title="Approve/Reject Dcc">
            <DropdownItem>{approveButton}</DropdownItem>
            <DropdownItem>{rejectButton}</DropdownItem>
          </Dropdown>
        )}
      </div>
    </AdminContent>
  );
};

export default DccActions;
