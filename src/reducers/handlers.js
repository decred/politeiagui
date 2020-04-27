import { request } from "./util";

export const onRequestLikeComment = (state, action) => {
  state = request("likeComment", state, action);
  const id = action.payload.commentid;
  return {
    ...state,
    likeComment: {
      ...state.likeComment,
      isRequesting: {
        [id]: true
      }
    }
  };
};
