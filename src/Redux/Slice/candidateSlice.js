// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL ||
//     " ";

// /*
// |--------------------------------------------------------------------------
// | GET ALL CANDIDATES
// |--------------------------------------------------------------------------
// */
// export const getAllCandidates = createAsyncThunk(
//     "candidates/getAllCandidates",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await fetch(
//                 `${API_BASE_URL}/api/v1/candidates`,
//                 {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 return rejectWithValue(
//                     data?.message || "Failed to fetch candidates"
//                 );
//             }

//             /*
//              * API may return either:
//              * 1. Direct array
//              * 2. Pageable object containing content
//              */
//             if (Array.isArray(data)) {
//                 return data;
//             }

//             if (Array.isArray(data?.content)) {
//                 return data.content;
//             }

//             if (Array.isArray(data?.data)) {
//                 return data.data;
//             }

//             return [];
//         } catch (error) {
//             return rejectWithValue(
//                 error.message || "Something went wrong while fetching candidates"
//             );
//         }
//     }
// );

// const initialState = {
//     candidates: [],
//     loading: false,
//     error: null,
// };

// const candidateSlice = createSlice({
//     name: "candidates",

//     initialState,

//     reducers: {
//         clearCandidateError: (state) => {
//             state.error = null;
//         },
//     },

//     extraReducers: (builder) => {
//         builder
//             /*
//             |--------------------------------------------------------------------------
//             | GET ALL CANDIDATES - PENDING
//             |--------------------------------------------------------------------------
//             */
//             .addCase(getAllCandidates.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })

//             /*
//             |--------------------------------------------------------------------------
//             | GET ALL CANDIDATES - SUCCESS
//             |--------------------------------------------------------------------------
//             */
//             .addCase(getAllCandidates.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.candidates = action.payload;
//             })

//             /*
//             |--------------------------------------------------------------------------
//             | GET ALL CANDIDATES - FAILED
//             |--------------------------------------------------------------------------
//             */
//             .addCase(getAllCandidates.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error =
//                     action.payload || "Failed to fetch candidates";
//             });
//     },
// });

// export const {
//     clearCandidateError,
// } = candidateSlice.actions;

// export default candidateSlice.reducer;


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

            /*
             * API may return either:
             * 1. Direct array
             * 2. Pageable object containing content
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
                error.message || "Something went wrong while fetching candidates"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| ADD CANDIDATE
|--------------------------------------------------------------------------
*/
export const addCandidate = createAsyncThunk(
    "candidates/addCandidate",
    async (candidateData, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/v1/candidates`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(candidateData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message || "Failed to add candidate"
                );
            }

            return data;
        } catch (error) {
            return rejectWithValue(
                error.message || "Something went wrong while adding candidate"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE CANDIDATE
|--------------------------------------------------------------------------
*/
export const updateCandidate = createAsyncThunk(
    "candidates/updateCandidate",
    async ({ id, candidateData }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/v1/candidates/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(candidateData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data?.message || "Failed to update candidate"
                );
            }

            return data;
        } catch (error) {
            return rejectWithValue(
                error.message || "Something went wrong while updating candidate"
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
                `${API_BASE_URL}/api/v1/candidates/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const data = await response.json();
                return rejectWithValue(
                    data?.message || "Failed to delete candidate"
                );
            }

            return id;
        } catch (error) {
            return rejectWithValue(
                error.message || "Something went wrong while deleting candidate"
            );
        }
    }
);

const initialState = {
    candidates: [],
    loading: false,
    error: null,
};

const candidateSlice = createSlice({
    name: "candidates",

    initialState,

    reducers: {
        clearCandidateError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            /*
            |--------------------------------------------------------------------------
            | GET ALL CANDIDATES
            |--------------------------------------------------------------------------
            */
            .addCase(getAllCandidates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCandidates.fulfilled, (state, action) => {
                state.loading = false;
                state.candidates = action.payload;
            })
            .addCase(getAllCandidates.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to fetch candidates";
            })

            /*
            |--------------------------------------------------------------------------
            | ADD CANDIDATE
            |--------------------------------------------------------------------------
            */
            .addCase(addCandidate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCandidate.fulfilled, (state, action) => {
                state.loading = false;
                state.candidates.push(action.payload);
            })
            .addCase(addCandidate.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to add candidate";
            })

            /*
            |--------------------------------------------------------------------------
            | UPDATE CANDIDATE
            |--------------------------------------------------------------------------
            */
            .addCase(updateCandidate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCandidate.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.candidates.findIndex(
                    (c) => c.id === action.payload.id
                );
                if (index !== -1) {
                    state.candidates[index] = action.payload;
                }
            })
            .addCase(updateCandidate.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to update candidate";
            })

            /*
            |--------------------------------------------------------------------------
            | DELETE CANDIDATE
            |--------------------------------------------------------------------------
            */
            .addCase(deleteCandidate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCandidate.fulfilled, (state, action) => {
                state.loading = false;
                state.candidates = state.candidates.filter(
                    (c) => c.id !== action.payload
                );
            })
            .addCase(deleteCandidate.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to delete candidate";
            });
    },
});

export const {
    clearCandidateError,
} = candidateSlice.actions;

export default candidateSlice.reducer;