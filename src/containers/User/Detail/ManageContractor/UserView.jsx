import React from "react";
import PropTypes from "prop-types";
import { H2, Message } from "pi-ui";
import InfoSection from "../InfoSection.jsx";
import { typeViewOptions, domainOptions } from "./helpers";

const UserDccInfo = ({ contractorType, domain, supervisorIds }) => (
  <>
    <H2>DCC Info</H2>
    <div className="margin-top-s margin-bottom-s">
      <InfoSection label="Contractor Type" info={contractorType} />
      <InfoSection label="Domain" info={domain} />
      <InfoSection
        label="Supervisors IDs"
        info={
          supervisorIds.length ? supervisorIds.join(", ") : "No supervisors"
        }
      />
    </div>
  </>
);

const UserContractorInfo = ({
  githubname,
  matrixname,
  contractorcontact,
  contractorname,
  contractorlocation,
  showGitHubName
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
    </div>
  </>
);

const ManageContractorUserView = ({
  user,
  showGitHubName,
  requireGitHubName,
  hideDccInfo,
  hideContractorInfo
}) => {
  const { domain, contractortype, supervisoruserids = [] } = user;

  return (
    <>
      {requireGitHubName && (
        <Message kind="warning" className="margin-bottom-s">
          Update your GitHub Username information
        </Message>
      )}
      {!hideDccInfo && (
        <UserDccInfo
          contractorType={typeViewOptions[contractortype]}
          domain={domainOptions[domain]}
          supervisorIds={supervisoruserids}
        />
      )}
      {!hideContractorInfo && (
        <UserContractorInfo {...{ ...user, showGitHubName }} />
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
