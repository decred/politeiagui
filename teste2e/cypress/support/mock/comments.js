import { buildRecordComment } from "../generate";
import range from "lodash/fp/range";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";

const COMMENTS_API = "/api/comments/v1";

export const middlewares = {
  comments: (amount, state) =>
    cy.intercept(`${COMMENTS_API}/comments`, (req) => {
      const token = req.body.token;
      const comments = compose(
        map((comment) => ({
          ...comment,
          parentid:
            comment.commentid > 0
              ? comment.commentid % 5 === 0
                ? comment.commentid - 3
                : 0
              : 0
        })),
        map((index) =>
          buildRecordComment({
            token,
            state,
            commentid: index,
            downvotes: index % 4 === 0 ? 1 : 0,
            upvotes: index % 2 === 0 ? 2 : 0
          })
        ),
        range(amount)
      )(0);
      req.reply({ body: { comments } });
    }),
  vote: ({ errorCode, statusCode = 200, delay = 0 } = {}) =>
    cy.intercept(`${COMMENTS_API}/vote`, (req) => {
      if (statusCode === 403 && !errorCode) {
        req.reply({
          statusCode,
          delay
        });
      } else {
        req.reply({
          body: errorCode ? { errorcode: errorCode, pluginid: "comments" } : {},
          statusCode,
          delay
        });
      }
    }),
  new: ({ errorCode } = {}) =>
    cy.intercept(`${COMMENTS_API}/new`, (req) => {
      req.reply({
        statusCode: errorCode || 200
      });
    })
};
