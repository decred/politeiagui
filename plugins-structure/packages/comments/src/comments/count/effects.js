import { getTokensToFetch } from "@politeiagui/core";
import isEmpty from "lodash/isEmpty";
import { commentsCount } from "./";

export async function fetchNextCommentsCount(
  state,
  dispatch,
  { inventoryList }
) {
  const {
    commentsCount: { byToken },
    commentsPolicy: {
      policy: { countpagesize },
    },
  } = state;

  const commentsCountToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: countpagesize,
  });

  if (!isEmpty(commentsCountToFetch)) {
    await dispatch(
      commentsCount.fetch({
        tokens: commentsCountToFetch,
      })
    );
  }
}
