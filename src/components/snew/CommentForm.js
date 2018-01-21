import React from "react";
import LinkComponent from "./Link";
import { Field } from "redux-form";
import Message from "../Message";
import ErrorField from "../Form/Fields/ErrorField";
import connector from "../../connectors/reply";
import WarningPaywallNotPaid from "./WarningPaywallNotPaid";

const CommentForm = ({
  Link = LinkComponent,
  body,
  isPostingComment,
  isShowingMarkdownHelp,
  error,
  thingId,
  defaultBody,
  onChangeBody,
  onSave,
  handleSubmit,
  onToggleMarkdownHelp,
  onSetReplyParent,
  loggedIn,
  grantAccess,
}) => (
  loggedIn ?
    <form className="usertext cloneable warn-on-unload"  onSubmit={handleSubmit(onSave)}>
      <Field
        name="global"
        component={props => <ErrorField title="Cannot create comment" {...props} />}
      />
      {error ? (
        <Message
          type="error"
          header="Error creating comment"
          body={error} />
      ) : null}
      <input name="parentid" type="hidden" defaultValue={thingId} />
      <div className="usertext-edit md-container">
        {isPostingComment && (<h2>Posting comment...</h2>)}
        {!isPostingComment && (
          <div className="md">
            <Field
              name="comment"
              component="textarea"
              autoFocus={!!thingId}
              type="text"
              cols={1}
              data-event-action="comment"
              data-type="link"
              rows={1}
              defaultValue={defaultBody}
              body={body}
              onChange={onChangeBody && ((e) => onChangeBody(e.target.value))}
            />
          </div>
        )}
        {!isPostingComment && (
          <div className="bottom-area">
            <span className="help-toggle toggle" style={{}}>
              <a
                className="option active"
                tabIndex={100}
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
            <Link
              className="reddiquette"
              href="/help/contentpolicy"
              tabIndex={100}
              target="_blank"
            >
            content policy
            </Link>
            <WarningPaywallNotPaid
              message="You must pay the registration fee before you can comment on proposals" />
            <div className="usertext-buttons">
              <button className="save" type="submit" disabled={!grantAccess}>
              save
              </button>
              {(thingId && (<button
                className="cancel"
                onClick={() => onSetReplyParent()}
                type="button"
                disabled={!grantAccess}
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
