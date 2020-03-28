import fetchMock from "fetch-mock";

export const assertRouteIsCalledWithQueryParams = async (
  path,
  query,
  func,
  args,
  mockResult = {}
) => {
  const OPTIONS = { query };
  fetchMock.getOnce(path, mockResult, OPTIONS);
  const result = await func.apply(null, args);
  expect(fetchMock.called(path, OPTIONS)).toBeTruthy();
  return result;
};

export const assertPOSTOnRouteIsCalled = async (
  path,
  func,
  args,
  mockResult = {}
) => {
  fetchMock.post(path, mockResult);
  const result = await func.apply(null, args);
  expect(fetchMock.called(path)).toBeTruthy();
  return result;
};

export const assertGETOnRouteIsCalled = async (
  path,
  func,
  args,
  mockResult = {}
) => {
  fetchMock.getOnce(path, mockResult);
  const result = await func.apply(null, args);
  expect(fetchMock.called(path)).toBeTruthy();
  return result;
};

export const setMockUrl = ({ pathname, search }) => {
  window.history.pushState({}, "Test title", `${pathname}${search || ""}`);
};
