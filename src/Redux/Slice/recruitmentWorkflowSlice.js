import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetch from "../../services/fetchInstance";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

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

export const getSubmissionStatuses = createAsyncThunk(
    "recruitmentWorkflow/getSubmissionStatuses",
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
                `${API_BASE_URL}/api/v1/submissions/statuses`,
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
                "Submission Statuses API Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch submission statuses"
                );
            }

            return data;
        } catch (error) {
            console.error(
                "Submission Statuses API Error:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching submission statuses"
            );
        }
    }
);


// export const getSubmissionsByStage = createAsyncThunk(
//     "recruitmentWorkflow/getSubmissionsByStage",
//     async (pipelineStage, { rejectWithValue }) => {
//         try {
//             const accessToken =
//                 localStorage.getItem("accessToken");

//             if (!accessToken) {
//                 return rejectWithValue(
//                     "Authentication token not found. Please login again."
//                 );
//             }

//             const cleanToken = accessToken
//                 .replace(/^Bearer\s+/i, "")
//                 .trim();

//             const response = await fetch(
//                 `${API_BASE_URL}/api/v1/submissions?pipelineStage=${encodeURIComponent(
//                     pipelineStage
//                 )}`,
//                 {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${cleanToken}`,
//                     },
//                 }
//             );

//             const data = await response.json();

//             console.log(
//                 `Submissions API Response - ${pipelineStage}:`,
//                 data
//             );

//             if (!response.ok) {
//                 return rejectWithValue(
//                     data?.message ||
//                     `Failed to fetch ${pipelineStage} submissions`
//                 );
//             }

//             return data;
//         } catch (error) {
//             console.error(
//                 `Submissions API Error - ${pipelineStage}:`,
//                 error
//             );

//             return rejectWithValue(
//                 error.message ||
//                 "Something went wrong while fetching submissions"
//             );
//         }
//     }
// );

export const getSubmissionsByStage = createAsyncThunk(
    "recruitmentWorkflow/getSubmissionsByStage",
    async (
        {
            pipelineStage,
            page = 0,
            size = 20,
        },
        { rejectWithValue }
    ) => {
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

            const params = new URLSearchParams();

            params.append(
                "pipelineStage",
                pipelineStage
            );

            params.append(
                "page",
                page
            );

            params.append(
                "size",
                size
            );

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions?${params.toString()}`,
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
export const getAllJobsName = createAsyncThunk(
    "recruitmentWorkflow/getAllJobsName",
    async (
        pipelineStage = "submitted",
        { rejectWithValue }
    ) => {
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

            const params = new URLSearchParams();

            params.append(
                "pipelineStage",
                pipelineStage
            );

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/allJobsName?${params.toString()}`,
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
                `All Jobs Name API Response - ${pipelineStage}:`,
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    `Failed to fetch jobs for ${pipelineStage} stage`
                );
            }

            return data;
        } catch (error) {
            console.error(
                `All Jobs Name API Error - ${pipelineStage}:`,
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching job names"
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

    submissionStatuses: [],
    workflowStages: [],

    submissionStatusesLoading: false,
    submissionStatusesError: null,

    submissions: [],
    submissionsLoading: false,
    submissionsError: null,

    submissionsPagination: {
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        numberOfElements: 0,
        first: true,
        last: true,
        empty: true,
    },


    loading: false,
    error: null,

    allJobsName: [],
allJobsNameLoading: false,
allJobsNameError: null,
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
            );

        builder
            .addCase(
                getSubmissionStatuses.pending,
                (state) => {
                    state.submissionStatusesLoading = true;
                    state.submissionStatusesError = null;
                }
            )

            .addCase(
                getSubmissionStatuses.fulfilled,
                (state, action) => {
                    state.submissionStatusesLoading = false;
                    state.submissionStatusesError = null;

                    state.submissionStatuses =
                        action.payload?.submissionStatusList || [];

                    state.workflowStages =
                        action.payload?.workflowStages || [];

                    console.log(
                        "Submission Status List:",
                        state.submissionStatuses
                    );

                    console.log(
                        "Workflow Stages:",
                        state.workflowStages
                    );
                }
            )

            .addCase(
                getSubmissionStatuses.rejected,
                (state, action) => {
                    state.submissionStatusesLoading = false;

                    state.submissionStatusesError =
                        action.payload ||
                        "Failed to fetch submission statuses";

                    state.submissionStatuses = [];
                    state.workflowStages = [];
                }
            );

                builder
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

                    /* =====================================================
                       STORE BACKEND PAGINATION RESPONSE
                    ===================================================== */

                    state.submissionsPagination = {
                        page:
                            action.payload?.number ?? 0,

                        size:
                            action.payload?.size ?? 20,

                        totalElements:
                            action.payload?.totalElements ?? 0,

                        totalPages:
                            action.payload?.totalPages ?? 0,

                        numberOfElements:
                            action.payload?.numberOfElements ?? 0,

                        first:
                            action.payload?.first ?? true,

                        last:
                            action.payload?.last ?? true,

                        empty:
                            action.payload?.empty ?? true,
                    };

                    console.log(
                        "Updated submissions:",
                        state.submissions
                    );

                    console.log(
                        "Submission Pagination:",
                        state.submissionsPagination
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
            )
                    builder
            .addCase(
                getAllJobsName.pending,
                (state) => {
                    state.allJobsNameLoading = true;
                    state.allJobsNameError = null;
                }
            )

            .addCase(
                getAllJobsName.fulfilled,
                (state, action) => {
                    state.allJobsNameLoading = false;
                    state.allJobsNameError = null;

                    state.allJobsName =
                        Array.isArray(action.payload)
                            ? action.payload
                            : [];

                    console.log(
                        "Updated All Jobs Name:",
                        state.allJobsName
                    );
                }
            )

            .addCase(
                getAllJobsName.rejected,
                (state, action) => {
                    state.allJobsNameLoading = false;

                    state.allJobsNameError =
                        action.payload ||
                        "Failed to fetch job names";

                    state.allJobsName = [];
                }
            );
    },
});

export default recruitmentWorkflowSlice.reducer;