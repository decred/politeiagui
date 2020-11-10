import React, { useState } from "react";
import { classNames, Card } from "pi-ui";
import ManageDccForm from "./ManageDccForm";
import UserView from "./UserView";
import EditContractorForm from "./EditContractorForm";
import useContractor from "../hooks/useContractor";
import isEmpty from "lodash/isEmpty";

const ManageContractor = ({ userID, isUserPageOwner }) => {
  const [showContractorInfoForm, setShowContractorInfoForm] = useState(true);

  const {
    user,
    isAdmin,
    onUpdateDccInfo,
    isDeveloper,
    onUpdateContractorInfo,
    requireGitHubName,
    loading
  } = useContractor(userID);

  const [showDccForm, setShowDccForm] = useState(isAdmin);

  const onToggleDccEdit = () => setShowDccForm(isAdmin && !showDccForm);
  const onToggleContractorInfoEdit = () =>
    setShowContractorInfoForm(!showContractorInfoForm);

  const enableEditMode = isUserPageOwner || isAdmin;
  const canEditDccInfo = isAdmin && !showDccForm;
  const canEditContractorInfo = isUserPageOwner && !showContractorInfoForm;

  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      {canEditDccInfo && (
        <div className="margin-bottom-m">
          <ManageDccForm user={user} onUpdate={onUpdateDccInfo} />
        </div>
      )}
      {!loading && user.cmsinfo && (
        <UserView
          user={user}
          showGitHubName={isDeveloper || !isEmpty(user.githubname)}
          requireGitHubName={requireGitHubName && isUserPageOwner}
          hideDccInfo={canEditDccInfo}
          hideContractorInfo={canEditContractorInfo}
          showDccForm={isAdmin}
          showContractorInfoForm={showContractorInfoForm}
          onToggleDccEdit={onToggleDccEdit}
          onToggleContractorInfoEdit={onToggleContractorInfoEdit}
          enableEditMode={enableEditMode}
        />
      )}
      {canEditContractorInfo && (
        <EditContractorForm
          onEdit={onUpdateContractorInfo}
          user={user}
          onClose={onToggleContractorInfoEdit}
        />
      )}
    </Card>
  );
};

export default ManageContractor;
