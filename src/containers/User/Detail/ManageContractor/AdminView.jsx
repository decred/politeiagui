import { Card, classNames, Spinner, Button, Message } from "pi-ui";
import SelectField from "src/components/Select/SelectField";
import React, { useCallback, useMemo, useState } from "react";
import InfoSection from "../InfoSection.jsx";
import { selectTypeOptions, selectDomainOptions } from "./helpers";
import UserSearchSelect from "src/containers/User/Search/SearchSelector";
import { Formik } from "formik";
import { useAction } from "src/redux";
import { onManageCmsUser } from "src/actions";
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

const ManageContractor = ({ user }) => {
  const { domain, contractortype, userid, supervisoruserids = [] } = user;
  const onUpdateContractor = useAction(onManageCmsUser);
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
        await onUpdateContractor(
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
    [onUpdateContractor, userid]
  );

  return isLoading ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className={classNames("container", "margin-bottom-m")}>
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
            <form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <Message className={styles.errorMessage} kind="error">
                  {errors.global.toString()}
                </Message>
              )}
              <InfoSection
                className="no-margin-top"
                label="Type:"
                info={
                  <SelectField
                    name="type"
                    options={selectTypeOptions}
                    styles={selectStyles}
                  />
                }
              />
              <InfoSection
                label="Domain:"
                info={
                  <SelectField
                    name="domain"
                    options={selectDomainOptions}
                    styles={selectStyles}
                  />
                }
              />
              <InfoSection
                label="Supervisors:"
                info={
                  <UserSearchSelect
                    onChange={handleChangeUserSelector}
                    styles={selectSupervisorStyles}
                    value={values.users}
                  />
                }
              />
              <Button
                kind={submitEnabled ? "primary" : "disabled"}
                loading={isSubmitting}
                type="submit">
                {updated && !submitEnabled ? "Updated ✓" : "Update"}
              </Button>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default ManageContractor;
