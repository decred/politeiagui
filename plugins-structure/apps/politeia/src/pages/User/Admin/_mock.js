import { faker } from "@faker-js/faker";

export function getMockUserMatches(matches) {
  const totalusers = 35;
  const totalmatches = matches;

  const users = Array.from({ length: totalmatches }, () => {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
    };
  });

  return { totalusers, totalmatches, users };
}
