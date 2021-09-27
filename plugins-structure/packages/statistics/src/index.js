import {
  // router,
  // navigateTo,
  // fetchApi,
  // selectApiStatus,
  store,
  selectRecordsInventoryStatus,
  fetchRecordsInventory,
  selectRecordsInventoryLastPage,
  selectRecordsInventoryByStateAndStatus,
  setRecordsFetchQueue,
  fetchRecordsNextPage,
  selectHasMoreRecordsToFetch,
  selectRecordsByStateAndStatus,
} from "@politeiagui/core";

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
  const inventoryVettedPublicStatus = selectRecordsInventoryStatus(
    state,
    publicRecord
  );
  const inventoryVettedCensoredStatus = selectRecordsInventoryStatus(
    state,
    censoredRecord
  );
  const inventoryVettedArchivedStatus = selectRecordsInventoryStatus(
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
      fetchRecordsInventory({
        ...publicRecord,
        page:
          selectRecordsInventoryLastPage(store.getState(), publicRecord) + 1,
      })
    );
  }
  if (inventoryVettedCensoredStatus === "idle") {
    await store.dispatch(
      fetchRecordsInventory({
        ...censoredRecord,
        page:
          selectRecordsInventoryLastPage(store.getState(), censoredRecord) + 1,
      })
    );
  }
  if (inventoryVettedArchivedStatus === "idle") {
    await store.dispatch(
      fetchRecordsInventory({
        ...archivedRecord,
        page:
          selectRecordsInventoryLastPage(store.getState(), archivedRecord) + 1,
      })
    );
  }
}

async function fetchRecords(status, opt) {
  if (status) {
    const records = selectRecordsInventoryByStateAndStatus(
      store.getState(),
      opt
    );
    store.dispatch(setRecordsFetchQueue({ ...opt, records }));
    let hasMoreRecords = selectHasMoreRecordsToFetch(store.getState(), opt);
    while (hasMoreRecords) {
      await store.dispatch(fetchRecordsNextPage(opt));
      hasMoreRecords = selectHasMoreRecordsToFetch(store.getState(), opt);
    }
  }
}

async function statisticsPage() {
  await fetchInventory();
  const {
    inventoryVettedPublicStatus,
    inventoryVettedCensoredStatus,
    inventoryVettedArchivedStatus,
  } = getInventoryStatus(store.getState());
  await fetchRecords(inventoryVettedPublicStatus, publicRecord);
  await fetchRecords(inventoryVettedCensoredStatus, censoredRecord);
  await fetchRecords(inventoryVettedArchivedStatus, archivedRecord);
  const publicRecords = selectRecordsByStateAndStatus(
    store.getState(),
    publicRecord
  );
  const censoredRecords = selectRecordsByStateAndStatus(
    store.getState(),
    censoredRecord
  );
  const archivedRecords = selectRecordsByStateAndStatus(
    store.getState(),
    archivedRecord
  );
  const userWithMostRecords = calcStatistics(
    publicRecords,
    censoredRecords,
    archivedRecords
  );
  return `<div>
    <h1>Nice Statistics</h1>
    ${renderNumOfRecords("public", publicRecords)}
    ${renderNumOfRecords("censored", censoredRecords)}
    ${renderNumOfRecords("archived", archivedRecords)}
    ${renderUserWithMostRecords(userWithMostRecords)}
  </div>`;
}

function renderNumOfRecords(status, records) {
  return `
    <div>
      <h2># of ${status} records</h2>
      <span>${records.length}</span>
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
//   document.addEventListener("DOMContentLoaded", () => {
//     // make anchor tags work
//     document.body.addEventListener("click", (e) => {
//       if (e.target.matches("[data-link]")) {
//         e.preventDefault();
//         navigateTo(e.target.href);
//       }
//     });
//     const unsubscribe = initializeApi();
//     const apiStatus = selectApiStatus(store.getState());
//     if (apiStatus === "succeeded") {
//       unsubscribe();
//     }
//   });
//   // router history
//   window.addEventListener("popstate", () => router(routes));
// }

// function initializeApi() {
//   const apiStatus = selectApiStatus(store.getState());
//   let unsubscribe;
//   if (apiStatus === "idle") {
//     unsubscribe = store.subscribe(handleApi);
//     store.dispatch(fetchApi());
//   }
//   return unsubscribe;
// }

// function handleApi() {
//   const state = store.getState();
//   const status = selectApiStatus(state);
//   if (status === "loading") {
//     document.querySelector("#root").innerHTML = "<h1>Loading api...</h1>";
//   }
//   if (status === "succeeded" && !routerInitialized) {
//     routerInitialized = true;
//     router(routes);
//   }
// }

// initializeApp();
