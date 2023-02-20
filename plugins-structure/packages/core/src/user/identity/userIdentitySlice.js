import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAuth } from "../auth";

const initialState = {
  status: "idle",
  error: null,
  isValid: false,
};

export const updateKey = createAsyncThunk(
  "userIdentity/updateKey",
  async ({ userid }, { getState, extra, rejectWithValue }) => {
    try {
      // Get user public key from user
      const publickey = await extra.pki.getCurrentUserPubkeyHex(userid);
      console.log(publickey);

      // const { data } = await extra.api.updateKey(userid);
      // return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadKey = createAsyncThunk(
  "userIdentity/loadKey",
  async ({ userid }, { getState, extra, rejectWithValue }) => {
    try {
      // Get user public key from user
      const publickey = await extra.pki.getCurrentUserPubkeyHex(userid);
      const currentUser = userAuth.selectCurrent(getState());
      return { current: publickey, user: currentUser?.publickey };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (params) => {
      return !!params?.userid;
    },
  }
);

export const importKey = createAsyncThunk(
  "userIdentity/importKey",
  async (
    { userid, publicKey, secretKey },
    { extra, rejectWithValue, getState }
  ) => {
    try {
      // Get user public key from user
      const currentUser = userAuth.selectCurrent(getState());
      if (currentUser?.publickey !== publicKey) {
        throw new Error("Invalid keys");
      }
      await extra.pki.setKeys(userid, { publicKey, secretKey });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userIdentitySlice = createSlice({
  name: "userIdentity",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(updateKey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateKey.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateKey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loadKey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadKey.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { current, user } = action.payload;
        state.isValid = !!(current && user && current === user);
      })
      .addCase(loadKey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(importKey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(importKey.fulfilled, (state) => {
        state.status = "succeeded";
        console.log("Succeeded");
        state.isValid = true;
      })
      .addCase(importKey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectIdentityStatus = (state) => state.userIdentity.status;
export const selectIdentityError = (state) => state.userIdentity.error;
export const selectIdentityIsValid = (state) => state.userIdentity.isValid;

export default userIdentitySlice.reducer;
