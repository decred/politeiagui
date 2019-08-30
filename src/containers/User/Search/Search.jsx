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
import Link from "src/componentsv2/Link";
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
        <PageDetails
          actionsContent={null}
          title={<Title className="margin-right-m">Search</Title>}
          subtitle={
            <Link gray to="/proposals/unvetted">
              &#8592; Go back to unvetted proposals
            </Link>
          }
        >
          <Formik
            initialValues={{
              searchTerm: "",
              searchBy: "email"
            }}
            onSubmit={onSubmit}
            validationSchema={Yup.object().shape({
              searchTerm: Yup.string().required("Required")
            })}
          >
            {({
              values,
              handleChange,
              // handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              // errors,
              isValid
              // touched
            }) => {
              function handleChangeSearchBy(v) {
                setFieldValue("searchBy", v.value);
              }
              return (
                <form>
                  <RadioButtonGroup
                    className={styles.searchByRadioGroup}
                    label=""
                    options={[
                      { value: "email", label: "By email" },
                      { value: "username", label: "By username" }
                    ]}
                    value={values.searchBy}
                    onChange={handleChangeSearchBy}
                  />
                  <div className="justify-left margin-top-m">
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
                  </div>
                </form>
              );
            }}
          </Formik>
        </PageDetails>
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
