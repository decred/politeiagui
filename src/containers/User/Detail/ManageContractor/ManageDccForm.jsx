import { Button, Message, H2, Select } from "pi-ui";
import SelectField from "src/components/Select/SelectField";
import React, { useCallback, useState } from "react";
import InfoSection from "../InfoSection.jsx";
import {
  selectTypeOptions,
  getInitialAndOptionsProposals,
  getInitialAndOptionsSupervisors
} from "./helpers";
import { Formik } from "formik";
import styles from "./ManageContractor.module.css";
import useSupervisors from "src/hooks/api/useSupervisors";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import { usePolicy } from "src/hooks";
import { getContractorDomains } from "src/helpers";

const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: "200px",
    minWidth: "200px"
  })
};

const multipleSelectStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
    minWidth: "200px"
  })
};

const ManageDccForm = ({ onUpdate, user }) => {
  const {
    domain,
    contractortype,
    userid,
    supervisoruserids = [],
    proposalsowned = []
  } = user;
  const {
    policy: { supporteddomains }
  } = usePolicy();
  const contractorDomains = getContractorDomains(supporteddomains);
  const [updated, setUpdated] = useState(false);

  // Parse supervisors initial values and options
  const {
    loading: loadingSupervisors,
    supervisors,
    error: supervisorsError
  } = useSupervisors();
  const { supervisorsOptions, initialSupervisorOptions } =
    getInitialAndOptionsSupervisors(supervisors, supervisoruserids);

  // Parse owned proposals initial values and options
  const {
    proposals,
    isLoading: loadingOwnedProposals,
    error: approvedProposalsError
  } = useApprovedProposals();
  const { proposalsOptions, initialOwnedProposals } =
    getInitialAndOptionsProposals(proposals, proposalsowned);

  const handleSubmitForm = useCallback(
    async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
        await onUpdate(
          userid,
          values.domain,
          values.type,
          values.users.map((user) => user.value),
          values.proposals.map((prop) => prop.value)
        );
        setSubmitting(false);
        setUpdated(true);
        resetForm();
      } catch (e) {
        setFieldError("global", e);
        setSubmitting(false);
      }
    },
    [onUpdate, userid]
  );

  return (
    <Formik
      onSubmit={handleSubmitForm}
      enableReinitialize={true}
      initialValues={{
        domain,
        type: contractortype,
        users: initialSupervisorOptions,
        proposals: initialOwnedProposals
      }}>
      {({
        values,
        setFieldValue,
        handleSubmit,
        isSubmitting,
        dirty,
        errors
      }) => {
        const handleChangeUserSelector = (options) => {
          setFieldValue("users", options);
        };
        const handleChangeOwnedProposals = (options) => {
          setFieldValue("proposals", options);
        };
        const submitEnabled =
          dirty && !loadingSupervisors && !loadingOwnedProposals;
        return (
          <>
            <form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <Message className={styles.errorMessage} kind="error">
                  {errors.global.toString()}
                </Message>
              )}
              <H2>Edit DCC Info</H2>
              <div className="margin-bottom-m margin-top-m">
                <InfoSection
                  className="no-margin-top"
                  label="Contractor Type"
                  info={
                    <SelectField
                      name="type"
                      options={selectTypeOptions}
                      styles={selectStyles}
                    />
                  }
                />
                <InfoSection
                  label="Domain"
                  info={
                    <SelectField
                      name="domain"
                      options={contractorDomains}
                      styles={selectStyles}
                    />
                  }
                />
                <InfoSection
                  label="Supervisors"
                  isLoading={loadingSupervisors}
                  info={
                    <Select
                      placeholder="Select Supervisor"
                      value={values.users}
                      onChange={handleChangeUserSelector}
                      isMulti
                      options={supervisorsOptions}
                      styles={multipleSelectStyles}
                    />
                  }
                  error={supervisorsError}
                />
                <InfoSection
                  label="Owned Proposals"
                  error={approvedProposalsError}
                  isLoading={loadingOwnedProposals}
                  info={
                    <Select
                      placeholder="Select Proposals"
                      value={values.proposals}
                      onChange={handleChangeOwnedProposals}
                      isMulti
                      options={proposalsOptions}
                      styles={multipleSelectStyles}
                    />
                  }
                />
              </div>
              <Button
                kind={submitEnabled ? "primary" : "disabled"}
                loading={isSubmitting}
                type="submit">
                {updated && !submitEnabled
                  ? "DCC Info Updated ✓"
                  : "Update DCC Info"}
              </Button>
            </form>
          </>
        );
      }}
    </Formik>
  );
};

export default ManageDccForm;
