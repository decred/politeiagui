import {
  getHumanReadableTicketvoteStatus,
  getTicketvoteStatusCode,
} from "./utils";

describe("Given getHumanReadableTicketvoteStatus util", () => {
  it("should throw error when status is invalid", () => {
    const invalidStatusNumber = 2000;
    const invalidStatusNaN = "300";
    expect(() => {
      getHumanReadableTicketvoteStatus(invalidStatusNumber);
    }).toThrow("Invalid status");
    expect(() => {
      getHumanReadableTicketvoteStatus(invalidStatusNaN);
    }).toThrow("Invalid status");
  });
  it("should return readable status for valid statuses", () => {
    // Unauthorized
    const unauthorizedStatus = 1;
    let readableStatus = getHumanReadableTicketvoteStatus(unauthorizedStatus);
    expect(readableStatus).toEqual("unauthorized");

    // Authorized
    const authorizedStatus = 2;
    readableStatus = getHumanReadableTicketvoteStatus(authorizedStatus);
    expect(readableStatus).toEqual("authorized");

    // Started
    const startedStatus = 3;
    readableStatus = getHumanReadableTicketvoteStatus(startedStatus);
    expect(readableStatus).toEqual("started");

    // Finished
    const finishedStatus = 4;
    readableStatus = getHumanReadableTicketvoteStatus(finishedStatus);
    expect(readableStatus).toEqual("finished");

    // Approved
    const approvedStatus = 5;
    readableStatus = getHumanReadableTicketvoteStatus(approvedStatus);
    expect(readableStatus).toEqual("approved");

    // Rejected
    const rejectedStatus = 6;
    readableStatus = getHumanReadableTicketvoteStatus(rejectedStatus);
    expect(readableStatus).toEqual("rejected");

    // Ineligible
    const ineligibleStatus = 7;
    readableStatus = getHumanReadableTicketvoteStatus(ineligibleStatus);
    expect(readableStatus).toEqual("ineligible");
  });
});

describe("Given getTicketvoteStatusCode util", () => {
  it("should throw error when status string is invalid", () => {
    const invalidStatusString = "invalid";
    expect(() => {
      getTicketvoteStatusCode(invalidStatusString);
    }).toThrow("Invalid status");
  });
  it("should return status code for valid status strings", () => {
    // Unauthorized
    const unauthorizedStatus = "unauthorized";
    let statusCode = getTicketvoteStatusCode(unauthorizedStatus);
    expect(statusCode).toEqual(1);

    // Authorized
    const authorizedStatus = "authorized";
    statusCode = getTicketvoteStatusCode(authorizedStatus);
    expect(statusCode).toEqual(2);

    // Started
    const startedStatus = "started";
    statusCode = getTicketvoteStatusCode(startedStatus);
    expect(statusCode).toEqual(3);

    // Finished
    const finishedStatus = "finished";
    statusCode = getTicketvoteStatusCode(finishedStatus);
    expect(statusCode).toEqual(4);

    // Approved
    const approvedStatus = "approved";
    statusCode = getTicketvoteStatusCode(approvedStatus);
    expect(statusCode).toEqual(5);

    // Rejected
    const rejectedStatus = "rejected";
    statusCode = getTicketvoteStatusCode(rejectedStatus);
    expect(statusCode).toEqual(6);

    // Ineligible
    const ineligibleStatus = "ineligible";
    statusCode = getTicketvoteStatusCode(ineligibleStatus);
    expect(statusCode).toEqual(7);
  });
  it("should return status code for valid status codes", () => {
    // Unauthorized
    const unauthorizedStatus = 1;
    let statusCode = getTicketvoteStatusCode(unauthorizedStatus);
    expect(statusCode).toEqual(1);

    // Authorized
    const authorizedStatus = 2;
    statusCode = getTicketvoteStatusCode(authorizedStatus);
    expect(statusCode).toEqual(2);

    // Started
    const startedStatus = 3;
    statusCode = getTicketvoteStatusCode(startedStatus);
    expect(statusCode).toEqual(3);

    // Finished
    const finishedStatus = 4;
    statusCode = getTicketvoteStatusCode(finishedStatus);
    expect(statusCode).toEqual(4);

    // Approved
    const approvedStatus = 5;
    statusCode = getTicketvoteStatusCode(approvedStatus);
    expect(statusCode).toEqual(5);

    // Rejected
    const rejectedStatus = 6;
    statusCode = getTicketvoteStatusCode(rejectedStatus);
    expect(statusCode).toEqual(6);

    // Ineligible
    const ineligibleStatus = 7;
    statusCode = getTicketvoteStatusCode(ineligibleStatus);
    expect(statusCode).toEqual(7);
  });
});
