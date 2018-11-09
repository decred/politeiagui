import React, { Component } from "react";
import { autobind } from "core-decorators";
import UserDetailPage from "./Page";
import userConnector from "../../connectors/user";
import { USER_DETAIL_TAB_PROPOSALS, USER_DETAIL_TAB_GENERAL } from "../../constants";

class UserDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabId: USER_DETAIL_TAB_GENERAL
    };
  }

  componentDidMount() {
    this.props.onFetchData(this.props.userId);
    this.props.onFetchUserProposals(this.props.userId);
    this.props.onFetchProposalsVoteStatus();
  }

  componentDidUpdate(prevProps) {
    const { loggedInAsUserId, editUserResponse, user, isAdmin } = this.props;
    if(editUserResponse) {
      window.location.reload();
    }

    const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);
    if (!isAdminOrTheUser && (prevProps.user !== this.props.user)) {
      this.setState({ tabId: USER_DETAIL_TAB_PROPOSALS });
    }
  }

  onTabChange(tabId) {
    this.setState({ tabId: tabId });
  }

  componentWillUnmount() {
    this.unmounting = true;
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
