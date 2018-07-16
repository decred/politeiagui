import React from "react";
import ReactBody from "react-body";
import connector from "../../connectors/submitProposal";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import FilesField from "../Form/Fields/FilesField";
import ErrorField from "../Form/Fields/ErrorField";
import Message from "../Message";
import MultipleItemsBodyMessage from "../MultipleItemsBodyMessage";
import ProposalInfo from "../ProposalInfo";
import { isArray, isUndefined, concat, cloneDeep } from "lodash";
import { Field } from "redux-form";
import MarkdownHelp from "../MarkdownHelp";

const normalizer = (value, previousValue) => {
  let files = [];

  if (previousValue && isArray(previousValue)) {
    files = cloneDeep(previousValue);
  }

  // Delete images
  if (!isUndefined(value.remove)) {
    files.splice(value.remove, 1);
  }

  // Add images
  if (isArray(value)) {
    files = concat(files, value);
  }

  return files;
};

class SubmitPage extends React.Component {
  render() {
    const {
      isLoading,
      PageLoadingIcon,
      policy,
      error,
      onSave,
      handleSubmit,
      newProposalError,
      userCanExecuteActions
    } = this.props;
    return !policy || isLoading ? <PageLoadingIcon /> : (
      <div className="content" role="main">
        <div className="page submit-proposal-page">
          <ReactBody className="submit-page" />
          <div
            className="submit content warn-on-unload"
            id="newlink"
          >
            <Message type="info" header="Important information about proposals">
              <ProposalInfo policy={policy} />
            </Message>
            <div className="formtabs-content">
              <div className="spacer">
                <Field
                  name="global"
                  component={props => <ErrorField title="Cannot submit proposal" {...props} />}
                />
                <div className="roundfield" id="title-field">
                  <div className="roundfield-content">
                    <Field
                      name="name"
                      component="textarea"
                      tabIndex={1}
                      type="text"
                      placeholder="Proposal Name"
                    />
                    <input name="kind" type="hidden" defaultValue="self" />
                    <div className="usertext">
                      <input name="thing_id" type="hidden" defaultValue />
                      <div className="usertext-edit md-container" style={{}}>
                        <div className="md">
                          <Field
                            name="description"
                            component={MarkdownEditorField}
                            tabIndex={2}
                            placeholder="Markdown Entry"
                            rows={20}
                            cols={80}
                          />
                          <Field
                            name="files"
                            component={FilesField}
                            userCanExecuteActions={userCanExecuteActions}
                            placeholder="Attach files"
                            policy={policy}
                            normalize={normalizer}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="spacer">
                <button
                  className={`btn togglebutton access-required${!userCanExecuteActions ? " not-active disabled" : ""}`}
                  name="submit"
                  type="submit"
                  value="form"
                  onClick={handleSubmit(onSave)}>
                  submit
                </button>
                {newProposalError && (
                  <Message type="error" header="Error creating proposal">
                    <MultipleItemsBodyMessage items={newProposalError} />
                  </Message>
                )}
                {error && (
                  <Message type="error" header="Error creating proposal">
                    <MultipleItemsBodyMessage items={error} />
                  </Message>
                )}
              </div>
              <div className="spacer">
                <div className="roundfield">
                  <MarkdownHelp />
                </div>
              </div>
            </div>
            <div className="roundfield info-notice"> </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connector(SubmitPage);
