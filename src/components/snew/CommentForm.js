import React from "react";
import LinkComponent from "./Link";
import Message from "../Message";
import connector from "../../connectors/reply";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import { PROPOSAL_VOTING_NOT_STARTED } from "../../constants";

const CommentForm = ({
  Link = LinkComponent,
  isPostingComment,
  isShowingMarkdownHelp,
  error,
  thingId,
  onSave,
  onToggleMarkdownHelp,
  loggedInAsEmail,
  userCanExecuteActions,
  getVoteStatus,
  token,
  showContentPolicy=false,
  value,
  onChange,
  onClose
}) => (
  loggedInAsEmail ?
    <form className="usertext cloneable warn-on-unload"  onSubmit={onSave}>
      {error ? (
        <Message
          type="error"
          header="Error creating comment"
          body={error} />
      ) : null}
      <input name="parentid" type="hidden" defaultValue={thingId} />
      <div className="usertext-edit md-container">
        {isPostingComment && (<h2>Posting comment...</h2>)}
        {!isPostingComment &&
          getVoteStatus(token) &&
          getVoteStatus(token).status === PROPOSAL_VOTING_NOT_STARTED && (
          <div className="md">
            <MarkdownEditorField
              input={{
                value: value,
                onChange: onChange
              }}
              toggledStyle
            />
          </div>
        )}
        {!isPostingComment && getVoteStatus(token) &&
          getVoteStatus(token).status === PROPOSAL_VOTING_NOT_STARTED && (
          <div className="bottom-area">
            <span className="help-toggle toggle">
              <a
                className="option active"
                tabIndex={100}
                style={{ cursor: "pointer" }}
                onClick={e => {
                  onToggleMarkdownHelp();
                  e.preventDefault();
                }}
              >
              formatting help
              </a>
              <a className="option">
              hide help
              </a>
            </span>
            {showContentPolicy &&
              <Link
                className="reddiquette"
                href="/help/contentpolicy"
                tabIndex={100}
                target="_blank"
              >
                content policy
              </Link>
            }
            <div className="usertext-buttons">
              <button
                className={`togglebutton access-required${!userCanExecuteActions ? " not-active disabled" : ""}`}
                type="submit"
                disabled={!userCanExecuteActions}
              >
              save
              </button>
              {(onClose && (<button
                className={`togglebutton access-required${!userCanExecuteActions ? " not-active disabled" : ""}`}
                onClick={() => onClose()}
                type="button"
                disabled={!userCanExecuteActions}
              >
              cancel
              </button>)) || null}
            </div>
          </div>
        )}
        {isShowingMarkdownHelp && (
          <div className="markhelp">
            <p>
            we use a slightly-customized version of{" "}
              <a href="http://daringfireball.net/projects/markdown/syntax">
              Markdown
              </a>{" "}
            for formatting. See below for some basics.
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
                  <td>[decred!](https://decred.org)</td>
                  <td>
                    <a href="https://decred.org">decred!</a>
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
                    <span className="spaces">        </span>print "hello, world!"<br />
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
        )}
      </div>
    </form> : null
);

export default connector(CommentForm);
