import { faker } from "@faker-js/faker";

export * from "./comments";
export * from "./userVotes";

export function mockCommentsCount() {
  return ({ tokens = [] }) => {
    const res = tokens.reduce(
      (response, token) => ({
        ...response,
        [token]: +faker.random.numeric(),
      }),
      {}
    );
    return { counts: res };
  };
}

export function mockCommentsPolicy({
  lengthmax = 8000,
  votechangesmax = 5,
  allowextradata = true,
  countpagesize = 10,
  timestampspagesize = 100,
  votespagesize = 2500,
  allowedits = true,
  editperiod = 300,
} = {}) {
  return () => ({
    lengthmax,
    votechangesmax,
    allowextradata,
    countpagesize,
    timestampspagesize,
    votespagesize,
    allowedits,
    editperiod,
  });
}

const baseCommentMock = {
  userid: "1baadc76-3c9d-46be-8aac-15c944bab958",
  username: "user_8a13d2b07b",
  state: 2,
  parentid: 0,
  version: 1,
  createdat: 1650381215,
  timestamp: 1650381215,
  upvotes: 0,
  downvoted: 0,
};

export function mockComments({
  amount = 0,
  customCommentData = {},
  additionalComments = [],
} = {}) {
  return ({ token }) => {
    const comments = Array(amount)
      .fill({
        ...baseCommentMock,
        ...customCommentData,
        token,
        comment: faker.lorem.paragraph(),
      })
      .map((comment, i) => ({
        ...comment,
        commentid: i + 1,
        comment: `Comment ${i + 1}: ${comment.comment}`,
        parentid: comment.parentid,
      }));
    const moreComments = additionalComments.map((ac, i) => ({
      ...baseCommentMock,
      ...customCommentData,
      ...ac,
      comment: `Addidional Comment ${i + 1}: ${faker.lorem.paragraph()}`,
      token,
      commentid: amount + i + 1,
    }));
    return { comments: [...comments, ...moreComments] };
  };
}
