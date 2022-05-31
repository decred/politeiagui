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

## Integration listeners

In order to provide a clean integration among all plugins and
core packages, we are using the Observables pattern. The app-shell can start
listening to actions from plugins or custom ones created in the app-shell and
fire effects to dispatch multiple plugins actions. A good use case is listen to
a fetchNextBatch action and dispatch records, summaries and comments counts
requests accordingly.

To start listening to an action, you should import the listener object from the
core:

`import { listener } from "@politeiagui/core/listeners";`

Then you can `startListening` to action creators and call effects. For example:

```js
listener.startListening({
  actionCreator: myCustomAction,
  effect: () => {
    // will be called every time myCustomAction is dispatched
  }
})
```

For more details, see the [createListenerMiddleware docs](https://redux-toolkit.js.org/api/createListenerMiddleware)

## Proposal

Once records are fetched, we can now decode all
information and transform them on **proposals**.

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
