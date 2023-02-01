import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import isString from "lodash/isString";

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
        state.byId[userid] = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectUserById = (state, userid) => state.users.byId[userid];
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
