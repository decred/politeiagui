import { Spinner, Button, Message, H2, Select } from "pi-ui";
import SelectField from "src/components/Select/SelectField";
import React, { useCallback, useState, useMemo } from "react";
import InfoSection from "../InfoSection.jsx";
import {
  selectTypeOptions,
  selectDomainOptions,
  getSupervisorsOptions
} from "./helpers";
import { Formik } from "formik";
import styles from "./ManageContractor.module.css";
import useSupervisors from "src/hooks/api/useSupervisors";

const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: "200px",
    minWidth: "200px"
  })
};

const selectSupervisorStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
    minWidth: "200px"
  })
};

const ManageDccForm = ({ onUpdate, user }) => {
  const { domain, contractortype, userid, supervisoruserids = [] } = user;
  const [updated, setUpdated] = useState(false);

  const { loading: loadingSupervisors, supervisors } = useSupervisors();

  const supervisorsOptions = useMemo(
    () => getSupervisorsOptions(supervisors, userid),
    [supervisors, userid]
  );

  const initialSupervisorOptions = useMemo(
    () =>
      supervisorsOptions.filter((option) =>
        supervisoruserids.some((supervisorid) => supervisorid === option.value)
      ),
    [supervisorsOptions, supervisoruserids]
  );

  const isLoading =
    domain === undefined || contractortype === undefined || loadingSupervisors;

  const handleSubmitForm = useCallback(
    async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
        await onUpdate(
          userid,
          values.domain,
          values.type,
          values.users.map((user) => user.value)
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

  return isLoading ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Formik
      onSubmit={handleSubmitForm}
      enableReinitialize={true}
      initialValues={{
        domain,
        type: contractortype,
        users: initialSupervisorOptions
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
        const submitEnabled = dirty && !loadingSupervisors;
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
                      options={selectDomainOptions}
                      styles={selectStyles}
                    />
                  }
                />
                <InfoSection
                  label="Supervisors"
                  info={
                    <Select
                      placeholder="Select Supervisor"
                      value={values.users}
                      onChange={handleChangeUserSelector}
                      isMulti
                      options={supervisorsOptions}
                      styles={selectSupervisorStyles}
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
