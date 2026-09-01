import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* =========================================================
   GET ACCESS TOKEN
========================================================= */

const getAccessToken = () => {
    return (
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token")
    );
};

/* =========================================================
   COMMON GET REQUEST
========================================================= */

const fetchGetRequest = async (url, rejectWithValue) => {
    try {
        const token = getAccessToken();

        if (!token) {
            return rejectWithValue(
                "User not authenticated. Access token not found."
            );
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return rejectWithValue(
                data?.message ||
                data?.error ||
                "Failed to fetch data"
            );
        }

        return data;
    } catch (error) {
        return rejectWithValue(
            error?.message || "Something went wrong"
        );
    }
};

/* =========================================================
   DASHBOARD SUMMARY
========================================================= */

export const getDashboardSummary = createAsyncThunk(
    "dashboard/getDashboardSummary",
    async (_, { rejectWithValue }) => {
        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/dashboard/summary`,
            rejectWithValue
        );
    }
);

/* =========================================================
   GET SELECTED SUBMISSIONS
   API:
   /api/v1/submissions?statusName=Selected&page=0&size=20
========================================================= */

export const getSelectedSubmissions = createAsyncThunk(
    "dashboard/getSelectedSubmissions",
    async (
        {
            page = 0,
            size = 20,
            search = "",
        } = {},
        { rejectWithValue }
    ) => {
        const params = new URLSearchParams();

        params.append("statusName", "Selected");
        params.append("page", page);
        params.append("size", size);

        if (search?.trim()) {
            params.append("search", search.trim());
        }

        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/submissions?${params.toString()}`,
            rejectWithValue
        );
    }
);

/* =========================================================
   GET HIGH PRIORITY JOBS
   API:
   /api/v1/jobs?priority=high&page=0&size=20
========================================================= */

export const getHighPriorityJobs = createAsyncThunk(
    "dashboard/getHighPriorityJobs",
    async (
        {
            page = 0,
            size = 20,
        } = {},
        { rejectWithValue }
    ) => {
        const params = new URLSearchParams();

        params.append("priority", "high");
        params.append("page", page);
        params.append("size", size);

        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/jobs?${params.toString()}`,
            rejectWithValue
        );
    }
);

/* =========================================================
   GET INTERVIEW SUBMISSIONS
   API:
   /api/v1/submissions
       ?statusName=Interview
       &search=Feedback
       &page=0
       &size=20
========================================================= */

export const getInterviewSubmissions = createAsyncThunk(
    "dashboard/getInterviewSubmissions",
    async (
        {
            page = 0,
            size = 20,
            search = "Feedback",
        } = {},
        { rejectWithValue }
    ) => {
        const params = new URLSearchParams();

        params.append("statusName", "Interview");
        params.append("page", page);
        params.append("size", size);

        if (search?.trim()) {
            params.append("search", search.trim());
        }

        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/submissions?${params.toString()}`,
            rejectWithValue
        );
    }
);

/* =========================================================
   GET READY TO SUBMIT SUBMISSIONS
   API:
   /api/v1/submissions?pipelineStage=ready_to_submit&page=0&size=20
========================================================= */

export const getReadyToSubmitSubmissions = createAsyncThunk(
    "dashboard/getReadyToSubmitSubmissions",
    async (
        {
            page = 0,
            size = 20,
        } = {},
        { rejectWithValue }
    ) => {
        const params = new URLSearchParams();

        params.append("pipelineStage", "ready_to_submit");
        params.append("page", page);
        params.append("size", size);

        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/submissions?${params.toString()}`,
            rejectWithValue
        );
    }
);


/* =========================================================
   GET ONBOARDED SUBMISSIONS
   API:
   /api/v1/submissions?pipelineStage=onboarded&page=0&size=20
========================================================= */

export const getOnboardedSubmissions = createAsyncThunk(
    "dashboard/getOnboardedSubmissions",
    async (
        {
            page = 0,
            size = 20,
            search = "",
        } = {},
        { rejectWithValue }
    ) => {
        const params = new URLSearchParams();

        params.append("pipelineStage", "onboarded");
        params.append("page", page);
        params.append("size", size);

        if (search?.trim()) {
            params.append("search", search.trim());
        }

        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/submissions?${params.toString()}`,
            rejectWithValue
        );
    }
);
/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
    /* -------------------------
       Dashboard Summary
    ------------------------- */

    summary: null,

    loading: false,
    error: null,

    /* -------------------------
       Selected Submissions
    ------------------------- */

    selectedSubmissions: {
        content: [],
        pageable: null,
        last: true,
        totalPages: 0,
        totalElements: 0,
        size: 20,
        number: 0,
        first: true,
        numberOfElements: 0,
        empty: true,
    },

    selectedSubmissionsLoading: false,
    selectedSubmissionsError: null,

    /* -------------------------
       High Priority Jobs
    ------------------------- */

    highPriorityJobs: {
        content: [],
        pageable: null,
        last: true,
        totalPages: 0,
        totalElements: 0,
        size: 20,
        number: 0,
        first: true,
        numberOfElements: 0,
        empty: true,
    },

    highPriorityJobsLoading: false,
    highPriorityJobsError: null,

    /* -------------------------
       Interview Submissions
    ------------------------- */

    interviewSubmissions: {
        content: [],
        pageable: null,
        last: true,
        totalPages: 0,
        totalElements: 0,
        size: 20,
        number: 0,
        first: true,
        numberOfElements: 0,
        empty: true,
    },

    interviewSubmissionsLoading: false,
    interviewSubmissionsError: null,

    /* -------------------------
       Ready To Submit
    ------------------------- */

    readyToSubmitSubmissions: {
        content: [],
        pageable: null,
        last: true,
        totalPages: 0,
        totalElements: 0,
        size: 20,
        number: 0,
        first: true,
        numberOfElements: 0,
        empty: true,
    },

    readyToSubmitSubmissionsLoading: false,
    readyToSubmitSubmissionsError: null,

    onboardedSubmissions: {
    content: [],
    pageable: null,
    last: true,
    totalPages: 0,
    totalElements: 0,
    size: 20,
    number: 0,
    first: true,
    numberOfElements: 0,
    empty: true,
},

onboardedSubmissionsLoading: false,
onboardedSubmissionsError: null,
};

/* =========================================================
   SLICE
========================================================= */

const dashboardSlice = createSlice({
    name: "dashboard",

    initialState,

    reducers: {
        /* =====================================================
           CLEAR GENERAL DASHBOARD ERROR
        ===================================================== */

        clearDashboardError: (state) => {
            state.error = null;
        },

        /* =====================================================
           CLEAR DASHBOARD SUMMARY
        ===================================================== */

        clearDashboardSummary: (state) => {
            state.summary = null;
        },

        /* =====================================================
           CLEAR SELECTED SUBMISSIONS ERROR
        ===================================================== */

        clearSelectedSubmissionsError: (state) => {
            state.selectedSubmissionsError = null;
        },

        /* =====================================================
           CLEAR HIGH PRIORITY JOBS ERROR
        ===================================================== */

        clearHighPriorityJobsError: (state) => {
            state.highPriorityJobsError = null;
        },

        /* =====================================================
           CLEAR INTERVIEW SUBMISSIONS ERROR
        ===================================================== */

        clearInterviewSubmissionsError: (state) => {
            state.interviewSubmissionsError = null;
        },

        /* =====================================================
           CLEAR READY TO SUBMIT ERROR
        ===================================================== */

        clearReadyToSubmitSubmissionsError: (state) => {
            state.readyToSubmitSubmissionsError = null;
        },

        /* =====================================================
           CLEAR ALL DASHBOARD DATA
        ===================================================== */

        clearDashboardData: (state) => {
            state.summary = null;

            state.selectedSubmissions = {
                ...initialState.selectedSubmissions,
            };

            state.highPriorityJobs = {
                ...initialState.highPriorityJobs,
            };

            state.interviewSubmissions = {
                ...initialState.interviewSubmissions,
            };

            state.readyToSubmitSubmissions = {
                ...initialState.readyToSubmitSubmissions,
            };
            state.onboardedSubmissions = {
    ...initialState.onboardedSubmissions,
};
        },
    },

    /* =========================================================
       EXTRA REDUCERS
    ========================================================= */

    extraReducers: (builder) => {
        builder

            /* =================================================
               DASHBOARD SUMMARY
            ================================================= */

            .addCase(
                getDashboardSummary.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getDashboardSummary.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.summary = action.payload;
                    state.error = null;
                }
            )

            .addCase(
                getDashboardSummary.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload ||
                        "Failed to fetch dashboard summary";
                }
            )

            /* =================================================
               SELECTED SUBMISSIONS
            ================================================= */

            .addCase(
                getSelectedSubmissions.pending,
                (state) => {
                    state.selectedSubmissionsLoading = true;
                    state.selectedSubmissionsError = null;
                }
            )

            .addCase(
                getSelectedSubmissions.fulfilled,
                (state, action) => {
                    state.selectedSubmissionsLoading = false;

                    /*
                     * Store the complete backend pagination response.
                     * No frontend pagination is performed.
                     */
                    state.selectedSubmissions = action.payload;

                    state.selectedSubmissionsError = null;
                }
            )

            .addCase(
                getSelectedSubmissions.rejected,
                (state, action) => {
                    state.selectedSubmissionsLoading = false;

                    state.selectedSubmissionsError =
                        action.payload ||
                        "Failed to fetch selected submissions";
                }
            )

            /* =================================================
               HIGH PRIORITY JOBS
            ================================================= */

            .addCase(
                getHighPriorityJobs.pending,
                (state) => {
                    state.highPriorityJobsLoading = true;
                    state.highPriorityJobsError = null;
                }
            )

            .addCase(
                getHighPriorityJobs.fulfilled,
                (state, action) => {
                    state.highPriorityJobsLoading = false;

                    /*
                     * Backend pagination response stored directly.
                     */
                    state.highPriorityJobs = action.payload;

                    state.highPriorityJobsError = null;
                }
            )

            .addCase(
                getHighPriorityJobs.rejected,
                (state, action) => {
                    state.highPriorityJobsLoading = false;

                    state.highPriorityJobsError =
                        action.payload ||
                        "Failed to fetch high priority jobs";
                }
            )

            /* =================================================
               INTERVIEW SUBMISSIONS
            ================================================= */

            .addCase(
                getInterviewSubmissions.pending,
                (state) => {
                    state.interviewSubmissionsLoading = true;
                    state.interviewSubmissionsError = null;
                }
            )

            .addCase(
                getInterviewSubmissions.fulfilled,
                (state, action) => {
                    state.interviewSubmissionsLoading = false;

                    /*
                     * Backend pagination response stored directly.
                     */
                    state.interviewSubmissions = action.payload;

                    state.interviewSubmissionsError = null;
                }
            )

            .addCase(
                getInterviewSubmissions.rejected,
                (state, action) => {
                    state.interviewSubmissionsLoading = false;

                    state.interviewSubmissionsError =
                        action.payload ||
                        "Failed to fetch interview submissions";
                }
            )

            /* =================================================
               READY TO SUBMIT SUBMISSIONS
            ================================================= */

            .addCase(
                getReadyToSubmitSubmissions.pending,
                (state) => {
                    state.readyToSubmitSubmissionsLoading = true;
                    state.readyToSubmitSubmissionsError = null;
                }
            )

            .addCase(
                getReadyToSubmitSubmissions.fulfilled,
                (state, action) => {
                    state.readyToSubmitSubmissionsLoading = false;

                    /*
                     * Backend pagination response stored directly.
                     */
                    state.readyToSubmitSubmissions = action.payload;

                    state.readyToSubmitSubmissionsError = null;
                }
            )

            .addCase(
                getReadyToSubmitSubmissions.rejected,
                (state, action) => {
                    state.readyToSubmitSubmissionsLoading = false;

                    state.readyToSubmitSubmissionsError =
                        action.payload ||
                        "Failed to fetch ready to submit submissions";
                }
            )
            /* =================================================
   ONBOARDED SUBMISSIONS
================================================= */

.addCase(
    getOnboardedSubmissions.pending,
    (state) => {
        state.onboardedSubmissionsLoading = true;
        state.onboardedSubmissionsError = null;
    }
)

.addCase(
    getOnboardedSubmissions.fulfilled,
    (state, action) => {
        state.onboardedSubmissionsLoading = false;

        /*
         * Backend pagination response stored directly.
         * No frontend pagination.
         */
        state.onboardedSubmissions = action.payload;

        state.onboardedSubmissionsError = null;
    }
)

.addCase(
    getOnboardedSubmissions.rejected,
    (state, action) => {
        state.onboardedSubmissionsLoading = false;

        state.onboardedSubmissionsError =
            action.payload ||
            "Failed to fetch onboarded submissions";
    }
);
    },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
    clearDashboardError,
    clearDashboardSummary,
    clearSelectedSubmissionsError,
    clearHighPriorityJobsError,
    clearInterviewSubmissionsError,
    clearReadyToSubmitSubmissionsError,
    clearOnboardedSubmissionsError,
    clearDashboardData,
} = dashboardSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectDashboardSummary = (state) =>
    state.dashboard.summary;

export const selectSelectedSubmissions = (state) =>
    state.dashboard.selectedSubmissions;

export const selectHighPriorityJobs = (state) =>
    state.dashboard.highPriorityJobs;

export const selectInterviewSubmissions = (state) =>
    state.dashboard.interviewSubmissions;

export const selectReadyToSubmitSubmissions = (state) =>
    state.dashboard.readyToSubmitSubmissions;

export const selectOnboardedSubmissions = (state) =>
    state.dashboard.onboardedSubmissions;
/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default dashboardSlice.reducer;