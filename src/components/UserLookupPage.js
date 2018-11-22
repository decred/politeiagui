import React from "react";
import LoadingIcon from "./snew/LoadingIcon";
import { Field, reduxForm } from "redux-form";
import Link from "./snew/Link";
import Message from "./Message";
import searchUserConnector from "../connectors/userSearch";

class UserLookupPage extends React.PureComponent {
  handleSubmit = args => {
    this.props.onSearchUser({ [args.parameter]: args.searchusers });
  };

  render() {
    const { userSearch, error, isLoading, handleSubmit } = this.props;
    return (
      <div className="content" role="main">
        <form
          className="search-form"
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
          id="searchusers"
          role="search"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          {isLoading ? (
            <LoadingIcon
              hidden={!isLoading}
              width={200}
              style={{ paddingTop: "50px", margin: "0 auto" }}
            />
          ) : (
            <div>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-around"
                }}
              >
                Search by:
                <label>
                  <Field
                    name="parameter"
                    component="input"
                    type="radio"
                    value="email"
                  />{" "}
                  Email
                </label>
                <label>
                  <Field
                    name="parameter"
                    component="input"
                    type="radio"
                    value="username"
                  />{" "}
                  Username
                </label>
              </div>
              <div>
                <Field
                  name="searchusers"
                  component="input"
                  type="text"
                  placeholder="user email or username"
                  size={80}
                  tabIndex={1}
                />
                <input tabIndex="2" type="submit" value="" />
              </div>
            </div>
          )}
        </form>
        {error && (
          <Message type="error" header="Cannot search for user" body={error} />
        )}
        {userSearch && !isLoading && (
          <div className="search-results">
            <h3>
              Matches {userSearch.totalmatches} of {userSearch.totalusers} users
            </h3>
            {userSearch.users.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {userSearch.users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <Link href={`/user/${user.id}`}>{user.id}</Link>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default reduxForm({
  form: "form/user-search",
  initialValues: { parameter: "email" }
})(searchUserConnector(UserLookupPage));
