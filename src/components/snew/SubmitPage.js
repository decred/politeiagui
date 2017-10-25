import React from "react";
import ReactBody from "react-body";
import connector from "../../connectors/submitProposal";
import normalizer from "../ProposalSubmitPage/normalizer";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import FilesField from "../Form/Fields/FilesField";
import Message from "../Message";
import { Field } from "redux-form";

const SubmitPage = ({
  isSaving,
  Loading,
  policy,
  error,
  onSave,
  handleSubmit,
  newProposalError,
}) => isSaving ? <Loading /> : (
  <div className="content" role="main">
    <ReactBody className="submit-page" />
    <h1>
      Submit Proposal
    </h1>
    {newProposalError ? (
      <Message
        type="error"
        header="Error creating proposal"
        body={newProposalError} />
    ) : null}
    <form
      className="submit content warn-on-unload"
      id="newlink"
      onSubmit={handleSubmit(onSave)}
    >
      <div className="formtabs-content">
        <div className="spacer">
          <div className="roundfield" id="title-field">
            <span className="title">title</span>
            <div className="roundfield-content">
              <Field
                name="name"
                component="textarea"
                type="text"
                rows={2}
                placeholder="Proposal Name"
              />
            </div>
          </div>
        </div>
        {error ? (
          <div className={"error"}>
            {(typeof error === "string") ? error : (
              <pre>{JSON.stringify(error, null, 2)}</pre>
            )}
          </div>
        ) : null}
        <div className="spacer">
          <div
            className="roundfield"
            id="text-field"
            style={{ display: "block" }}
          >
            <span className="title">Proposal body</span>{" "}
            <div className="roundfield-content">
              <input name="kind" type="hidden" defaultValue="self" />
              <div className="usertext">
                <input name="thing_id" type="hidden" defaultValue />
                <div className="usertext-edit md-container" style={{}}>
                  <div className="md">
                    <Field
                      name="description"
                      component={MarkdownEditorField}
                      placeholder="Markdown Entry"
                      rows={20}
                      cols={80}
                    />
                    <Field
                      name="files"
                      component={FilesField}
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
          <button className="btn" name="submit" type="submit" value="form">
            submit
          </button>
        </div>
        <div className="spacer">
          <div className="roundfield">
            <div className="markhelp" >
              <p>
                reddit uses a slightly-customized version of{" "}
                <a href="http://daringfireball.net/projects/markdown/syntax">
                  Markdown
                </a>{" "}
                for formatting. See below for some basics, or check{" "}
                <a href="/wiki/commenting">
                  the commenting wiki page
                </a>{" "}
                for more detailed help and solutions to common issues.
              </p>
              <table className="md">
                <tbody>
                  <tr
                    style={{
                      backgroundColor: "#ffff99",
                      textAlign: "center"
                    }}
                  >
                    <td>
                      <em>you type:</em>
                    </td>
                    <td>
                      <em>you see:</em>
                    </td>
                  </tr>
                  <tr>
                    <td>*italics*</td>
                    <td>
                      <em>italics</em>
                    </td>
                  </tr>
                  <tr>
                    <td>**bold**</td>
                    <td>
                      <b>bold</b>
                    </td>
                  </tr>
                  <tr>
                    <td>[reddit!](https://reddit.com)</td>
                    <td>
                      <a href="https://reddit.com">reddit!</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      * item 1<br />
                      * item 2<br />
                      * item 3
                    </td>
                    <td>
                      <ul>
                        <li>item 1</li>
                        <li>item 2</li>
                        <li>item 3</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>> quoted text</td>
                    <td>
                      <blockquote>quoted text</blockquote>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Lines starting with four spaces<br />
                      are treated like code:<br />
                      <br />
                      <span className="spaces">    </span>if 1 * 2 != 3:<br />
                      <span className="spaces">        </span>print
                      "hello, world!"<br />
                    </td>
                    <td>
                      Lines starting with four spaces<br />
                      are treated like code:<br />
                      <pre>
                        if 1 * 2 != 3:<br />    print "hello, world!"{"\n"}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <td>~~strikethrough~~</td>
                    <td>
                      <strike>strikethrough</strike>
                    </td>
                  </tr>
                  <tr>
                    <td>super^script</td>
                    <td>
                      super<sup>script</sup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="roundfield info-notice"> </div>
    </form>
  </div>
);

export default connector(SubmitPage);

