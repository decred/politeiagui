import React from "react";
import { Card, classNames } from "pi-ui";
import InfoSection from "../InfoSection.jsx";
import { typeOptions, domainOptions } from "./helpers";

const ManageContractorUserView = ({ user }) => {
  const { domain, contractortype, supervisoruserids = [] } = user;
  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <InfoSection
        className="no-margin-top"
        label="Domain:"
        info={domainOptions[domain]}
      />
      <InfoSection
        label="Contractor type:"
        info={typeOptions[contractortype]}
      />
      <InfoSection
        label="Supervisors IDs:"
        info={
          supervisoruserids.length
            ? supervisoruserids.join(", ")
            : "No supervisors"
        }
      />
    </Card>
  );
};

export default ManageContractorUserView;
