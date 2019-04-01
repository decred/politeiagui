import React from "react";
import { renderInvoiceStatus } from "../../../helpers";

const ThingLinkInvoice = ({
  id,
  title,
  author,
  authorid,
  is_self,
  selftext,
  selftext_html,
  review_status,
  Link,
  Expando,
  url,
  rank = 0
}) => {
  const isEditable = true; // TODO: set the proper conditions here

  return (
    <div className={`thing thing-proposal id-${id} odd link`}>
      <div className="entry unvoted">
        <span
          className="title"
          style={{ display: "flex", overflow: "visible" }}
        >
          <Link className="title may-blank loggedin" href={url} tabIndex={rank}>
            {title}
          </Link>
          {isEditable && (
            <div
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
            >
              <Link
                href={`/invoices/${id}/edit`}
                className="edit-proposal right-margin-10"
                onClick={() => null}
              >
                <i className="fa fa-edit right-margin-5" />
                Edit
              </Link>
            </div>
          )}
        </span>
        <span
          style={{ display: "flex", flexDirection: "column" }}
          className="tagline"
        >
          <span className="submitted-by">
            {author && (
              <span>
                {" by "}
                <Link href={`/user/${authorid}`}>{author}</Link>
              </span>
            )}
          </span>
          {renderInvoiceStatus(review_status)}
          <Expando
            {...{
              expanded: true,
              is_self,
              selftext,
              selftext_html
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default ThingLinkInvoice;
