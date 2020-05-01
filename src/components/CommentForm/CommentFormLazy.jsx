import React, { lazy, Suspense } from "react";
import CommentFormLoader from "./CommentFormLoader";

const CommentForm = lazy(() =>
  import(/* webpackChunkName: "CommentForm" */ "./CommentForm")
);

const CommentFormLazy = (props) => (
  <Suspense fallback={<CommentFormLoader />}>
    <CommentForm {...props} />
  </Suspense>
);

export default CommentFormLazy;
