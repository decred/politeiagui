import { createContext, useContext } from "react";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

const mapStateToProps = {
  comments: sel.proposalComments
};

export function useDownloadComments(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, {});
  return fromRedux;
}
