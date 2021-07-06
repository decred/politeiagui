const POST_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
};

export function getPostHeaders(csrf) {
  return {
    ...POST_HEADERS,
    "x-csrf-token": csrf
  }
}