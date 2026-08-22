import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import "./Clients.css";

import Add_Edit_clients
    from "./Add_Edit_clients";

import DeleteConfirmationModal
    from "./DeleteConfirmationModal";

import EndClients
    from "./EndClients";

import {
    fetchClients,
    fetchCountries,
    createClient,
    updateClient,
    deleteClient,
    exportClients,
    clearClientError,
} from "../../Redux/Slice/clientSlice";

import {
    fetchEndClients,
    fetchActiveEndClients,
} from "../../Redux/Slice/endClientSlice";

import {
    FontAwesomeIcon
} from "@fortawesome/react-fontawesome";

import {
    faMicrosoft,
    faGoogle,
    faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";


function Clients() {

    const dispatch =
        useDispatch();


    /* =========================================================
       CLIENT REDUX STATE
    ========================================================= */

    const {
        items: clients = [],

        countries = [],

        loading,

        countriesLoading,

        creating,

        updating,

        deleting,
        exporting,

        error,

        countriesError,

    } = useSelector(
        (state) =>
            state.clients
    );


    /* =========================================================
       END CLIENT REDUX STATE
    ========================================================= */

    // const {
    //     items: endClients = [],

    //     loading: endClientsLoading,

    // } = useSelector(
    //     (state) =>
    //         state.endClients
    // );

    const {
    activeItems: activeEndClients = [],
    activeLoading: activeEndClientsLoading,
} = useSelector(
    (state) => state.endClients
);


    /* =========================================================
       LOCAL STATE
    ========================================================= */

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("Active");


    const [
        showModal,
        setShowModal,
    ] = useState(false);


    const [
        editingClient,
        setEditingClient,
    ] = useState(null);


    const [
        showDeleteModal,
        setShowDeleteModal,
    ] = useState(false);


    const [
        clientToDelete,
        setClientToDelete,
    ] = useState(null);


    const [
        showEndClients,
        setShowEndClients,
    ] = useState(false);

    /* =========================================================
    EXPORT FILTER STATE
    ========================================================= */

    const [
        showExportModal,
        setShowExportModal,
    ] = useState(false);


    const [
        exportFromDate,
        setExportFromDate,
    ] = useState("");


    const [
        exportToDate,
        setExportToDate,
    ] = useState("");


    const [
        exportStatus,
        setExportStatus,
    ] = useState("");

    /* =========================================================
       FETCH CLIENTS + COUNTRIES + END CLIENTS
    ========================================================= */

    // useEffect(() => {

    //     dispatch(
    //         fetchClients()
    //     );


    //     dispatch(
    //         fetchCountries()
    //     );


    //     dispatch(
    //         fetchEndClients()
    //     );

    // }, [dispatch]);

    useEffect(() => {

    dispatch(
        fetchClients()
    );

    dispatch(
        fetchCountries()
    );

    dispatch(
        fetchActiveEndClients()
    );

}, [dispatch]);


    /* =========================================================
       OPEN ADD CLIENT MODAL
    ========================================================= */

    const handleAddClient = () => {
        dispatch(clearClientError());
        setEditingClient(null);

        setShowModal(true);

    };


    /* =========================================================
       OPEN EDIT CLIENT MODAL
    ========================================================= */

    const handleEditClient = (
        client
    ) => {
        dispatch(clearClientError());
        setEditingClient(client);

        setShowModal(true);

    };


    /* =========================================================
       CLOSE CLIENT MODAL
    ========================================================= */

    const handleCloseModal = () => {

        setShowModal(false);

        setEditingClient(null);
        dispatch(clearClientError());
    };


    /* =========================================================
       SAVE CLIENT
    ========================================================= */

    const handleSaveClient = async (
        clientData
    ) => {

        try {

            if (editingClient) {

                await dispatch(

                    updateClient({

                        id:
                            editingClient.id,

                        ...clientData,

                    })

                ).unwrap();

            } else {

                await dispatch(

                    createClient(
                        clientData
                    )

                ).unwrap();

            }


            /*
                Close modal only after
                successful API response.
            */

            handleCloseModal();


        } catch (error) {

            console.error(
                "Client save error:",
                error
            );

        }

    };


    /* =========================================================
       DELETE CLIENT
    ========================================================= */

    const handleDeleteClick = (
        client
    ) => {

        setClientToDelete(client);

        setShowDeleteModal(true);

    };


    /* =========================================================
       CONFIRM DELETE
    ========================================================= */

    const handleConfirmDelete =
        async () => {

            if (!clientToDelete) {

                return;

            }


            try {

                await dispatch(

                    deleteClient(
                        clientToDelete.id
                    )

                ).unwrap();


                setShowDeleteModal(
                    false
                );


                setClientToDelete(
                    null
                );


            } catch (error) {

                console.error(
                    "Client delete error:",
                    error
                );

            }

        };


    /* =========================================================
       CANCEL DELETE
    ========================================================= */

    const handleCancelDelete =
        () => {

            setShowDeleteModal(
                false
            );


            setClientToDelete(
                null
            );

        };


    /* =========================================================
       FILTER CLIENTS
    ========================================================= */

    // const filteredClients =
    //     useMemo(() => {

    //         return clients.filter(
    //             (client) => {

    //                 const search =
    //                     searchTerm
    //                         .toLowerCase()
    //                         .trim();


    //                 const matchesSearch =

    //                     !search ||

    //                     client.name
    //                         ?.toLowerCase()
    //                         .includes(
    //                             search
    //                         ) ||

    //                     client.contactPerson
    //                         ?.toLowerCase()
    //                         .includes(
    //                             search
    //                         ) ||

    //                     client.countryName
    //                         ?.toLowerCase()
    //                         .includes(
    //                             search
    //                         ) ||

    //                     client.email
    //                         ?.toLowerCase()
    //                         .includes(
    //                             search
    //                         );


    //                 const matchesStatus =

    //                     statusFilter ===
    //                         "All statuses" ||

    //                     client.status ===
    //                         statusFilter;


    //                 return (
    //                     matchesSearch &&
    //                     matchesStatus
    //                 );

    //             }
    //         );

    //     }, [
    //         clients,
    //         searchTerm,
    //         statusFilter,
    //     ]);

    /* =========================================================
   FILTER CLIENTS
   NEWEST CLIENTS SHOULD ALWAYS STAY AT THE BOTTOM
========================================================= */

const filteredClients =
    useMemo(() => {

        return clients
            .filter((client) => {

                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();


                const matchesSearch =

                    !search ||

                    client.name
                        ?.toLowerCase()
                        .includes(search) ||

                    client.contactPerson
                        ?.toLowerCase()
                        .includes(search) ||

                    client.countryName
                        ?.toLowerCase()
                        .includes(search) ||

                    client.email
                        ?.toLowerCase()
                        .includes(search);


                const matchesStatus =

                    statusFilter ===
                        "All statuses" ||

                    client.status ===
                        statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            })

            .sort((a, b) => {

                /*
                 * Sort by Created At ASCENDING.
                 *
                 * Oldest client  -> TOP
                 * Newest client  -> BOTTOM
                 */

                const dateA =
                    a.createdAt
                        ? new Date(a.createdAt).getTime()
                        : 0;

                const dateB =
                    b.createdAt
                        ? new Date(b.createdAt).getTime()
                        : 0;


                return dateA - dateB;

            });

    }, [
        clients,
        searchTerm,
        statusFilter,
    ]);


    /* =========================================================
       STATISTICS
    ========================================================= */

    const activeCount =
        clients.filter(
            (client) =>
                client.status ===
                "Active"
        ).length;


    const inactiveCount =
        clients.filter(
            (client) =>
                client.status ===
                "Inactive"
        ).length;


    /* =========================================================
       EXPORT CSV
    ========================================================= */

/* =========================================================
   OPEN EXPORT MODAL
========================================================= */

const handleExportCSV = () => {

    setExportFromDate("");

    setExportToDate("");

    setExportStatus("");

    setShowExportModal(true);

};


/* =========================================================
   CLOSE EXPORT MODAL
========================================================= */

const handleCloseExportModal = () => {

    if (exporting) {
        return;
    }

    setShowExportModal(false);

};


/* =========================================================
   EXPORT CLIENTS
========================================================= */

const handleConfirmExport = async () => {

    try {

        /* =====================================================
           DATE VALIDATION
        ===================================================== */

        if (
            exportFromDate &&
            exportToDate &&
            exportFromDate >
                exportToDate
        ) {

            alert(
                "From date cannot be later than To date."
            );

            return;

        }


        /* =====================================================
           CALL EXPORT API
        ===================================================== */

        const result =
            await dispatch(

                exportClients({

                    fromDate:
                        exportFromDate,

                    toDate:
                        exportToDate,

                    status:
                        exportStatus,

                })

            ).unwrap();


        /* =====================================================
           DOWNLOAD EXCEL FILE
        ===================================================== */

        const blob =
            result.blob;


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        /*
            API response is Excel binary,
            so use .xls instead of .csv.
        */

        const datePart =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );


        link.download =
            `clients_${datePart}.xls`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        /* =====================================================
           CLOSE MODAL
        ===================================================== */

        setShowExportModal(false);


    } catch (error) {

        console.error(
            "Client export error:",
            error
        );

        alert(
            error ||
            "Failed to export clients."
        );

    }

};


    /* =========================================================
       END CLIENT PAGE
    ========================================================= */

    if (showEndClients) {

        return (

            <EndClients

                onBack={() =>
                    setShowEndClients(
                        false
                    )
                }

            />

        );

    }


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="clients-page">

            <div className="clients-content">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="clients-header">

                    <div>

                        <h1>
                            Clients
                        </h1>

                        <p>

                            {clients.length} client{" "}

                            {clients.length === 1
                                ? "company"
                                : "companies"}

                        </p>

                    </div>


                    <div className="clients-header-actions">

                        <button
    type="button"
    className="export-btn"
    onClick={handleExportCSV}
    disabled={
        !clients.length ||
        exporting
    }
>

    {exporting
        ? "Exporting..."
        : "↓ Export CSV"}

</button>


                        <button
                            type="button"
                            className="view-end-client-btn"
                            onClick={() =>
                                setShowEndClients(
                                    true
                                )
                            }
                        >

                            View End Clients

                        </button>


                        <button
                            type="button"
                            className="add-client-btn"
                            onClick={
                                handleAddClient
                            }
                            disabled={
                                creating
                            }
                        >

                            {creating
                                ? "Adding..."
                                : "+ Add client"}

                        </button>

                    </div>

                </div>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="client-stats">


                    <div className="client-stat-card">

                        <div className="client-stat-number active-number">

                            {activeCount}

                        </div>

                        <div className="client-stat-label">

                            Active

                        </div>

                    </div>


                    <div className="client-stat-card">

                        <div className="client-stat-number">

                            {inactiveCount}

                        </div>

                        <div className="client-stat-label">

                            Inactive

                        </div>

                    </div>


                </div>


                {/* =================================================
                    SEARCH + FILTER
                ================================================= */}

                <div className="clients-filter-bar">


                    <div className="client-search-wrapper">

                        <input
                            type="text"
                            value={
                                searchTerm
                            }
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            placeholder="Search company or contact person, country..."
                        />

                    </div>


                    <select
                        value={
                            statusFilter
                        }
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="status-filter"
                    >

                        <option value="All statuses">
                            All statuses
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>

                    </select>


                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="clients-table-wrapper">

                    <table className="clients-table">


                        <thead>

                            <tr>

                                <th>
                                    CLIENT
                                </th>

                                <th>
                                    CONTACT PERSON
                                </th>

                                <th>
                                    THROUGH · BDM
                                </th>

                                <th>
                                    END CLIENT
                                </th>

                                <th>
                                    COUNTRY
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="no-client-data"
                                    >

                                        Loading clients...

                                    </td>

                                </tr>

                            ) : filteredClients.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="no-client-data"
                                    >

                                        No clients found

                                    </td>

                                </tr>

                            ) : (

                                filteredClients.map(
                                    (client) => (

                                        <tr
                                            key={
                                                client.id
                                            }
                                        >


                                            {/* =================================
                                                CLIENT
                                            ================================= */}

                                            <td>

                                                <div className="client-company-name">

                                                    {
                                                        client.name
                                                    }

                                                </div>

                                                <div className="client-industry">

                                                    {
                                                        client.industry ||
                                                        "—"
                                                    }

                                                </div>

                                            </td>


                                            {/* =================================
                                                CONTACT PERSON
                                            ================================= */}

                                            <td>

                                                <div className="client-contact-name">

                                                    {
                                                        client.contactPerson ||
                                                        "—"
                                                    }

                                                </div>


                                                <div className="client-email">

                                                    {
                                                        client.email ||
                                                        "—"
                                                    }

                                                </div>


                                                <div className="contact-icons">


                                                    {/* OUTLOOK */}

                                                    <button
                                                        type="button"
                                                        className="contact-icon outlook-icon"
                                                        title="Outlook"
                                                        onClick={() => {

                                                            if (
                                                                client.email
                                                            ) {

                                                                window.location.href =
                                                                    `mailto:${client.email}`;

                                                            }

                                                        }}
                                                    >

                                                        <FontAwesomeIcon
                                                            icon={
                                                                faMicrosoft
                                                            }
                                                        />

                                                    </button>


                                                    {/* GMAIL */}

                                                    <button
                                                        type="button"
                                                        className="contact-icon gmail-icon"
                                                        title="Gmail"
                                                        onClick={() => {

                                                            if (
                                                                client.email
                                                            ) {

                                                                window.open(

                                                                    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                                                        client.email
                                                                    )}`,

                                                                    "_blank"

                                                                );

                                                            }

                                                        }}
                                                    >

                                                        <FontAwesomeIcon
                                                            icon={
                                                                faGoogle
                                                            }
                                                        />

                                                    </button>


                                                    {/* WHATSAPP */}

                                                    <button
                                                        type="button"
                                                        className="contact-icon whatsapp-icon"
                                                        title="WhatsApp"
                                                        onClick={() => {

                                                            if (
                                                                client.phone
                                                            ) {

                                                                const phoneNumber =
                                                                    client.phone.replace(
                                                                        /\D/g,
                                                                        ""
                                                                    );


                                                                if (
                                                                    phoneNumber
                                                                ) {

                                                                    window.open(

                                                                        `https://wa.me/${phoneNumber}`,

                                                                        "_blank"

                                                                    );

                                                                }

                                                            }

                                                        }}
                                                    >

                                                        <FontAwesomeIcon
                                                            icon={
                                                                faWhatsapp
                                                            }
                                                        />

                                                    </button>


                                                </div>

                                            </td>


                                            {/* =================================
                                                SOURCE / BDM
                                            ================================= */}

                                            <td>

                                                <span className="table-dash">

                                                    {
                                                        client.source ||
                                                        "—"
                                                    }

                                                </span>

                                            </td>

                                           {/* =================================
                                                END CLIENT
                                            ================================= */}

                                            <td>
                                                {client.endClients?.length ? (
                                                    <div className="client-end-client-list">
                                                        {client.endClients.map((endClient, index) => (
                                                            <span key={endClient.id}>
                                                                <span className="end-client-item">
                                                                    {endClient.name}
                                                                </span>
                                                                {index < client.endClients.length - 1 && (
                                                                    <span className="end-client-comma">,</span>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="table-end-client-na">
                                                        NA
                                                    </span>
                                                )}
                                            </td>


                                            {/* =================================
                                                COUNTRY
                                            ================================= */}

                                            <td>

                                                <span className="country-text">

                                                    {
                                                        client.countryName ||
                                                        client.countryCode ||
                                                        "—"
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                STATUS
                                            ================================= */}

                                            <td>

                                                <span
                                                    className={`client-status ${client.status
                                                        ?.toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )}`}
                                                >

                                                    {
                                                        client.status
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                ACTIONS
                                            ================================= */}

                                            <td>

                                                <div className="client-actions">


                                                    <button
                                                        type="button"
                                                        className="edit-action"
                                                        onClick={() =>
                                                            handleEditClient(
                                                                client
                                                            )
                                                        }
                                                        disabled={
                                                            updating ||
                                                            deleting
                                                        }
                                                    >

                                                        Edit

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="delete-action"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                client
                                                            )
                                                        }
                                                        disabled={
                                                            deleting
                                                        }
                                                    >

                                                        Delete

                                                    </button>


                                                </div>

                                            </td>


                                        </tr>

                                    )
                                )

                            )}


                        </tbody>

                    </table>

                </div>

            </div>


            {/* =====================================================
                ADD / EDIT CLIENT MODAL
            ===================================================== */}

            {showModal && (

                <Add_Edit_clients

    client={
        editingClient
    }

    endClients={
        activeEndClients
    }

    countries={
        countries
    }

    countriesLoading={
        countriesLoading
    }

    endClientsLoading={
        activeEndClientsLoading
    }

    onClose={
        handleCloseModal
    }

    onSave={
        handleSaveClient
    }

    isSubmitting={
        creating ||
        updating
    }

    error={
        error
    }

    countriesError={
        countriesError
    }

/>
            )}


            {/* =====================================================
                DELETE CONFIRMATION MODAL
            ===================================================== */}

            {showDeleteModal && (

                <DeleteConfirmationModal

                    clientName={
                        clientToDelete?.name ||
                        ""
                    }

                    onConfirm={
                        handleConfirmDelete
                    }

                    onCancel={
                        handleCancelDelete
                    }

                />

            )}

            {/* =====================================================
    EXPORT CLIENTS MODAL
===================================================== */}

{showExportModal && (

    <div
        className="export-modal-overlay"
        onMouseDown={(e) => {

            if (
                e.target ===
                    e.currentTarget &&
                !exporting
            ) {

                handleCloseExportModal();

            }

        }}
    >

        <div
            className="export-modal"
            onMouseDown={(e) =>
                e.stopPropagation()
            }
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="export-modal-header">

                <div>

                    <h2>
                        Export Clients
                    </h2>

                    <p>
                        Choose optional filters
                        for your export
                    </p>

                </div>


                <button
                    type="button"
                    className="export-modal-close"
                    onClick={
                        handleCloseExportModal
                    }
                    disabled={exporting}
                >

                    ×

                </button>

            </div>


            {/* =================================================
                BODY
            ================================================= */}

            <div className="export-modal-body">


                {/* =================================================
                    DATE RANGE
                ================================================= */}

                <div className="export-date-row">


                    {/* FROM DATE */}

                    <div className="export-form-group">

                        <label>
                            From date
                        </label>

                        <input
                            type="date"
                            value={
                                exportFromDate
                            }
                            onChange={(e) =>
                                setExportFromDate(
                                    e.target.value
                                )
                            }
                            disabled={
                                exporting
                            }
                        />

                    </div>


                    {/* TO DATE */}

                    <div className="export-form-group">

                        <label>
                            To date
                        </label>

                        <input
                            type="date"
                            value={
                                exportToDate
                            }
                            onChange={(e) =>
                                setExportToDate(
                                    e.target.value
                                )
                            }
                            disabled={
                                exporting
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="export-form-group">

                    <label>
                        Status
                    </label>


                    <select
                        value={
                            exportStatus
                        }
                        onChange={(e) =>
                            setExportStatus(
                                e.target.value
                            )
                        }
                        disabled={
                            exporting
                        }
                    >

                        <option value="">
                            All statuses
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>

                    </select>

                </div>


                {/* =================================================
                    FILTER INFO
                ================================================= */}

                <div className="export-info">

                    <span className="export-info-icon">
                        i
                    </span>

                    <span>
                        Leave all filters empty
                        to export all clients.
                    </span>

                </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="export-modal-footer">


                <button
                    type="button"
                    className="export-cancel-btn"
                    onClick={
                        handleCloseExportModal
                    }
                    disabled={
                        exporting
                    }
                >

                    Cancel

                </button>


                <button
                    type="button"
                    className="export-submit-btn"
                    onClick={
                        handleConfirmExport
                    }
                    disabled={
                        exporting
                    }
                >

                    {exporting
                        ? "Exporting..."
                        : "Export Excel"}

                </button>


            </div>


        </div>

    </div>

)}


        </div>

    );

}


export default Clients;