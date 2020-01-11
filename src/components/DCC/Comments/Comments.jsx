import React from "react";
import { useDCCComments } from "./hooks";
import { Content, CommentArea } from "../../snew";
import { commentsToT1 } from "../../../lib/snew";
import dccConnector from "../../../connectors/dcc";

const DCCComments = (props) => {
  const {
    comments,
    isLoading,
    error,
    commentid,
    onFetchData,
    token,
    dcc
  } = useDCCComments(props);
  return <div className="dccComments commentarea">
    <CommentArea {...props} dcc={dcc} comments={comments} numofcomments={comments.length}/>
    <Content
      {...{
        isLoading,
        error,
        commentid,
        comments,
        bodyClassName: "single-page comments-page",
        onFetchData: () => onFetchData(token),
        listings: isLoading
          ? []
          : [
              {
                allChildren: commentsToT1(comments, commentid, [])
              }
            ],
        ...props
      }}
    />
  </div>;
};

export default dccConnector(DCCComments);
