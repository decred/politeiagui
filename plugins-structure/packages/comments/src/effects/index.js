import { commentsCount } from "../comments/count";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

export async function fetchNextComments(state, dispatch, { inventoryList }) {
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
