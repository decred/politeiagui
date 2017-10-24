import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import connector from "../../connectors/proposals";

export const CustomContent = ({ proposals, isLoading, ...props }) => (
  <Content {...{
    ...props,
    isLoading,
    listings: [
      {
        allChildren: proposals.map(({ name, timestamp, censorshiprecord: { token } }, idx) => ({
          kind: "t3",
          data: {
            rank: idx + 1,
            title: name,
            id: token,
            name: "t3_"+token,
            created_utc: timestamp,
            permalink: `/proposals/${token}/`,
            url: `/proposals/${token}/`,
            is_self: true
          }
        }))
      }
    ]
  }} />
);

class Loader extends Component {
  componentDidMount() {
    this.props.onFetchData();
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default connector(Loader);
