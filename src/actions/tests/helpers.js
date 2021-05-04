import fetchMock from "fetch-mock";

export const done = (...args) => {
  expect(args[0]).toEqual(undefined);
};

export const doneWithError = (...args) => {
  expect(args[0]).toBeTruthy();
};

export const RANDOM_SUCCESS_RESPONSE = {
  success: true
};
export const RANDOM_ERROR_RESPONSE = {
  errorcode: 29
};

export const setGetSuccessResponse = (
  path,
  options = {},
  response = RANDOM_SUCCESS_RESPONSE
) =>
  fetchMock.get(path, response, {
    overwriteRoutes: true,
    ...options
  });
export const setGetErrorResponse = (
  path,
  options = {},
  response = RANDOM_ERROR_RESPONSE
) =>
  fetchMock.get(
    path,
    { throws: response },
    {
      overwriteRoutes: true,
      ...options
    }
  );
export const setPostSuccessResponse = (
  path,
  options = {},
  response = RANDOM_SUCCESS_RESPONSE
) =>
  fetchMock.post(path, response, {
    overwriteRoutes: true,
    ...options
  });
export const setPostErrorResponse = (
  path,
  options = {},
  response = RANDOM_ERROR_RESPONSE
) =>
  fetchMock.post(
    path,
    { throws: response },
    {
      overwriteRoutes: true,
      ...options
    }
  );

export const setPutSuccessResponse = (
  path,
  options = {},
  response = RANDOM_SUCCESS_RESPONSE
) =>
  fetchMock.put(path, response, {
    overwriteRoutes: true,
    ...options
  });

export const setPutErrorResponse = (
  path,
  options = {},
  response = RANDOM_ERROR_RESPONSE
) =>
  fetchMock.put(
    path,
    { throws: response },
    {
      overwriteRoutes: true,
      ...options
    }
  );

export const methods = {
  GET: "get",
  POST: "post",
  PUT: "put"
};
