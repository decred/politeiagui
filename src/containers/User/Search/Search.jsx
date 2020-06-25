import { useMemo } from "react";
import { Formik } from "formik";
import {
  BoxTextInput,
  Button,
  Card,
  classNames,
  Message,
  RadioButtonGroup,
  Table
} from "pi-ui";
import React, { useEffect, useState } from "react";
import {
  selectTypeOptions,
  selectDomainOptions
} from "src/containers/User/Detail/ManageContractor/helpers";
import HelpMessage from "src/components/HelpMessage";
import SelectField from "src/components/Select/SelectField";
import * as Yup from "yup";
import { useSearchUser } from "./hooks";
import styles from "./Search.module.css";
import Link from "src/components/Link";

const getFormattedSearchResults = (users = []) =>
  users.map((u) => ({
    Username: u.username,
    Email: u.email,
    ID: <Link to={`/user/${u.id}`}>{u.id}</Link>
  }));

const UserSearch = ({ TopBanner, PageDetails, Main, Title }) => {
  const { onSearchUser, searchResult, isCMS } = useSearchUser();
  const [searchError, setSearchError] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);

  const searchOptions = useMemo(() => {
    const options = [
      { value: "email", label: "Email" },
      { value: "username", label: "Username" }
    ];
    // If CMS mode, add two more filter options
    if (isCMS) {
      options.push(
        ...[
          { value: "domain", label: "Domain" },
          { value: "contractortype", label: "Contractor type" }
        ]
      );
    }
    return options;
  }, [isCMS]);

  async function onSubmit(values, { setSubmitting }) {
    try {
      setSearchError(null);
      await onSearchUser({
        [values.searchBy]: values.searchTerm
      });
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      setSearchError(e);
    }
  }

  useEffect(
    function updateFoundUsers() {
      if (searchResult) {
        setFoundUsers(getFormattedSearchResults(searchResult));
      }
    },
    [searchResult]
  );
  return (
    <>
      <TopBanner>
        <PageDetails
          actionsContent={null}
          title={<Title className="margin-right-m">Search</Title>}>
          <Formik
            initialValues={{
              searchTerm: "",
              searchBy: "email"
            }}
            onSubmit={onSubmit}
            validationSchema={Yup.object().shape({
              searchTerm: Yup.string().required("Required")
            })}>
            {({
              values,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              isValid
            }) => {
              const handleChangeSearchBy = (v) => {
                setFieldValue("searchBy", v.value);
              };
              const isByDomain = values.searchBy === "domain";
              const isByType = values.searchBy === "contractortype";
              const showTextBox = !isByDomain && !isByType;
              return (
                <form>
                  <RadioButtonGroup
                    className={styles.searchByRadioGroup}
                    optionClassName={styles.searchByRadioButton}
                    label=""
                    options={searchOptions}
                    value={values.searchBy}
                    onChange={handleChangeSearchBy}
                  />
                  <div className="justify-left margin-top-m">
                    {showTextBox && (
                      <BoxTextInput
                        name="searchTerm"
                        className={styles.searchBox}
                        value={values.searchTerm}
                        onChange={handleChange}
                        placeholder="User email or username"
                      />
                    )}
                    {isByType && (
                      <SelectField
                        name="type"
                        className={styles.select}
                        options={selectTypeOptions}
                      />
                    )}
                    {isByDomain && (
                      <SelectField
                        name="domain"
                        className={styles.select}
                        options={selectDomainOptions}
                      />
                    )}
                    <Button
                      className={styles.searchButton}
                      onClick={handleSubmit}
                      type="submit"
                      loading={isSubmitting}
                      kind={isValid ? "primary" : "disabled"}>
                      Search
                    </Button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        {searchError ? (
          <Message kind="error">{searchError.toString()}</Message>
        ) : foundUsers && !!foundUsers.length ? (
          <Card className={classNames("container", "margin-bottom-m")}>
            <Table data={foundUsers} headers={["Username", "Email", "ID"]} />
          </Card>
        ) : (
          <HelpMessage>No users to show</HelpMessage>
        )}
      </Main>
    </>
  );
};

export default UserSearch;
