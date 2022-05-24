export function getStatusFromMultipleSlices(statuses) {
  if (statuses.some((el) => el === "loading")) {
    return "loading";
  }
  if (statuses.some((el) => el === "failed")) {
    return "failed";
  }
  if (statuses.every((el) => el === "succeeded")) {
    return "succeeded";
  }
  if (statuses.every((el) => el === "idle")) {
    return "idle";
  }
  // when one request succeeds before the other ones start we want to keep loading
  if (statuses.some((el) => el === "succeeded")) {
    return "loading";
  }
}
