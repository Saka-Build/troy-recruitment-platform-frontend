import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetch from "../../services/fetchInstance";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

const getAccessToken = () => {
    return (
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token")
    );
};

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


export const getSubmissionFilters = createAsyncThunk(
    "report/getSubmissionFilters",

    async (_, { rejectWithValue }) => {
        return fetchGetRequest(
            `${API_BASE_URL}/api/v1/submissions/header/submissionfilters`,
            rejectWithValue
        );
    }
);


export const getHopeListReport = createAsyncThunk(
    "report/getHopeListReport",

    async (
        {
            page = 0,
            size = 20,
            search = "",
            statusIds = [],
            jobId = "",
            clientId = "",
            createdFrom = "",
            createdTo = "",
            sort = [
                "job.client.name,asc",
                "job.endClient.name,asc",
                "job.title,asc",
            ],
        } = {},
        { rejectWithValue }
    ) => {

        try {

            const token = getAccessToken();

            if (!token) {
                return rejectWithValue(
                    "User not authenticated. Access token not found."
                );
            }

            const params = new URLSearchParams();

            params.append("page", page);
            params.append("size", size);

            if (search) {
                params.append("search", search);
            }

            // Backend expects multiple status IDs
            if (Array.isArray(statusIds) && statusIds.length > 0) {
                params.append("statusIds", statusIds.join(","));
            } else if (statusIds) {
                // Backward compatibility with a single status ID
                params.append("statusIds", statusIds);
            }

            if (jobId) {
                params.append("jobId", jobId);
            }

            if (clientId) {
                params.append("clientId", clientId);
            }

            if (createdFrom) {
                params.append("createdFrom", createdFrom);
            }

            if (createdTo) {
                params.append("createdTo", createdTo);
            }

            // Keep the sort order exactly as passed
            sort.forEach((sortValue) => {
                params.append("sort", sortValue);
            });

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/hopeListReport?${params.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    data?.error ||
                    "Failed to fetch hope list report"
                );
            }

            return data;

        } catch (error) {

            return rejectWithValue(
                error?.message ||
                "Something went wrong while fetching hope list report"
            );
        }
    }
);
export const exportSubmissions = createAsyncThunk(
    "report/exportSubmissions",

    async (
        {
            createdFrom,
            createdTo,
            statusIds = [],
            jobId = "",
            clientId = "",
        },
        { rejectWithValue }
    ) => {
        try {
            const token = getAccessToken();

            if (!token) {
                return rejectWithValue(
                    "User not authenticated. Access token not found."
                );
            }

            const body = {
                createdFrom,
                createdTo,
            };

            // Backend expects statusIds as an array
            if (statusIds?.length > 0) {
                body.statusIds = statusIds;
            }

            if (jobId) {
                body.jobId = jobId;
            }

            if (clientId) {
                body.clientId = clientId;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/export`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(body),
                }
            );

            if (!response.ok) {
                let errorMessage = "Failed to export submissions";

                try {
                    const errorData = await response.json();

                    errorMessage =
                        errorData?.message ||
                        errorData?.error ||
                        errorMessage;
                } catch {
                    // Ignore JSON parsing error
                }

                return rejectWithValue(errorMessage);
            }

            const blob = await response.blob();

            const contentDisposition =
                response.headers.get("Content-Disposition");

            let fileName = "submission-report.xlsx";

            if (contentDisposition) {
                const match = contentDisposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                );

                if (match?.[1]) {
                    fileName = match[1]
                        .replace(/['"]/g, "")
                        .trim();
                }
            }

            return {
                blob,
                fileName,
            };
        } catch (error) {
            return rejectWithValue(
                error?.message ||
                "Something went wrong while exporting submissions"
            );
        }
    }
);

const initialState = {

    submissionFilters: {
        totalSubmittedApplications: 0,
        totalInterviewApplications: 0,
        totalOnboardedApplications: 0,

        jobs: [],

        clients: [],

        applicationStatusList: [],
    },
    hopeListReport: { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, first: true, last: true, },
    loading: false,
    error: null,
    exportLoading: false,
exportError: null,
hopeListLoading: false, hopeListError: null,
};

const reportSlice = createSlice({

    name: "report",

    initialState,

    reducers: {

        clearReportError: (state) => {
            state.error = null;
            state.exportError = null;
        },

        clearSubmissionFilters: (state) => {
            state.submissionFilters = {
                ...initialState.submissionFilters,

                jobs: [],
                clients: [],
                applicationStatusList: [],
            };
        },

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
            state.exportLoading = false;
state.exportError = null;
        },
    },

    extraReducers: (builder) => {

        builder

            .addCase(
                getSubmissionFilters.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getSubmissionFilters.fulfilled,
                (state, action) => {

                    state.loading = false;
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

            .addCase(
                getSubmissionFilters.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch submission filters";
                }
            )

.addCase(
    exportSubmissions.pending,
    (state) => {

        state.exportLoading = true;
        state.exportError = null;
    }
)

.addCase(
    exportSubmissions.fulfilled,
    (state) => {

        state.exportLoading = false;
        state.exportError = null;
    }
)

.addCase(
    exportSubmissions.rejected,
    (state, action) => {

        state.exportLoading = false;

        state.exportError =
            action.payload ||
            "Failed to export submissions";
    }
)
.addCase(
    getHopeListReport.pending,
    (state) => {

        state.hopeListLoading = true;
        state.hopeListError = null;
    }
)

.addCase(
    getHopeListReport.fulfilled,
    (state, action) => {

        state.hopeListLoading = false;

        state.hopeListReport = {
            content: action.payload?.content || [],

            totalElements:
                action.payload?.totalElements || 0,

            totalPages:
                action.payload?.totalPages || 0,

            size:
                action.payload?.size || 20,

            number:
                action.payload?.number || 0,

            first:
                action.payload?.first ?? true,

            last:
                action.payload?.last ?? true,
        };

        state.hopeListError = null;
    }
)

.addCase(
    getHopeListReport.rejected,
    (state, action) => {

        state.hopeListLoading = false;

        state.hopeListError =
            action.payload ||
            "Failed to fetch hope list report";
    }
)
    },
});

export const {
    clearReportError,
    clearSubmissionFilters,
    clearReportData,
} = reportSlice.actions;


export const selectSubmissionFilters = (state) =>
    state.report.submissionFilters;


export const selectReportLoading = (state) =>
    state.report.loading;


export const selectReportError = (state) =>
    state.report.error;

export const selectExportLoading = (state) =>
    state.report.exportLoading;


export const selectExportError = (state) =>
    state.report.exportError;

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


export const selectHopeListReport = (state) =>
    state.report.hopeListReport;

export const selectHopeListContent = (state) =>
    state.report.hopeListReport?.content || [];

export const selectHopeListLoading = (state) =>
    state.report.hopeListLoading;

export const selectHopeListError = (state) =>
    state.report.hopeListError;

export const selectHopeListPagination = (state) => ({
    totalElements:
        state.report.hopeListReport?.totalElements || 0,

    totalPages:
        state.report.hopeListReport?.totalPages || 0,

    size:
        state.report.hopeListReport?.size || 20,

    number:
        state.report.hopeListReport?.number || 0,

    first:
        state.report.hopeListReport?.first ?? true,

    last:
        state.report.hopeListReport?.last ?? true,
});


export default reportSlice.reducer;