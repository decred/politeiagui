import React, { Component } from "react";
import { autobind } from "core-decorators";
import UserDetailPage from "./Page";
import userConnector from "../../connectors/user";
import { USER_DETAIL_TAB_GENERAL } from "../../constants";

class UserDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabIndex: USER_DETAIL_TAB_GENERAL,
    };
  }

  componentDidMount() {
    this.props.onFetchData(this.props.userId);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editUserResponse) {
      window.location.reload();
    }
  }

  onTabChange(tabIndex) {
    this.setState({ tabIndex: tabIndex });
  }

  render() {
    const { isTestnet } = this.props;
    let dcrdataTxUrl;
    if(isTestnet) {
      dcrdataTxUrl = "https://testnet.dcrdata.org/tx/";
    }
    else {
      dcrdataTxUrl = "https://explorer.dcrdata.org/tx/";
    }

    return (
      <UserDetailPage
        {...{
          ...this.props,
          dcrdataTxUrl,
          tabIndex: this.state.tabIndex,
          onTabChange: this.onTabChange
        }}
      />
    );
  }
}

autobind(UserDetail);

export default userConnector(UserDetail);
