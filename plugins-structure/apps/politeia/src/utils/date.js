import { formatUnixTimestampToObj } from "@politeiagui/common-ui/utils";

/**
 * Returns the available dates range as objects { min,max } for RFP linkby
 * using policy[ticketvote] provided values
 * @param {number} linkbyperiodmin min possible linkby period as seconds unix
 * @param {number} linkbyperiodmax max possible linkby period as seconds unix
 */
export const getRfpMinMaxDates = (linkbyperiodmin, linkbyperiodmax) => {
  const currentTimeSec = new Date().getTime() / 1000;
  return {
    min: formatUnixTimestampToObj(currentTimeSec + Number(linkbyperiodmin)),
    max: formatUnixTimestampToObj(currentTimeSec + Number(linkbyperiodmax)),
  };
};

/**
 * Returns the possible dates range as objects { min, max } for the
 * start-end dates range.
 */
export const getStartEndDatesRange = (startdatemin, enddatemax) => {
  const currentTimeSec = new Date().getTime() / 1000;
  return {
    min: formatUnixTimestampToObj(currentTimeSec + Number(startdatemin)),
    max: formatUnixTimestampToObj(currentTimeSec + Number(enddatemax)),
  };
};
