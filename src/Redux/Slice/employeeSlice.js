import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import employeeApi from "../../services/employeeApi";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    " ";
const getAccessToken = () => {
    const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

    if (!token) {
        return null;
    }

    return token
        .replace(/^Bearer\s+/i, "")
        .trim();
};

const getAuthHeaders = () => {
    const token = getAccessToken();

    if (!token) {
        return null;
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

const getFormDataHeaders = () => {
    const token = getAccessToken();

    if (!token) {
        return null;
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getAllEmployees = createAsyncThunk(
    "employees/getAllEmployees",
    async (
        {
            page = 0,
            size = 20,
            search = "",
            active,
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            const headers = getAuthHeaders();

if (!headers) {
    return rejectWithValue(
        "User not authenticated. Access token not found."
    );
}

            params.append("page", page);
            params.append("size", size);

            if (search?.trim()) {
                params.append(
                    "search",
                    search.trim()
                );
            }

            if (
                active !== undefined &&
                active !== null
            ) {
                params.append(
                    "active",
                    active
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees?${params.toString()}`,
    {
        method: "GET",
        headers,
    }
            );

            const data =
                await response.json();

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

export const getCountries = createAsyncThunk(
    "employees/getCountries",
    async (_, { rejectWithValue }) => {

        try {

            const headers = getAuthHeaders();

            if (!headers) {
                return rejectWithValue(
                    "User not authenticated. Access token not found."
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/global/getCountries`,
    {
        method: "GET",
        headers,
    }
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

export const getEmployeeById = createAsyncThunk(
    "employees/getEmployeeById",
    async (id, { rejectWithValue }) => {

        try {
const headers = getAuthHeaders();

if (!headers) {
    return rejectWithValue(
        "User not authenticated. Access token not found."
    );
}
            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees/${id}`,
    {
        method: "GET",
        headers,
    }
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

const headers = getFormDataHeaders();

if (!headers) {
    return rejectWithValue(
        "User not authenticated. Access token not found."
    );
}
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
            headers,
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
            const headers = getFormDataHeaders();

            if (!headers) {
                return rejectWithValue(
                    "User not authenticated. Access token not found."
                );
            }

            const formData = new FormData();

            const employeeBlob = new Blob(
                [
                    JSON.stringify(employeeData),
                ],
                {
                    type: "application/json",
                }
            );

            formData.append(
                "employee",
                employeeBlob
            );

            // Only append photo when a NEW photo is selected
            if (photoFile instanceof File) {
                formData.append(
                    "photo",
                    photoFile
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees/update/${id}`,
                {
                    method: "PUT",
                    headers,
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to update employee."
                );
            }

            return data;

        } catch (error) {
            return rejectWithValue(
                error.message ||
                "Failed to update employee."
            );
        }
    }
);
export const deleteEmployee = createAsyncThunk(
    "employees/deleteEmployee",
    async (id, { rejectWithValue }) => {

        try {

            const headers = getFormDataHeaders();

if (!headers) {
    return rejectWithValue(
        "User not authenticated. Access token not found."
    );
}
const response = await fetch(
    `${API_BASE_URL}/api/v1/employees/delete/${id}`,
    {
        method: "DELETE",
        headers,
    }
);

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


export const getAllSubmissions = createAsyncThunk(
    "employees/getAllSubmissions",
    async (
        {
            page = 0,
            size = 20,
            statusId = [],
            jobId = "",
            clientId = "",
            search = "",
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            const headers = getAuthHeaders();

            if (!headers) {
                return rejectWithValue(
                    "User not authenticated. Access token not found."
                );
            }

            params.append("page", page);
            params.append("size", size);
if (Array.isArray(statusId) && statusId.length > 0) {
    params.append("statusIds", statusId.join(","));
} else if (statusId) {
    // Keeps backward compatibility with a single status
    params.append("statusIds", statusId);
}

            if (jobId) {
                params.append("jobId", jobId);
            }

            if (clientId) {
                params.append("clientId", clientId);
            }

            if (search) {
                params.append("search", search);
            }

            const response = await fetch(
                `${API_BASE_URL}/api/v1/submissions?${params.toString()}`,
                {
                    method: "GET",
                    headers,
                }
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

export const getEmployeeFilters = createAsyncThunk(
    "employees/getEmployeeFilters",
    async (_, { rejectWithValue }) => {

        try {
const headers = getAuthHeaders();

if (!headers) {
    return rejectWithValue(
        "User not authenticated. Access token not found."
    );
}
            const response = await fetch(
                `${API_BASE_URL}/api/v1/employees/employeefilters`,
    {
        method: "GET",
        headers,
    }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to fetch employee filters."
                );
            }

            return data;

        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch employee filters."
            );
        }
    }
);

export const exportEmployees =
    createAsyncThunk(
        "employees/exportEmployees",

        async (
            {
                fromDate = "",
                toDate = "",
                role = "",
                active,
            } = {},
            { rejectWithValue }
        ) => {

            try {

                const params = {};

                /*
                 * -------------------------------------------------------
                 * FROM DATE
                 * -------------------------------------------------------
                 */

                if (fromDate) {
                    params.fromDate =
                        fromDate;
                }


                /*
                 * -------------------------------------------------------
                 * TO DATE
                 * -------------------------------------------------------
                 */

                if (toDate) {
                    params.toDate =
                        toDate;
                }


                /*
                 * -------------------------------------------------------
                 * ROLE
                 * -------------------------------------------------------
                 */

                if (role) {
                    params.role =
                        role;
                }


                /*
                 * -------------------------------------------------------
                 * ACTIVE
                 *
                 * Important:
                 *
                 * false must also be sent.
                 *
                 * So don't use:
                 *
                 * if (active)
                 *
                 * because false would be ignored.
                 * -------------------------------------------------------
                 */

                if (
                    active !== undefined &&
                    active !== null
                ) {

                    params.active =
                        active;
                }


                console.log(
                    "EXPORT EMPLOYEE THUNK PARAMS:",
                    params
                );


                const response =
                    await employeeApi.exportEmployees(
                        params
                    );


                return {
                    data:
                        response.data,

                    headers:
                        response.headers,
                };

            } catch (error) {

                console.error(
                    "EXPORT EMPLOYEES ERROR:",
                    error
                );


                /*
                 * Because responseType is blob,
                 * backend errors may sometimes
                 * also come back as Blob.
                 *
                 * We can improve this later if needed.
                 */

                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to export employees.";


                return rejectWithValue(
                    message
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

    employeePagination: {
        pageNumber: 0,
        pageSize: 20,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        first: true,
        last: true,
        empty: true,
    },

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
        pageSize: 100,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        first: true,
        last: true,
        empty: true,
    },

    submissionsLoading: false,

    submissionsError: null,
    employeeFilters: {
    totalEmployees: 0,
    totalActiveEmployees: 0,
    totalInActiveEmployees: 0,
},

employeeFiltersLoading: false,

employeeFiltersError: null,
isEmployeeExporting: false,

employeeExportError: null,
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

                    pageSize: 100,

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

        state.isLoading = false;

        const data =
            action.payload;

        state.employees =
            data?.content || [];

        state.employeePagination = {
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
                )

builder

    .addCase(
        getEmployeeFilters.pending,
        (state) => {

            state.employeeFiltersLoading = true;

            state.employeeFiltersError = null;
        }
    )

    .addCase(
        getEmployeeFilters.fulfilled,
        (
            state,
            action
        ) => {

            state.employeeFiltersLoading = false;

            const data = action.payload || {};

            state.employeeFilters = {

                totalEmployees:
                    data?.totalEmployees ?? 0,

                totalActiveEmployees:
                    data?.totalActiveEmployees ?? 0,

                totalInActiveEmployees:
                    data?.totalInActiveEmployees ?? 0,
            };
        }
    )

    .addCase(
        getEmployeeFilters.rejected,
        (
            state,
            action
        ) => {

            state.employeeFiltersLoading = false;

            state.employeeFiltersError =
                action.payload ||
                "Failed to fetch employee filters.";
        }
    )
    /*
|--------------------------------------------------------------------------
| EXPORT EMPLOYEES
|--------------------------------------------------------------------------
*/

builder

    .addCase(
        exportEmployees.pending,
        (state) => {

            state.isEmployeeExporting =
                true;

            state.employeeExportError =
                null;
        }
    )

    .addCase(
        exportEmployees.fulfilled,
        (state) => {

            state.isEmployeeExporting =
                false;

            state.employeeExportError =
                null;
        }
    )

    .addCase(
        exportEmployees.rejected,
        (
            state,
            action
        ) => {

            state.isEmployeeExporting =
                false;

            state.employeeExportError =
                action.payload ||
                "Failed to export employees.";
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