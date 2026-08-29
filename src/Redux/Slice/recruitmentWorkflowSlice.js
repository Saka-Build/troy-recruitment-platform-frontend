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

export const getSubmissionsByStage = createAsyncThunk(
    "recruitmentWorkflow/getSubmissionsByStage",
    async (pipelineStage, { rejectWithValue }) => {
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
                `${API_BASE_URL}/api/v1/submissions?pipelineStage=${encodeURIComponent(
                    pipelineStage
                )}`,
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
                `Submissions API Response - ${pipelineStage}:`,
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    `Failed to fetch ${pipelineStage} submissions`
                );
            }

            return data;
        } catch (error) {
            console.error(
                `Submissions API Error - ${pipelineStage}:`,
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching submissions"
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
        totalSelected: 0,
        totalRejected: 0,
        totalOnBoarding: 0,
        totalOnBoarded: 0,
    },
    submissions: [],
    submissionsLoading: false,
    submissionsError: null,

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

            totalSelected:
                action.payload?.totalSelected ?? 0,

            totalRejected:
                action.payload?.totalRejected ?? 0,

            totalOnBoarding:
                action.payload?.totalOnBoarding ?? 0,

            totalOnBoarded:
                action.payload?.totalOnBoarded ?? 0,
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
            )
            
            .addCase(
    getSubmissionsByStage.pending,
    (state) => {
        state.submissionsLoading = true;
        state.submissionsError = null;
    }
)
.addCase(
    getSubmissionsByStage.fulfilled,
    (state, action) => {
        state.submissionsLoading = false;
        state.submissionsError = null;

        state.submissions =
            action.payload?.content || [];

        console.log(
            "Updated submissions:",
            state.submissions
        );
    }
)
.addCase(
    getSubmissionsByStage.rejected,
    (state, action) => {
        state.submissionsLoading = false;
        state.submissionsError =
            action.payload ||
            "Failed to fetch submissions";

        state.submissions = [];
    }
);
    },
});

export default recruitmentWorkflowSlice.reducer;