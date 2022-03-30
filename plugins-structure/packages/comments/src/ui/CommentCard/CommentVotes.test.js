import React from "react";
import { render, screen } from "@testing-library/react";
import { CommentVotes } from "./CommentVotes";

jest.mock("pi-ui", () => ({
  Text: (props) => <p {...props} />,
  classNames: (...args) => args.join(" "),
  Icon: ({ type }) => <span>{type}</span>,
}));

describe("Given the CommentVotes component", () => {
  it("should display like and dislike buttons correctly", () => {
    render(<CommentVotes upvotes={2} downvotes={1} />);
    expect(screen.getByTestId("like-btn")).toBeVisible();
    expect(screen.getByTestId("dislike-btn")).toBeVisible();
  });
  it("should display upvotes and downvotes counts correctly", () => {
    render(<CommentVotes upvotes={2} downvotes={1} />);
    expect(screen.getByTestId("score-like")).toHaveTextContent(2);
    expect(screen.getByTestId("score-dislike")).toHaveTextContent(1);
  });
});
