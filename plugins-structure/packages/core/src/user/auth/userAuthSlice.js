import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sha3_256 } from "js-sha3";

export const initialState = {
  currentUser: null,
  status: "idle",
  error: null,
  verificationtoken: null,
};

/**
 * userLogin is an async thunk responsible for logging in a user.
 * @param {{
 *  email: String,
 *  password: String,
 *  code: String
 * }} credentials - The user's credentials
 */
export const userLogin = createAsyncThunk(
  "userAuth/login",
  async ({ email, password, code }, { rejectWithValue, extra }) => {
    try {
      return await extra.userLogin({
        email: email.toLowerCase(),
        password: sha3_256(password),
        code,
      });
    } catch (error) {
      // TODO: Format user error messages
      // TODO 2: Handle 2FA error codes
      throw rejectWithValue(error.message);
    }
  },
  {
    condition: (credentials) => {
      return !!(credentials && credentials.email && credentials.password);
    },
  }
);

export const userSignup = createAsyncThunk(
  "userAuth/signup",
  async (
    { email, password, username },
    { rejectWithValue, getState, extra }
  ) => {
    try {
      const publickey = await extra.pki.generateNewUserPubkeyHex(username);
      return await extra.userSignup(getState(), {
        email: email.toLowerCase(),
        password: sha3_256(password),
        publickey,
        username,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (credentials) =>
      !!(
        credentials &&
        credentials.email &&
        credentials.password &&
        credentials.username
      ),
  }
);

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(userSignup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.verificationtoken) {
          state.verificationtoken = action.payload.verificationtoken;
        }
      })
      .addCase(userSignup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectCurrentUser = (state) => state.userAuth.currentUser;
export const selectAuthError = (state) => state.userAuth.error;

export default userAuthSlice.reducer;
