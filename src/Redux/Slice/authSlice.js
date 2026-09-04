import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../services/authApi";

const savedToken        = localStorage.getItem("accessToken");
const savedRefreshToken = localStorage.getItem("refreshToken");
const savedUser         = localStorage.getItem("user");
const savedActiveRole   = localStorage.getItem("activeRole");
const savedRoles        = localStorage.getItem("roles");

const initialState = {
    accessToken: savedToken || null,
    refreshToken: savedRefreshToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    activeRole: savedActiveRole ? JSON.parse(savedActiveRole) : null,
    roles: savedRoles ? JSON.parse(savedRoles) : [],
    isLoading: false,
    isAuthenticated: !!savedToken,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const tokenResponse = await authApi.getToken(
                email,
                password
            );
            const {
    accessToken,
    refreshToken,
    expiresInSeconds,
    activeRole,
    roles,
} = tokenResponse;

            if (!accessToken) {
                return rejectWithValue(
                    "Access token was not received."
                );
            }

            const userResponse = await authApi.login(accessToken);
            localStorage.setItem("accessToken", accessToken);

            if (activeRole) {
                localStorage.setItem(
                    "activeRole",
                    JSON.stringify(activeRole)
                );
            }

            if (roles) {
                localStorage.setItem(
                    "roles",
                    JSON.stringify(roles)
                );
            }

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
            // return {
            //     accessToken,
            //     refreshToken,
            //     expiresInSeconds,
            //     user: userResponse,
            // };

            return {
                accessToken,
                refreshToken,
                expiresInSeconds,
                activeRole,
                roles,
                user: userResponse,
            };
        } catch (error) {
            console.error("Login API Error:", error);
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid email or password. Please try again.";
            return rejectWithValue(message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("activeRole");
            localStorage.removeItem("roles");
        }
    );

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },

        setActiveRole: (state, action) => {
            state.activeRole = action.payload;

            localStorage.setItem(
                "activeRole",
                JSON.stringify(action.payload)
            );
        },
        setRoles: (state, action) => {
            state.roles = action.payload || [];

            localStorage.setItem(
                "roles",
                JSON.stringify(state.roles)
            );
        },
            handleUnauthorized: (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.activeRole = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = "Your session has expired. Please sign in again.";

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("activeRole");
        localStorage.removeItem("roles");
    },
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(
                loginUser.fulfilled,
                (state, action) => {

                    state.isLoading = false;

                    state.isAuthenticated = true;

                    state.accessToken =
                        action.payload.accessToken;

                    state.refreshToken =
                        action.payload.refreshToken;

                    state.user =
                        action.payload.user;

                    state.activeRole =
                        action.payload.activeRole;

                    state.roles =
                        action.payload.roles || [];

                    state.error = null;
                }
            )
            
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error =
                    action.payload ||
                    "Login failed. Please try again.";
            })

            .addCase(
                logoutUser.fulfilled,
                (state) => {

                    state.accessToken = null;
                    state.refreshToken = null;
                    state.user = null;
                    state.activeRole = null;
                    state.roles = [];

                    state.isAuthenticated = false;
                    state.isLoading = false;
                    state.error = null;
                }
            )
    },
});

export const { clearAuthError, setActiveRole, handleUnauthorized, setRoles, } = authSlice.actions;

export default authSlice.reducer;