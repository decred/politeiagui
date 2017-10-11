import React from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";

const Pager = ({
  location,
  nextPageParams,
  previousPageParams
}) => (
  <div className="pager">
    {previousPageParams
      ? <Link to={{...location, search: queryString.stringify(previousPageParams)}}>&laquo; Previous</Link>
      : <span>&laquo; Previous</span>}
    {" | "}
    {nextPageParams
      ? <Link to={{...location, search: queryString.stringify(nextPageParams)}}>Next &raquo;</Link>
      : <span>Next &raquo;</span>}
  </div>
);

export default Pager;
