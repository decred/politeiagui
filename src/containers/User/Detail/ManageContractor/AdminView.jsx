import { Card, classNames } from "pi-ui";
import React, { useCallback } from "react";
import { Spinner, Button } from "pi-ui";
import { SelectField } from "src/componentsv2/Select";
import InfoSection from "../InfoSection.jsx";
import { selectTypeOptions, selectDomainOptions } from "./helpers";
import UserSearchSelect from "src/containers/User/Search/SearchSelector";
import { Formik } from "formik";
import { useAction } from "src/redux";
import { onManageCmsUserV2 } from "src/actions";
import styles from "./ManageContractor.module.css";

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
  const { domain, contractortype, userid } = user;
  const onUpdateContractor = useAction(onManageCmsUserV2);
  const isLoading = domain === undefined || contractortype === undefined;

  const handleSubmitForm = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      console.log(values);
      try {
        await onUpdateContractor(
          userid,
          values.domain,
          values.type,
          values.users.map((user) => user.value)
        );
        setSubmitting(false);
      } catch (e) {
        setFieldError("global", e);
        setSubmitting(false);
      }
    },
    []
  );

  return isLoading ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className={classNames("container", "margin-bottom-m")}>
      <Formik
        onSubmit={handleSubmitForm}
        initialValues={{ domain, type: contractortype, users: [] }}>
        {({ values, setFieldValue, handleSubmit, isSubmitting, dirty }) => {
          const handleChangeUserSelector = (options) => {
            setFieldValue("users", options);
          };
          return (
            <form onSubmit={handleSubmit}>
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
                kind={dirty ? "primary" : "disabled"}
                loading={isSubmitting}
                type="submit">
                Update
              </Button>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default ManageContractor;
