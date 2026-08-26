import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    " ";

/*
|--------------------------------------------------------------------------
| GET ALL CANDIDATES
|--------------------------------------------------------------------------
*/
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
/*
|--------------------------------------------------------------------------
| GET CANDIDATE BY ID
|--------------------------------------------------------------------------
*/
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


            /*
             * API can return:
             *
             * 1. Array
             * 2. Pageable object -> content
             * 3. data array
             */

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
            /*
             * Get access token
             */
            let accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            /*
             * Safety:
             * If localStorage accidentally contains
             * "Bearer eyJ..." instead of "eyJ...",
             * don't send "Bearer Bearer..."
             */
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

            /*
             * Create multipart FormData
             */
            const formData = new FormData();

            /*
             * candidate JSON
             */
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

            /*
             * Original CV
             */
            if (originalCV) {
                formData.append(
                    "original_cv_file",
                    originalCV
                );
            }

            /*
             * Troy CV
             */
            if (troyCV) {
                formData.append(
                    "troy_cv_file",
                    troyCV
                );
            }

            /*
             * POST
             */
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

            /*
             * Read response safely
             */
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

            /*
             * Handle unauthorized
             */
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

            /*
             * Handle other errors
             */
            if (!response.ok) {
                return rejectWithValue(
                    typeof data === "object"
                        ? data?.message ||
                        data?.error ||
                        `Failed to add candidate (${response.status})`
                        : `Failed to add candidate (${response.status})`
                );
            }

            /*
             * Success
             */
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
            /*
             * Get access token
             */
            let accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            /*
             * Safety:
             * If localStorage contains
             * "Bearer eyJ...",
             * remove Bearer before adding it again.
             */
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

            /*
             * Create multipart FormData
             */
            const formData = new FormData();

            /*
             * Candidate JSON
             *
             * Example:
             * {
             *     email: "biswaranjan.sahu17@gmail.com"
             * }
             */
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

            /*
             * Original CV
             *
             * Only append if user selected
             * a new file.
             */
            if (originalCV) {
                formData.append(
                    "original_cv_file",
                    originalCV
                );
            }

            /*
             * Troy CV
             *
             * Only append if user selected
             * a new file.
             */
            if (troyCV) {
                formData.append(
                    "troy_cv_file",
                    troyCV
                );
            }

            /*
             * PUT UPDATE
             */
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

            /*
             * Read response safely
             */
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

            /*
             * Handle unauthorized
             */
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

            /*
             * Handle other errors
             */
            if (!response.ok) {
                return rejectWithValue(
                    typeof data === "object"
                        ? data?.message ||
                        data?.error ||
                        `Failed to update candidate (${response.status})`
                        : `Failed to update candidate (${response.status})`
                );
            }

            /*
             * Success
             */
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


/*
|--------------------------------------------------------------------------
| DELETE CANDIDATE
|--------------------------------------------------------------------------
*/
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


/*
|--------------------------------------------------------------------------
| GET CANDIDATE ACTIVITY
|--------------------------------------------------------------------------
*/
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
    },

    extraReducers: (builder) => {

        builder

            /*
            |--------------------------------------------------------------------------
            | GET ALL CANDIDATES
            |--------------------------------------------------------------------------
            */
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
            /*
|--------------------------------------------------------------------------
| GET CANDIDATE BY ID
|--------------------------------------------------------------------------
*/
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

            /*
            |--------------------------------------------------------------------------
            | GET ALL EMPLOYEES
            |--------------------------------------------------------------------------
            */
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


            /*
            |--------------------------------------------------------------------------
            | ADD CANDIDATE
            |--------------------------------------------------------------------------
            */
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

                    /*
                     * Backend returns the complete candidate,
                     * including generated cvId.
                     */
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


            /*
            |--------------------------------------------------------------------------
            | UPDATE CANDIDATE
            |--------------------------------------------------------------------------
            */
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


            /*
            |--------------------------------------------------------------------------
            | DELETE CANDIDATE
            |--------------------------------------------------------------------------
            */
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
            /*
|--------------------------------------------------------------------------
| GET CANDIDATE ACTIVITY
|--------------------------------------------------------------------------
*/
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
);
    },
});


export const {
    clearCandidateError,
    clearEmployeeError,
    clearCandidateDetails,
    clearCandidateActivity,
} = candidateSlice.actions;


export default candidateSlice.reducer;