import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// MOCKS
import { mockUser } from "../dev/mocks";

// TODO: Use correct methods from user layer once it gets implemented on backend

const initialState = {
  currentUser: null,
  byId: {},
  status: "idle",
  error: null,
};

// Auth
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
    // Replace this mock by the api/user signup method.
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

// Password
export const userPasswordRequestReset = createAsyncThunk(
  "user/passwordRequest",
  ({ username, email }, { rejectWithValue }) => {
    // Mock user. ONLY FOR DEV PURPOSES. THIS MUST BE REMOVED BEFORE PRODUCTION.
    // Replace this mock by the api/user request password reset method.
    if (email === "error@error.com") return rejectWithValue("User not found");
    return { verificationtoken: "fake-verification-token" };
    // END MOCK
  }
);

// Email
export const userVerificationEmailResend = createAsyncThunk(
  "user/verificationResend",
  ({ email, username }, { rejectWithValue }) => {
    // Mock user. ONLY FOR DEV PURPOSES. THIS MUST BE REMOVED BEFORE PRODUCTION.
    // Replace this mock by the api/user email resend method.
    if (email === "error@error.com") return rejectWithValue("User not found");
    return { verificationtoken: "fake-verification-token" };
    // END MOCK
  },
  {
    condition: (data) => data && data.email && data.username,
  }
);
export const userVerifyEmail = createAsyncThunk(
  "user/verify",
  ({ email, verificationtoken, username }, { rejectWithValue }) => {
    // Mock user. ONLY FOR DEV PURPOSES. THIS MUST BE REMOVED BEFORE PRODUCTION.
    // Replace this mock by the api/user verify email method.
    if (email === "error@error.com") return rejectWithValue("User not found");
    return { verificationtoken: "fake-verification-token" };
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
      // Password Request Reset
      .addCase(userPasswordRequestReset.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userPasswordRequestReset.fulfilled, (state) => {
        state.status = "succeeded";
        // TODO: save server response
      })
      .addCase(userPasswordRequestReset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Verification email Resend
      .addCase(userVerificationEmailResend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userVerificationEmailResend.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(userVerificationEmailResend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // User Email Verification
      .addCase(userVerifyEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userVerifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(userVerifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectCurrentUser = (state) => state.user.currentUser;

export default userSlice.reducer;
