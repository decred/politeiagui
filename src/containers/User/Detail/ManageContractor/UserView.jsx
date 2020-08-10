import React from "react";
import PropTypes from "prop-types";
import { H2, Message, Button, Spinner } from "pi-ui";
import InfoSection from "../InfoSection.jsx";
import { typeOptions, getOwnedProposals, getSupervisorsNames } from "./helpers";
import { useApprovedProposals, useSupervisors, usePolicy } from "src/hooks";
import { getContractorDomains, getDomainName } from "src/helpers";

const UserDccInfo = ({
  contractorType,
  domain,
  userSupervisors,
  proposalsOwned,
  isLoadingProposals,
  showEdit,
  onToggleDccEdit
}) => {
  const supervisors = userSupervisors.length
    ? userSupervisors.join(", ")
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
        <InfoSection label="Supervisors" info={supervisors} />
        <InfoSection
          label="Owned Proposals"
          info={isLoadingProposals ? <Spinner invert /> : proposals}
        />
      </div>
      {showEdit && (
        <Button
          className="margin-bottom-m"
          onClick={onToggleDccEdit}
          kind={isLoadingProposals ? "disabled" : "primary"}>
          {isLoadingProposals ? <Spinner invert /> : "Edit"}
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
  const { supervisors } = useSupervisors();
  const {
    policy: { supporteddomains }
  } = usePolicy();

  const contractorDomains = getContractorDomains(supporteddomains);

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
          domain={getDomainName(contractorDomains, domain)}
          proposalsOwned={ownedProposals}
          isLoadingProposals={isLoading}
          userSupervisors={getSupervisorsNames(supervisors, supervisoruserids)}
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
