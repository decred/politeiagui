import React, { useState, useCallback } from "react";
import { classNames, Card, Link, Icon } from "pi-ui";
import ManageDccForm from "./ManageDccForm";
import UserView from "./UserView";
import EditContractorForm from "./EditContractorForm";
import useContractor from "../hooks/useContractor";
import styles from "./ManageContractor.module.css";
import isEmpty from "lodash/isEmpty";

const ManageContractor = ({ userID, isUserPageOwner }) => {
  const [editMode, setEditMode] = useState(false);
  const {
    user,
    isAdmin,
    onUpdateDccInfo,
    isDeveloper,
    onUpdateContractorInfo,
    requireGitHubName
  } = useContractor(userID);

  const onToggleEditMode = useCallback(
    (e) => {
      e && e.preventDefault();
      setEditMode(!editMode);
    },
    [setEditMode, editMode]
  );

  const enableEditMode = isUserPageOwner || isAdmin;
  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      {enableEditMode && (
        <Link onClick={onToggleEditMode} className={styles.editDcc}>
          <Icon type="edit" />
        </Link>
      )}
      {isAdmin && editMode && (
        <div className="margin-bottom-m">
          <ManageDccForm user={user} onUpdate={onUpdateDccInfo} />
        </div>
      )}
      <UserView
        user={user}
        showGitHubName={isDeveloper || !isEmpty(user.githubname)}
        requireGitHubName={requireGitHubName && isUserPageOwner}
        hideDccInfo={isAdmin && editMode}
        hideContractorInfo={isUserPageOwner && editMode}
      />
      {isUserPageOwner && editMode && (
        <EditContractorForm
          onEdit={onUpdateContractorInfo}
          user={user}
          onClose={onToggleEditMode}
        />
      )}
    </Card>
  );
};

export default ManageContractor;
