import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import roleApi from "../../services/roleApi";


/* =========================================================
   GET ROLES + MODULES + PERMISSIONS
========================================================= */

export const getAllRolesAndModules =
    createAsyncThunk(
        "role/getAllRolesAndModules",
        async (_, { rejectWithValue }) => {

            try {

                return await roleApi
                    .getAllRolesAndModules();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load roles and permissions."
                );
            }
        }
    );


/* =========================================================
   GET ALL ROLES
========================================================= */

export const getAllRoles =
    createAsyncThunk(
        "role/getAllRoles",
        async (_, { rejectWithValue }) => {

            try {

                return await roleApi.getAllRoles();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load roles."
                );
            }
        }
    );


/* =========================================================
   GET ROLE BY ID
========================================================= */

export const getRoleById =
    createAsyncThunk(
        "role/getRoleById",
        async (roleId, { rejectWithValue }) => {

            try {

                return await roleApi.getRoleById(
                    roleId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load role."
                );
            }
        }
    );


/* =========================================================
   CREATE ROLE
========================================================= */

export const createRole =
    createAsyncThunk(
        "role/createRole",
        async (roleData, { rejectWithValue }) => {

            try {

                return await roleApi.createRole(
                    roleData
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to create role."
                );
            }
        }
    );


/* =========================================================
   UPDATE ROLE
========================================================= */

export const updateRole =
    createAsyncThunk(
        "role/updateRole",
        async (
            {
                roleId,
                roleData,
            },
            { rejectWithValue }
        ) => {

            try {

                return await roleApi.updateRole(
                    roleId,
                    roleData
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to update role."
                );
            }
        }
    );


/* =========================================================
   DELETE ROLE
========================================================= */

export const deleteRole =
    createAsyncThunk(
        "role/deleteRole",
        async (
            roleId,
            { rejectWithValue }
        ) => {

            try {

                await roleApi.deleteRole(
                    roleId
                );

                return roleId;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to delete role."
                );
            }
        }
    );


/* =========================================================
   GET EMPLOYEE ROLES
========================================================= */

export const getEmployeeRoles =
    createAsyncThunk(
        "role/getEmployeeRoles",
        async (
            employeeId,
            { rejectWithValue }
        ) => {

            try {

                return await roleApi
                    .getEmployeeRoles(
                        employeeId
                    );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load employee roles."
                );
            }
        }
    );


/* =========================================================
   ASSIGN ROLE TO EMPLOYEE
========================================================= */

export const assignRoleToEmployee =
    createAsyncThunk(
        "role/assignRoleToEmployee",
        async (
            {
                employeeId,
                roleId,
            },
            { rejectWithValue }
        ) => {

            try {

                return await roleApi
                    .assignRoleToEmployee(
                        employeeId,
                        roleId
                    );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to assign role."
                );
            }
        }
    );


/* =========================================================
   REMOVE ROLE FROM EMPLOYEE
========================================================= */

export const removeRoleFromEmployee =
    createAsyncThunk(
        "role/removeRoleFromEmployee",
        async (
            {
                employeeId,
                roleId,
            },
            { rejectWithValue }
        ) => {

            try {

                await roleApi
                    .removeRoleFromEmployee(
                        employeeId,
                        roleId
                    );

                return {
                    employeeId,
                    roleId,
                };

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to remove role."
                );
            }
        }
    );


/* =========================================================
   INITIAL STATE
========================================================= */
export const switchRole =
    createAsyncThunk(
        "role/switchRole",
        async (
            roleId,
            { rejectWithValue }
        ) => {

            try {

                return await roleApi.switchRole(
                    roleId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to switch role."
                );
            }
        }
    );
const initialState = {

    // All role objects
    roles: [],

    // Selected role for edit/details
    selectedRole: null,

    // Master data from allRolesAndModules
    availableRoles: [],
    modules: [],
    permissions: [],

    // Roles of selected employee
    employeeRoles: [],

    loading: false,
    error: null,
};


/* =========================================================
   SLICE
========================================================= */

const roleSlice = createSlice({

    name: "role",

    initialState,

    reducers: {

        clearRoleError: (state) => {
            state.error = null;
        },

        clearSelectedRole: (state) => {
            state.selectedRole = null;
        },

        clearEmployeeRoles: (state) => {
            state.employeeRoles = [];
        },
    },


    extraReducers: (builder) => {

        builder


            /* =================================================
               ALL ROLES + MODULES + PERMISSIONS
            ================================================= */

            .addCase(
                getAllRolesAndModules.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getAllRolesAndModules.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.availableRoles =
                        action.payload?.roles || [];

                    state.modules =
                        action.payload?.modules || [];

                    state.permissions =
                        action.payload?.permissions || [];
                }
            )

            .addCase(
                getAllRolesAndModules.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )


            /* =================================================
               ALL ROLES
            ================================================= */

            .addCase(
                getAllRoles.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getAllRoles.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.roles =
                        action.payload || [];
                }
            )

            .addCase(
                getAllRoles.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )


            /* =================================================
               ROLE BY ID
            ================================================= */

            .addCase(
                getRoleById.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getRoleById.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.selectedRole =
                        action.payload;
                }
            )

            .addCase(
                getRoleById.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )


            /* =================================================
               CREATE ROLE
            ================================================= */

            .addCase(
                createRole.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                createRole.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.roles.push(
                        action.payload
                    );
                }
            )

            .addCase(
                createRole.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )


            /* =================================================
               UPDATE ROLE
            ================================================= */

            .addCase(
                updateRole.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateRole.fulfilled,
                (state, action) => {

                    state.loading = false;

                    const index =
                        state.roles.findIndex(
                            (role) =>
                                role.id ===
                                action.payload.id
                        );

                    if (index !== -1) {

                        state.roles[index] =
                            action.payload;
                    }

                    state.selectedRole =
                        action.payload;
                }
            )

            .addCase(
                updateRole.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )


            /* =================================================
               DELETE ROLE
            ================================================= */

            .addCase(
                deleteRole.fulfilled,
                (state, action) => {

                    state.roles =
                        state.roles.filter(
                            (role) =>
                                role.id !==
                                action.payload
                        );

                    if (
                        state.selectedRole?.id ===
                        action.payload
                    ) {

                        state.selectedRole =
                            null;
                    }
                }
            )


            /* =================================================
               EMPLOYEE ROLES
            ================================================= */

            .addCase(
                getEmployeeRoles.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getEmployeeRoles.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.employeeRoles =
                        action.payload || [];
                }
            )

            .addCase(
                getEmployeeRoles.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )


            /* =================================================
               ASSIGN ROLE
            ================================================= */

            .addCase(
                assignRoleToEmployee.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                assignRoleToEmployee.fulfilled,
                (state) => {

                    state.loading = false;
                }
            )

            .addCase(
                assignRoleToEmployee.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )


            /* =================================================
               REMOVE ROLE
            ================================================= */

            .addCase(
                removeRoleFromEmployee.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                removeRoleFromEmployee.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.employeeRoles =
                        state.employeeRoles.filter(
                            (role) =>
                                role.id !==
                                action.payload.roleId
                        );
                }
            )

            .addCase(
                removeRoleFromEmployee.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )
            /* =================================================
   SWITCH ACTIVE ROLE
================================================= */

.addCase(
    switchRole.pending,
    (state) => {

        state.loading = true;
        state.error = null;
    }
)

.addCase(
    switchRole.fulfilled,
    (state) => {

        state.loading = false;
    }
)

.addCase(
    switchRole.rejected,
    (state, action) => {

        state.loading = false;
        state.error = action.payload;
    }
)
    },
});


export const {
    clearRoleError,
    clearSelectedRole,
    clearEmployeeRoles,
} = roleSlice.actions;


export default roleSlice.reducer;