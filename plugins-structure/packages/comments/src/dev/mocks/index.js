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

export function mockComment(customData = {}) {
  return {
    userid: faker.datatype.uuid(),
    username: faker.internet.userName(),
    state: 2,
    parentid: 0,
    version: 1,
    createdat: Date.now() / 1000,
    timestamp: Date.now() / 1000,
    upvotes: 0,
    downvoted: 0,
    comment: faker.lorem.paragraph(),
    token: faker.git.shortSha(),
    ...customData,
  };
}

export function mockComments({
  amount = 0,
  customCommentData = {},
  additionalComments = [],
} = {}) {
  return ({ token }) => {
    const comments = Array(amount)
      .fill({})
      .map((_, i) => ({
        ...mockComment(customCommentData),
        token,
        commentid: i + 1,
      }));
    const moreComments = additionalComments.map((ac, i) => ({
      ...mockComment(customCommentData),
      comment: `Addidional Comment ${i + 1}: ${faker.lorem.paragraph()}`,
      token,
      commentid: amount + i + 1,
      ...ac,
    }));
    return { comments: [...comments, ...moreComments] };
  };
}

export function mockCommentsTimestamps() {
  return ({ commentids }) => {
    const comments = commentids.reduce(
      (acc, cid) => ({
        ...acc,
        [cid]: {
          adds: [
            {
              data: faker.datatype.json(),
              digest: faker.datatype.hexadecimal(64),
              txid: faker.datatype.hexadecimal(64),
              merkleroot: faker.datatype.hexadecimal(64),
              proofs: [],
            },
          ],
        },
      }),
      {}
    );
    return { comments };
  };
}
