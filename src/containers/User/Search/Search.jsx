import { Formik } from "formik";
import { BoxTextInput, Button, Card, classNames, Link, Message, RadioButtonGroup, Table } from "pi-ui";
import React, { useEffect, useState } from "react";
import HelpMessage from "src/componentsv2/HelpMessage";
import { useSearchUser } from "./hooks";
import styles from "./Search.module.css";
import * as Joi from "@hapi/joi";

const getFormattedSearchResults = (users = []) =>
  users.map(u => ({
    Username: u.username,
    Email: u.email,
    ID: <Link href={`/user/${u.id}`}>{u.id}</Link>
  }));

const UserSearch = ({ TopBanner, PageDetails, Main, Title }) => {
  const { onSearchUser, searchResult } = useSearchUser();
  const [searchError, setSearchError] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
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
  const usersResult = searchResult && searchResult.users;
  useEffect(
    function updateFoundUsers() {
      if (usersResult) {
        setFoundUsers(getFormattedSearchResults(usersResult));
      }
    },
    [usersResult]
  );

  const formSchema = Joi.object({
    searchTerm: Joi.string()
      .required(),
    searchBy: Joi.string()
  });

  const validate = (values) => {
    const { error } = formSchema.validate(values);
    return error;
  };

  return (
    <>
      <TopBanner>
        <PageDetails
          actionsContent={null}
          title={<Title className="margin-right-m">Search</Title>}
        >
          <Formik
            initialValues={{
              searchTerm: "",
              searchBy: "email"
            }}
            onSubmit={onSubmit}
            validate={validate}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              isValid
            }) => {
              function handleChangeSearchBy(v) {
                setFieldValue("searchBy", v.value);
              }
              return (
                <form>
                  <RadioButtonGroup
                    className={styles.searchByRadioGroup}
                    optionClassName={styles.searchByRadioButton}
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
