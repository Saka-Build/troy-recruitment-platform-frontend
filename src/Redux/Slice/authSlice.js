import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../services/authApi";

/*
 * Load previously saved authentication data
 */
const savedToken = localStorage.getItem("accessToken");
const savedRefreshToken = localStorage.getItem("refreshToken");
const savedUser = localStorage.getItem("user");

const initialState = {
    accessToken: savedToken || null,
    refreshToken: savedRefreshToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,

    isLoading: false,
    isAuthenticated: !!savedToken,
    error: null,
};

/*
 * TWO STEP LOGIN
 *
 * Step 1:
 * Get access token using email + password
 *
 * Step 2:
 * Call login API using Bearer token
 */
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            /*
             * STEP 1
             * Get token
             */
            const tokenResponse = await authApi.getToken(
                email,
                password
            );

            const {
                accessToken,
                refreshToken,
                expiresInSeconds,
            } = tokenResponse;

            if (!accessToken) {
                return rejectWithValue(
                    "Access token was not received."
                );
            }

            /*
             * STEP 2
             * Login using access token
             */
            const userResponse = await authApi.login(accessToken);

            /*
             * Save authentication information
             */
            localStorage.setItem("accessToken", accessToken);

            if (refreshToken) {
                localStorage.setItem(
                    "refreshToken",
                    refreshToken
                );
            }

            localStorage.setItem(
                "user",
                JSON.stringify(userResponse)
            );

            /*
             * Return everything to Redux
             */
            return {
                accessToken,
                refreshToken,
                expiresInSeconds,
                user: userResponse,
            };
        } catch (error) {
            console.error("Login API Error:", error);

            /*
             * Backend error message
             */
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid email or password. Please try again.";

            return rejectWithValue(message);
        }
    }
);

/*
 * Logout
 */
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    }
);

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
             * LOGIN STARTED
             */
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            /*
             * LOGIN SUCCESS
             */
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;

                state.accessToken =
                    action.payload.accessToken;

                state.refreshToken =
                    action.payload.refreshToken;

                state.user = action.payload.user;

                state.error = null;
            })

            /*
             * LOGIN FAILED
             */
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error =
                    action.payload ||
                    "Login failed. Please try again.";
            })

            /*
             * LOGOUT
             */
            .addCase(logoutUser.fulfilled, (state) => {
                state.accessToken = null;
                state.refreshToken = null;
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            });
    },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;