import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || " ";

export const getSubmissionCounts = createAsyncThunk(
    "recruitmentWorkflow/getSubmissionCounts",
    async (_, { rejectWithValue }) => {
        try {
            const accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            const cleanToken = accessToken
                .replace(/^Bearer\s+/i, "")
                .trim();

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/submissionCounts`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },
                }
            );

            const data = await response.json();

            console.log(
                "Submission Counts API Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch submission counts"
                );
            }

            return data;
        } catch (error) {
            console.error(
                "Submission Counts API Error:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching submission counts"
            );
        }
    }
);

const initialState = {
    submissionCounts: {
        totalApplied: 0,
        totalScreening: 0,
        totalReadyToSubmit: 0,
        totalSubmitted: 0,
        totalInterview: 0,
        totalOffer: 0,
        totalJoined: 0,
    },
    loading: false,
    error: null,
};

const recruitmentWorkflowSlice = createSlice({
    name: "recruitmentWorkflow",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getSubmissionCounts.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addCase(
                getSubmissionCounts.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.error = null;

                    state.submissionCounts = {
                        totalApplied:
                            action.payload?.totalApplied ?? 0,
                        totalScreening:
                            action.payload?.totalScreening ?? 0,
                        totalReadyToSubmit:
                            action.payload?.totalReadyToSubmit ?? 0,
                        totalSubmitted:
                            action.payload?.totalSubmitted ?? 0,
                        totalInterview:
                            action.payload?.totalInterview ?? 0,
                        totalOffer:
                            action.payload?.totalOffer ?? 0,
                        totalJoined:
                            action.payload?.totalJoined ?? 0,
                    };

                    console.log(
                        "Updated Submission Counts:",
                        state.submissionCounts
                    );
                }
            )
            .addCase(
                getSubmissionCounts.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload ||
                        "Failed to fetch submission counts";
                }
            );
    },
});

export default recruitmentWorkflowSlice.reducer;