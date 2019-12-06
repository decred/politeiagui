import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import proposalVoteResults from "../../../connectors/proposalVoteResults";
import DcrdataTxLink from "../../DcrdataTxLink";
import { Field, reduxForm } from "redux-form";
import Message from "../../Message";

class SearchVotesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      option: "",
      error: false
    };
  }

  componentDidMount() {
    this.props.onFetchProposalVoteResults &&
      this.props.onFetchProposalVoteResults(this.props.me.payload.id);
  }

  handleSubmit = ({ token }) => {
    const vote =
      this.props.proposalVoteResults &&
      this.props.proposalVoteResults.castvotes[token];
    return vote
      ? this.setState({
          result: token,
          option: vote.votebit === "2" ? "Yes" : "No",
          error: false
        })
      : this.setState({ error: true });
  };

  handleCancel() {
    this.props.closeModal();
  }

  renderField = (field) => (
    <div>
      <input
        {...field.input}
        name="token"
        style={{ width: "550px" }}
        type="text"
        placeholder="search vote by ticket token"
      />
      <input type="submit" value="" />
    </div>
  );

  render() {
    const { error, isLoading, handleSubmit } = this.props;
    const shouldLoad = !isLoading && this.state.result && !this.state.error;
    return (
      <ModalContentWrapper
        title={"Search votes - " + this.props.me.payload.title}
        onClose={this.props.closeModal}>
        <div className="content" role="main">
          <form
            className="search-form"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
            onSubmit={handleSubmit(this.handleSubmit)}>
            {isLoading ? (
              <i
                className="fa fa-circle-o-notch fa-spin right-margin-5"
                style={{ fontSize: "26px" }}
              />
            ) : (
              <div>
                <Field
                  autoFocus
                  name="token"
                  component={this.renderField}
                  placeholder="search by ticket token"
                />
              </div>
            )}
          </form>
          {error && (
            <Message
              type="error"
              header="Cannot search for vote"
              body={error}
            />
          )}
          {shouldLoad && (
            <div className="search-results votes">
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Vote Option</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <DcrdataTxLink
                        isTestnet={this.props.isTestnet}
                        txId={this.state.result}
                      />
                    </td>
                    <td>{this.state.option}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {this.state.error && (
            <div className="search-results votes">
              <h3>No matches found with that ticket</h3>
            </div>
          )}
        </div>
      </ModalContentWrapper>
    );
  }
}

export default reduxForm({
  form: "form/vote-search"
})(proposalVoteResults(modalConnector(SearchVotesModal)));
