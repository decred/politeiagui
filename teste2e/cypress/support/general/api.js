import faker from "faker";
export const API_GENERAL_BASE_URL = "/api/v1";

/**
 * usersReply represents the data of /api/v1/users endpoint
 * It currently returns empty data since it is serving the data for downloading
 * and we just check the existence of the downloaded file.
 *
 * @param {Object} { requestParams, testParams }
 * @returns {Object}
 */
function usersReply({
  requestParams: { publickey },
  testParams: { amount = 0 }
}) {
  const users = [];
  for (let i = 0; i < amount; i++) {
    users.push({
      id: faker.random.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
  }
  return {
    totalmatches: amount,
    totalusers: amount + 10,
    users
  };
}

export const repliers = {
  users: usersReply
};
