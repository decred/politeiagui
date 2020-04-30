import { Spinner, Button, Message, H2 } from "pi-ui";
import SelectField from "src/components/Select/SelectField";
import React, { useCallback, useMemo, useState } from "react";
import InfoSection from "../InfoSection.jsx";
import { selectTypeOptions, selectDomainOptions } from "./helpers";
import UserSearchSelect from "src/containers/User/Search/SearchSelector";
import { Formik } from "formik";
import styles from "./ManageContractor.module.css";
import useMultipleUsers from "../../hooks/useMultipleUsers";

const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: "200px"
  })
};

const selectSupervisorStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%"
  })
};

const ManageDccForm = ({ onUpdate, user }) => {
  const { domain, contractortype, userid, supervisoruserids = [] } = user;
  const [updated, setUpdated] = useState(false);

  const [users, loadingUsers] = useMultipleUsers(supervisoruserids);
  const isLoading =
    domain === undefined || contractortype === undefined || loadingUsers;

  const usersInitialValue = useMemo(
    () =>
      Object.keys(users).map((uid) => {
        const currUser = users[uid];
        return {
          value: currUser.userid,
          label: `${currUser.username} | ${currUser.email}`
        };
      }),
    [users]
  );

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
      initialValues={{
        domain,
        type: contractortype,
        users: usersInitialValue
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
        const submitEnabled = dirty && !loadingUsers;
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
                    <UserSearchSelect
                      onChange={handleChangeUserSelector}
                      styles={selectSupervisorStyles}
                      value={values.users}
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
