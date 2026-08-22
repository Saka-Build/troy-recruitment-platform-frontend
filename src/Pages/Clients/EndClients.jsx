import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import "./EndClients.css";

import AddEndClientModal from "./AddEndClientModal";

import {
    fetchEndClients,
    createEndClient,
    updateEndClient,
} from "../../Redux/Slice/endClientSlice";


function EndClients({ onBack }) {

    const dispatch = useDispatch();


    /* =========================================================
       REDUX STATE
    ========================================================= */

    const {
        items: endClients = [],
        loading,
        creating,
        updating,
        error,
    } = useSelector(
        (state) => state.endClients
    );


    /* =========================================================
       LOCAL STATE
    ========================================================= */

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("Active");

    const [showModal, setShowModal] =
        useState(false);

    const [editingEndClient, setEditingEndClient] =
        useState(null);


    /* =========================================================
       PAGINATION
    ========================================================= */

    const [currentPage, setCurrentPage] =
        useState(1);

    const ITEMS_PER_PAGE = 10;


    /* =========================================================
       FETCH END CLIENTS
    ========================================================= */

    useEffect(() => {

        dispatch(
            fetchEndClients()
        );

    }, [dispatch]);


    /* =========================================================
       OPEN ADD MODAL
    ========================================================= */

    const handleAddEndClient = () => {

        setEditingEndClient(null);

        setShowModal(true);

    };


    /* =========================================================
       OPEN EDIT MODAL
    ========================================================= */

    const handleEditEndClient = (
        endClient
    ) => {

        setEditingEndClient(
            endClient
        );

        setShowModal(true);

    };


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    const handleCloseModal = () => {

        setShowModal(false);

        setEditingEndClient(null);

    };


    /* =========================================================
       SAVE END CLIENT
    ========================================================= */

    const handleSaveEndClient = async (
        endClientData
    ) => {

        try {

            if (editingEndClient) {

                await dispatch(

                    updateEndClient({

                        id:
                            editingEndClient.id,

                        name:
                            endClientData.name,

                        status:
                            endClientData.status,

                    })

                ).unwrap();

            } else {

                await dispatch(

                    createEndClient({

                        name:
                            endClientData.name,

                        status:
                            endClientData.status,

                    })

                ).unwrap();

            }


            handleCloseModal();

        } catch (error) {

            console.error(
                "End client save error:",
                error
            );

        }

    };


    /* =========================================================
       FILTER END CLIENTS
    ========================================================= */

    const filteredEndClients =
        useMemo(() => {

            return endClients.filter(
                (client) => {

                    const search =
                        searchTerm
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        !search ||
                        client.name
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

                }
            );

        }, [
            endClients,
            searchTerm,
            statusFilter,
        ]);


    /* =========================================================
       PAGINATION CALCULATIONS
    ========================================================= */

    const totalPages =
        Math.ceil(
            filteredEndClients.length /
            ITEMS_PER_PAGE
        );


    /*
        Make sure current page is always
        within the available page range.
    */

    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {

            setCurrentPage(
                totalPages
            );

        }

        if (
            totalPages === 0 &&
            currentPage !== 1
        ) {

            setCurrentPage(1);

        }

    }, [
        totalPages,
        currentPage,
    ]);


    /* =========================================================
       CURRENT PAGE DATA
    ========================================================= */

    const paginatedEndClients =
        useMemo(() => {

            const startIndex =
                (
                    currentPage - 1
                ) *
                ITEMS_PER_PAGE;


            const endIndex =
                startIndex +
                ITEMS_PER_PAGE;


            return filteredEndClients.slice(
                startIndex,
                endIndex
            );

        }, [
            filteredEndClients,
            currentPage,
        ]);


    /* =========================================================
       PAGE NUMBER LIST
    ========================================================= */

    const pageNumbers =
        useMemo(() => {

            return Array.from(
                {
                    length: totalPages,
                },
                (_, index) =>
                    index + 1
            );

        }, [
            totalPages,
        ]);


    /* =========================================================
       SEARCH CHANGE
       RESET TO PAGE 1
    ========================================================= */

    const handleSearchChange = (e) => {

        setSearchTerm(
            e.target.value
        );

        setCurrentPage(1);

    };


    /* =========================================================
       STATUS CHANGE
       RESET TO PAGE 1
    ========================================================= */

    const handleStatusChange = (e) => {

        setStatusFilter(
            e.target.value
        );

        setCurrentPage(1);

    };


    /* =========================================================
       PREVIOUS PAGE
    ========================================================= */

    const handlePreviousPage = () => {

        setCurrentPage(
            (prev) =>
                Math.max(
                    prev - 1,
                    1
                )
        );

    };


    /* =========================================================
       NEXT PAGE
    ========================================================= */

    const handleNextPage = () => {

        setCurrentPage(
            (prev) =>
                Math.min(
                    prev + 1,
                    totalPages
                )
        );

    };


    /* =========================================================
       GO TO PAGE
    ========================================================= */

    const handlePageChange = (
        page
    ) => {

        setCurrentPage(page);

    };


    /* =========================================================
       STATISTICS
    ========================================================= */

    const activeCount =
        endClients.filter(
            (client) =>
                client.status ===
                "Active"
        ).length;


    const inactiveCount =
        endClients.filter(
            (client) =>
                client.status ===
                "Inactive"
        ).length;


    /* =========================================================
       PAGINATION DISPLAY RANGE
    ========================================================= */

    const firstRecord =
        filteredEndClients.length === 0
            ? 0
            : (
                (
                    currentPage - 1
                ) *
                ITEMS_PER_PAGE
            ) + 1;


    const lastRecord =
        Math.min(
            currentPage *
                ITEMS_PER_PAGE,
            filteredEndClients.length
        );


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="end-clients-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="end-clients-header">

                <div className="end-clients-title-section">

                    <button
                        type="button"
                        className="back-to-clients-btn"
                        onClick={onBack}
                    >
                        Back to Clients
                    </button>


                    <h1>
                        End Clients
                    </h1>


                    <p>

                        {endClients.length} end client{" "}

                        {endClients.length === 1
                            ? "company"
                            : "companies"}

                    </p>

                </div>


                <div className="end-clients-header-actions">

                    <button
                        type="button"
                        className="add-end-client-btn"
                        onClick={
                            handleAddEndClient
                        }
                        disabled={
                            creating
                        }
                    >

                        {creating
                            ? "Adding..."
                            : "+ Add End Client"}

                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="end-client-api-error">

                    {error}

                </div>

            )}


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="end-client-stats">


                <div className="end-client-stat-card">

                    <div className="end-client-stat-number active-number">

                        {activeCount}

                    </div>


                    <div className="end-client-stat-label">

                        Active

                    </div>

                </div>


                <div className="end-client-stat-card">

                    <div className="end-client-stat-number">

                        {inactiveCount}

                    </div>


                    <div className="end-client-stat-label">

                        Inactive

                    </div>

                </div>

            </div>


            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <div className="end-clients-filter-bar">


                <input
                    type="text"
                    className="end-client-search"
                    value={
                        searchTerm
                    }
                    onChange={
                        handleSearchChange
                    }
                    placeholder="Search end client..."
                />


                <select
                    value={
                        statusFilter
                    }
                    onChange={
                        handleStatusChange
                    }
                    className="end-client-status-filter"
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
                END CLIENT TABLE
            ================================================= */}

            <div className="end-clients-table-wrapper">


                <table className="end-clients-table">


                    <thead>

                        <tr>

                            <th>
                                END CLIENT
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
                                    colSpan="3"
                                    className="no-end-client-data"
                                >
                                    Loading end clients...
                                </td>

                            </tr>

                        ) : paginatedEndClients.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="no-end-client-data"
                                >
                                    No end clients found
                                </td>

                            </tr>

                        ) : (

                            paginatedEndClients.map(
                                (client) => (

                                    <tr
                                        key={
                                            client.id
                                        }
                                    >


                                        {/* NAME */}

                                        <td>

                                            <div className="end-client-name">

                                                {
                                                    client.name
                                                }

                                            </div>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`end-client-status ${
                                                    client.status
                                                        ?.toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )
                                                }`}
                                            >

                                                {
                                                    client.status
                                                }

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="end-client-actions">


                                                <button
                                                    type="button"
                                                    className="end-client-edit-action"
                                                    onClick={() =>
                                                        handleEditEndClient(
                                                            client
                                                        )
                                                    }
                                                >

                                                    Edit

                                                </button>


                                                <button
                                                    type="button"
                                                    className="end-client-delete-action"
                                                    onClick={() =>
                                                        alert(
                                                            "Delete API is not available yet."
                                                        )
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


            {/* =================================================
                PAGINATION
            ================================================= */}

            {!loading &&
                filteredEndClients.length > 0 &&
                totalPages > 1 && (

                <div className="end-clients-pagination">


                    {/* =========================================
                        RECORD INFO
                    ========================================= */}

                    <div className="end-client-pagination-info">

                        Showing{" "}

                        <strong>
                            {firstRecord}
                        </strong>

                        {" "}to{" "}

                        <strong>
                            {lastRecord}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {filteredEndClients.length}
                        </strong>

                        {" "}end clients

                    </div>


                    {/* =========================================
                        PAGINATION CONTROLS
                    ========================================= */}

                    <div className="end-client-pagination-controls">


                        {/* PREVIOUS */}

                        <button
                            type="button"
                            className="pagination-arrow"
                            onClick={
                                handlePreviousPage
                            }
                            disabled={
                                currentPage === 1
                            }
                        >

                            ‹

                        </button>


                        {/* PAGE NUMBERS */}

                        {pageNumbers.map(
                            (page) => (

                                <button
                                    key={page}
                                    type="button"
                                    className={`pagination-page ${
                                        currentPage === page
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }
                                >

                                    {page}

                                </button>

                            )
                        )}


                        {/* NEXT */}

                        <button
                            type="button"
                            className="pagination-arrow"
                            onClick={
                                handleNextPage
                            }
                            disabled={
                                currentPage ===
                                totalPages
                            }
                        >

                            ›

                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (

                <AddEndClientModal

                    client={
                        editingEndClient
                    }

                    onClose={
                        handleCloseModal
                    }

                    onSave={
                        handleSaveEndClient
                    }

                    isSubmitting={
                        creating ||
                        updating
                    }

                />

            )}

        </div>

    );

}


export default EndClients;