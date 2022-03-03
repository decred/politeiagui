# Pi (Decred's Proposal System)

Regarding our plugins structure, we need to connect the desired plugins into an
application. The application is called _app-shell_, and **Pi is our app-shell
for Decred's Proposal System**.

Pi integrates ticketvote and comments plugins with the core records layer, where
each record is interpreted as a **proposal**, i.e. each Proposal record contains
specific metadata files that describe a Proposal and distinguish them from other
kinds of records.

The proposal metadata file is called `proposalmetadata.json`, and each record
including this file is considered a **proposal**.

Also, the Pi app shell itself provides the _pi plugin_ interface and includes
all interaction methods with it, such as billing status changes, policy and
proposal summaries.

## Integration Slices

In order to provide a clean and easy-to-debug integration among all plugins and
core packages, we decided to introduce the **Integration Slices** concept on our
app-shell.

Each integration slice provides an async thunk that integrates all other async
thunks calls from plugins used on a specific page.

For example, on `homeSlice` we have a `fetchNextBatch` thunk to fetch records
and ticketvote summaries according to the ticketvote inventory tokens list. Each
batch request will trigger both `records.fetch` and `ticketvoteSummaries.fetch`
calls with N tokens from the inventory, where N is the minimum value between
`ticketvotePolicy` and `recordsPolicy` pages sizes.

To illustrate the example above, let's understand how does the `homeSlice` work.

### Home Slice

The Home Slice is located on the `src/pages/Home/homeSlice.js` directory, and
controls the proposals batch fetching, where each batch is composed by N
requests containing some records tokens batch, as described on the diagram
below:

<p align="center">
  <img src="./src/public/assets/homeSlice-thunk.svg" />
</p>

Before requesting _records_, _ticketvote summaries_, _pi summaries_ and
_comments count_, we need to load the tokens batch, which is retreived from the
ticketvote inventory. The fetching conditions are described below:

> The following pieces of code will only include _records_ and _ticketvote
> summaries_. However, integrating pi summaries and comments count is analogous,
> so we opted to omit them in the example.

```javascript
export const fetchNextBatch = createAsyncThunk(
  "home/fetchNextBatch",
  async (status, { dispatch, rejectWithValue, getState }) => {
    // ...fetch records and ticketvote summaries
  },
  {
    condition: (status, { getState }) =>
      // from "@politeiagui/ticketvote/validation":
      validateTicketvoteStatus(status) &&
      validateTicketvoteSummariesPageSize(getState()) &&
      // from "@politeiagui/core/records/validation":
      validateRecordsPageSize(getState()) &&
      // from from "src/pages/Home/validation":
      validateInventoryIsLoaded(
        getState().ticketvoteInventory[status].tokens
      ) &&
      validateInventoryListLength(
        getState().ticketvoteInventory[status].tokens
      ),
  }
);
```

After loading the inventory, we can dispatch all actions from the regarded thunks
with the given tokens batch, which is composed by N elements, where N is the
minimum value between all plugin's policies being used on the thunk.

```javascript
const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

export const fetchNextBatch = createAsyncThunk(
  "home/fetchNextBatch",
  async (status, { dispatch, rejectWithValue, getState }) => {
    try {
      // Get all required states from packages slices
      const {
        ticketvoteInventory,
        records: recordsState,
        recordsPolicy,
        ticketvotePolicy,
        home,
      } = getState();
      // Get all pages sizes allowed
      const summariesPageSize = ticketvotePolicy.policy.summariespagesize;
      const recordsPageSize = recordsPolicy.policy.recordspagesize;
      // get tokens batch to perform the dispatches
      const { tokens, last } = getTokensToFetch({
        records: recordsState.records,
        // pageSize is the minimum value between all pages sizes, so we can
        // sync all requests with the same tokens batch
        pageSize: Math.min(summariesPageSize, recordsPageSize),
        // inventoryList corresponds to all tokens from given ticketvote
        // inventory
        inventoryList: ticketvoteInventory[status].tokens,
        // lastTokenPos is the pointer that indicates the tokens batch index on
        // homeSlice
        lastTokenPos: home[status].lastTokenPos,
      });

      // dispatches
      await dispatch(records.fetch({ tokens, filenames: piFilenames }));
      await dispatch(ticketvoteSummaries.fetch({ tokens }));
      // returns the last token index so we can update our `lastTokenPos`
      // pointer
      return last;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: (status, { getState }) => // ... fetch condition
  }
);
```

#### API

- <a id="home-fetchnextbatch"></a> `async fetchNextBatch(status)`

  Async thunk responsible for fetching home page batches.

  | Param  | Type                          | Description       |
  | ------ | ----------------------------- | ----------------- |
  | status | <code>String or Number</code> | Ticketvote Status |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { fetchNextBatch } from "./homeSlice.js";

  await store.dispatch(fetchNextBatch("unreviewed"));
  const recordsFetched = store.getState().records.records;
  // { [token1]: {...record1}, [token2]: {...record2}, [token3]: {...record3} }
  const summariesFetched = store.getState().ticketvoteSummaries.summaries;
  // { [token1]: {...summary1}, [token2]: {...summary2}, [token3]: {...summary3} }
  const recordsFetchStatus = store.getState().home.status;
  // "succeeded"
  ```

- <a id="home-selectlasttoken"></a> `selectLastToken(state, status)`

  Last token position selector. Used to fetch paginated batches.

  | Param  | Type                          | Description       |
  | ------ | ----------------------------- | ----------------- |
  | state  | <code>Object</code>           | Redux Store state |
  | status | <code>String or Number</code> | Ticketvote Status |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { fetchNextBatch, selectLastToken } from "./homeSlice.js";

  // fetch first
  await store.dispatch(fetchNextBatch("unreviewed"));
  const state = store.getState();
  // selectLastToken selector
  const lastTokenPos = selectLastToken(state, "unreviewed");
  // lastTokenPos = 4
  ```

- <a id="home-selectstatus"></a> `selectStatus(state, status)`

  Last token position selector. Used to fetch paginated batches.

  | Param  | Type                          | Description       |
  | ------ | ----------------------------- | ----------------- |
  | state  | <code>Object</code>           | Redux Store state |
  | status | <code>String or Number</code> | Ticketvote Status |

  **Usage:**

  ```javascript
  import { store } from "@politeiagui/core";
  import { fetchNextBatch, selectStatus } from "./homeSlice.js";

  // fetch first
  await store.dispatch(fetchNextBatch("unreviewed"));
  let state = store.getState();
  // selectStatus selector
  let homeStatus = selectStatus(state, "unreviewed");
  // homeStatus = "succeeded"

  // Sync dispatch
  store.dispatch(fetchNextBatch("unreviewed"));
  state = store.getState();
  homeStatus = selectStatus(state, "unreviewed");
  // homeStatus = "loading"
  ```

## Proposal

Once we integrated the plugins into `homeSlice`, we can now decode all
information from records and transform it on a **proposal**.

Let's use the utilities provided on `Proposal/utils.js` to perform it. It's
pretty simple!

```javascript
import { decodeProposalRecord } from "./src/components/Proposal/utils";
const proposal = decodeProposalRecord(record);
```

### Utils

- <a id="utils-decodeproposalmetadatafile"></a>
  `decodeProposalMetadataFile(files)`

  Returns the decoded "proposalmetadata.json" file for given record's files
  array.

  | Param | Type               | Description    |
  | ----- | ------------------ | -------------- |
  | files | <code>Array</code> | record's files |

  **Usage:**

  ```javascript
  import { decodeProposalMetadataFile } from "./src/components/Proposal/utils";
  const proposalMetadata = decodeProposalMetadataFile(record.files);
  ```

- <a id="utils-decodevotemetadatafile"></a> `decodeVoteMetadataFile(files)`

  Accepts a proposal files array parses it's vote metadata and returns it as
  object of the form { linkto, linkby }.

  | Param | Type               | Description    |
  | ----- | ------------------ | -------------- |
  | files | <code>Array</code> | record's files |

  **Usage:**

  ```javascript
  import { decodeVoteMetadataFile } from "./src/components/Proposal/utils";
  const voteMetadata = decodeVoteMetadataFile(record.files);
  ```

- <a id="utils-decodeproposalusermetadata"></a>
  `decodeProposalUserMetadata(metadataStreams)`

  Accepts a proposal files array parses it's vote metadata and returns it as
  object of the form { linkto, linkby }.

  | Param | Type               | Description    |
  | ----- | ------------------ | -------------- |
  | files | <code>Array</code> | record's files |

  **Usage:**

  ```javascript
  import { decodeProposalUserMetadata } from "./src/components/Proposal/utils";
  const userMetadata = decodeProposalUserMetadata(record.metadata);
  ```

- <a id="utils-decodeproposalrecord"></a> `decodeProposalRecord(record)`

  returns a formatted proposal object for given record. It decodes all
  proposal-related data from records and converts it into a readable proposal
  object.

  | Param  | Type                | Description |
  | ------ | ------------------- | ----------- |
  | record | <code>Object</code> | record      |

  **Usage:**

  ```javascript
  import { decodeProposalRecord } from "./src/components/Proposal/utils";
  const proposal = decodeProposalRecord(record);
  ```

- <a id="utils-getpublicstatuschangemetadata"></a>
  `getPublicStatusChangeMetadata(userMetadata)`

  Returns the metadata stream that describes when the record has been made
  `public`, i.e. `status === 2`.

  | Param        | Type               | Description                       |
  | ------------ | ------------------ | --------------------------------- |
  | userMetadata | <code>Array</code> | record's "usermd" metadata stream |

  **Usage:**

  ```javascript
  import {
    getPublicStatusChangeMetadata,
    decodeProposalUserMetadata,
  } from "./src/components/Proposal/utils";
  const userMetadata = decodeProposalUserMetadata(record.metadata);
  const statusChangeMetadata = getPublicStatusChangeMetadata(userMetadata);
  ```

- <a id="utils-getproposaltimestamps"></a> `getProposalTimestamps(record)`

  Returns published, censored, edited and abandoned timestamps for given record.
  Default timestamps values are 0.

  | Param  | Type                | Description |
  | ------ | ------------------- | ----------- |
  | record | <code>Object</code> | record      |

  **Usage:**

  ```javascript
  import { getProposalTimestamps } from "./src/components/Proposal/utils";
  const { editedat, publishedat, abandonedat, censoredat } =
    getProposalTimestamps(record);
  ```

- <a id="utils-getproposalstatustagprops"></a>
  `getProposalStatusTagProps(record, voteSummary)`

  Returns the formatted `{ type, text }` props for StatusTag component for given
  record and ticketvote summary.

  | Param       | Type                | Description             |
  | ----------- | ------------------- | ----------------------- |
  | record      | <code>Object</code> | record                  |
  | voteSummary | <code>Object</code> | ticketvote vote summary |

  **Usage:**

  ```javascript
  import { getProposalTimestamps } from "./src/components/Proposal/utils";
  const statusChangeMetadata = getProposalStatusTagProps(record);
  ```

- <a id="utils-showvotestatusbar"></a> `showVoteStatusBar(voteSummary)`

  Returns if vote has started, finished, approved or rejected, which indicates
  whether the StatusBar should be displayed or not.

  | Param       | Type                | Description             |
  | ----------- | ------------------- | ----------------------- |
  | voteSummary | <code>Object</code> | ticketvote vote summary |

  **Usage:**

  ```javascript
  import { showVoteStatusBar } from "./src/components/Proposal/utils";
  const isVoteStatusBarDisplayed = showVoteStatusBar(record);
  ```

## References

<a id="ref-1">1</a>. lukebp, alexlyp, marcopeereboom, dajohi, amass01, thi4go,
victorgcramos, tiagoalvesdulce, vibros68 . . . (2021). _Politeia_ (1.2.0)
[Politeia is a system for storing off-chain data that is both versioned and
timestamped]. Decred. https://github.com/decred/politeia

<a id="ref-2">2</a>. lukebp. (2021, May 6). _Politeia: Pi 2021 Q3 (Proposal
System)_. Politeia Proposal. https://proposals.decred.org/record/91cfcc8

<a id="ref-3">3</a>. Redux Toolkit v1.6.1. _Redux Toolkit_.
https://redux-toolkit.js.org.

<a id="ref-4">4</a>. Redux - A predictable state container for JavaScript apps.
_Redux_. https://redux.js.org.
