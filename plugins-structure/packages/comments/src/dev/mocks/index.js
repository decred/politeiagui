import { faker } from "@faker-js/faker";

export * from "./comments";
export * from "./userVotes";

function getThreadParent(id) {
  if (id < 2) return id;
  return Math.floor(id / 2);
}

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

export function mockComments({ amount = 0, thread = false } = {}) {
  return ({ token }) => {
    const comments = Array(amount)
      .fill({
        userid: "1baadc76-3c9d-46be-8aac-15c944bab958",
        username: "user_8a13d2b07b",
        state: 2,
        token,
        parentid: 0,
        comment: "31efb976ac702977dddd56d52e03a2d7",
        version: 1,
        createdat: 1650381215,
        timestamp: 1650381215,
        upvotes: 0,
        downvoted: 0,
      })
      .map((comment, i) => ({
        ...comment,
        commentid: i + 1,
        comment: `Comment ${i + 1}: ${comment.comment}`,
        parentid: thread ? getThreadParent(i + 1) : comment.parentid,
      }));
    return { comments };
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
