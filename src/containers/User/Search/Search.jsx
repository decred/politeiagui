import React, { useState, useEffect } from "react";
import {
  BoxTextInput,
  Button,
  RadioButtonGroup,
  Table,
  Card,
  Message
} from "pi-ui";
import { Formik } from "formik";
import styles from "./Search.module.css";
import * as Yup from "yup";
import { useSearchUser } from "./hooks";
import HelpMessage from "src/componentsv2/HelpMessage";

const getFormattedSearchResults = (users = []) =>
  users.map(u => ({ Username: u.username, Email: u.email, ID: u.id }));

const UserSearch = ({ TopBanner, PageDetails, Sidebar, Main, Title }) => {
  const { onSearchUser, searchResult } = useSearchUser();
  const [searchError, setSearchError] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  async function onSubmit(values, { resetForm, setSubmitting, setFieldError }) {
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
  const usersResult = searchResult && searchResult.users;
  useEffect(
    function updateFoundUsers() {
      if (!!usersResult) {
        setFoundUsers(getFormattedSearchResults(usersResult));
      }
    },
    [usersResult]
  );
  return (
    <>
      <TopBanner>
        <Formik
          initialValues={{
            searchTerm: "",
            searchBy: "username"
          }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            searchTerm: Yup.string().required("Required")
          })}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            errors,
            isValid,
            touched
          }) => {
            function handleChangeSearchBy(v) {
              setFieldValue("searchBy", v.value);
            }
            return (
              <PageDetails
                actionsContent={null}
                title={
                  <>
                    <Title className="margin-right-m">Search</Title>
                    <RadioButtonGroup
                      label="Search by"
                      options={[
                        { value: "username", label: "username" },
                        { value: "email", label: "email" }
                      ]}
                      value={values.searchBy}
                      onChange={handleChangeSearchBy}
                    />
                  </>
                }
              >
                <form className={styles.searchForm}>
                  <BoxTextInput
                    name="searchTerm"
                    className={styles.searchBox}
                    value={values.searchTerm}
                    onChange={handleChange}
                    placeholder="User email or username"
                  />

                  <Button
                    className={styles.searchButton}
                    onClick={handleSubmit}
                    type="submit"
                    loading={isSubmitting}
                    kind={isValid ? "primary" : "disabled"}
                  >
                    Search
                  </Button>
                </form>
              </PageDetails>
            );
          }}
        </Formik>
      </TopBanner>
      <Sidebar />
      <Main>
        {searchError ? (
          <Message kind="error">{searchError.toString()}</Message>
        ) : foundUsers && !!foundUsers.length ? (
          <Card className="container">
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
