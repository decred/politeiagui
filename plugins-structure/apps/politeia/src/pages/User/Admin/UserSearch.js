import React, { useState } from "react";
import { H1, Link, RadioButtonGroup, Table } from "pi-ui";
import { RecordForm, SubmitButton, TextInput } from "@politeiagui/common-ui";
import { SingleContentPage } from "@politeiagui/common-ui/layout";
import styles from "./styles.module.css";
import { getMockUserMatches } from "./_mock";
import { InfoCard } from "../../../components";

const MODE_EMAIL = 1;
const MODE_USERNAME = 2;
const TABLE_HEADERS = {
  username: "Username",
  email: "E-mail",
  id: "ID",
};
const options = [
  { label: "E-mail", value: MODE_EMAIL },
  { label: "Username", value: MODE_USERNAME },
];

function SearchBanner({ onSubmit = () => {} }) {
  const [mode, setMode] = useState(MODE_EMAIL);
  function handleSubmit({ email, username }) {
    console.log("Searching for users", { email, username });
    onSubmit({ email, username });
  }
  return (
    <div>
      <H1>Search for Users</H1>
      <RecordForm className={styles.form} onSubmit={handleSubmit}>
        {({ formProps }) => (
          <>
            <RadioButtonGroup
              onChange={(args) => {
                setMode(args.value);
                formProps.reset();
              }}
              value={mode}
              options={options}
            />
            <div className={styles.fields}>
              {mode === MODE_EMAIL ? (
                <TextInput
                  name="email"
                  placeholder="Search by E-mail"
                  data-testid="admin-search-email"
                />
              ) : (
                <TextInput
                  name="username"
                  placeholder="Search by Username"
                  data-testid="admin-search-username"
                />
              )}
              <SubmitButton data-testid="admin-search-button">
                Search
              </SubmitButton>
            </div>
          </>
        )}
      </RecordForm>
    </div>
  );
}

function AdminUserSearch() {
  // TODO: use user layer api calls instead
  const { users } = getMockUserMatches(50);
  const formattedUsers = users.map((u) => ({
    [TABLE_HEADERS.username]: u.username,
    [TABLE_HEADERS.email]: u.email,
    [TABLE_HEADERS.id]: (
      <Link href={`/user/${u.id}`} data-link>
        {u.id}
      </Link>
    ),
  }));
  return (
    <SingleContentPage banner={<SearchBanner />}>
      {users ? (
        <InfoCard title="Search Results" data-testid="admin-search-results">
          <Table headers={Object.values(TABLE_HEADERS)} data={formattedUsers} />
        </InfoCard>
      ) : null}
    </SingleContentPage>
  );
}

export default AdminUserSearch;
