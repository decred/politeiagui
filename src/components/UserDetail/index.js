import React, { Component } from "react";
import { autobind } from "core-decorators";
import UserDetailPage from "./Page";
import userConnector from "../../connectors/user";
import { USER_DETAIL_TAB_GENERAL, USER_DETAIL_TAB_PROPOSALS } from "../../constants";

class UserDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabId: this.isAdminOrTheUser(props) ? USER_DETAIL_TAB_GENERAL : USER_DETAIL_TAB_PROPOSALS
    };
  }

  componentDidMount() {
    this.props.onFetchData(this.props.userId);
  }

  isAdminOrTheUser({ user, loggedInAsUserId }) {
    return user && (user.isadmin || user.id === loggedInAsUserId);
  }

  componentWillReceiveProps({ editUserResponse, ...props }) {
    if(editUserResponse) {
      window.location.reload();
    }

    if(this.isAdminOrTheUser(props)) {
      this.setState({ tabId: USER_DETAIL_TAB_GENERAL });
    }

  }

  onTabChange(tabId) {
    this.setState({ tabId: tabId });
  }

  render() {
    const { isTestnet } = this.props;
    let dcrdataTxUrl;
    if(isTestnet) {
      dcrdataTxUrl = "https://testnet.dcrdata.org/tx/";
    } else {
      dcrdataTxUrl = "https://explorer.dcrdata.org/tx/";
    }

    return (
      <UserDetailPage
        {...{
          ...this.props,
          dcrdataTxUrl,
          tabId: this.state.tabId,
          onTabChange: this.onTabChange
        }}
      />
    );
  }
}

autobind(UserDetail);

export default userConnector(UserDetail);
