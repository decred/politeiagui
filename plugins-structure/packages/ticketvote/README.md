# Ticketvote

Ticketvote package describes the ticketvote plugin from politeia, including
methods and components to interact with it.

## Files Structure

```bash
├── src
│   ├── /dev
│   ├── /lib
│   ├── /routes
│   ├── /ticketvote
│   │   ├── /authorize
│   │   ├── /details
│   │   ├── /inventory
│   │   ├── /policy
│   │   ├── /results
│   │   ├── /start
│   │   ├── /submissions
│   │   ├── /summaries
│   │   ├── /timestamps
│   │   ├── helpers.js
│   │   ├── index.js
│   │   └── constants.js
│   ├── /ui
│   ├── index.html
│   ├── index.js
│   └── setupTests.js
├── README.md
├── jest.config.js
├── package.json
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```

## Exports

You can use the ticketvote package tools by importing them from
`@politeiagui/ticketvote`. Exports are defined on `package.json`.

```javascript
// package.json
// ...
"exports": {
  ".": "./src/index.js", // @politeiagui/ticketvote
  "./api": "./src/lib/api.js", // @politeiagui/ticketvote/api
  "./routes": "./src/routes/index.js", // @politeiagui/ticketvote/routes
  "./details": "./src/ticketvote/details/index.js", // @politeiagui/ticketvote/details
  "./inventory": "./src/ticketvote/inventory/index.js", // @politeiagui/ticketvote/inventory
  "./policy": "./src/ticketvote/policy/index.js", // @politeiagui/ticketvote/policy
  "./results": "./src/ticketvote/results/index.js", // @politeiagui/ticketvote/results
  "./submissions": "./src/ticketvote/submissions/index.js", // @politeiagui/ticketvote/submissions
  "./summaries": "./src/ticketvote/summaries/index.js", // @politeiagui/ticketvote/summaries
  "./timestamps": "./src/ticketvote/timestamps/index.js", // @politeiagui/ticketvote/timestamps
  "./ui": "./src/ui/index.js", // @politeiagui/ticketvote/ui
  "./helpers": "./src/ticketvote/helpers.js", // @politeiagui/ticketvote/helpers
  "./utils": "./src/lib/utils.js", // @politeiagui/ticketvote/utils
  "./constants": "./src/lib/constants.js", // @politeiagui/ticketvote/constants
  "./validation": "./src/lib/validation.js" // @politeiagui/ticketvote/validation
},
// ...
```

## <a id="testing"></a> Testing

Testing scripts are defined on `package.json`:

```javascript
// package.json
// ...
"scripts": {
  "test:format": "yarn prettier --check",

  "test:eslint": "eslint --ext .js ./src",

  "test:ci": "npm run test:format && npm run test:eslint && cross-env NODE_OPTIONS=--experimental-vm-modules jest --no-cache",

  "test:dev": "npm run test:format && npm run test:eslint && cross-env NODE_OPTIONS=--experimental-vm-modules jest --watchAll --no-cache",

  "test": "is-ci \"test:ci\" \"test:dev\"",

  "test:coverage": "yarn test:ci; open coverage/lcov-report/index.html",
},
// ...
```

**Run Unit Tests**:

```bash
$ yarn && yarn test
```

## Connect Reducers

You can connect ticketvote reducers into the Core Store using the
`connectReducers` method from `@politeiagui/core`:

```javascript
import { connectReducers } from "@politeiagui/core";
import { ticketvoteConstants } from "@politeiagui/ticketvote";

await connectReducers(ticketvoteConstants.reducersArray);
```

This will use the `reducersArray` from ticketvote constants to connect each
reducer using the `{ key, reducer }` array described below:

```javascript
// ticketvote constants
import details from "./details/detailsSlice";
import inventory from "./inventory/inventorySlice";
import policy from "./policy/policySlice";
import results from "./results/resultsSlice";
import summaries from "./summaries/summariesSlice";
import timestamps from "./timestamps/timestampsSlice";

export const reducersArray = [
  {
    key: "ticketvoteDetails",
    reducer: details,
  },
  {
    key: "ticketvoteInventory",
    reducer: inventory,
  },
  {
    key: "ticketvotePolicy",
    reducer: policy,
  },
  {
    key: "ticketvoteResults",
    reducer: results,
  },
  {
    key: "ticketvoteSummaries",
    reducer: summaries,
  },
  {
    key: "ticketvoteTimestamps",
    reducer: timestamps,
  },
];
```

## Inventory Slice

An `inventory` is a `{ { [status]: [...tokens] } }` map used to index `record tokens`.

<a id="ticketvote-status"></a> Each `status` is defined below:

| Value | Label          | Description                                        |
| ----- | -------------- | -------------------------------------------------- |
| 1     | `unauthorized` | Record not yet authorized for voting               |
| 2     | `authorized`   | Record authorized for voting                       |
| 3     | `started`      | Record is available for voting                     |
| 4     | `finished`     | Voting has finished. No more votes can be cast.    |
| 5     | `approved`     | Vote finished and passed the approval criteria     |
| 6     | `rejected`     | Vote finished and not passed the approval criteria |
| 7     | `ineligible`   | Record can't be voted                              |

- `initialState`

  Inventory Slice initial state:

  ```javascript
  const initialStatusInventory = {
    tokens: [],
    lastPage: 0,
    lastTokenPos: null,
    status: "idle",
  };

  export const initialState = {
    unauthorized: initialStatusInventory,
    authorized: initialStatusInventory,
    started: initialStatusInventory,
    finished: initialStatusInventory,
    approved: initialStatusInventory,
    rejected: initialStatusInventory,
    ineligible: initialStatusInventory,
    error: null,
    bestBlock: 0,
    status: "idle",
  };
  ```

- <a id="inventory-fetch"></a>
  `async ticketvoteInventory.fetch({ status, page })`

  Async thunk responsible for fetching a paginated inventory for given
  `status` and `page` parameters. `status` must be valid.

  | Param | Type                | Description        |
  | ----- | ------------------- | ------------------ |
  | body  | <code>Object</code> | `{ status, page }` |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";

  // fetch unauthorized records
  await store.dispatch(ticketvoteInventory.fetch({ status: 1, page: 1 }));

  const unauthorizedInventory = store.getState().unauthorized;
  // {
  //    tokens: ["token1", "token2", "token3"],
  //    status: "succeeded/isDone",
  //    lastPage: 1
  // }
  ```

- <a id="inventory-selectstatus"></a>
  `ticketvoteInventory.selectStatus(state, { status })`

  Returns the current Inventory slice fetch status for given `state` and
  `status`.

  | Param          | Type                | Description                      |
  | -------------- | ------------------- | -------------------------------- |
  | state          | <code>Object</code> | Redux Store state                |
  | selectorParams | <code>Object</code> | `{ status }` - Ticketvote Status |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";

  // fetch unauthorized records
  await store.dispatch(ticketvoteInventory.fetch({ status: 1, page: 1 }));

  const state = store.getState();
  const unauthorizedStatus = ticketvoteInventory.selectStatus(state, {
    status: 1,
  });
  // "succeeded/isDone"
  ```

- <a id="inventory-selectbystatus"></a>
  `ticketvoteInventory.selectByStatus(state, status)`

  Returns the current Inventory for given `state` and `status`.

  | Param  | Type                          | Description                     |
  | ------ | ----------------------------- | ------------------------------- |
  | state  | <code>Object</code>           | Redux Store state               |
  | status | <code>Number or String</code> | Ticketvote status code or label |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";

  // fetch unauthorized records
  await store.dispatch(ticketvoteInventory.fetch({ status: 1, page: 1 }));

  const state = store.getState();
  const unauthorizedInv = ticketvoteInventory.selectByStatus(state, 1);
  // ["token1", "token2" "token3", ...]
  ```

- <a id="inventory-selectlastpage"></a>
  `ticketvoteInventory.selectLastPage(state, { status })`

  Returns the current Inventory for given `state` and `status`.

  | Param          | Type                | Description                      |
  | -------------- | ------------------- | -------------------------------- |
  | state          | <code>Object</code> | Redux Store state                |
  | selectorParams | <code>Object</code> | `{ status }` - Ticketvote Status |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";

  // fetch unauthorized records
  await store.dispatch(ticketvoteInventory.fetch({ status: 1, page: 1 }));

  const state = store.getState();
  const unauthorizedLastPage = ticketvoteInventory.selectByStatus(state, {
    status: 1,
  });
  // Last page: 1
  ```

## Summaries Slice

- `initialState`:

  ```javascript
  export const initialState = {
    byToken: {},
    lastTokenPos: null,
    status: "idle",
    error: null,
  };
  ```

- <a id="summaries-fetch"></a> `async ticketvoteSummaries.fetch({ tokens })`

  Async thunk responsible for fetching ticketvote summaries for given `tokens`
  param.

  | Param | Type                | Description                        |
  | ----- | ------------------- | ---------------------------------- |
  | body  | <code>Object</code> | `{ tokens }` - Record Tokens array |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";

  await store.dispatch(
    ticketvoteSummaries.fetch({ tokens: ["token1", "token2", "token3"] })
  );

  const summaries = store.getState().byToken;
  // {
  //    token1: {...summary1},
  //    token2: {...summary2},
  //    token3: {...summary3}
  // }
  ```

- <a id="summaries-selectstatus"></a>
  `ticketvoteSummaries.selectStatus(state)`

  Returns the current ticketvote summaries slice fetch status for given `state`.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";

  await store.dispatch(
    ticketvoteSummaries.fetch({ tokens: ["token1", "token2", "token3"] })
  );

  const state = store.getState();
  const summariesStatus = ticketvoteSummaries.selectStatus(state);
  // "succeeded"
  ```

- <a id="summaries-selectbystatus"></a>
  `ticketvoteSummaries.selectByStatus(state, status)`

  Returns ticketvote summaries for given `state` and `status`.

  | Param  | Type                          | Description                     |
  | ------ | ----------------------------- | ------------------------------- |
  | state  | <code>Object</code>           | Redux Store state               |
  | status | <code>Number or String</code> | Ticketvote status code or label |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";

  await store.dispatch(
    ticketvoteSummaries.fetch({ tokens: ["token1", "token2", "token3"] })
  );

  const state = store.getState();
  const unauthorizedSummaries = ticketvoteSummaries.selectByStatus(state, 1);
  // {
  //    token1: {...summary1},
  // }
  ```

- <a id="summaries-selectall"></a> `ticketvoteSummaries.selectAll(state)`

  Returns ticketvote summaries for given `state`.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";

  await store.dispatch(
    ticketvoteSummaries.fetch({ tokens: ["token1", "token2", "token3"] })
  );

  const state = store.getState();
  const allSummaries = ticketvoteSummaries.selectAll(state);
  // {
  //    token1: {...summary1},
  //    token2: {...summary2},
  //    token3: {...summary3}
  // }
  ```

- <a id="summaries-selectbytoken"></a>
  `ticketvoteSummaries.selectByToken(state, token)`

  Returns ticketvote summary for given `state` and `token`.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |
  | token | <code>String</code> | Record Token      |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";

  await store.dispatch(
    ticketvoteSummaries.fetch({ tokens: ["token1", "token2", "token3"] })
  );

  const state = store.getState();
  const summary = ticketvoteSummaries.selectByToken(state, "token2");
  // {...summary2}
  ```

- <a id="summaries-selectbytokensbatch"></a>
  `ticketvoteSummaries.selectByTokensBatch(state, tokens)`

  Returns ticketvote summaries for given `state` and `tokens`.

  | Param  | Type                | Description       |
  | ------ | ------------------- | ----------------- |
  | state  | <code>Object</code> | Redux Store state |
  | tokens | <code>Array</code>  | Record Tokens     |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";

  await store.dispatch(
    ticketvoteSummaries.fetch({ tokens: ["token1", "token2", "token3"] })
  );

  const state = store.getState();
  const summaries = ticketvoteSummaries.selectByTokensBatch(state, [
    "token2",
    "token3",
  ]);
  // [{...summary2},  {...summary3}]
  ```

- <a id="summaries-selectfetchedtokens"></a>
  `ticketvoteSummaries.selectFetchedTokens(state, tokens)`

  Returns fetched ticketvote summaries for given `state` and `tokens`.

  | Param  | Type                | Description       |
  | ------ | ------------------- | ----------------- |
  | state  | <code>Object</code> | Redux Store state |
  | tokens | <code>Array</code>  | Record Tokens     |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";

  await store.dispatch(
    ticketvoteSummaries.fetch({ tokens: ["token1", "token2", "token3"] })
  );

  const state = store.getState();
  const summariesFetched = ticketvoteSummaries.selectFetchedTokens(state, [
    "token2",
    "token4",
    "token5",
  ]);
  // [{...summary2}]
  ```

## Details Slice

- `initialState`

  ```javascript
  export const initialState = {
    byToken: {},
    status: "idle",
    error: null,
  };
  ```

- <a id="details-fetch"></a> `async ticketvoteDetails.fetch({ token })`

  Async thunk responsible for fetching ticketvote details for given `token`
  param.

  | Param | Type                | Description                |
  | ----- | ------------------- | -------------------------- |
  | body  | <code>Object</code> | `{ token }` - Record Token |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteDetails } from "@politeiagui/ticketvote/details";

  await store.dispatch(ticketvoteDetails.fetch({ token: "token1" }));

  const state = store.getState();
  // {
  //    byToken: { token1: {...details1} },
  //    status: "succeeded",
  //    error: null,
  // };
  ```

- <a id="details-selectstatus"></a> `ticketvoteDetails.selectStatus(state)`

  Returns ticketvote details fetch status for given `state` param.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteDetails } from "@politeiagui/ticketvote/details";

  await store.dispatch(ticketvoteDetails.fetch({ token: "token1" }));

  const state = store.getState();
  const detailsStatus = ticketvoteDetails.selectStatus(state);
  // "succeeded",
  ```

- <a id="details-selectbytoken"></a>
  `ticketvoteDetails.selectByToken(state, token)`

  Returns ticketvote details for given `state` and `token` params.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |
  | token | <code>String</code> | Record Token      |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteDetails } from "@politeiagui/ticketvote/details";

  await store.dispatch(ticketvoteDetails.fetch({ token: "token1" }));

  const state = store.getState();
  const details = ticketvoteDetails.selectByToken(state, "token1");
  // {...details1},
  ```

## Results Slice

- `initialState`

  ```javascript
  export const initialState = {
    byToken: {},
    status: "idle",
    error: null,
  };
  ```

- <a id="results-fetch"></a> `async ticketvoteResults.fetch({ token })`

  Async thunk responsible for fetching ticketvote results for given `token`
  param.

  | Param | Type                | Description                |
  | ----- | ------------------- | -------------------------- |
  | body  | <code>Object</code> | `{ token }` - Record Token |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteResults } from "@politeiagui/ticketvote/results";

  await store.dispatch(ticketvoteResults.fetch({ token: "token1" }));

  const state = store.getState();
  // {
  //    byToken: { token1: {...results1} },
  //    status: "succeeded",
  //    error: null,
  // };
  ```

- <a id="results-selectstatus"></a> `ticketvoteResults.selectStatus(state)`

  Returns ticketvote results fetch status for given `state` param.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteResults } from "@politeiagui/ticketvote/results";

  await store.dispatch(ticketvoteResults.fetch({ token: "token1" }));

  const state = store.getState();
  const resultsStatus = ticketvoteResults.selectStatus(state);
  // "succeeded",
  ```

- <a id="results-selectbytoken"></a>
  `ticketvoteResults.selectByToken(state, token)`

  Returns ticketvote results for given `state` and `token` params.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |
  | token | <code>String</code> | Record Token      |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteResults } from "@politeiagui/ticketvote/results";

  await store.dispatch(ticketvoteResults.fetch({ token: "token1" }));

  const state = store.getState();
  const results = ticketvoteResults.selectByToken(state, "token1");
  // {...results1},
  ```

## Submissions Slice

- `initialState`

  ```javascript
  export const initialState = {
    byToken: {},
    status: "idle",
    error: null,
  };
  ```

- <a id="submissions-fetch"></a> `async ticketvoteSubmissions.fetch({ token })`

  Async thunk responsible for fetching ticketvote submissions for given `token`
  param.

  | Param | Type                | Description                |
  | ----- | ------------------- | -------------------------- |
  | body  | <code>Object</code> | `{ token }` - Record Token |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSubmissions } from "@politeiagui/ticketvote/submissions";

  await store.dispatch(ticketvoteSubmissions.fetch({ token: "token1" }));

  const state = store.getState();
  // {
  //    byToken: { token1: {...submissions1} },
  //    status: "succeeded",
  //    error: null,
  // };
  ```

- <a id="submissions-selectstatus"></a>
  `ticketvoteSubmissions.selectStatus(state)`

  Returns ticketvote submissions fetch status for given `state` param.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSubmissions } from "@politeiagui/ticketvote/submissions";

  await store.dispatch(ticketvoteSubmissions.fetch({ token: "token1" }));

  const state = store.getState();
  const submissionsStatus = ticketvoteSubmissions.selectStatus(state);
  // "succeeded",
  ```

- <a id="submissions-selectbytoken"></a>
  `ticketvoteSubmissions.selectByToken(state, token)`

  Returns ticketvote submissions for given `state` and `token` params.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |
  | token | <code>String</code> | Record Token      |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteSubmissions } from "@politeiagui/ticketvote/submissions";

  await store.dispatch(ticketvoteSubmissions.fetch({ token: "token1" }));

  const state = store.getState();
  const submissions = ticketvoteSubmissions.selectByToken(state, "token1");
  // {...submissions1},
  ```

## Timestamps Slice

- `initialState`

  ```javascript
  export const initialState = {
    byToken: {},
    status: "idle",
    error: null,
  };
  ```

- <a id="timestamps-fetch"></a>
  `async ticketvoteTimestamps.fetch({ token, votespage })`

  Async thunk responsible for fetching ticketvote timestamps for given `token`
  and `votespage` params.

  | Param | Type                | Description                                                 |
  | ----- | ------------------- | ----------------------------------------------------------- |
  | body  | <code>Object</code> | `{ token, votespage }` - Record Token, and votes page index |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";

  await store.dispatch(
    ticketvoteTimestamps.fetch({ token: "token1", votespage: 1 })
  );

  const state = store.getState();
  // {
  //    byToken: { token1: {...timestamps1} },
  //    status: "succeeded",
  //    error: null,
  // };
  ```

- <a id="timestamps-selectstatus"></a>
  `ticketvoteTimestamps.selectStatus(state)`

  Returns ticketvote timestamps fetch status for given `state` param.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";

  await store.dispatch(ticketvoteTimestamps.fetch({ token: "token1" }));

  const state = store.getState();
  const timestampsStatus = ticketvoteTimestamps.selectStatus(state);
  // "succeeded",
  ```

- <a id="timestamps-selectbytoken"></a>
  `ticketvoteTimestamps.selectByToken(state, token)`

  Returns ticketvote timestamps for given `state` and `token` params.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |
  | token | <code>String</code> | Record Token      |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvoteTimestamps } from "@politeiagui/ticketvote/timestamps";

  await store.dispatch(ticketvoteTimestamps.fetch({ token: "token1" }));

  const state = store.getState();
  const timestamps = ticketvoteTimestamps.selectByToken(state, "token1");
  // {...timestamps1},
  ```

### <a id="ticketvote-policy"></a> Policy Slice

The ticketvote policy slice is used for storing and managing server's policy for
ticketvote API.

- `initialState`:

  ```javascript
  export const initialState = {
    policy: {},
    status: "idle",
    error: null,
  };
  ```

- <a id="policy-fetch"></a> `async ticketvotePolicy.fetch()`

  Async thunk used to fetch ticketvote API policy.

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";

  await store.dispatch(ticketvotePolicy.fetch());

  const policy = store.getState().policy;
  // {
  //    "linkbyperiodmin": 1,
  //    "linkbyperiodmax": 7776000,
  //    "votedurationmin": 1,
  //    "votedurationmax": 4032,
  //    "summariespagesize": 5,
  //    "inventorypagesize": 20,
  //    "timestampspagesize": 100
  // }
  ```

- <a id="policy-select"></a> `ticketvotePolicy.select(state)`

  Returns `policy` rules for given `state`.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";

  await store.dispatch(ticketvotePolicy.fetch());

  const policy = ticketvotePolicy.select(store.getState());
  // {
  //    "linkbyperiodmin": 1,
  //    "linkbyperiodmax": 7776000,
  //    "votedurationmin": 1,
  //    "votedurationmax": 4032,
  //    "summariespagesize": 5,
  //    "inventorypagesize": 20,
  //    "timestampspagesize": 100
  // }
  ```

- <a id="policy-selectstatus"></a> `ticketvotePolicy.selectStatus(state)`

  Returns the ticketvote policy fetch status.

  | Param | Type                | Description       |
  | ----- | ------------------- | ----------------- |
  | state | <code>Object</code> | Redux Store state |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";

  await store.dispatch(ticketvotePolicy.fetch());

  const policy = ticketvotePolicy.selectStatus(store.getState());
  // "succeeded"
  ```

## Example

Let's build a custom page for fetching `unauthorized` records + summaries:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store, connectReducers } from "@politeiagui/core";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteConstants } from "../../ticketvote";
import { ticketvotePolicy } from "../../ticketvote/policy";
import { TicketvoteRecordsList } from "../../ui";
// Improve visual theming
import { PiThemeWrapper } from "../theme";

const AllStatusPage = async () => {
  // Before dispatching any actions, we need to connect the ticketvote reducers
  // into the core store.
  await connectReducers(ticketvoteConstants.reducersArray);
  // We can only perform fetch actions with all policies loaded, because the
  // async thunks will require some extra parameters defined by each plugin's
  // policy rules
  await store.dispatch(ticketvotePolicy.fetch());
  await store.dispatch(recordsPolicy.fetch());
  // Render AllStatusPage component
  ReactDOM.render(
    <Provider store={store}>
      <PiThemeWrapper>
        <TicketvoteRecordsList status={"unauthorized"} />
      </PiThemeWrapper>
    </Provider>,
    document.querySelector("#root")
  );
};

export default AllStatusPage;
```

Here is our `TicketvoteRecordsList` component:

```javascript
import React, { useState } from "react";
import { Card } from "pi-ui";
import { useSelector } from "react-redux";
import { ticketvoteInventory } from "../../ticketvote/inventory";
import { ticketvoteSummaries } from "../../ticketvote/summaries";
import { records } from "@politeiagui/core/records";
import { TicketvoteRecordVoteStatusBar } from "../Vote";

export function TicketvoteRecordsList({ status }) {
  const [page, setPage] = useState(1);
  // Fetch inventory first, to load the required record tokens
  const { inventory, onFetchNextRecordsBatch, inventoryStatus } =
    ticketvoteInventory.useFetch({
      status,
      page,
    });

  // Get all summaries from given inventory
  const { summaries, onFetchSummariesNextPage } = ticketvoteSummaries.useFetch({
    tokens: inventory,
  });
  // Get all records from given inventory
  const recordsFetched = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );

  // pagination methods
  function handleFetchNextPage() {
    onFetchNextRecordsBatch();
    onFetchSummariesNextPage();
  }

  return (
    <div>
      {recordsFetched &&
        recordsFetched.map((rec, i) => {
          if (
            i === inventory.length - 1 &&
            inventoryStatus === "succeeded/hasMore"
          )
            // only allow next inventory page fetching if inventory has been
            // loaded successfully
            return (
              <button onClick={() => setPage(page + 1)}>
                Fetch Next Inventory Page
              </button>
            );
          return (
            <Card key={i} paddingSize="small">
              <div>Record: {rec.censorshiprecord.token}</div>
              <TicketvoteRecordVoteStatusBar
                ticketvoteSummary={summaries[rec.censorshiprecord.token]}
              />
            </Card>
          );
        })}
      <button onClick={handleFetchNextPage}>Fetch Next Batch</button>
    </div>
  );
}
```

Here's the result:

<img src="./public/assets/ticketvote-records-page.gif"/>

## References

<a id="ref-1">1</a>. lukebp, alexlyp, marcopeereboom, dajohi, amass01, thi4go,
victorgcramos, tiagoalvesdulce, vibros68 . . . (2021). _Politeia_ (1.2.0)
[Politeia is a system for storing off-chain data that is both versioned and
timestamped]. Decred. https://github.com/decred/politeia

<a id="ref-2">2</a>. lukebp. (2021, May 6). _Politeia: Pi 2021 Q3 (Proposal
System)_. Politeia Proposal. https://proposals.decred.org/record/91cfcc8

<a id="ref-3">3</a>. Redux Toolkit v1.6.1. _Redux Toolkit_.
https://redux-toolkit.js.org

<a id="ref-4">4</a>. Redux - A predictable state container for JavaScript apps.
_Redux_. https://redux.js.org.
