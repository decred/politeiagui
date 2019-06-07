// import { useEffect, useState } from "react";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {
  userId: compose(
    get(["match", "params", "userId"]),
    arg(1)
  ),
  user: sel.user
};

const mapDispatchToProps = {
  onFetchUser: act.onFetchUser
};

function validateUUID(str) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

export function useUserDetail(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return { ...fromRedux, validateUUID };
}
