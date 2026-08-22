// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// /* =========================================================
//    API BASE URL
// ========================================================= */

// const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL ||
//     " ";


// /* =========================================================
//    GET ACCESS TOKEN
// ========================================================= */

// const getAccessToken = (getState) => {
//     const state = getState();

//     /*
//         Change this path ONLY if your existing authSlice
//         stores the token somewhere else.

//         Expected:
//         state.auth.accessToken
//     */

//     return state.auth?.accessToken;
// };


// /* =========================================================
//    GET ALL ACTIVE END CLIENTS
// ========================================================= */


// export const fetchEndClients = createAsyncThunk(
//     "endClients/fetchEndClients",

//     async (_, { getState, rejectWithValue }) => {

//         try {

//             const token = getAccessToken(getState);

//             const response = await fetch(
//                 `${API_BASE_URL}/api/v1/endclients/allEndClients`,
//                 {
//                     method: "GET",

//                     headers: {
//                         "Content-Type": "application/json",

//                         ...(token && {
//                             Authorization: `Bearer ${token}`,
//                         }),
//                     },
//                 }
//             );


//             if (!response.ok) {

//                 const errorText = await response.text();

//                 throw new Error(
//                     errorText || "Failed to fetch end clients"
//                 );
//             }


//             const data = await response.json();

//             return data;

//         } catch (error) {

//             return rejectWithValue(
//                 error.message || "Failed to fetch end clients"
//             );
//         }
//     }
// );


// /* =========================================================
//    CREATE END CLIENT
// ========================================================= */

// export const createEndClient = createAsyncThunk(
//     "endClients/createEndClient",

//     async (endClientData, { getState, rejectWithValue }) => {

//         try {

//             const token = getAccessToken(getState);


//             const requestBody = {
//                 name: endClientData.name.trim(),

//                 isActive:
//                     endClientData.status === "Active",
//             };


//             const response = await fetch(
//                 `${API_BASE_URL}/api/v1/endclients/create`,
//                 {
//                     method: "POST",

//                     headers: {
//                         "Content-Type": "application/json",

//                         ...(token && {
//                             Authorization: `Bearer ${token}`,
//                         }),
//                     },

//                     body: JSON.stringify(requestBody),
//                 }
//             );


//             if (!response.ok) {

//                 const errorText = await response.text();

//                 throw new Error(
//                     errorText || "Failed to create end client"
//                 );
//             }


//             const data = await response.json();

//             return data;

//         } catch (error) {

//             return rejectWithValue(
//                 error.message || "Failed to create end client"
//             );
//         }
//     }
// );


// /* =========================================================
//    UPDATE END CLIENT
// ========================================================= */

// export const updateEndClient = createAsyncThunk(
//     "endClients/updateEndClient",

//     async (
//         { id, name, status },
//         { getState, rejectWithValue }
//     ) => {

//         try {

//             const token = getAccessToken(getState);


//             /* =================================================
//                UPDATE API REQUEST

//                Backend expects:
//                {
//                    "active": false
//                }

//                NOT:
//                {
//                    "isActive": false
//                }
//             ================================================= */

//             const requestBody = {
//                 active: status === "Active",
//             };


//             console.log(
//                 "UPDATE END CLIENT REQUEST:",
//                 requestBody
//             );


//             const response = await fetch(
//                 `${API_BASE_URL}/api/v1/endclients/update/${id}`,
//                 {
//                     method: "PUT",

//                     headers: {
//                         "Content-Type": "application/json",

//                         ...(token && {
//                             Authorization: `Bearer ${token}`,
//                         }),
//                     },

//                     body: JSON.stringify(requestBody),
//                 }
//             );


//             if (!response.ok) {

//                 const errorText =
//                     await response.text();

//                 throw new Error(
//                     errorText ||
//                     "Failed to update end client"
//                 );
//             }


//             const data =
//                 await response.json();


//             console.log(
//                 "UPDATE END CLIENT RESPONSE:",
//                 data
//             );


//             return data;

//         } catch (error) {

//             return rejectWithValue(
//                 error.message ||
//                 "Failed to update end client"
//             );
//         }
//     }
// );

// /* =========================================================
//    SLICE
// ========================================================= */

// const endClientSlice = createSlice({

//     name: "endClients",

//     initialState: {

//         items: [],

//         loading: false,

//         creating: false,

//         updating: false,

//         error: null,
//     },


//     reducers: {

//         clearEndClientError: (state) => {

//             state.error = null;

//         },

//     },


//     extraReducers: (builder) => {

//         /* =====================================================
//            FETCH
//         ===================================================== */

//         builder

//             .addCase(
//                 fetchEndClients.pending,
//                 (state) => {

//                     state.loading = true;

//                     state.error = null;
//                 }
//             )


//             .addCase(
//                 fetchEndClients.fulfilled,
//                 (state, action) => {

//                     state.loading = false;

//                     state.items = action.payload.map(
//                         (client) => ({
//                             id: client.id,

//                             name: client.name,

//                             status: client.active
//                                 ? "Active"
//                                 : "Inactive",
//                         })
//                     );
//                 }
//             )


//             .addCase(
//                 fetchEndClients.rejected,
//                 (state, action) => {

//                     state.loading = false;

//                     state.error =
//                         action.payload ||
//                         "Failed to fetch end clients";
//                 }
//             );


//         /* =====================================================
//            CREATE
//         ===================================================== */

//         builder

//             .addCase(
//                 createEndClient.pending,
//                 (state) => {

//                     state.creating = true;

//                     state.error = null;
//                 }
//             )


//             .addCase(
//                 createEndClient.fulfilled,
//                 (state, action) => {

//                     state.creating = false;


//                     const newClient = {

//                         id: action.payload.id,

//                         name: action.payload.name,

//                         status: action.payload.active
//                             ? "Active"
//                             : "Inactive",
//                     };


//                     state.items.push(newClient);
//                 }
//             )


//             .addCase(
//                 createEndClient.rejected,
//                 (state, action) => {

//                     state.creating = false;

//                     state.error =
//                         action.payload ||
//                         "Failed to create end client";
//                 }
//             );


//         /* =====================================================
//            UPDATE
//         ===================================================== */

//         builder

//             .addCase(
//                 updateEndClient.pending,
//                 (state) => {

//                     state.updating = true;

//                     state.error = null;
//                 }
//             )


//             .addCase(
//                 updateEndClient.fulfilled,
//                 (state, action) => {

//                     state.updating = false;


//                     const updatedClient =
//                         action.payload;


//                     const index =
//                         state.items.findIndex(
//                             (client) =>
//                                 client.id ===
//                                 updatedClient.id
//                         );


//                     if (index !== -1) {

//                         state.items[index] = {

//                             id: updatedClient.id,

//                             name: updatedClient.name,

//                             status:
//                                 updatedClient.active
//                                     ? "Active"
//                                     : "Inactive",
//                         };
//                     }
//                 }
//             )


//             .addCase(
//                 updateEndClient.rejected,
//                 (state, action) => {

//                     state.updating = false;

//                     state.error =
//                         action.payload ||
//                         "Failed to update end client";
//                 }
//             );
//     },
// });


// export const {
//     clearEndClientError,
// } = endClientSlice.actions;


// export default endClientSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    " ";


/* =========================================================
   GET ACCESS TOKEN
========================================================= */

const getAccessToken = (getState) => {

    const state = getState();

    return state.auth?.accessToken;
};


/* =========================================================
   GET ALL END CLIENTS
========================================================= */

export const fetchEndClients = createAsyncThunk(
    "endClients/fetchEndClients",

    async (_, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);


            const response = await fetch(
                `${API_BASE_URL}/api/v1/endclients/allEndClients`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token && {
                            Authorization:
                                `Bearer ${token}`,
                        }),
                    },
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to fetch end clients"
                );
            }


            const data =
                await response.json();


            return data;


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch end clients"
            );

        }
    }
);


/* =========================================================
   GET ACTIVE END CLIENTS
========================================================= */

export const fetchActiveEndClients = createAsyncThunk(
    "endClients/fetchActiveEndClients",

    async (_, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);


            const response = await fetch(
                `${API_BASE_URL}/api/v1/endclients/activeEndClients`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token && {
                            Authorization:
                                `Bearer ${token}`,
                        }),
                    },
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to fetch active end clients"
                );
            }


            const data =
                await response.json();


            /*
                API returns:

                [
                    {
                        id: "...",
                        name: "DEF Technologies",
                        active: true
                    }
                ]
            */

            return data;


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch active end clients"
            );

        }
    }
);


/* =========================================================
   CREATE END CLIENT
========================================================= */

export const createEndClient = createAsyncThunk(
    "endClients/createEndClient",

    async (
        endClientData,
        { getState, rejectWithValue }
    ) => {

        try {

            const token =
                getAccessToken(getState);


            const requestBody = {

                name:
                    endClientData.name.trim(),

                isActive:
                    endClientData.status ===
                    "Active",

            };


            const response = await fetch(
                `${API_BASE_URL}/api/v1/endclients/create`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token && {
                            Authorization:
                                `Bearer ${token}`,
                        }),
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        ),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to create end client"
                );
            }


            const data =
                await response.json();


            return data;


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to create end client"
            );

        }
    }
);


/* =========================================================
   UPDATE END CLIENT
========================================================= */

export const updateEndClient = createAsyncThunk(
    "endClients/updateEndClient",

    async (
        { id, name, status },
        { getState, rejectWithValue }
    ) => {

        try {

            const token =
                getAccessToken(getState);


            const requestBody = {

                active:
                    status === "Active",

            };


            console.log(
                "UPDATE END CLIENT REQUEST:",
                requestBody
            );


            const response = await fetch(
                `${API_BASE_URL}/api/v1/endclients/update/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token && {
                            Authorization:
                                `Bearer ${token}`,
                        }),
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        ),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to update end client"
                );
            }


            const data =
                await response.json();


            console.log(
                "UPDATE END CLIENT RESPONSE:",
                data
            );


            return data;


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to update end client"
            );

        }
    }
);


/* =========================================================
   SLICE
========================================================= */

const endClientSlice = createSlice({

    name: "endClients",

    initialState: {

        /* ALL END CLIENTS */

        items: [],

        loading: false,


        /* ACTIVE END CLIENTS */

        activeItems: [],

        activeLoading: false,


        /* CREATE */

        creating: false,


        /* UPDATE */

        updating: false,


        /* ERROR */

        error: null,

        activeError: null,

    },


    reducers: {

        clearEndClientError: (state) => {

            state.error = null;

            state.activeError = null;

        },

    },


    extraReducers: (builder) => {


        /* =====================================================
           FETCH ALL END CLIENTS
        ===================================================== */

        builder

            .addCase(
                fetchEndClients.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;

                }
            )


            .addCase(
                fetchEndClients.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.items =
                        (action.payload || []).map(
                            (client) => ({

                                id:
                                    client.id,

                                name:
                                    client.name,

                                status:
                                    client.active
                                        ? "Active"
                                        : "Inactive",

                            })
                        );

                }
            )


            .addCase(
                fetchEndClients.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch end clients";

                }
            );


        /* =====================================================
           FETCH ACTIVE END CLIENTS
        ===================================================== */

        builder

            .addCase(
                fetchActiveEndClients.pending,
                (state) => {

                    state.activeLoading = true;

                    state.activeError = null;

                }
            )


            .addCase(
                fetchActiveEndClients.fulfilled,
                (state, action) => {

                    state.activeLoading = false;

                    state.activeItems =
                        (action.payload || []).map(
                            (client) => ({

                                id:
                                    client.id,

                                name:
                                    client.name,

                                status:
                                    client.active
                                        ? "Active"
                                        : "Inactive",

                            })
                        );

                }
            )


            .addCase(
                fetchActiveEndClients.rejected,
                (state, action) => {

                    state.activeLoading = false;

                    state.activeError =
                        action.payload ||
                        "Failed to fetch active end clients";

                }
            );


        /* =====================================================
           CREATE
        ===================================================== */

        builder

            .addCase(
                createEndClient.pending,
                (state) => {

                    state.creating = true;

                    state.error = null;

                }
            )


            .addCase(
                createEndClient.fulfilled,
                (state, action) => {

                    state.creating = false;


                    const newClient = {

                        id:
                            action.payload.id,

                        name:
                            action.payload.name,

                        status:
                            action.payload.active
                                ? "Active"
                                : "Inactive",

                    };


                    state.items.push(
                        newClient
                    );


                    /*
                        If the newly created client
                        is active, also add it to
                        activeItems immediately.
                    */

                    if (
                        action.payload.active
                    ) {

                        state.activeItems.push(
                            newClient
                        );

                    }

                }
            )


            .addCase(
                createEndClient.rejected,
                (state, action) => {

                    state.creating = false;

                    state.error =
                        action.payload ||
                        "Failed to create end client";

                }
            );


        /* =====================================================
           UPDATE
        ===================================================== */

        builder

            .addCase(
                updateEndClient.pending,
                (state) => {

                    state.updating = true;

                    state.error = null;

                }
            )


            .addCase(
                updateEndClient.fulfilled,
                (state, action) => {

                    state.updating = false;


                    const updatedClient =
                        action.payload;


                    const updatedClientData = {

                        id:
                            updatedClient.id,

                        name:
                            updatedClient.name,

                        status:
                            updatedClient.active
                                ? "Active"
                                : "Inactive",

                    };


                    /* =========================================
                       UPDATE ALL END CLIENTS
                    ========================================= */

                    const index =
                        state.items.findIndex(
                            (client) =>
                                client.id ===
                                updatedClient.id
                        );


                    if (index !== -1) {

                        state.items[index] =
                            updatedClientData;

                    }


                    /* =========================================
                       UPDATE ACTIVE END CLIENTS
                    ========================================= */

                    const activeIndex =
                        state.activeItems.findIndex(
                            (client) =>
                                client.id ===
                                updatedClient.id
                        );


                    if (
                        updatedClient.active
                    ) {

                        /*
                            Still active.

                            Update existing record or add
                            it if it wasn't previously active.
                        */

                        if (
                            activeIndex !== -1
                        ) {

                            state.activeItems[
                                activeIndex
                            ] =
                                updatedClientData;

                        } else {

                            state.activeItems.push(
                                updatedClientData
                            );

                        }

                    } else {

                        /*
                            Client became inactive,
                            so remove it from activeItems.
                        */

                        if (
                            activeIndex !== -1
                        ) {

                            state.activeItems =
                                state.activeItems.filter(
                                    (client) =>
                                        client.id !==
                                        updatedClient.id
                                );

                        }

                    }

                }
            )


            .addCase(
                updateEndClient.rejected,
                (state, action) => {

                    state.updating = false;

                    state.error =
                        action.payload ||
                        "Failed to update end client";

                }
            );

    },

});


export const {
    clearEndClientError,
} = endClientSlice.actions;


export default endClientSlice.reducer;