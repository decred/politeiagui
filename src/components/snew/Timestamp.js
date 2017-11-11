import React from "react";
import TimeAgo from "timeago-react";

const Timestamp = ({ created_utc }) => (created_utc && <TimeAgo datetime={created_utc * 1000} />) || null;
export default Timestamp;

