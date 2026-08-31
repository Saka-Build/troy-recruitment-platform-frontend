import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    " ";
export const getAllCandidates = createAsyncThunk(
    "candidates/getAllCandidates",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/v1/candidates`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message || "Failed to fetch candidates"
                );
            }

            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data?.content)) {
                return data.content;
            }

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            return [];
        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching candidates"
            );
        }
    }
);

export const getCandidateById = createAsyncThunk(
    "candidates/getCandidateById",
    async (id, { rejectWithValue }) => {
        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/candidates/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch candidate"
                );
            }

            return data;

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching candidate"
            );
        }
    }
);

export const getAllEmployees = createAsyncThunk(
    "candidates/getAllEmployees",
    async (_, { rejectWithValue }) => {
        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees?active=true`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );


            const data = await response.json();


            if (!response.ok) {

                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch active employees"
                );

            }
            if (Array.isArray(data)) {
                return data;
            }


            if (Array.isArray(data?.content)) {
                return data.content;
            }


            if (Array.isArray(data?.data)) {
                return data.data;
            }


            return [];

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching active employees"
            );

        }
    }
);
export const addCandidate = createAsyncThunk(
    "candidates/addCandidate",
    async (
        {
            candidateData,
            originalCV,
            troyCV,
        },
        { rejectWithValue }
    ) => {
        try {
            let accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }
            accessToken = accessToken
                .replace(/^Bearer\s+/i, "")
                .trim();

            console.log(
                "========== ADD CANDIDATE =========="
            );

            console.log(
                "Token exists:",
                !!accessToken
            );

            console.log(
                "Token length:",
                accessToken.length
            );

            console.log(
                "Token starts with:",
                accessToken.substring(0, 20)
            );

            const formData = new FormData();
            formData.append(
                "candidate",
                new Blob(
                    [
                        JSON.stringify(
                            candidateData
                        ),
                    ],
                    {
                        type: "application/json",
                    }
                )
            );
            if (originalCV) {
                formData.append(
                    "original_cv_file",
                    originalCV
                );
            }
            if (troyCV) {
                formData.append(
                    "troy_cv_file",
                    troyCV
                );
            }
            const response = await fetch(
                `/api/v1/candidates/create`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },

                    body: formData,
                }
            );

            console.log(
                "Candidate create status:",
                response.status
            );
            const contentType =
                response.headers.get(
                    "content-type"
                );

            let data;

            if (
                contentType &&
                contentType.includes(
                    "application/json"
                )
            ) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            console.log(
                "Candidate create response:",
                data
            );
            if (response.status === 401) {
                console.error(
                    "401 UNAUTHORIZED - Backend rejected access token"
                );

                return rejectWithValue(
                    typeof data === "object"
                        ? data?.message ||
                        "User is not authenticated. Please login again."
                        : "User is not authenticated. Please login again."
                );
            }
            if (!response.ok) {
                return rejectWithValue(
                    typeof data === "object"
                        ? data?.message ||
                        data?.error ||
                        `Failed to add candidate (${response.status})`
                        : `Failed to add candidate (${response.status})`
                );
            }
            return data;

        } catch (error) {

            console.error(
                "ADD CANDIDATE ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while adding candidate"
            );
        }
    }
);

export const updateCandidate = createAsyncThunk(
    "candidates/updateCandidate",
    async (
        {
            id,
            candidateData,
            originalCV,
            troyCV,
        },
        { rejectWithValue }
    ) => {
        try {
            let accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }
            accessToken = accessToken
                .replace(/^Bearer\s+/i, "")
                .trim();

            console.log(
                "========== UPDATE CANDIDATE =========="
            );

            console.log(
                "Candidate ID:",
                id
            );

            console.log(
                "Token exists:",
                !!accessToken
            );

            console.log(
                "Token length:",
                accessToken.length
            );
            const formData = new FormData();
            formData.append(
                "candidate",
                new Blob(
                    [
                        JSON.stringify(
                            candidateData
                        ),
                    ],
                    {
                        type: "application/json",
                    }
                )
            );
            if (originalCV) {
                formData.append(
                    "original_cv_file",
                    originalCV
                );
            }
            if (troyCV) {
                formData.append(
                    "troy_cv_file",
                    troyCV
                );
            }
            const response = await fetch(
                `/api/v1/candidates/update/${id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },

                    body: formData,
                }
            );

            console.log(
                "Candidate update status:",
                response.status
            );
            const contentType =
                response.headers.get(
                    "content-type"
                );

            let data;

            if (
                contentType &&
                contentType.includes(
                    "application/json"
                )
            ) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            console.log(
                "Candidate update response:",
                data
            );
            if (response.status === 401) {
                console.error(
                    "401 UNAUTHORIZED - Backend rejected access token"
                );

                return rejectWithValue(
                    typeof data === "object"
                        ? data?.message ||
                        "User is not authenticated. Please login again."
                        : "User is not authenticated. Please login again."
                );
            }
            if (!response.ok) {
                return rejectWithValue(
                    typeof data === "object"
                        ? data?.message ||
                        data?.error ||
                        `Failed to update candidate (${response.status})`
                        : `Failed to update candidate (${response.status})`
                );
            }
            return data;

        } catch (error) {

            console.error(
                "UPDATE CANDIDATE ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while updating candidate"
            );
        }
    }
);

export const deleteCandidate = createAsyncThunk(
    "candidates/deleteCandidate",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/v1/candidates/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to delete candidate"
                );
            }

            return id;

        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Something went wrong while deleting candidate"
            );
        }
    }
);

export const exportCandidates = createAsyncThunk(
    "candidates/exportCandidates",
    async (
        {
            fromDate = null,
            toDate = null,
            status = null,
        } = {},
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
            const requestBody = {};

            if (fromDate) {
                requestBody.fromDate = fromDate;
            }

            if (toDate) {
                requestBody.toDate = toDate;
            }

            if (status) {
                requestBody.status = status;
            }

            console.log(
                "========== EXPORT CANDIDATES =========="
            );

            console.log(
                "Export Request Body:",
                requestBody
            );

            const response = await fetch(
                `${API_BASE_URL}/api/v1/candidates/export`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${cleanToken}`,
                    },

                    body: JSON.stringify(requestBody),
                }
            );

            console.log(
                "Export Candidates Status:",
                response.status
            );
            if (!response.ok) {
                const contentType =
                    response.headers.get("content-type");

                let errorMessage =
                    "Failed to export candidates";

                if (
                    contentType &&
                    contentType.includes(
                        "application/json"
                    )
                ) {
                    const data =
                        await response.json().catch(
                            () => null
                        );

                    errorMessage =
                        data?.message ||
                        data?.error ||
                        errorMessage;
                } else {
                    const text =
                        await response.text().catch(
                            () => ""
                        );

                    if (text) {
                        errorMessage = text;
                    }
                }

                if (response.status === 401) {
                    errorMessage =
                        "User is not authenticated. Please login again.";
                }

                return rejectWithValue(
                    errorMessage
                );
            }
            const blob =
                await response.blob();
            const contentDisposition =
                response.headers.get(
                    "Content-Disposition"
                );

            let fileName =
                "candidates.xlsx";

            if (contentDisposition) {
                const fileNameMatch =
                    contentDisposition.match(
                        /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i
                    );

                if (fileNameMatch?.[1]) {
                    fileName =
                        decodeURIComponent(
                            fileNameMatch[1]
                        );
                }
            }
            return {
                blob,
                fileName,
            };

        } catch (error) {
            console.error(
                "EXPORT CANDIDATES ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while exporting candidates"
            );
        }
    }
);

export const getCandidateActivity = createAsyncThunk(
    "candidates/getCandidateActivity",
    async (candidateId, { rejectWithValue }) => {
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
                `${API_BASE_URL}/api/v1/activityLog/candidate/${candidateId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch candidate activity"
                );
            }

            /*
             * API returns an array
             */
            if (Array.isArray(data)) {
                return data;
            }

            /*
             * Safety in case backend wraps response
             */
            if (Array.isArray(data?.content)) {
                return data.content;
            }

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            return [];

        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching candidate activity"
            );
        }
    }
);

export const getSubmissionActivities = createAsyncThunk(
    "candidates/getSubmissionActivities",
    async (submissionId, { rejectWithValue }) => {
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
                `${API_BASE_URL}/api/v1/activityLog/submission/${submissionId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch submission activities"
                );
            }

            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data?.content)) {
                return data.content;
            }

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            return [];

        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching submission activities"
            );
        }
    }
);


export const getCandidateApplications = createAsyncThunk(
    "candidates/getCandidateApplications",
    async (candidateId, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            const cleanToken = accessToken
                .replace(/^Bearer\s+/i, "")
                .trim();

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions?candidateId=${candidateId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch candidate applications"
                );
            }

            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data?.content)) {
                return data.content;
            }

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            return [];
        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching candidate applications"
            );
        }
    }
);

export const getSubmissionStatuses = createAsyncThunk(
    "candidates/getSubmissionStatuses",
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
                `${API_BASE_URL}/api/v1/submissions/status/allStatuses`,
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

            return Array.isArray(data) ? data : [];

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

export const createSubmission = createAsyncThunk(
    "candidates/createSubmission",
    async (
        {
            candidateId,
            jobId,
            statusId,
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

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/create`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },

                    body: JSON.stringify({
                        candidateId,
                        jobId,
                        statusId,
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "Create Submission API Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    data?.error ||
                    "Failed to apply candidate to job"
                );
            }

            return data;

        } catch (error) {
            console.error(
                "Create Submission API Error:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while applying candidate to job"
            );
        }
    }
);

export const getSubmissionSubStatuses = createAsyncThunk(
    "candidates/getSubmissionSubStatuses",
    async (statusId, { rejectWithValue }) => {
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
                `${API_BASE_URL}/api/v1/submissions/substatus/allSubStatuses/${statusId}`,
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
                "Submission Sub-Statuses API Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch submission sub-statuses"
                );
            }

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {
            console.error(
                "Submission Sub-Statuses API Error:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching submission sub-statuses"
            );
        }
    }
);


export const updateSubmission = createAsyncThunk(
    "candidates/updateSubmission",
    async (
        {
            submissionId,
            statusId,
            subStatusId,
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

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/update/${submissionId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },

                    body: JSON.stringify({
                        statusId,
                        subStatusId:
                            subStatusId || null,
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "Update Submission API Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    data?.error ||
                    "Failed to update submission"
                );
            }

            return data;

        } catch (error) {
            console.error(
                "Update Submission API Error:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while updating submission"
            );
        }
    }
);

export const updateSubmissionRates = createAsyncThunk(
    "candidates/updateSubmissionRates",
    async (
        {
            submissionId,

            candidateExpectedAmount,
            candidateExpectedCurrency,
            candidateExpectedPeriod,

            submissionAmount,
            submissionCurrency,
            submissionPeriod,

            offerAmount,
            offerCurrency,
            offerPeriod,
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

            /*
             * Base rate request
             */
            const requestBody = {
                candidateExpectedAmount:
                    candidateExpectedAmount !== "" &&
                        candidateExpectedAmount !== null &&
                        candidateExpectedAmount !== undefined
                        ? Number(candidateExpectedAmount)
                        : null,

                candidateExpectedCurrency:
                    candidateExpectedCurrency || null,

                candidateExpectedPeriod:
                    candidateExpectedPeriod || null,

                submissionAmount:
                    submissionAmount !== "" &&
                        submissionAmount !== null &&
                        submissionAmount !== undefined
                        ? Number(submissionAmount)
                        : null,

                submissionCurrency:
                    submissionCurrency || null,

                submissionPeriod:
                    submissionPeriod || null,
            };

            /*
             * Offer / release rate is only added
             * when the modal provides it.
             */
            if (
                offerAmount !== undefined ||
                offerCurrency !== undefined ||
                offerPeriod !== undefined
            ) {
                requestBody.offerAmount =
                    offerAmount !== "" &&
                        offerAmount !== null &&
                        offerAmount !== undefined
                        ? Number(offerAmount)
                        : null;

                requestBody.offerCurrency =
                    offerCurrency || null;

                requestBody.offerPeriod =
                    offerPeriod || null;
            }

            console.log(
                "========== UPDATE SUBMISSION RATES =========="
            );

            console.log(
                "Submission ID:",
                submissionId
            );

            console.log(
                "Rate Request Body:",
                requestBody
            );

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/update/${submissionId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${cleanToken}`,
                    },

                    body: JSON.stringify(
                        requestBody
                    ),
                }
            );

            const data =
                await response.json();

            console.log(
                "Update Submission Rates Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    data?.error ||
                    "Failed to update submission rates"
                );
            }

            return data;

        } catch (error) {
            console.error(
                "UPDATE SUBMISSION RATES ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while updating submission rates"
            );
        }
    }
);

export const createInterview = createAsyncThunk(
    "candidates/createInterview",
    async (
        {
            submissionId,
            candidateId,
            jobId,
            interviewDate,
            interviewTime,
            interviewType,
            round,
            interviewerName,
            status = "scheduled",
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

            const requestBody = {
                submissionId,
                candidateId,
                jobId,
                interviewDate,
                interviewTime,
                interviewType,
                round,
                interviewerName,
                status,
            };

            console.log(
                "========== CREATE INTERVIEW =========="
            );

            console.log(
                "Interview Request Body:",
                requestBody
            );

            const response = await fetch(
                `${API_BASE_URL}/api/v1/interviews/create`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${cleanToken}`,
                    },

                    body: JSON.stringify(
                        requestBody
                    ),
                }
            );

            const data =
                await response.json();

            console.log(
                "Create Interview Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    data?.error ||
                    "Failed to schedule interview"
                );
            }

            return data;
        } catch (error) {
            console.error(
                "CREATE INTERVIEW ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while scheduling interview"
            );
        }
    }
);

export const updateInterview = createAsyncThunk(
    "candidates/updateInterview",
    async (
        {
            interviewId,
            submissionId,
            candidateId,
            jobId,
            interviewDate,
            interviewTime,
            interviewType,
            round,
            interviewerName,
            status = "Rescheduled",
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

            let requestBody;
            if (
                String(status)
                    .trim()
                    .toLowerCase() ===
                "cancelled"
            ) {
                requestBody = {
                    submissionId,
                    candidateId,
                    jobId,
                    status: "Cancelled",
                };
            } else {
                requestBody = {
                    submissionId,
                    candidateId,
                    jobId,
                    interviewDate,
                    interviewTime,
                    interviewType,
                    round,
                    interviewerName,
                    status,
                };
            }

            console.log(
                "========== UPDATE INTERVIEW =========="
            );

            console.log(
                "Interview ID:",
                interviewId
            );

            console.log(
                "Update Interview Request Body:",
                requestBody
            );

            const response = await fetch(
                `${API_BASE_URL}/api/v1/interviews/update/${interviewId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${cleanToken}`,
                    },

                    body: JSON.stringify(
                        requestBody
                    ),
                }
            );

            const data =
                await response.json();

            console.log(
                "Update Interview Response:",
                data
            );

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    data?.error ||
                    "Failed to update interview"
                );
            }

            return data;

        } catch (error) {
            console.error(
                "UPDATE INTERVIEW ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while updating interview"
            );
        }
    }
);

export const getInterviewsBySubmission = createAsyncThunk(
    "candidates/getInterviewsBySubmission",
    async (submissionId, { rejectWithValue }) => {
        try {
            const accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue({
                    submissionId,
                    message:
                        "Authentication token not found. Please login again.",
                });
            }

            const cleanToken = accessToken
                .replace(/^Bearer\s+/i, "")
                .trim();

            console.log(
                "========== GET INTERVIEWS BY SUBMISSION =========="
            );

            console.log(
                "Submission ID:",
                submissionId
            );

            const url =
                `${API_BASE_URL}/api/v1/interviews/submission/${submissionId}`;

            console.log(
                "Interview API URL:",
                url
            );

            const response = await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${cleanToken}`,
                    },
                }
            );

            const contentType =
                response.headers.get("content-type");

            let data;

            if (
                contentType &&
                contentType.includes("application/json")
            ) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            console.log(
                "Get Interviews Response:",
                data
            );

            console.log(
                "Get Interviews Status:",
                response.status
            );

            if (!response.ok) {
                return rejectWithValue({
                    submissionId,
                    message:
                        typeof data === "object"
                            ? data?.message ||
                            data?.error ||
                            "Failed to fetch interviews"
                            : `Failed to fetch interviews (${response.status})`,
                });
            }

            /*
             * Backend returns:
             *
             * [
             *   {
             *     id: "...",
             *     interviewDate: "28-08-2026",
             *     interviewTime: "01:40 PM",
             *     interviewType: "Teams",
             *     round: "Final",
             *     interviewerName: "biswa",
             *     status: "Scheduled"
             *   }
             * ]
             */

            let interviews = [];

            if (Array.isArray(data)) {
                interviews = data;
            } else if (Array.isArray(data?.content)) {
                interviews = data.content;
            } else if (Array.isArray(data?.data)) {
                interviews = data.data;
            }

            return {
                submissionId,
                interviews,
            };

        } catch (error) {
            console.error(
                "GET INTERVIEWS BY SUBMISSION ERROR:",
                error
            );

            return rejectWithValue({
                submissionId,
                message:
                    error.message ||
                    "Something went wrong while fetching interviews",
            });
        }
    }
);


export const createNote = createAsyncThunk(
    "candidates/createNote",
    async (noteData, { rejectWithValue }) => {
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
                `${API_BASE_URL}/api/v1/notes/create`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },

                    body: JSON.stringify({
                        entityType:
                            noteData.entityType || "candidate",

                        entityId:
                            noteData.entityId,

                        content:
                            noteData.content,

                        chatWith:
                            noteData.chatWith,
                    }),
                }
            );

            const data =
                await response.json().catch(() => null);

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to create note"
                );
            }

            return data;

        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Something went wrong while creating note"
            );
        }
    }
);


export const getCandidateNotes = createAsyncThunk(
    "candidates/getCandidateNotes",
    async (candidateId, { rejectWithValue }) => {
        try {
            const accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            if (!candidateId) {
                return rejectWithValue(
                    "Candidate ID is required"
                );
            }

            const cleanToken = accessToken
                .replace(/^Bearer\s+/i, "")
                .trim();

            const response = await fetch(
                `${API_BASE_URL}/api/v1/notes/candidate/${candidateId}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cleanToken}`,
                    },
                }
            );

            const data =
                await response.json().catch(() => null);

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to fetch candidate notes"
                );
            }

            /*
             * Backend currently returns:
             *
             * [
             *   {
             *      entityType,
             *      entityId,
             *      content,
             *      chatWith,
             *      chatAt
             *   }
             * ]
             */

            if (Array.isArray(data)) {
                return data;
            }

            /*
             * Safety for wrapped responses
             */
            if (Array.isArray(data?.content)) {
                return data.content;
            }

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            return [];

        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Something went wrong while fetching candidate notes"
            );
        }
    }
);

export const deleteSubmission = createAsyncThunk(
    "candidates/deleteSubmission",
    async (submissionId, { rejectWithValue }) => {
        try {
            const accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            if (!submissionId) {
                return rejectWithValue(
                    "Submission ID is required"
                );
            }

            const cleanToken = accessToken
                .replace(/^Bearer\s+/i, "")
                .trim();

            console.log(
                "========== DELETE SUBMISSION =========="
            );

            console.log(
                "Submission ID:",
                submissionId
            );

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions/delete/${submissionId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${cleanToken}`,
                    },
                }
            );

            const data =
                await response.json().catch(() => null);

            console.log(
                "Delete Submission Status:",
                response.status
            );

            console.log(
                "Delete Submission Response:",
                data
            );

            if (response.status === 401) {
                return rejectWithValue(
                    "User is not authenticated. Please login again."
                );
            }

            if (!response.ok) {
                return rejectWithValue(
                    data?.message ||
                    data?.error ||
                    "Failed to delete submission"
                );
            }

            /*
             * Backend response:
             *
             * {
             *     "success": true,
             *     "message": "Deleted successfully",
             *     "data": null
             * }
             */

            if (data?.success === false) {
                return rejectWithValue(
                    data?.message ||
                    "Failed to delete submission"
                );
            }

            /*
             * Return the deleted submission ID
             * so Redux can remove it from state.
             */
            return {
                submissionId,
                message:
                    data?.message ||
                    "Deleted successfully",
            };

        } catch (error) {
            console.error(
                "DELETE SUBMISSION ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Something went wrong while deleting submission"
            );
        }
    }
);

const initialState = {
    candidates: [],
    employees: [],

    selectedCandidate: null,

    candidateActivity: [],

    loading: false,
    employeesLoading: false,
    adding: false,
    candidateDetailsLoading: false,
    candidateActivityLoading: false,

    error: null,
    employeeError: null,
    candidateDetailsError: null,
    candidateActivityError: null,
    candidateApplications: [],
    candidateApplicationsLoading: false,
    candidateApplicationsError: null,
    submissionActivities: [],
    submissionActivitiesLoading: false,
    submissionActivitiesError: null,
    submissionStatuses: [],
    submissionStatusesLoading: false,
    submissionStatusesError: null,

    creatingSubmission: false,
    createSubmissionError: null,

    deletingSubmission: false,
    deleteSubmissionError: null,

    submissionSubStatuses: {},
    submissionSubStatusesLoading: {},
    submissionSubStatusesError: {},

    updatingSubmission: false,
    updateSubmissionError: null,

    updatingSubmissionRates: false,
    updateSubmissionRatesError: null,
    creatingInterview: false,
    createInterviewError: null,
    interviewsBySubmission: {},
    interviewsBySubmissionLoading: {},
    interviewsBySubmissionError: {},
    notes: [],
    notesLoading: false,
    notesError: null,

    creatingNote: false,
    createNoteError: null,

    updatingInterview: false,
    updateInterviewError: null,

    exportingCandidates: false,
    exportCandidatesError: null,
};

const candidateSlice = createSlice({
    name: "candidates",

    initialState,

    reducers: {
        clearCandidateError: (state) => {
            state.error = null;
        },

        clearEmployeeError: (state) => {
            state.employeeError = null;
        },

        clearCandidateDetails: (state) => {
            state.selectedCandidate = null;
            state.candidateDetailsError = null;
        },

        clearCandidateActivity: (state) => {
            state.candidateActivity = [];
            state.candidateActivityError = null;
        },
        clearSubmissionActivities: (state) => {
            state.submissionActivities = [];
            state.submissionActivitiesError = null;
        },

        clearCandidateApplications: (state) => {
            state.candidateApplications = [];
            state.candidateApplicationsError = null;
        },
    },

    extraReducers: (builder) => {

        builder
            .addCase(
                getAllCandidates.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getAllCandidates.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.candidates = action.payload;
                }
            )

            .addCase(
                getAllCandidates.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload ||
                        "Failed to fetch candidates";
                }
            )
            .addCase(
                getCandidateById.pending,
                (state) => {
                    state.candidateDetailsLoading = true;
                    state.candidateDetailsError = null;
                    state.selectedCandidate = null;
                }
            )

            .addCase(
                getCandidateById.fulfilled,
                (state, action) => {
                    state.candidateDetailsLoading = false;
                    state.selectedCandidate = action.payload;
                }
            )

            .addCase(
                getCandidateById.rejected,
                (state, action) => {
                    state.candidateDetailsLoading = false;
                    state.candidateDetailsError =
                        action.payload ||
                        "Failed to fetch candidate";
                }
            )
            .addCase(
                getAllEmployees.pending,
                (state) => {
                    state.employeesLoading = true;
                    state.employeeError = null;
                }
            )

            .addCase(
                getAllEmployees.fulfilled,
                (state, action) => {
                    state.employeesLoading = false;
                    state.employees = action.payload;
                }
            )

            .addCase(
                getAllEmployees.rejected,
                (state, action) => {
                    state.employeesLoading = false;
                    state.employeeError =
                        action.payload ||
                        "Failed to fetch employees";
                }
            )
            .addCase(
                addCandidate.pending,
                (state) => {
                    state.adding = true;
                    state.error = null;
                }
            )

            .addCase(
                addCandidate.fulfilled,
                (state, action) => {
                    state.adding = false;
                    state.candidates.unshift(
                        action.payload
                    );
                }
            )

            .addCase(
                addCandidate.rejected,
                (state, action) => {
                    state.adding = false;
                    state.error =
                        action.payload ||
                        "Failed to add candidate";
                }
            )
            .addCase(
                updateCandidate.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateCandidate.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const index =
                        state.candidates.findIndex(
                            (candidate) =>
                                candidate.id ===
                                action.payload.id
                        );

                    if (index !== -1) {
                        state.candidates[index] =
                            action.payload;
                    }
                }
            )

            .addCase(
                updateCandidate.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload ||
                        "Failed to update candidate";
                }
            )

            .addCase(
                deleteCandidate.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                deleteCandidate.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.candidates =
                        state.candidates.filter(
                            (candidate) =>
                                candidate.id !==
                                action.payload
                        );
                }
            )

            .addCase(
                deleteCandidate.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload ||
                        "Failed to delete candidate";
                }
            )
            .addCase(
                getCandidateActivity.pending,
                (state) => {
                    state.candidateActivityLoading = true;
                    state.candidateActivityError = null;
                    state.candidateActivity = [];
                }
            )

            .addCase(
                getCandidateActivity.fulfilled,
                (state, action) => {
                    state.candidateActivityLoading = false;
                    state.candidateActivity = action.payload;
                }
            )

            .addCase(
                getCandidateActivity.rejected,
                (state, action) => {
                    state.candidateActivityLoading = false;
                    state.candidateActivityError =
                        action.payload ||
                        "Failed to fetch candidate activity";
                }
            )
            .addCase(
                getCandidateApplications.pending,
                (state) => {
                    state.candidateApplicationsLoading = true;
                    state.candidateApplicationsError = null;
                    state.candidateApplications = [];
                }
            )

            .addCase(
                getCandidateApplications.fulfilled,
                (state, action) => {
                    state.candidateApplicationsLoading = false;
                    state.candidateApplications = action.payload;
                }
            )

            .addCase(
                getCandidateApplications.rejected,
                (state, action) => {
                    state.candidateApplicationsLoading = false;
                    state.candidateApplicationsError =
                        action.payload ||
                        "Failed to fetch candidate applications";
                }
            )
            .addCase(
                getSubmissionActivities.pending,
                (state) => {
                    state.submissionActivitiesLoading = true;
                    state.submissionActivitiesError = null;
                    state.submissionActivities = [];
                }
            )

            .addCase(
                getSubmissionActivities.fulfilled,
                (state, action) => {
                    state.submissionActivitiesLoading = false;
                    state.submissionActivities = action.payload;
                }
            )

            .addCase(
                getSubmissionActivities.rejected,
                (state, action) => {
                    state.submissionActivitiesLoading = false;
                    state.submissionActivitiesError =
                        action.payload ||
                        "Failed to fetch submission activities";
                }
            )
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
                    state.submissionStatuses = action.payload;
                }
            )

            .addCase(
                getSubmissionStatuses.rejected,
                (state, action) => {
                    state.submissionStatusesLoading = false;
                    state.submissionStatusesError =
                        action.payload ||
                        "Failed to fetch submission statuses";
                }
            )
            .addCase(
                createSubmission.pending,
                (state) => {
                    state.creatingSubmission = true;
                    state.createSubmissionError = null;
                }
            )

            .addCase(
                createSubmission.fulfilled,
                (state) => {
                    state.creatingSubmission = false;
                    state.createSubmissionError = null;
                }
            )

            .addCase(
                createSubmission.rejected,
                (state, action) => {
                    state.creatingSubmission = false;
                    state.createSubmissionError =
                        action.payload ||
                        "Failed to create submission";
                }
            )
            .addCase(
                getSubmissionSubStatuses.pending,
                (state, action) => {
                    const statusId = action.meta.arg;

                    state.submissionSubStatusesLoading[statusId] = true;

                    state.submissionSubStatusesError[statusId] = null;
                }
            )

            .addCase(
                getSubmissionSubStatuses.fulfilled,
                (state, action) => {
                    const statusId = action.meta.arg;

                    state.submissionSubStatusesLoading[statusId] = false;

                    state.submissionSubStatuses[statusId] =
                        action.payload;
                }
            )

            .addCase(
                getSubmissionSubStatuses.rejected,
                (state, action) => {
                    const statusId = action.meta.arg;

                    state.submissionSubStatusesLoading[statusId] = false;

                    state.submissionSubStatusesError[statusId] =
                        action.payload ||
                        "Failed to fetch submission sub-statuses";
                }
            )
            .addCase(
                updateSubmission.pending,
                (state) => {
                    state.updatingSubmission = true;
                    state.updateSubmissionError = null;
                }
            )

            .addCase(
                updateSubmission.fulfilled,
                (state, action) => {
                    state.updatingSubmission = false;
                    state.updateSubmissionError = null;

                    const updated = action.payload;

                    const index =
                        state.candidateApplications.findIndex(
                            (application) =>
                                (
                                    application.id ||
                                    application.submissionId
                                ) === updated.submissionId
                        );

                    if (index !== -1) {
                        state.candidateApplications[index] =
                            updated;
                    }
                }
            )

            .addCase(
                updateSubmission.rejected,
                (state, action) => {
                    state.updatingSubmission = false;

                    state.updateSubmissionError =
                        action.payload ||
                        "Failed to update submission";
                }
            )
            .addCase(
                updateSubmissionRates.pending,
                (state) => {
                    state.updatingSubmissionRates = true;
                    state.updateSubmissionRatesError = null;
                }
            )

            .addCase(
                updateSubmissionRates.fulfilled,
                (state, action) => {
                    state.updatingSubmissionRates = false;
                    state.updateSubmissionRatesError = null;

                    const updated = action.payload;

                    const index =
                        state.candidateApplications.findIndex(
                            (application) =>
                                (
                                    application.id ||
                                    application.submissionId
                                ) === updated.submissionId
                        );

                    if (index !== -1) {
                        state.candidateApplications[index] =
                            updated;
                    }
                }
            )

            .addCase(
                updateSubmissionRates.rejected,
                (state, action) => {
                    state.updatingSubmissionRates = false;

                    state.updateSubmissionRatesError =
                        action.payload ||
                        "Failed to update submission rates";
                }
            )
            .addCase(
                createInterview.pending,
                (state) => {
                    state.creatingInterview = true;
                    state.createInterviewError = null;
                }
            )

            .addCase(
                createInterview.fulfilled,
                (state) => {
                    state.creatingInterview = false;
                    state.createInterviewError = null;
                }
            )

            .addCase(
                createInterview.rejected,
                (state, action) => {
                    state.creatingInterview = false;

                    state.createInterviewError =
                        action.payload ||
                        "Failed to schedule interview";
                }
            )
            .addCase(
                getInterviewsBySubmission.pending,
                (state, action) => {
                    const submissionId = action.meta.arg;

                    state.interviewsBySubmissionLoading[
                        submissionId
                    ] = true;

                    state.interviewsBySubmissionError[
                        submissionId
                    ] = null;
                }
            )

            .addCase(
                getInterviewsBySubmission.fulfilled,
                (state, action) => {
                    const {
                        submissionId,
                        interviews,
                    } = action.payload;

                    state.interviewsBySubmission[
                        submissionId
                    ] = Array.isArray(interviews)
                            ? interviews
                            : [];

                    state.interviewsBySubmissionLoading[
                        submissionId
                    ] = false;

                    state.interviewsBySubmissionError[
                        submissionId
                    ] = null;
                }
            )

            .addCase(
                getInterviewsBySubmission.rejected,
                (state, action) => {
                    const submissionId =
                        action.payload?.submissionId ||
                        action.meta.arg;

                    state.interviewsBySubmissionLoading[
                        submissionId
                    ] = false;

                    state.interviewsBySubmissionError[
                        submissionId
                    ] =
                        action.payload?.message ||
                        "Failed to fetch interviews";
                }
            )
            .addCase(
                getCandidateNotes.pending,
                (state) => {
                    state.notesLoading = true;
                    state.notesError = null;
                }
            )

            .addCase(
                getCandidateNotes.fulfilled,
                (state, action) => {
                    state.notesLoading = false;
                    state.notes = action.payload || [];
                    state.notesError = null;
                }
            )

            .addCase(
                getCandidateNotes.rejected,
                (state, action) => {
                    state.notesLoading = false;
                    state.notes = [];
                    state.notesError =
                        action.payload ||
                        "Failed to fetch candidate notes";
                }
            )

            .addCase(
                createNote.pending,
                (state) => {
                    state.creatingNote = true;
                    state.createNoteError = null;
                }
            )

            .addCase(
                createNote.fulfilled,
                (state, action) => {
                    state.creatingNote = false;
                    state.createNoteError = null;

                    /*
                     * Add newly created note immediately.
                     */
                    if (action.payload) {
                        state.notes = [
                            ...state.notes,
                            action.payload,
                        ];
                    }
                }
            )

            .addCase(
                createNote.rejected,
                (state, action) => {
                    state.creatingNote = false;

                    state.createNoteError =
                        action.payload ||
                        "Failed to create note";
                }
            )
            .addCase(
                deleteSubmission.pending,
                (state) => {
                    state.deletingSubmission = true;
                    state.deleteSubmissionError = null;
                }
            )

            .addCase(
                deleteSubmission.fulfilled,
                (state, action) => {
                    state.deletingSubmission = false;
                    state.deleteSubmissionError = null;

                    const deletedSubmissionId =
                        action.payload?.submissionId;

                    if (deletedSubmissionId) {
                        state.candidateApplications =
                            state.candidateApplications.filter(
                                (application) =>
                                    (
                                        application.id ||
                                        application.submissionId
                                    ) !== deletedSubmissionId
                            );
                    }
                }
            )

            .addCase(
                deleteSubmission.rejected,
                (state, action) => {
                    state.deletingSubmission = false;

                    state.deleteSubmissionError =
                        action.payload ||
                        "Failed to delete submission";
                }
            )

            .addCase(
                updateInterview.pending,
                (state) => {
                    state.updatingInterview = true;
                    state.updateInterviewError = null;
                }
            )

            .addCase(
                updateInterview.fulfilled,
                (state) => {
                    state.updatingInterview = false;
                    state.updateInterviewError = null;
                }
            )

            .addCase(
                updateInterview.rejected,
                (state, action) => {
                    state.updatingInterview = false;
                    state.updateInterviewError =
                        action.payload ||
                        "Failed to reschedule interview";
                }
            )

            .addCase(
                exportCandidates.pending,
                (state) => {
                    state.exportingCandidates = true;
                    state.exportCandidatesError = null;
                }
            )

            .addCase(
                exportCandidates.fulfilled,
                (state) => {
                    state.exportingCandidates = false;
                    state.exportCandidatesError = null;
                }
            )

            .addCase(
                exportCandidates.rejected,
                (state, action) => {
                    state.exportingCandidates = false;
                    state.exportCandidatesError =
                        action.payload ||
                        "Failed to export candidates";
                }
            )
    },
});

export const {
    clearCandidateError,
    clearEmployeeError,
    clearCandidateDetails,
    clearCandidateActivity,
    clearCandidateApplications,
    clearSubmissionActivities,
} = candidateSlice.actions;

export default candidateSlice.reducer;