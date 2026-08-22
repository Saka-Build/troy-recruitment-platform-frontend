import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import employeeApi from "../../services/employeeApi";


/*
 * =========================================================
 * CREATE EMPLOYEE
 * =========================================================
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

            const response =
                await employeeApi.createEmployee(
                    employeeData,
                    photoFile
                );

            return response;

        } catch (error) {

            console.error(
                "Create Employee API Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to create employee. Please try again.";

            return rejectWithValue(message);
        }
    }
);


/*
 * =========================================================
 * GET ALL EMPLOYEES
 * =========================================================
 */
export const getAllEmployees = createAsyncThunk(
    "employees/getAllEmployees",

    async (_, { rejectWithValue }) => {

        try {

            const response =
                await employeeApi.getAllEmployees();

            return response;

        } catch (error) {

            console.error(
                "Get All Employees API Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load employees.";

            return rejectWithValue(message);
        }
    }
);


/*
 * =========================================================
 * GET EMPLOYEE BY ID
 * =========================================================
 */
export const getEmployeeById = createAsyncThunk(
    "employees/getEmployeeById",

    async (id, { rejectWithValue }) => {

        try {

            const response =
                await employeeApi.getEmployeeById(id);

            return response;

        } catch (error) {

            console.error(
                "Get Employee By ID API Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load employee.";

            return rejectWithValue(message);
        }
    }
);

/*
 * =========================================================
 * UPDATE EMPLOYEE
 * =========================================================
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

            const response =
                await employeeApi.updateEmployee(
                    id,
                    employeeData,
                    photoFile
                );

            return response;

        } catch (error) {

            console.error(
                "Update Employee API Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to update employee. Please try again.";

            return rejectWithValue(message);
        }
    }
);

/*
 * =========================================================
 * DELETE EMPLOYEE
 * =========================================================
 */
export const deleteEmployee = createAsyncThunk(
    "employees/deleteEmployee",

    async (id, { rejectWithValue }) => {

        try {

            await employeeApi.deleteEmployee(id);

            return id;

        } catch (error) {

            console.error(
                "Delete Employee API Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to delete employee.";

            return rejectWithValue(message);
        }
    }
);


/*
 * =========================================================
 * INITIAL STATE
 * =========================================================
 */
const initialState = {

    employees: [],

    selectedEmployee: null,

    isLoading: false,

    isFetching: false,
    isUpdating: false,
    isDeleting: false,

    error: null,

    success: false,
};


/*
 * =========================================================
 * SLICE
 * =========================================================
 */
const employeeSlice = createSlice({

    name: "employees",

    initialState,

    reducers: {

        clearEmployeeError: (state) => {
            state.error = null;
        },

        clearEmployeeSuccess: (state) => {
            state.success = false;
        },

        clearSelectedEmployee: (state) => {
            state.selectedEmployee = null;
        },
    },


    extraReducers: (builder) => {

        builder


            /*
             * =================================================
             * CREATE START
             * =================================================
             */
            .addCase(
                createEmployee.pending,
                (state) => {

                    state.isLoading = true;
                    state.error = null;
                    state.success = false;
                }
            )


            /*
             * =================================================
             * CREATE SUCCESS
             * =================================================
             */
            .addCase(
                createEmployee.fulfilled,
                (state, action) => {

                    state.isLoading = false;
                    state.success = true;
                    state.error = null;

                    /*
                     * Add API response
                     */
                    state.employees.push(
                        action.payload
                    );
                }
            )


            /*
             * =================================================
             * CREATE FAILED
             * =================================================
             */
            .addCase(
                createEmployee.rejected,
                (state, action) => {

                    state.isLoading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Unable to create employee.";
                }
            )


            /*
             * =================================================
             * GET ALL START
             * =================================================
             */
            .addCase(
                getAllEmployees.pending,
                (state) => {

                    state.isFetching = true;
                    state.error = null;
                }
            )


            /*
             * =================================================
             * GET ALL SUCCESS
             * =================================================
             */
            .addCase(
    getAllEmployees.fulfilled,
    (state, action) => {

        state.isFetching = false;
        state.error = null;

        /*
         * Backend returns Spring Page:
         *
         * {
         *   content: [...]
         * }
         */

        if (Array.isArray(action.payload?.content)) {

            state.employees =
                action.payload.content;

        } else if (Array.isArray(action.payload)) {

            state.employees =
                action.payload;

        } else if (
            Array.isArray(action.payload?.data)
        ) {

            state.employees =
                action.payload.data;

        } else if (
            Array.isArray(action.payload?.employees)
        ) {

            state.employees =
                action.payload.employees;

        } else {

            state.employees = [];
        }
    }
)
            /*
             * =================================================
             * GET ALL FAILED
             * =================================================
             */
            .addCase(
                getAllEmployees.rejected,
                (state, action) => {

                    state.isFetching = false;

                    state.error =
                        action.payload ||
                        "Unable to load employees.";
                }
            )


            /*
             * =================================================
             * GET BY ID START
             * =================================================
             */
            .addCase(
                getEmployeeById.pending,
                (state) => {

                    state.isFetching = true;
                    state.error = null;
                }
            )


            /*
             * =================================================
             * GET BY ID SUCCESS
             * =================================================
             */
            .addCase(
                getEmployeeById.fulfilled,
                (state, action) => {

                    state.isFetching = false;
                    state.error = null;

                    state.selectedEmployee =
                        action.payload;
                }
            )


            /*
             * =================================================
             * GET BY ID FAILED
             * =================================================
             */
            .addCase(
                getEmployeeById.rejected,
                (state, action) => {

                    state.isFetching = false;

                    state.error =
                        action.payload ||
                        "Unable to load employee.";
                }
            )

           /*
 * =========================================================
 * UPDATE START
 * =========================================================
 */
.addCase(
    updateEmployee.pending,
    (state) => {

        state.isUpdating = true;
        state.error = null;
        state.success = false;
    }
)


/*
 * =========================================================
 * UPDATE SUCCESS
 * =========================================================
 */
.addCase(
    updateEmployee.fulfilled,
    (state, action) => {

        state.isUpdating = false;
        state.success = true;
        state.error = null;

        /*
         * Updated employee returned by backend
         */
        const updatedEmployee =
            action.payload;

        /*
         * Find employee in Redux list
         */
        const index =
            state.employees.findIndex(
                (employee) =>
                    employee.id ===
                    updatedEmployee.id
            );

        /*
         * Replace old employee
         * with updated employee
         */
        if (index !== -1) {

            state.employees[index] =
                updatedEmployee;
        }

        /*
         * Also update selected employee
         * if it is currently selected.
         */
        if (
            state.selectedEmployee?.id ===
            updatedEmployee.id
        ) {

            state.selectedEmployee =
                updatedEmployee;
        }
    }
)


/*
 * =========================================================
 * UPDATE FAILED
 * =========================================================
 */
.addCase(
    updateEmployee.rejected,
    (state, action) => {

        state.isUpdating = false;
        state.success = false;

        state.error =
            action.payload ||
            "Unable to update employee.";
    }
)
            /*
             * =================================================
             * DELETE START
             * =================================================
             */
            .addCase(
                deleteEmployee.pending,
                (state) => {

                    state.isDeleting = true;
                    state.error = null;
                }
            )


            /*
             * =================================================
             * DELETE SUCCESS
             * =================================================
             */
            .addCase(
                deleteEmployee.fulfilled,
                (state, action) => {

                    state.isDeleting = false;
                    state.error = null;

                    /*
                     * Remove deleted employee
                     * from Redux list.
                     */
                    state.employees =
                        state.employees.filter(
                            (employee) =>
                                employee.id !==
                                action.payload
                        );
                }
            )


            /*
             * =================================================
             * DELETE FAILED
             * =================================================
             */
            .addCase(
                deleteEmployee.rejected,
                (state, action) => {

                    state.isDeleting = false;

                    state.error =
                        action.payload ||
                        "Unable to delete employee.";
                }
            );
    },
});


export const {
    clearEmployeeError,
    clearEmployeeSuccess,
    clearSelectedEmployee,
} = employeeSlice.actions;


export default employeeSlice.reducer;