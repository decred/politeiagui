import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const connector= connect(
  sel.selectorMap({
    isAdmin: sel.isAdmin,
    error: sel.getApiSidebarError,
    isLoading: sel.isApiRequestingSidebar,
    markdown: sel.getApiSidebarMarkdown
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchSidebar,
  }, dispatch)
);

class Wrapper extends Component {
  componentDidMount() {
    this.props.onFetchData && this.props.onFetchData();
  }

  render() {
    const Component = this.props.Component;
    return <Component {...this.props} />;
  }
}

const wrap = (Component) => connector((props) => <Wrapper {...{...props, Component }} />);

export default wrap;
