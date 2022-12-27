import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// MOCKS
import { mockUser } from "../dev/mocks";

const initialState = {
  currentUser: null,
  byId: {},
  status: "idle",
  error: null,
};

export const userLogin = createAsyncThunk(
  "user/login",
  ({ email, password }, { rejectWithValue }) => {
    // Mock user. ONLY FOR DEV PURPOSES. THIS MUST BE REMOVED BEFORE PRODUCTION.
    // Replace this mock by the api/user login method.
    if (email === "error@error.com") return rejectWithValue("User not found");
    const user = mockUser({ isadmin: email === "admin@example.com" })({
      email,
      password,
    });
    // END MOCK
    return { user };
  },
  {
    condition: (credentials) => {
      return credentials && credentials.email && credentials.password;
    },
  }
);

export const userSignup = createAsyncThunk(
  "user/signup",
  ({ email, password, publickey, username }, { rejectWithValue }) => {
    // Mock user. ONLY FOR DEV PURPOSES. THIS MUST BE REMOVED BEFORE PRODUCTION.
    // Replace this mock by the api/user new method.
    if (email === "error@error.com") throw rejectWithValue("User not found");
    return { verificationtoken: "fake-verification-token" };
    // END MOCK
  },
  {
    condition: (data) =>
      data && data.email && data.password && data.publickey && data.username,
  }
);

export const userLogout = createAsyncThunk(
  "user/logout",
  () => {
    // LOGOUT SHOULD CALL API.
    return;
  },
  {
    condition: (_, { getState }) => {
      return !!getState().user.currentUser;
    },
  }
);

export const userVerificationEmailResend = createAsyncThunk(
  "user/verificationResend",
  ({ email, username }, { rejectWithValue }) => {
    // Mock user. ONLY FOR DEV PURPOSES. THIS MUST BE REMOVED BEFORE PRODUCTION.
    // Replace this mock by the api/user new method.
    if (email === "error@error.com") return rejectWithValue("User not found");
    return { verificationtoken: "fake-verification-token" };
    // END MOCK
  },
  {
    condition: (data) => data && data.email && data.username,
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers(builder) {
    builder
      // Login
      .addCase(userLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { user } = action.payload;
        // Format user
        state.currentUser = user;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Signup
      .addCase(userSignup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userSignup.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(userSignup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Logout
      .addCase(userLogout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.status = "succeeded";
        state.currentUser = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Verification email
      .addCase(userVerificationEmailResend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userVerificationEmailResend.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(userVerificationEmailResend.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectCurrentUser = (state) => state.user.currentUser;

export default userSlice.reducer;
