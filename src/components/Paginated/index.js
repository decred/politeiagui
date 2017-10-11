import React, { Component } from "react";
import queryString from "query-string";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import last from "lodash/fp/last";
import first from "lodash/fp/first";
import PaginatedContainer from "./Container";

const getQuery = compose(queryString.parse, get(["location", "search"]));
const getLimit = compose(get("limit"), getQuery);
const getAfter = compose(get("after"), getQuery);
const getBefore = compose(get("before"), getQuery);

const DEFAULT_GET_ITEM_ID = get(["censorshiprecord", "token"]);
const DEFAULT_LIMIT = 5;

class Paginated extends Component {
  componentDidMount() {
    this.onFetchData(this.props);
  }

  render() {
    return (
      <PaginatedContainer
        {...{
          ...this.props,
          children: [],
          PageComponent: this.props.children,
          nextPageParams: this.getNextPageParams(),
          previousPageParams: this.getPreviousPageParams()
        }}
      />
    );
  }

  getNextPageParams() {
    const {
      getItemId = DEFAULT_GET_ITEM_ID,
      limit = DEFAULT_LIMIT,
      items = []
    } = this.props;
    const after = compose(getItemId, last)(items);
    return (items.length >= limit)
      ? { after, limit }
      : null;
  }

  getPreviousPageParams() {
    const {
      getItemId = DEFAULT_GET_ITEM_ID,
      limit = DEFAULT_LIMIT,
      items = []
    } = this.props;
    const after = getAfter(this.props);
    const before = compose(getItemId, first)(items);
    return (after && before)
      ? { before, limit }
      : null;
  }

  onFetchData(props) {
    const params = {};
    const limit = getLimit(props);
    const after = getAfter(props);
    const before = getBefore(props);
    if (limit) params.limit = limit;
    if (after) params.after = after;
    if (before) params.before = before;
    this.props.onFetchData(params);
  }
}

export default Paginated;
