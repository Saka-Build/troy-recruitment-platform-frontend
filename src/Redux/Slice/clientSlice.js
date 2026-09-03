import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetch from "../../services/fetchInstance";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "";

const getAccessToken = (getState) => {

    const state = getState();

    return state.auth?.accessToken;
};


const getHeaders = (token) => {

    return {
        "Content-Type": "application/json",

        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    };
};


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

export const fetchClients = createAsyncThunk( "clients/fetchClients", async ( { page = 0, size = 10, search = "", active, } = {}, { getState, rejectWithValue } ) => { try { const token = getAccessToken(getState); /* ===================================================== BUILD QUERY PARAMS ===================================================== */ const params = new URLSearchParams(); /* Backend uses ZERO-BASED page numbers. */ params.set( "page", page ); params.set( "size", size ); /* Only send search when user actually searched. */ if (search?.trim()) { params.set( "search", search.trim() ); } /* Active status: Active -> active=true Inactive -> active=false All -> don't send active */ if (active !== undefined) { params.set( "active", String(active) ); } const url = `${API_BASE_URL}/api/v1/clients?${params.toString()}`; console.log( "FETCH CLIENTS URL:", url ); /* ===================================================== API CALL ===================================================== */ const response = await fetch( url, { method: "GET", headers: getHeaders(token), } ); if (!response.ok) { const errorText = await response.text(); throw new Error( errorText || "Failed to fetch clients" ); } const data = await response.json(); /* Backend response: { content: [], totalPages: 5, totalElements: 42, size: 10, number: 0, first: true, last: false, ... } */ return { content: Array.isArray(data.content) ? data.content : [], totalPages: data.totalPages ?? 0, totalElements: data.totalElements ?? 0, pageSize: data.size ?? size, currentPage: data.number ?? page, numberOfElements: data.numberOfElements ?? data.content?.length ?? 0, first: data.first ?? true, last: data.last ?? true, empty: data.empty ?? data.content?.length === 0, }; } catch (error) { return rejectWithValue( error.message || "Failed to fetch clients" ); } } );


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

                name:clientData.name?.trim() || "",
                industry:clientData.industry?.trim() || "",
                countryCode:clientData.countryCode || "",
                contactPerson:clientData.contactPerson?.trim() || "",
                source:clientData.source?.trim() || "",
                endClientIds:Array.isArray(clientData.endClientIds)    ? clientData.endClientIds    : [],
                isActive:clientData.isActive ?? true,
                status:clientData.status || "Active",
                email:clientData.email?.trim() || "",
                phone:clientData.phone?.trim() || "",
                whatsapp:clientData.whatsapp?.trim() || "",
                address:clientData.address?.trim() || "",
            };

            const response = await fetch(
                `${API_BASE_URL}/api/v1/clients/update/${id}`,
                {
                    method: "PUT",
                    headers: getHeaders(token),
                    body:JSON.stringify(requestBody),
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

            const state =
                thunkAPI.getState();

            const token =
                state.auth?.accessToken;

            const requestBody = {};
            if (fromDate) {

                requestBody.fromDate =
                    `${fromDate}T00:00:00`;

            }

            if (toDate) {

                requestBody.toDate =
                    `${toDate}T23:59:59`;

            }

            if (status === "Active") {

                requestBody.active = true;

            }

            else if (status === "Inactive") {

                requestBody.active = false;

            }

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

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(

                    errorText ||
                    "Failed to export clients"

                );

            }

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

export const fetchClientHeaderFilters = createAsyncThunk(
    "clients/fetchClientHeaderFilters",

    async (_, { getState, rejectWithValue }) => {

        try {

            const token =
                getAccessToken(getState);

            const url =
                `${API_BASE_URL}/api/v1/clients/clientheader/clientfilters`;

            const response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        headers:
                            getHeaders(token),
                    }
                );

            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "CLIENT HEADER FILTER API ERROR:",
                    errorText
                );


                throw new Error(
                    errorText ||
                    `Request failed with status ${response.status}`
                );

            }

            const data =
                await response.json();

            if (
                !data ||
                typeof data !== "object"
            ) {

                throw new Error(
                    "Invalid client header filter response"
                );

            }

            const result = {

                totalClients:
                    Number(
                        data.totalClients ?? 0
                    ),

                totalActiveClients:
                    Number(
                        data.totalActiveClients ?? 0
                    ),

                totalInActiveClients:
                    Number(
                        data.totalInActiveClients ?? 0
                    ),

            };

            return result;


        } catch (error) {

            return rejectWithValue(
                error?.message ||
                "Failed to fetch client header filters"
            );

        }

    }
);

const clientSlice = createSlice({

    name: "clients",

initialState: { /* ===================================================== CURRENT BACKEND PAGE ONLY ===================================================== */ items: [], /* ===================================================== PAGINATION METADATA FROM BACKEND ===================================================== */ totalPages: 0, totalElements: 0, pageSize: 10, currentPage: 0, numberOfElements: 0, first: true, last: true, empty: true, /* ===================================================== COUNTRIES ===================================================== */ countries: [], selectedClient: null, /* ===================================================== LOADING STATES ===================================================== */ loading: false, countriesLoading: false, fetchingById: false, creating: false, updating: false, deleting: false, exporting: false, /* ===================================================== ERRORS ===================================================== */ error: null, countriesError: null,totalClients: 0,

totalActiveClients: 0,

totalInActiveClients: 0,

clientHeaderLoading: false,

clientHeaderError: null, },


    reducers: {

        clearClientError: (state) => {

            state.error = null;

        },

        clearSelectedClient: (state) => {

            state.selectedClient = null;

        },

    },


    extraReducers: (builder) => {

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


 builder .addCase( fetchClients.pending, (state) => { state.loading = true; state.error = null; } ) .addCase( fetchClients.fulfilled, (state, action) => { state.loading = false; /* Replace current page completely. No append. No filter. No slice. */ state.items = action.payload.content || []; /* Store backend pagination metadata. */ state.totalPages = action.payload.totalPages ?? 0; state.totalElements = action.payload.totalElements ?? 0; state.pageSize = action.payload.pageSize ?? 10; state.currentPage = action.payload.currentPage ?? 0; state.numberOfElements = action.payload.numberOfElements ?? state.items.length; state.first = action.payload.first ?? true; state.last = action.payload.last ?? true; state.empty = action.payload.empty ?? state.items.length === 0; } ) .addCase( fetchClients.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Failed to fetch clients"; } )


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


        builder

            .addCase(
                createClient.pending,
                (state) => {

                    state.creating = true;

                    state.error = null;
                }
            )
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
    )

builder

    .addCase(
        fetchClientHeaderFilters.pending,
        (state) => {

            console.log(
                "REDUX: fetchClientHeaderFilters PENDING"
            );

            state.clientHeaderLoading = true;

            state.clientHeaderError = null;

        }
    )


    .addCase(
        fetchClientHeaderFilters.fulfilled,
        (state, action) => {

            console.log(
                "REDUX: fetchClientHeaderFilters FULFILLED"
            );

            console.log(
                "REDUX PAYLOAD:",
                action.payload
            );


            state.clientHeaderLoading = false;

            state.clientHeaderError = null;


            state.totalClients =
                action.payload?.totalClients ?? 0;


            state.totalActiveClients =
                action.payload?.totalActiveClients ?? 0;


            state.totalInActiveClients =
                action.payload?.totalInActiveClients ?? 0;


            console.log(
                "REDUX UPDATED COUNTS:",
                {
                    totalClients:
                        state.totalClients,

                    totalActiveClients:
                        state.totalActiveClients,

                    totalInActiveClients:
                        state.totalInActiveClients,
                }
            );

        }
    )


    .addCase(
        fetchClientHeaderFilters.rejected,
        (state, action) => {

            console.error(
                "REDUX: fetchClientHeaderFilters REJECTED"
            );

            console.error(
                "REDUX ERROR:",
                action.payload
            );


            state.clientHeaderLoading = false;


            state.clientHeaderError =
                action.payload ||
                "Failed to fetch client header filters";

        }
    );

    },
});


export const {
    clearClientError,
    clearSelectedClient,
} = clientSlice.actions;


export default clientSlice.reducer;