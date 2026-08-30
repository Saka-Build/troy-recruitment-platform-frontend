import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getDashboardSummary = createAsyncThunk(
    "dashboard/getDashboardSummary",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("User not authenticated. Access token not found.");
            }
            const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/summary`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data?.message || data?.error || "Failed to fetch dashboard summary");
            }
            return data;
        } catch (error) {
            return rejectWithValue(error?.message || "Something went wrong");
        }
    }
);

const initialState = {
    summary: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
        clearDashboardSummary: (state) => {
            state.summary = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboardSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload;
                state.error = null;
            })
            .addCase(getDashboardSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch dashboard summary";
            });
    },
});

export const { clearDashboardError, clearDashboardSummary } = dashboardSlice.actions;
export default dashboardSlice.reducer;