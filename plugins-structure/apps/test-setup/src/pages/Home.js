import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketvote } from "@politeiagui/ticketvote";

export const Home = () => {
  const dispatch = useDispatch();
  // Ticketvote inventory ready to be fetched without any additional setup.
  useEffect(() => {
    dispatch(ticketvote.inventory.fetch({ status: 3 }));
    dispatch(ticketvote.inventory.fetch({ status: 2 }));
    dispatch(ticketvote.inventory.fetch({ status: 1 }));
  }, [dispatch]);

  // Reducers installed, ticketvote registered correctly.
  const started = useSelector((state) =>
    ticketvote.inventory.selectByStatus(state, "started")
  );
  const authorized = useSelector((state) =>
    ticketvote.inventory.selectByStatus(state, "authorized")
  );
  const unauthorized = useSelector((state) =>
    ticketvote.inventory.selectByStatus(state, "unauthorized")
  );

  return (
    <div>
      <h1>Home Page</h1>
      <h3>Started</h3>
      <ol>
        {started.map((t, i) => (
          <li key={i}>
            <a data-link href={`/record/${t}`}>
              {t}
            </a>
          </li>
        ))}
      </ol>
      <h3>Authorized</h3>
      <ol>
        {authorized.map((t, i) => (
          <li key={i}>
            <a data-link href={`/record/${t}`}>
              {t}
            </a>
          </li>
        ))}
      </ol>
      <h3>Unauthorized</h3>
      <ol>
        {unauthorized.map((t, i) => (
          <li key={i}>
            <a data-link href={`/record/${t}`}>
              {t}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};
