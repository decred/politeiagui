import React from "react";
import LinkComponent from "./Link";
import Message from "../Message";
import connector from "../../connectors/reply";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import { PROPOSAL_VOTING_NOT_STARTED } from "../../constants";
import MarkdownHelp from "../MarkdownHelp";

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
    <React.Fragment>
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
            getVoteStatus(token).status === PROPOSAL_VOTING_NOT_STARTED ? (
              <div className="md">
                <MarkdownEditorField
                  input={{
                    value: value,
                    onChange: onChange
                  }}
                  toggledStyle
                />
              </div>
            ):
            getVoteStatus(token) && getVoteStatus(token).status !== PROPOSAL_VOTING_NOT_STARTED ?
              <Message height="70px" type="info">
                <span>
                    Proposals which voting has started can not receive further comments. However, you can still leave your comments on proposals which voting is unstarted.
                </span>
              </Message>
              :
              null
          }
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
                  style={{ marginBottom: "5px" }}
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
        </div>
      </form>
      {isShowingMarkdownHelp && (
        <MarkdownHelp />
      )}
    </React.Fragment> : null
);

export default connector(CommentForm);
