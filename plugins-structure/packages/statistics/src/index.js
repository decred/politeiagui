import { store } from "@politeiagui/core";
import { records } from "@politeiagui/core/records";
import { recordsInventory } from "@politeiagui/core/records/inventory";
import { recordsPolicy } from "@politeiagui/core/records/policy";

const publicRecord = {
  recordsState: "vetted",
  status: "public",
};

const censoredRecord = {
  recordsState: "vetted",
  status: "censored",
};

const archivedRecord = {
  recordsState: "vetted",
  status: "archived",
};

function getInventoryStatus(state) {
  const inventoryVettedPublicStatus = recordsInventory.selectStatus(
    state,
    publicRecord
  );
  const inventoryVettedCensoredStatus = recordsInventory.selectStatus(
    state,
    censoredRecord
  );
  const inventoryVettedArchivedStatus = recordsInventory.selectStatus(
    state,
    archivedRecord
  );
  return {
    inventoryVettedPublicStatus,
    inventoryVettedCensoredStatus,
    inventoryVettedArchivedStatus,
  };
}

async function fetchInventory() {
  const {
    inventoryVettedPublicStatus,
    inventoryVettedCensoredStatus,
    inventoryVettedArchivedStatus,
  } = getInventoryStatus(store.getState());
  if (inventoryVettedPublicStatus === "idle") {
    await store.dispatch(
      recordsInventory.fetch({
        ...publicRecord,
        page:
          recordsInventory.selectLastPage(store.getState(), publicRecord) + 1,
      })
    );
  }
  if (inventoryVettedCensoredStatus === "idle") {
    await store.dispatch(
      recordsInventory.fetch({
        ...censoredRecord,
        page:
          recordsInventory.selectLastPage(store.getState(), censoredRecord) + 1,
      })
    );
  }
  if (inventoryVettedArchivedStatus === "idle") {
    await store.dispatch(
      recordsInventory.fetch({
        ...archivedRecord,
        page:
          recordsInventory.selectLastPage(store.getState(), archivedRecord) + 1,
      })
    );
  }
}

async function fetchRecords(status, opt) {
  if (status) {
    recordsInventory.selectByStateAndStatus(store.getState(), opt);
    // let hasMoreRecords = recordsInventory.selectHasMoreRecordsToFetch(
    //   store.getState(),
    //   opt
    // );
    let hasMoreRecords = false;
    while (hasMoreRecords) {
      // TODO: redo without fetchNextRecordsBatch from recordsInventory
      // await store.dispatch(recordsInventory.fetchNextRecordsBatch(opt));
      hasMoreRecords = true;
    }
  }
}

async function statisticsPage() {
  await store.dispatch(recordsPolicy.fetch());
  await fetchInventory();
  const {
    inventoryVettedPublicStatus,
    inventoryVettedCensoredStatus,
    inventoryVettedArchivedStatus,
  } = getInventoryStatus(store.getState());
  await fetchRecords(inventoryVettedPublicStatus, publicRecord);
  await fetchRecords(inventoryVettedCensoredStatus, censoredRecord);
  await fetchRecords(inventoryVettedArchivedStatus, archivedRecord);
  const publicRecords = records.selectByStateAndStatus(
    store.getState(),
    publicRecord
  );
  const censoredRecords = records.selectByStateAndStatus(
    store.getState(),
    censoredRecord
  );
  const archivedRecords = records.selectByStateAndStatus(
    store.getState(),
    archivedRecord
  );
  const userWithMostRecords = calcStatistics(
    Object.values(publicRecords),
    Object.values(censoredRecords),
    Object.values(archivedRecords)
  );
  return `<div>
    <h1>Nice Statistics</h1>
    ${renderNumOfRecords("public", Object.values(publicRecords))}
    ${renderNumOfRecords("censored", Object.values(censoredRecords))}
    ${renderNumOfRecords("archived", Object.values(archivedRecords))}
    ${renderUserWithMostRecords(userWithMostRecords)}
  </div>`;
}

function renderNumOfRecords(status, recordsArr) {
  return `
    <div>
      <h2># of ${status} records</h2>
      <span>${recordsArr.length}</span>
    </div>
    `;
}

function renderUserWithMostRecords(user) {
  const entries = Object.entries(user);
  const [username, amount] = entries[0];
  return `
    <div>
      <h2>User with most records</h2>
      <span>${username} with ${amount} records</span>
    </div>
    `;
}

function calcStatistics(publicRecords, censoredRecords, archivedRecords) {
  const allRecords = [...publicRecords, ...censoredRecords, ...archivedRecords];
  const userAmountPair = allRecords.reduce((acc, cur) => {
    if (acc[cur.username]) {
      return {
        ...acc,
        [cur.username]: acc[cur.username] + 1,
      };
    } else {
      return {
        ...acc,
        [cur.username]: 1,
      };
    }
  }, {});
  let aux = 0;
  let userAmount = {};
  for (let key in userAmountPair) {
    if (userAmountPair[key] > aux) {
      aux = userAmountPair[key];
      userAmount = { [key]: userAmountPair[key] };
    }
  }
  return userAmount;
}

export const routes = [
  {
    path: "/statistics",
    view: async () => {
      document.querySelector("#root").innerHTML = await statisticsPage();
    },
  },
];

// let routerInitialized = false;

// function initializeApp() {
//   const unsubscribe = initializeApi();
//   const apiStatus = api.selectStatus(store.getState());
//   if (apiStatus === "succeeded") {
//     unsubscribe();
//   }
// }

// function initializeApi() {
//   const apiStatus = api.selectStatus(store.getState());
//   let unsubscribe;
//   if (apiStatus === "idle") {
//     unsubscribe = store.subscribe(handleApi);
//     store.dispatch(api.fetch());
//   }
//   return unsubscribe;
// }

// function handleApi() {
//   const state = store.getState();
//   const status = api.selectStatus(state);
//   if (status === "loading") {
//     document.querySelector("#root").innerHTML = "<h1>Loading api...</h1>";
//   }
//   if (status === "succeeded" && !routerInitialized) {
//     routerInitialized = true;
//     router.init({ routes });
//   }
// }

// initializeApp();
