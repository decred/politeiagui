import React from "react";
import LoadingIcon from "./snew/LoadingIcon";
import { Field, reduxForm } from "redux-form";
import Link from "./snew/Link";
import Message from "./Message";
import searchUserConnector from "../connectors/userSearch";

class UserLookupPage extends React.Component {
  handleSubmit = (args) => {
    this.props.onSearchUser(args.searchusers);
  }

  render() {
    const {
      userSearch,
      error,
      isLoading,
      handleSubmit
    } = this.props;
    return (
      <div className="content" role="main">
        <form className="search-form" style={{ display: "flex", justifyContent: "center", width: "100%" }} id="searchusers" role="search" onSubmit={handleSubmit(this.handleSubmit)}>
          {isLoading ?
            <LoadingIcon
              hidden={!isLoading}
              width={200}
              style={{ paddingTop: "50px", margin: "0 auto" }} />
            :
            <div>
              <Field
                name="searchusers"
                component="input"
                type="text"
                placeholder="user email or username"
                size={80}
                tabIndex={1}
              />
              <input tabIndex="2" type="submit" value=""></input>
            </div>
          }
        </form>
        {error && (
          <Message type="error" header="Cannot search for user" body={error} />
        )}
        {userSearch && (
          <div className="user-search-results">
            <h3>Matches {userSearch.totalmatches} of {userSearch.totalusers} users</h3>
            <table>
              <tr>
                <th>
                  ID
                </th>
                <th>
                  Email
                </th>
                <th>
                  Username
                </th>
              </tr>
              {
                userSearch.users.map(user => (
                  <tr>
                    <td>
                      <Link href={`/user/${user.id}`}>
                        {user.id}
                      </Link>
                    </td>
                    <td>
                      {user.email}
                    </td>
                    <td>
                      {user.username}
                    </td>
                  </tr>
                ))
              }
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default reduxForm({ form: "form/user-search" })(searchUserConnector(UserLookupPage));
