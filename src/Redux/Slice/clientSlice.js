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
   COMMON HEADERS
========================================================= */

const getHeaders = (token) => {

    return {
        "Content-Type": "application/json",

        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    };
};


/* =========================================================
   FETCH COUNTRIES
========================================================= */

export const fetchCountries = createAsyncThunk(
    "clients/fetchCountries",

    async (_, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);


            const response = await fetch(
                `${API_BASE_URL}/api/v1/global/getCountries`,
                {
                    method: "GET",
                    headers: getHeaders(token),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to fetch countries"
                );
            }


            const data =
                await response.json();


            /*
                API returns directly:

                [
                    {
                        id: "...",
                        code: "IN",
                        name: "India"
                    }
                ]
            */

            return Array.isArray(data)
                ? data
                : [];


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch countries"
            );
        }
    }
);


/* =========================================================
   GET ALL CLIENTS
========================================================= */

export const fetchClients = createAsyncThunk(
    "clients/fetchClients",

    async (_, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);


            const response = await fetch(
                `${API_BASE_URL}/api/v1/clients`,
                {
                    method: "GET",

                    headers: getHeaders(token),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to fetch clients"
                );
            }


            const data =
                await response.json();


            /*
                Expected:

                {
                    content: [...]
                }
            */

            return data.content || [];


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch clients"
            );
        }
    }
);


/* =========================================================
   GET CLIENT BY ID
========================================================= */

export const fetchClientById = createAsyncThunk(
    "clients/fetchClientById",

    async (id, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);


            const response = await fetch(
                `${API_BASE_URL}/api/v1/clients/${id}`,
                {
                    method: "GET",

                    headers: getHeaders(token),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to fetch client"
                );
            }


            return await response.json();


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to fetch client"
            );
        }
    }
);


/* =========================================================
   CREATE CLIENT
========================================================= */

export const createClient = createAsyncThunk(
    "clients/createClient",

    async (clientData, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);


            const requestBody = {

                name:
                    clientData.name?.trim() || "",

                industry:
                    clientData.industry?.trim() || "",

                countryCode:
                    clientData.countryCode || "",

                contactPerson:
                    clientData.contactPerson?.trim() || "",

                source:
                    clientData.source?.trim() || "",

                endClientIds:
                    Array.isArray(clientData.endClientIds)
                        ? clientData.endClientIds
                        : [],

                isActive:
                    clientData.isActive ?? true,

                status:
                    clientData.status || "Active",

                email:
                    clientData.email?.trim() || "",

                phone:
                    clientData.phone?.trim() || "",

                whatsapp:
                    clientData.whatsapp?.trim() || "",

                address:
                    clientData.address?.trim() || "",
            };


            console.log(
                "CREATE CLIENT REQUEST:",
                requestBody
            );


            const response = await fetch(
                `${API_BASE_URL}/api/v1/clients/create`,
                {
                    method: "POST",

                    headers: getHeaders(token),

                    body:
                        JSON.stringify(requestBody),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to create client"
                );
            }


            return await response.json();


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to create client"
            );
        }
    }
);


/* =========================================================
   UPDATE CLIENT
========================================================= */

export const updateClient = createAsyncThunk(
    "clients/updateClient",

    async (
        { id, ...clientData },
        { getState, rejectWithValue }
    ) => {

        try {

            const token =
                getAccessToken(getState);


            const requestBody = {

                name:
                    clientData.name?.trim() || "",

                industry:
                    clientData.industry?.trim() || "",

                countryCode:
                    clientData.countryCode || "",

                contactPerson:
                    clientData.contactPerson?.trim() || "",

                source:
                    clientData.source?.trim() || "",

                endClientIds:
                    Array.isArray(clientData.endClientIds)
                        ? clientData.endClientIds
                        : [],

                isActive:
                    clientData.isActive ?? true,

                status:
                    clientData.status || "Active",

                email:
                    clientData.email?.trim() || "",

                phone:
                    clientData.phone?.trim() || "",

                whatsapp:
                    clientData.whatsapp?.trim() || "",

                address:
                    clientData.address?.trim() || "",
            };


            console.log(
                "UPDATE CLIENT REQUEST:",
                requestBody
            );


            const response = await fetch(
                `${API_BASE_URL}/api/v1/clients/update/${id}`,
                {
                    method: "PUT",

                    headers: getHeaders(token),

                    body:
                        JSON.stringify(requestBody),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to update client"
                );
            }


            return await response.json();


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to update client"
            );
        }
    }
);


/* =========================================================
   DELETE CLIENT
========================================================= */

export const deleteClient = createAsyncThunk(
    "clients/deleteClient",

    async (id, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);


            const response = await fetch(
                `${API_BASE_URL}/api/v1/clients/delete/${id}`,
                {
                    method: "DELETE",

                    headers: getHeaders(token),
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to delete client"
                );
            }


            return id;


        } catch (error) {

            return rejectWithValue(
                error.message ||
                "Failed to delete client"
            );
        }
    }
);


/* =========================================================
   EXPORT CLIENTS
========================================================= */

export const exportClients = createAsyncThunk(
    "clients/exportClients",

    async (
        {
            fromDate = "",
            toDate = "",
            status = "",
        } = {},
        thunkAPI
    ) => {

        try {

            /* =====================================================
               GET STATE
            ===================================================== */

            const state =
                thunkAPI.getState();

            const token =
                state.auth?.accessToken;


            /* =====================================================
               BUILD REQUEST BODY
               
               IMPORTANT:
               - No filters       -> {}
               - Active           -> active: true
               - Inactive         -> active: false
               - All statuses     -> don't send active
            ===================================================== */

            const requestBody = {};


            /* =====================================================
               FROM DATE
            ===================================================== */

            if (fromDate) {

                requestBody.fromDate =
                    `${fromDate}T00:00:00`;

            }


            /* =====================================================
               TO DATE
            ===================================================== */

            if (toDate) {

                requestBody.toDate =
                    `${toDate}T23:59:59`;

            }


            /* =====================================================
               STATUS
            ===================================================== */

            if (status === "Active") {

                requestBody.active = true;

            }

            else if (status === "Inactive") {

                requestBody.active = false;

            }


            /* =====================================================
               DEBUG
            ===================================================== */

            console.log(
                "EXPORT CLIENT REQUEST BODY:",
                requestBody
            );


            /* =====================================================
               API CALL
            ===================================================== */

            const response = await fetch(

                `${API_BASE_URL}/api/v1/clients/export`,

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


            /* =====================================================
               API ERROR
            ===================================================== */

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(

                    errorText ||
                    "Failed to export clients"

                );

            }


            /* =====================================================
               GET EXCEL FILE
            ===================================================== */

            const blob =
                await response.blob();


            return {

                blob,

                requestBody,

            };


        } catch (error) {

            console.error(
                "Export clients thunk error:",
                error
            );


            return thunkAPI.rejectWithValue(

                error.message ||
                "Failed to export clients"

            );

        }

    }

);
/* =========================================================
   SLICE
========================================================= */

const clientSlice = createSlice({

    name: "clients",

    initialState: {

        items: [],

        countries: [],

        selectedClient: null,

        loading: false,

        countriesLoading: false,

        fetchingById: false,

        creating: false,

        updating: false,

        deleting: false,
        exporting: false,

        error: null,

        countriesError: null,
    },


    reducers: {

        clearClientError: (state) => {

            state.error = null;

        },

        clearSelectedClient: (state) => {

            state.selectedClient = null;

        },

    },


    extraReducers: (builder) => {


        /* =====================================================
           COUNTRIES
        ===================================================== */

        builder

            .addCase(
                fetchCountries.pending,
                (state) => {

                    state.countriesLoading = true;

                    state.countriesError = null;
                }
            )

            .addCase(
                fetchCountries.fulfilled,
                (state, action) => {

                    state.countriesLoading = false;

                    state.countries =
                        action.payload || [];
                }
            )

            .addCase(
                fetchCountries.rejected,
                (state, action) => {

                    state.countriesLoading = false;

                    state.countriesError =
                        action.payload ||
                        "Failed to fetch countries";
                }
            );


        /* =====================================================
           FETCH ALL
        ===================================================== */

        builder

            .addCase(
                fetchClients.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchClients.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.items =
                        action.payload || [];
                }
            )

            .addCase(
                fetchClients.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch clients";
                }
            );


        /* =====================================================
           FETCH BY ID
        ===================================================== */

        builder

            .addCase(
                fetchClientById.pending,
                (state) => {

                    state.fetchingById = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchClientById.fulfilled,
                (state, action) => {

                    state.fetchingById = false;

                    state.selectedClient =
                        action.payload;
                }
            )

            .addCase(
                fetchClientById.rejected,
                (state, action) => {

                    state.fetchingById = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch client";
                }
            );


        /* =====================================================
           CREATE
        ===================================================== */

        builder

            .addCase(
                createClient.pending,
                (state) => {

                    state.creating = true;

                    state.error = null;
                }
            )

            // .addCase(
            //     createClient.fulfilled,
            //     (state, action) => {

            //         state.creating = false;

            //         state.items.push(
            //             action.payload
            //         );
            //     }
            // )

            .addCase(
                    createClient.fulfilled,
                    (state, action) => {

                        state.creating = false;

                        // Add newly created client at the TOP
                        state.items.unshift(
                            action.payload
                        );
                    }
                )

            .addCase(
                createClient.rejected,
                (state, action) => {

                    state.creating = false;

                    state.error =
                        action.payload ||
                        "Failed to create client";
                }
            );


        /* =====================================================
           UPDATE
        ===================================================== */

        builder

            .addCase(
                updateClient.pending,
                (state) => {

                    state.updating = true;

                    state.error = null;
                }
            )

            .addCase(
                updateClient.fulfilled,
                (state, action) => {

                    state.updating = false;

                    const updatedClient =
                        action.payload;

                    const index =
                        state.items.findIndex(
                            (client) =>
                                client.id ===
                                updatedClient.id
                        );


                    if (index !== -1) {

                        state.items[index] =
                            updatedClient;
                    }

                }
            )

            .addCase(
                updateClient.rejected,
                (state, action) => {

                    state.updating = false;

                    state.error =
                        action.payload ||
                        "Failed to update client";
                }
            );


        /* =====================================================
           DELETE
        ===================================================== */

        builder

            .addCase(
                deleteClient.pending,
                (state) => {

                    state.deleting = true;

                    state.error = null;
                }
            )

            .addCase(
                deleteClient.fulfilled,
                (state, action) => {

                    state.deleting = false;

                    state.items =
                        state.items.filter(
                            (client) =>
                                client.id !==
                                action.payload
                        );
                }
            )

            .addCase(
                deleteClient.rejected,
                (state, action) => {

                    state.deleting = false;

                    state.error =
                        action.payload ||
                        "Failed to delete client";
                }
            );

            /* =====================================================
   EXPORT
===================================================== */

builder

    .addCase(
        exportClients.pending,
        (state) => {

            state.exporting = true;

            state.error = null;

        }
    )


    .addCase(
        exportClients.fulfilled,
        (state) => {

            state.exporting = false;

        }
    )


    .addCase(
        exportClients.rejected,
        (state, action) => {

            state.exporting = false;

            state.error =
                action.payload ||
                "Failed to export clients";

        }
    );

    },
});


export const {
    clearClientError,
    clearSelectedClient,
} = clientSlice.actions;


export default clientSlice.reducer;