export function getStatusFromMultipleSlices(statuses) {
  if (statuses.some((el) => el === "loading")) {
    return "loading";
  }
  if (statuses.some((el) => el === "failed")) {
    return "failed";
  }
  if (statuses.some((el) => el === "idle")) {
    return "idle";
  }
  if (statuses.every((el) => el === "succeeded")) {
    return "succeeded";
  }
}
