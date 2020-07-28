import React from "react";
import PropTypes from "prop-types";
import { H2, Message, Button, Spinner } from "pi-ui";
import InfoSection from "../InfoSection.jsx";
import { typeOptions, domainOptions, getOwnedProposals } from "./helpers";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";

const UserDccInfo = ({
  contractorType,
  domain,
  supervisorIds,
  proposalsOwned,
  isLoadingProposals,
  showEdit,
  onToggleDccEdit
}) => {
  const supervisors = supervisorIds.length
    ? supervisorIds.join(", ")
    : "No supervisors";
  const proposals = proposalsOwned.length
    ? proposalsOwned.join(", ")
    : "No owned proposals";
  return (
    <>
      <H2>DCC Info</H2>
      <div className="margin-top-s margin-bottom-s">
        <InfoSection label="Contractor Type" info={contractorType} />
        <InfoSection label="Domain" info={domain} />
        <InfoSection label="Supervisors IDs" info={supervisors} />
        <InfoSection
          label="Owned Proposals"
          info={isLoadingProposals ? <Spinner invert /> : proposals}
        />
      </div>
      {showEdit && (
        <Button className="margin-bottom-m" onClick={onToggleDccEdit}>
          Edit
        </Button>
      )}
    </>
  );
};

const UserContractorInfo = ({
  githubname,
  matrixname,
  contractorcontact,
  contractorname,
  contractorlocation,
  showGitHubName,
  showEdit,
  onToggleContractorInfoEdit
}) => (
  <>
    <H2>Contractor Info</H2>
    <div className="margin-top-s">
      <InfoSection label="Name" info={contractorname} />
      {showGitHubName && (
        <InfoSection label="GitHub Username" info={githubname} />
      )}
      <InfoSection label="Matrix Name" info={matrixname} />
      <InfoSection label="Location" info={contractorlocation} />
      <InfoSection label="Contact" info={contractorcontact} />
      {showEdit && <Button onClick={onToggleContractorInfoEdit}>Edit</Button>}
    </div>
  </>
);

const ManageContractorUserView = ({
  user,
  showGitHubName,
  requireGitHubName,
  hideDccInfo,
  hideContractorInfo,
  showDccForm,
  showContractorInfoForm,
  onToggleDccEdit,
  onToggleContractorInfoEdit
}) => {
  const { domain, contractortype, supervisoruserids = [] } = user;
  const { proposalsByToken, isLoading } = useApprovedProposals();
  const ownedProposals = getOwnedProposals(
    user.proposalsowned,
    proposalsByToken
  );
  return (
    <>
      {requireGitHubName && (
        <Message kind="warning" className="margin-bottom-s">
          Update your GitHub Username information
        </Message>
      )}
      {!hideDccInfo && (
        <UserDccInfo
          contractorType={typeOptions[contractortype]}
          domain={domainOptions[domain]}
          supervisorIds={supervisoruserids}
          proposalsOwned={ownedProposals}
          isLoadingProposals={isLoading}
          showEdit={showDccForm}
          onToggleDccEdit={onToggleDccEdit}
        />
      )}
      {!hideContractorInfo && (
        <UserContractorInfo
          {...{
            ...user,
            showGitHubName,
            showEdit: showContractorInfoForm,
            onToggleContractorInfoEdit
          }}
        />
      )}
    </>
  );
};

ManageContractorUserView.propTypes = {
  user: PropTypes.object.isRequired,
  showGitHubName: PropTypes.bool,
  hideContractorInfo: PropTypes.bool,
  hideDccInfo: PropTypes.bool
};

ManageContractorUserView.defaultProps = {
  showGitHubName: false,
  hideDccInfo: false,
  hideContractorInfo: false
};

export default ManageContractorUserView;
