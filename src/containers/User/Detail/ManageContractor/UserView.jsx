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
  showEdit,
  onToggleDccEdit,
  supervisorsError
}) => {
  const {
    policyTicketVote: { summariespagesize: proposalPageSize }
  } = usePolicy();
  const {
    proposalsByToken,
    isLoading,
    error: proposalsError
  } = useApprovedProposals(proposalsOwned, proposalPageSize);

  const ownedProposals = getOwnedProposals(proposalsOwned, proposalsByToken);

  const supervisors = userSupervisors.length
    ? userSupervisors.join(", ")
    : "No supervisors";
  const proposals = ownedProposals.length
    ? ownedProposals.join(", ")
    : "No owned proposals";
  return (
    <>
      <H2>DCC Info</H2>
      <div className="margin-top-s margin-bottom-s">
        <InfoSection label="Contractor Type" info={contractorType} />
        <InfoSection label="Domain" info={domain} />
        <InfoSection
          label="Supervisors"
          info={supervisors}
          error={supervisorsError}
        />
        <InfoSection
          label="Owned Proposals"
          error={proposalsError}
          isLoading={isLoading}
          info={proposals}
        />
      </div>
      {showEdit && (
        <Button
          className="margin-bottom-m"
          onClick={onToggleDccEdit}
          kind={isLoading ? "disabled" : "primary"}
        >
          {isLoading ? <Spinner invert /> : "Edit"}
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

  const { supervisors, error: supervisorsError } = useSupervisors();
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
          proposalsOwned={user.proposalsowned}
          userSupervisors={getSupervisorsNames(supervisors, supervisoruserids)}
          supervisorsError={supervisorsError}
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
