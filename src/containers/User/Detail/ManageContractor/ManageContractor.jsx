import React, { useState } from "react";
import { classNames, Card } from "pi-ui";
import ManageDccForm from "./ManageDccForm";
import UserView from "./UserView";
import EditContractorForm from "./EditContractorForm";
import useContractor from "../hooks/useContractor";
import { isEmpty } from "lodash";

const ManageContractor = ({ userID, isUserPageOwner }) => {
  const [showDccForm, setShowDccForm] = useState(true);
  const [showContractorInfoForm, setShowContractorInfoForm] = useState(true);

  const {
    user,
    isAdmin,
    onUpdateDccInfo,
    isDeveloper,
    onUpdateContractorInfo,
    requireGitHubName
  } = useContractor(userID);

  const onToggleDccEdit = () => setShowDccForm(!showDccForm);
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
      <UserView
        user={user}
        showGitHubName={isDeveloper || !isEmpty(user.githubname)}
        requireGitHubName={requireGitHubName && isUserPageOwner}
        hideDccInfo={canEditDccInfo}
        hideContractorInfo={canEditContractorInfo}
        enableEditMode={enableEditMode}
        showDccForm={showDccForm}
        showContractorInfoForm={showContractorInfoForm}
        onToggleDccEdit={onToggleDccEdit}
        onToggleContractorInfoEdit={onToggleContractorInfoEdit}
      />
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
