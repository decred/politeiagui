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
import { useSearchUser } from "./hooks";
import styles from "./Search.module.css";
import Link from "src/components/Link";
import { searchSchema } from "./validation";

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
    if (isCMS) {
      return [
        { value: "domain", label: "Domain" },
        { value: "contractortype", label: "Contractor type" }
      ];
    }
    return [
      { value: "email", label: "Email" },
      { value: "username", label: "Username" }
    ];
  }, [isCMS]);

  async function onSubmit(values, { setSubmitting }) {
    try {
      setSearchError(null);
      const isByDomain = values.searchBy === "domain";
      const isByType = values.searchBy === "contractortype";
      const isByEmail = values.searchBy === "email";
      const isByUsername = values.searchBy === "username";

      await onSearchUser(
        {
          [values.searchBy]:
            isByUsername || isByEmail
              ? values.searchTerm
              : isByType
              ? values.contractortype.value
              : isByDomain
              ? values.domain.value
              : ""
        },
        isCMS
      );
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
              searchBy: !isCMS ? "email" : "domain",
              contractortype: undefined,
              domain: undefined
            }}
            onSubmit={onSubmit}
            validationSchema={searchSchema}>
            {({
              values,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              isValid
            }) => {
              const handleChangeSearchBy = (v) =>
                setFieldValue("searchBy", v.value);
              const handleChangeSelectField = (field) => (v) =>
                setFieldValue(field, v);
              const isByDomain = values.searchBy === "domain";
              const isByType = values.searchBy === "contractortype";
              const isByEmail = values.searchBy === "email";
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
                    {!isCMS && (
                      <BoxTextInput
                        name="searchTerm"
                        className={styles.searchBox}
                        value={values.searchTerm}
                        onChange={handleChange}
                        placeholder={isByEmail ? "User email" : "Username"}
                      />
                    )}
                    {isByType && (
                      <SelectField
                        name="contractortype"
                        className={styles.select}
                        options={selectTypeOptions}
                        value={values.contractortype}
                        onChange={handleChangeSelectField("contractortype")}
                        placeholder="Choose contractor type"
                      />
                    )}
                    {isByDomain && (
                      <SelectField
                        name="domain"
                        className={styles.select}
                        options={selectDomainOptions}
                        value={values.domain}
                        onChange={handleChangeSelectField("domain")}
                        placeholder="Choose a domain"
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
