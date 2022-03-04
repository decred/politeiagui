import React from "react";
import { render, screen } from "@testing-library/react";
import { CommentCard } from "./CommentCard";

jest.mock("./CommentVotes", () => ({ CommentVotes: () => <div>Votes</div> }));

const comment = {
  userid: "fake-user-id",
  username: "fakeuser",
  state: 2,
  token: "fakeToken",
  parentid: 0,
  comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  publickey: "fakepubkey",
  signature: "fakesignature",
  commentid: 1,
  version: 1,
  createdat: 1646243109,
  timestamp: 1646243109,
  receipt: "fakereceipt",
  downvotes: 0,
  upvotes: 0,
};
const censoredComment = { ...comment, deleted: true, reason: "fake reason" };

describe("Given CommentCard component", () => {
  describe("given a regular comment", () => {
    it("should display the comment body inside the card", () => {
      render(<CommentCard comment={comment} />);
      expect(screen.getByTestId("comment-body")).toHaveTextContent(
        comment.comment
      );
    });
    it("should display the author username", () => {
      render(<CommentCard comment={comment} />);
      expect(screen.getByTestId("comment-author")).toHaveTextContent(
        "fakeuser"
      );
    });
    it("should display the reply button", () => {
      render(<CommentCard comment={comment} />);
      expect(screen.getByTestId("comment-reply")).toHaveTextContent("Reply");
    });
    it("should display the censor button", () => {
      render(<CommentCard comment={comment} showCensor={true} />);
      expect(screen.getByTestId("comment-censor")).toHaveTextContent("Censor");
    });
  });
  describe("given a censored comment", () => {
    it("should display the censored reason instead of comment body", () => {
      render(<CommentCard comment={censoredComment} />);
      expect(screen.getByTestId("comment-body")).toHaveTextContent(
        /reason: fake reason/i
      );
    });
    it("should not display the censor button", () => {
      render(<CommentCard comment={censoredComment} />);
      expect(screen.queryByTestId("comment-censor")).toBeNull();
    });
  });
});
