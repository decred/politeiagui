import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import isString from "lodash/isString";
import { userManageActionToCode } from "./helpers";

export const initialState = {
  byId: {},
  status: "idle",
  error: null,
};

/**
 * fetchUserDetails - async thunk to fetch user details for given userid.
 * @param {string} userid - user id
 */
export const fetchUserDetails = createAsyncThunk(
  "users/fetchDetails",
  async (userid, { rejectWithValue, extra }) => {
    try {
      return await extra.userFetchDetails({ userid });
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  },
  {
    condition: (userid) => !!userid && isString(userid),
  }
);

/**
 * userManage - async thunk to manage user account. It receives userid, action
 * and reason and performs the action on the corresponding user account.
 *
 * Valid actions are:
 * 1. expirenewuser           Expires new user verification
 * 2. expireupdatekey         Expires update user key verification
 * 3. expireresetpassword     Expires reset password verification
 * 4. clearpaywall            Clears user registration paywall
 * 5. unlocks                 Unlocks user account from failed logins
 * 6. deactivates             Deactivates user account
 * 7. reactivate              Reactivates user account
 */
export const userManage = createAsyncThunk(
  "users/manage",
  async ({ userid, action, reason }, { getState, extra, rejectWithValue }) => {
    try {
      return await extra.userManage(getState(), { userid, action, reason });
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  },
  {
    condition: (params) =>
      !!(
        params &&
        isString(params.userid) &&
        userManageActionToCode(params.action)
      ),
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const userid = action.meta.arg;
        state.byId[userid] = action.payload.user;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(userManage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userManage.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(userManage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectUserById = (state, userid) => state.users.byId[userid];
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
