import { commentsCount } from "../comments/count";
import { recordComments } from "../comments/comments";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

export async function fetchRecordComments(state, dispatch, { token }) {
  const hasComments = recordComments.selectByToken(state, token);
  if (!hasComments) await dispatch(recordComments.fetch({ token: token }));
}

export async function fetchNextCommentsCount(
  state,
  dispatch,
  { inventoryList }
) {
  const {
    commentsCount: { byToken, status },
    commentsPolicy: {
      policy: { countpagesize },
    },
  } = state;

  const commentsCountToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: countpagesize,
  });

  if (status !== "loading" && !isEmpty(commentsCountToFetch)) {
    await dispatch(
      commentsCount.fetch({
        tokens: commentsCountToFetch,
      })
    );
  }
}
