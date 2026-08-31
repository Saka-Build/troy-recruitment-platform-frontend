import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    " ";


/*
|--------------------------------------------------------------------------
| GET ALL EMPLOYEES
|--------------------------------------------------------------------------
*/
export const getAllEmployees = createAsyncThunk(
    "employees/getAllEmployees",
    async (_, { rejectWithValue }) => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees`
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to fetch employees."
                );
            }


            return data;

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch employees."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| GET COUNTRIES
|--------------------------------------------------------------------------
*/
export const getCountries = createAsyncThunk(
    "employees/getCountries",
    async (_, { rejectWithValue }) => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/global/getCountries`
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to fetch countries."
                );
            }


            return data;

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch countries."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| GET EMPLOYEE BY ID
|--------------------------------------------------------------------------
*/
export const getEmployeeById = createAsyncThunk(
    "employees/getEmployeeById",
    async (id, { rejectWithValue }) => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees/${id}`
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to fetch employee."
                );
            }


            return data;

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch employee."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| CREATE EMPLOYEE
|
| POST /api/v1/employees/create
|
| multipart/form-data
|
| employee -> JSON
| photo    -> File
|--------------------------------------------------------------------------
*/
export const createEmployee = createAsyncThunk(
    "employees/createEmployee",
    async (
        {
            employeeData,
            photoFile,
        },
        { rejectWithValue }
    ) => {

        try {

            const formData = new FormData();


            /*
             * Backend expects:
             *
             * employee = JSON
             */
            const employeeBlob =
                new Blob(
                    [
                        JSON.stringify(
                            employeeData
                        ),
                    ],
                    {
                        type:
                            "application/json",
                    }
                );


            formData.append(
                "employee",
                employeeBlob
            );


            /*
             * Backend expects:
             *
             * photo = File
             */
            if (photoFile) {

                formData.append(
                    "photo",
                    photoFile
                );
            }


            const response =
                await fetch(
                    `${API_BASE_URL}/api/v1/employees/create`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to create employee."
                );
            }


            return data;

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to create employee."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| UPDATE EMPLOYEE
|
| PUT /api/v1/employees/update/{id}
|
| Backend accepts partial body.
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| UPDATE EMPLOYEE
|
| PUT /api/v1/employees/update/{id}
|
| multipart/form-data
|
| employee -> JSON
| photo    -> File (optional)
|--------------------------------------------------------------------------
*/
export const updateEmployee = createAsyncThunk(
    "employees/updateEmployee",
    async (
        {
            id,
            employeeData,
            photoFile,
        },
        { rejectWithValue }
    ) => {

        try {

            const formData = new FormData();

            /*
             * Backend expects:
             *
             * employee = JSON
             */
            const employeeBlob = new Blob(
                [
                    JSON.stringify(
                        employeeData
                    ),
                ],
                {
                    type: "application/json",
                }
            );

            formData.append(
                "employee",
                employeeBlob
            );


            /*
             * Backend expects:
             *
             * photo = File
             */
            if (photoFile) {

                formData.append(
                    "photo",
                    photoFile
                );
            }


            console.log(
                "UPDATE URL:",
                `${API_BASE_URL}/api/v1/employees/update/${id}`
            );

            console.log(
                "UPDATE BODY:",
                employeeData
            );


            const response =
                await fetch(
                    `${API_BASE_URL}/api/v1/employees/update/${id}`,
                    {
                        method: "PUT",

                        body: formData,
                    }
                );


            const data =
                await response.json();


            console.log(
                "UPDATE RESPONSE STATUS:",
                response.status
            );

            console.log(
                "UPDATE RESPONSE:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to update employee."
                );
            }


            return data;

        } catch (error) {

            console.error(
                "UPDATE EMPLOYEE ERROR:",
                error
            );

            return rejectWithValue(
                error.message ||
                "Failed to update employee."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| DELETE EMPLOYEE
|
| DELETE /api/v1/employees/delete/{id}
|--------------------------------------------------------------------------
*/
export const deleteEmployee = createAsyncThunk(
    "employees/deleteEmployee",
    async (id, { rejectWithValue }) => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees/delete/${id}`,
                {
                    method: "DELETE",
                }
            );

            /*
             * DELETE API may return an empty response body.
             * So don't blindly call response.json().
             */
            const responseText = await response.text();

            let data = null;

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = responseText;
                }
            }

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    (typeof data === "string" ? data : null) ||
                    "Failed to delete employee."
                );
            }

            return {
                id,
                data,
            };

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to delete employee."
            );
        }
    }
);
/*
|--------------------------------------------------------------------------
| GET ALL SUBMISSIONS
|
| GET /api/v1/submissions
|--------------------------------------------------------------------------
*/
export const getAllSubmissions = createAsyncThunk(
    "employees/getAllSubmissions",
    async (_, { rejectWithValue }) => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions`
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to fetch submissions."
                );
            }


            return data;

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch submissions."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| SLICE
|--------------------------------------------------------------------------
*/
const employeeSlice =
    createSlice({

        name: "employees",

        initialState: {

            employees: [],

            countries: [],

            selectedEmployee: null,

            isLoading: false,

            isSaving: false,

            countriesLoading: false,

            error: null,

            countriesError: null,
            deleteLoading: false,
            submissions: [],

            submissionsPagination: {

                pageNumber: 0,

                pageSize: 20,

                totalPages: 0,

                totalElements: 0,

                numberOfElements: 0,

                first: true,

                last: true,

                empty: true,
            },

            submissionsLoading: false,

            submissionsError: null,

        },


        reducers: {

            clearEmployeeError: (
                state
            ) => {

                state.error = null;
            },


            clearSelectedEmployee: (
                state
            ) => {

                state.selectedEmployee = null;
            },
            clearSubmissionError: (
                state
            ) => {

                state.submissionsError =
                    null;
            },


            clearSubmissions: (
                state
            ) => {

                state.submissions = [];

                state.submissionsPagination = {

                    pageNumber: 0,

                    pageSize: 20,

                    totalPages: 0,

                    totalElements: 0,

                    numberOfElements: 0,

                    first: true,

                    last: true,

                    empty: true,
                };
            },
        },


        extraReducers: (builder) => {

            /*
             * -------------------------------------------------------
             * GET ALL EMPLOYEES
             * -------------------------------------------------------
             */

            builder

                .addCase(
                    getAllEmployees.pending,
                    (state) => {

                        state.isLoading =
                            true;

                        state.error = null;
                    }
                )


                .addCase(
                    getAllEmployees.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.isLoading =
                            false;


                        /*
                         * API returns:
                         *
                         * {
                         *   content: []
                         * }
                         */

                        state.employees =
                            action.payload
                                ?.content ||
                            [];
                    }
                )


                .addCase(
                    getAllEmployees.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.isLoading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch employees.";
                    }
                );


            /*
             * -------------------------------------------------------
             * GET COUNTRIES
             * -------------------------------------------------------
             */

            builder

                .addCase(
                    getCountries.pending,
                    (state) => {

                        state.countriesLoading =
                            true;

                        state.countriesError =
                            null;
                    }
                )


                .addCase(
                    getCountries.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.countriesLoading =
                            false;

                        state.countries =
                            action.payload || [];
                    }
                )


                .addCase(
                    getCountries.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.countriesLoading =
                            false;

                        state.countriesError =
                            action.payload ||
                            "Failed to fetch countries.";
                    }
                );


            /*
             * -------------------------------------------------------
             * GET EMPLOYEE BY ID
             * -------------------------------------------------------
             */

            builder

                .addCase(
                    getEmployeeById.pending,
                    (state) => {

                        state.isLoading =
                            true;

                        state.error = null;
                    }
                )


                .addCase(
                    getEmployeeById.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.isLoading =
                            false;

                        state.selectedEmployee =
                            action.payload;
                    }
                )


                .addCase(
                    getEmployeeById.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.isLoading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch employee.";
                    }
                );


            /*
             * -------------------------------------------------------
             * CREATE EMPLOYEE
             * -------------------------------------------------------
             */

            builder

                .addCase(
                    createEmployee.pending,
                    (state) => {

                        state.isSaving =
                            true;

                        state.error = null;
                    }
                )


                .addCase(
                    createEmployee.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.isSaving =
                            false;


                        /*
                         * Add newly created employee
                         * to Redux list immediately.
                         */
                        state.employees.unshift(
                            action.payload
                        );
                    }
                )


                .addCase(
                    createEmployee.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.isSaving =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to create employee.";
                    }
                );


            /*
             * -------------------------------------------------------
             * UPDATE EMPLOYEE
             * -------------------------------------------------------
             */

            builder

                .addCase(
                    updateEmployee.pending,
                    (state) => {

                        state.isSaving =
                            true;

                        state.error = null;
                    }
                )


                .addCase(
                    updateEmployee.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.isSaving =
                            false;


                        const updatedEmployee =
                            action.payload;


                        const index =
                            state.employees.findIndex(
                                (employee) =>
                                    employee.id ===
                                    updatedEmployee.id
                            );


                        if (index !== -1) {

                            state.employees[
                                index
                            ] = {
                                ...state
                                    .employees[
                                        index
                                    ],

                                ...updatedEmployee,
                            };
                        }


                        state.selectedEmployee =
                            updatedEmployee;
                    }
                )


                .addCase(
                    updateEmployee.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.isSaving =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to update employee.";
                    }
                )
                /*
 * -------------------------------------------------------
 * DELETE EMPLOYEE
 * -------------------------------------------------------
 */

builder

    .addCase(
        deleteEmployee.pending,
        (state) => {

            state.deleteLoading = true;

            state.error = null;
        }
    )

    .addCase(
        deleteEmployee.fulfilled,
        (
            state,
            action
        ) => {

            state.deleteLoading = false;

            const deletedEmployeeId =
                action.payload?.id;

            state.employees =
                state.employees.filter(
                    (employee) =>
                        employee.id !==
                        deletedEmployeeId
                );

            if (
                state.selectedEmployee?.id ===
                deletedEmployeeId
            ) {

                state.selectedEmployee = null;
            }
        }
    )

    .addCase(
        deleteEmployee.rejected,
        (
            state,
            action
        ) => {

            state.deleteLoading = false;

            state.error =
                action.payload ||
                "Failed to delete employee.";
        }
    )
            /*
             * -------------------------------------------------------
             * GET ALL SUBMISSIONS
             * -------------------------------------------------------
             */

            builder

                .addCase(
                    getAllSubmissions.pending,
                    (state) => {

                        state.submissionsLoading =
                            true;

                        state.submissionsError =
                            null;
                    }
                )


                .addCase(
                    getAllSubmissions.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.submissionsLoading =
                            false;


                        const data =
                            action.payload;


                        /*
                         * API returns:
                         *
                         * {
                         *     content: [],
                         *     pageable: {},
                         *     totalPages: 1,
                         *     totalElements: 5,
                         *     ...
                         * }
                         */

                        state.submissions =
                            data?.content ||
                            [];


                        state.submissionsPagination = {

                            pageNumber:
                                data?.number ??
                                data?.pageable?.pageNumber ??
                                0,

                            pageSize:
                                data?.size ??
                                data?.pageable?.pageSize ??
                                20,

                            totalPages:
                                data?.totalPages ??
                                0,

                            totalElements:
                                data?.totalElements ??
                                0,

                            numberOfElements:
                                data?.numberOfElements ??
                                0,

                            first:
                                data?.first ??
                                true,

                            last:
                                data?.last ??
                                true,

                            empty:
                                data?.empty ??
                                true,
                        };
                    }
                )


                .addCase(
                    getAllSubmissions.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.submissionsLoading =
                            false;

                        state.submissionsError =
                            action.payload ||
                            "Failed to fetch submissions.";
                    }
                );

        },
    });


export const {
    clearEmployeeError,
    clearSelectedEmployee,
    clearSubmissionError,
    clearSubmissions,
} = employeeSlice.actions;


export default employeeSlice.reducer;