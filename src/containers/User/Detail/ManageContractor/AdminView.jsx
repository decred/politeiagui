import { Card, classNames } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import { SelectField } from "src/componentsv2/Select";
import InfoSection from "../InfoSection.jsx";
import { selectTypeOptions, selectDomainOptions } from "./helpers";
import UserSearchSelect from "src/containers/User/Search/SearchSelector";
import { Formik } from "formik";

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

const ManageContractor = ({}) => {
  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <Formik initialValues={{ domain: 1, type: 1, users: [] }}>
        {({ values, setFieldValue }) => {
          const handleChangeUserSelector = (options) => {
            setFieldValue("users", options);
          };
          return (
            <form>
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
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default ManageContractor;
