import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";


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
            error?.message ||
            "Something went wrong"
        );
    }
};


/* =========================================================
   GET SUBMISSION FILTERS
   API:
   /api/v1/submissions/header/submissionfilters
========================================================= */

export const getSubmissionFilters = createAsyncThunk(
    "report/getSubmissionFilters",

    async (_, { rejectWithValue }) => {
        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/submissions/header/submissionfilters`,
            rejectWithValue
        );
    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {

    /* -------------------------
       Submission Filter Data
    ------------------------- */

    submissionFilters: {
        totalSubmittedApplications: 0,
        totalInterviewApplications: 0,
        totalOnboardedApplications: 0,

        jobs: [],

        clients: [],

        applicationStatusList: [],
    },

    /* -------------------------
       Loading / Error
    ------------------------- */

    loading: false,
    error: null,
};


/* =========================================================
   SLICE
========================================================= */

const reportSlice = createSlice({

    name: "report",

    initialState,

    reducers: {

        /* =====================================================
           CLEAR ERROR
        ===================================================== */

        clearReportError: (state) => {
            state.error = null;
        },


        /* =====================================================
           CLEAR SUBMISSION FILTERS
        ===================================================== */

        clearSubmissionFilters: (state) => {
            state.submissionFilters = {
                ...initialState.submissionFilters,

                jobs: [],
                clients: [],
                applicationStatusList: [],
            };
        },


        /* =====================================================
           CLEAR ALL REPORT DATA
        ===================================================== */

        clearReportData: (state) => {

            state.submissionFilters = {
                totalSubmittedApplications: 0,
                totalInterviewApplications: 0,
                totalOnboardedApplications: 0,

                jobs: [],

                clients: [],

                applicationStatusList: [],
            };

            state.loading = false;
            state.error = null;
        },
    },


    /* =========================================================
       EXTRA REDUCERS
    ========================================================= */

    extraReducers: (builder) => {

        builder

            /* =================================================
               GET SUBMISSION FILTERS - PENDING
            ================================================= */

            .addCase(
                getSubmissionFilters.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )


            /* =================================================
               GET SUBMISSION FILTERS - FULFILLED
            ================================================= */

            .addCase(
                getSubmissionFilters.fulfilled,
                (state, action) => {

                    state.loading = false;

                    /*
                     * Store complete backend response.
                     */
                    state.submissionFilters = {
                        totalSubmittedApplications:
                            action.payload
                                ?.totalSubmittedApplications || 0,

                        totalInterviewApplications:
                            action.payload
                                ?.totalInterviewApplications || 0,

                        totalOnboardedApplications:
                            action.payload
                                ?.totalOnboardedApplications || 0,

                        jobs:
                            action.payload?.jobs || [],

                        clients:
                            action.payload?.clients || [],

                        applicationStatusList:
                            action.payload?.applicationStatusList || [],
                    };

                    state.error = null;
                }
            )


            /* =================================================
               GET SUBMISSION FILTERS - REJECTED
            ================================================= */

            .addCase(
                getSubmissionFilters.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch submission filters";
                }
            );
    },
});


/* =========================================================
   ACTIONS
========================================================= */

export const {
    clearReportError,
    clearSubmissionFilters,
    clearReportData,
} = reportSlice.actions;


/* =========================================================
   SELECTORS
========================================================= */

export const selectSubmissionFilters = (state) =>
    state.report.submissionFilters;


export const selectReportLoading = (state) =>
    state.report.loading;


export const selectReportError = (state) =>
    state.report.error;


/* =========================================================
   INDIVIDUAL SELECTORS
========================================================= */

export const selectTotalSubmittedApplications = (state) =>
    state.report.submissionFilters
        ?.totalSubmittedApplications || 0;


export const selectTotalInterviewApplications = (state) =>
    state.report.submissionFilters
        ?.totalInterviewApplications || 0;


export const selectTotalOnboardedApplications = (state) =>
    state.report.submissionFilters
        ?.totalOnboardedApplications || 0;


export const selectReportJobs = (state) =>
    state.report.submissionFilters
        ?.jobs || [];


export const selectReportClients = (state) =>
    state.report.submissionFilters
        ?.clients || [];


export const selectApplicationStatusList = (state) =>
    state.report.submissionFilters
        ?.applicationStatusList || [];


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default reportSlice.reducer;