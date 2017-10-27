import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { autobind } from "core-decorators";
import { SubmissionError } from "redux-form";
import submitConnector from "../../connectors/submitProposal";
import LoadingPage from "../LoadingPage";
import Form from "./Form";
import validate from "./validator";

class ProposalSubmit extends Component {
  componentDidMount() {
    this.props.onFetchData();
  }

  componentWillReceiveProps({ token }) {
    if (token) {
      return this.props.history.push("/proposals/success");
    }
  }

  onSave(props) {
    validate(props, this.props.policy);

    return this
      .props
      .onSave(props)
      .catch((error) => {
        throw new SubmissionError({
          _error: error.message,
        });
      });
  }

  render() {
    const { isLoading } = this.props;

    return isLoading ? <LoadingPage /> : (
      <div className="page proposal-submit-page">
        <Form
          {...{
            ...this.props,
            onSave: this.onSave
          }}
        />
      </div>
    );
  }
}

autobind(ProposalSubmit);

export default withRouter(submitConnector(ProposalSubmit));
