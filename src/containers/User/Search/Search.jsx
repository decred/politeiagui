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
  typeOptions
} from "src/containers/User/Detail/ManageContractor/helpers";
import HelpMessage from "src/components/HelpMessage";
import SelectField from "src/components/Select/SelectField";
import { useSearchUser } from "./hooks";
import styles from "./Search.module.css";
import Link from "src/components/Link";
import { usePolicy } from "src/hooks";
import { searchSchema } from "./validation";
import { getContractorDomains, getDomainName } from "src/helpers";
import get from "lodash/get";

const getFormattedSearchResults = (users = [], isCMS, supporteddomains) =>
  users.map((u) =>
    !isCMS
      ? {
          Username: u.username,
          Email: u.email,
          ID: <Link to={`/user/${u.id}`}>{u.id}</Link>
        }
      : {
          Username: <Link to={`/user/${u.id}`}>{u.username}</Link>,
          Domain: getDomainName(
            getContractorDomains(supporteddomains),
            u.domain
          ),
          Type: typeOptions[u.contractortype]
        }
  );

const filterUserResult = (result, filterValue) =>
  !filterValue
    ? result
    : result &&
      result.filter((u) => u && u.username && u.username.includes(filterValue));

const UserSearch = ({ TopBanner, PageDetails, Main, Title }) => {
  const { onSearchUser, searchResult, isCMS } = useSearchUser();
  const [searchError, setSearchError] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [filterValue, setFilterValue] = useState(); // filters on the client-side
  const supportedDomains = get(usePolicy(), ["policyPi", "domains"]);
  const contractorDomains = isCMS ? getContractorDomains(supportedDomains) : [];
  const searchOptions = useMemo(() => {
    if (isCMS) {
      return [
        { value: "domain", label: "Domain" },
        { value: "contractortype", label: "Contractor type" },
        { value: "username", label: "Username" }
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
      const isCmsSearchByUsername = isCMS && isByUsername;

      const hasFetched = filterValue && !isByDomain && !isByType;

      // cache requests
      if (!hasFetched) {
        await onSearchUser(
          !isCmsSearchByUsername
            ? {
                [values.searchBy]:
                  isByUsername || isByEmail
                    ? values.searchTerm
                    : isByType
                    ? values.contractortype.value
                    : isByDomain
                    ? values.domain.value
                    : ""
              }
            : {}, // no params are passed since we need to fetch all users
          isCMS
        );
      }
      setFilterValue(isCmsSearchByUsername ? values.searchTerm : null);
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      setSearchError(e);
    }
  }

  useEffect(
    function updateFoundUsers() {
      const filteredResult = filterUserResult(searchResult, filterValue);
      if (filteredResult) {
        setFoundUsers(
          getFormattedSearchResults(filteredResult, isCMS, supportedDomains)
        );
      }
    },
    [searchResult, isCMS, filterValue, supportedDomains]
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
                    {!isByType && !isByDomain && (
                      <BoxTextInput
                        data-testid="search-user"
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
                        options={contractorDomains}
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
            <Table
              data-testid="results-table"
              data={foundUsers}
              headers={
                !isCMS
                  ? ["Username", "Email", "ID"]
                  : ["Username", "Domain", "Type"]
              }
            />
          </Card>
        ) : (
          <HelpMessage>No users to show</HelpMessage>
        )}
      </Main>
    </>
  );
};

export default UserSearch;
