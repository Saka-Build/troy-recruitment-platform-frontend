import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import "./candidate.css";

import CandidateModal from "../Candidate/CandidateModal";

import {
    getAllCandidates,
    getAllEmployees,
    addCandidate,
    updateCandidate,
    deleteCandidate,
} from "../../Redux/Slice/candidateSlice";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
const Candidates = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | REDUX
    |--------------------------------------------------------------------------
    */
    const {
        candidates = [],
        employees = [],
        loading,
        employeesLoading,
        adding,
        error,
        employeeError,
    } = useSelector(
        (state) => state.candidate
    );


    /*
    |--------------------------------------------------------------------------
    | LOCAL STATE
    |--------------------------------------------------------------------------
    */
    const [searchTerm, setSearchTerm] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [modalMode, setModalMode] =
        useState("add");

    const [selectedCandidate, setSelectedCandidate] =
        useState(null);

    const [statusFilter, setStatusFilter] =
        useState("All statuses");

    const [localStatuses, setLocalStatuses] =
        useState({});
    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [candidateToDelete, setCandidateToDelete] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);
    const [notification, setNotification] = useState({
        show: false,
        type: "",
        message: "",
    });

    /*
    |--------------------------------------------------------------------------
    | FETCH CANDIDATES + EMPLOYEES
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        dispatch(getAllCandidates());

        dispatch(getAllEmployees());

    }, [dispatch]);

    const showNotification = (type, message) => {
        setNotification({
            show: true,
            type,
            message,
        });

        setTimeout(() => {
            setNotification({
                show: false,
                type: "",
                message: "",
            });
        }, 3000);
    };
    /*
    |--------------------------------------------------------------------------
    | STATUS COLORS
    |--------------------------------------------------------------------------
    */
    const getStatusColor = (status) => {

        switch (status) {

            case "Active":
                return "#138f67";

            case "Inactive":
                return "#6b6f78";

            case "Blacklisted":
                return "#c33443";

            default:
                return "#6b6f78";
        }
    };


    const getStatusBgColor = (status) => {

        switch (status) {

            case "Active":
                return "#e7f8ef";

            case "Inactive":
                return "#f1f3f5";

            case "Blacklisted":
                return "#fff0f2";

            default:
                return "#f1f3f5";
        }
    };


    /*
    |--------------------------------------------------------------------------
    | GET CURRENT STATUS
    |--------------------------------------------------------------------------
    */
    const getCandidateStatus = (candidate) => {

        return (
            localStatuses[candidate.id] ??
            candidate.status ??
            "Active"
        );
    };


    const handleStatusChange = async (
        candidate,
        newStatus
    ) => {

        const previousStatus =
            getCandidateStatus(candidate);

        /*
        |--------------------------------------------------------------------------
        | Don't call API if status hasn't changed
        |--------------------------------------------------------------------------
        */

        if (previousStatus === newStatus) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Optimistic UI update
        |--------------------------------------------------------------------------
        | Change dropdown immediately while API is processing.
        */

        setLocalStatuses((previous) => ({
            ...previous,
            [candidate.id]: newStatus,
        }));


        try {

            console.log(
                "UPDATING CANDIDATE STATUS:",
                {
                    id: candidate.id,
                    status: newStatus,
                }
            );


            /*
            |--------------------------------------------------------------------------
            | UPDATE API
            |--------------------------------------------------------------------------
            | Only send status.
            */

            await dispatch(
                updateCandidate({
                    id: candidate.id,

                    candidateData: {
                        status: newStatus,
                    },
                })
            ).unwrap();


            console.log(
                "Candidate status updated successfully:",
                newStatus
            );


            /*
            |--------------------------------------------------------------------------
            | Refresh candidates
            |--------------------------------------------------------------------------
            | This makes sure Redux contains the backend value.
            */

            dispatch(
                getAllCandidates()
            );


        } catch (error) {

            console.error(
                "STATUS UPDATE ERROR:",
                error
            );


            /*
            |--------------------------------------------------------------------------
            | API failed
            |--------------------------------------------------------------------------
            | Restore previous status in UI.
            */

            setLocalStatuses((previous) => ({
                ...previous,
                [candidate.id]: previousStatus,
            }));
            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : "Failed to update candidate status"
            );
        }
    };

    const handleCandidateClick = (candidate) => {

        if (!candidate?.id) {
            console.error("Candidate ID is missing");
            return;
        }

        navigate(
            `/dashboard/candidates/${candidate.id}`
        );
    };
    const handleDelete = (candidate) => {

        if (!candidate?.id) {
            console.error("Candidate ID is missing");
            return;
        }

        setCandidateToDelete(candidate);
        setShowDeleteModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | CONFIRM DELETE CANDIDATE
    |--------------------------------------------------------------------------
    */

    const handleConfirmDelete = async () => {

        if (!candidateToDelete?.id) {
            return;
        }

        try {

            setDeleting(true);

            console.log(
                "DELETING CANDIDATE:",
                candidateToDelete.id
            );


            await dispatch(
                deleteCandidate(
                    candidateToDelete.id
                )
            ).unwrap();


            /*
            |--------------------------------------------------------------------------
            | Remove local status
            |--------------------------------------------------------------------------
            */

            setLocalStatuses((previous) => {

                const updated = {
                    ...previous,
                };

                delete updated[
                    candidateToDelete.id
                ];

                return updated;
            });


            /*
            |--------------------------------------------------------------------------
            | Close delete modal
            |--------------------------------------------------------------------------
            */

            setShowDeleteModal(false);

            setCandidateToDelete(null);


            /*
            |--------------------------------------------------------------------------
            | Refresh candidates
            |--------------------------------------------------------------------------
            */

            await dispatch(
                getAllCandidates()
            ).unwrap();


            console.log(
                "Candidate deleted successfully"
            );

        } catch (error) {

            console.error(
                "DELETE CANDIDATE ERROR:",
                error
            );

        } finally {

            setDeleting(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | ADD
    |--------------------------------------------------------------------------
    */
    const handleAddClick = () => {

        setModalMode("add");

        setSelectedCandidate(null);

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */
    const handleEditClick = (candidate) => {

        setModalMode("edit");

        setSelectedCandidate(candidate);

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | APPLICATIONS
    |--------------------------------------------------------------------------
    */
    const handleApplications = (id) => {

        console.log(
            "View applications for candidate:",
            id
        );
        showNotification(
            "info",
            `Applications for candidate: ${id}`
        );
    };

    const handleSave = async (data) => {

        /*
        |--------------------------------------------------------------------------
        | COMMON CANDIDATE DATA
        |--------------------------------------------------------------------------
        */

        const candidateData = {
            fullName:
                data.fullName,

            currentDesignation:
                data.designation,

            cvOwnerId:
                data.cvOwnerId,

            referredBy:
                data.referredBy,

            referenceNote:
                data.referenceNote,

            email:
                data.email,

            phone:
                data.phone,

            whatsapp:
                data.whatsapp,

            nationality:
                data.nationality,

            location:
                data.currentLocation,

            currentEmployer:
                data.currentCompany,

            experienceYears:
                Number(data.experience) || 0,

            skills:
                data.primarySkills
                    ? data.primarySkills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                    : [],

            noticePeriodDays:
                Number(data.noticePeriod) || 0,

            visaStatus:
                data.visaStatus,

            source:
                data.source,

            linkedinUrl:
                data.linkedinUrl || "",

            status:
                data.candidateStatus,

            education:
                data.education,

            currentSalaryAmount:
                Number(data.currentRateAmount) || 0,

            currentSalaryCurrency:
                data.currentRateCurrency,

            currentSalaryPeriod:
                data.currentRatePeriod,

            expectedSalaryAmount:
                Number(data.dayRateAmount) || 0,

            expectedSalaryCurrency:
                data.dayRateCurrency,

            expectedSalaryPeriod:
                data.dayRatePeriod,
        };


        console.log(
            "FINAL CANDIDATE PAYLOAD:",
            candidateData
        );


        try {

            /*
            |--------------------------------------------------------------------------
            | ADD CANDIDATE
            |--------------------------------------------------------------------------
            */

            if (modalMode === "add") {

                await dispatch(
                    addCandidate({
                        candidateData,

                        originalCV:
                            data.originalCV,

                        troyCV:
                            data.troyCV,
                    })
                ).unwrap();
                showNotification(
                    "success",
                    "Candidate added successfully"
                );

            }


            /*
            |--------------------------------------------------------------------------
            | UPDATE CANDIDATE
            |--------------------------------------------------------------------------
            */

            else if (modalMode === "edit") {

                if (!selectedCandidate?.id) {
                    showNotification(
                        "error",
                        "Candidate ID is missing"
                    );

                    return;

                    return;
                }


                console.log(
                    "UPDATING CANDIDATE ID:",
                    selectedCandidate.id
                );


                await dispatch(
                    updateCandidate({

                        id:
                            selectedCandidate.id,

                        candidateData,

                        /*
                         * Only send these when a NEW file
                         * has actually been selected.
                         *
                         * If the user does not select a file,
                         * the existing CV remains untouched.
                         */
                        originalCV:
                            data.originalCV,

                        troyCV:
                            data.troyCV,

                    })
                ).unwrap();
                showNotification(
                    "success",
                    "Candidate updated successfully"
                );

            }


            /*
            |--------------------------------------------------------------------------
            | CLOSE MODAL
            |--------------------------------------------------------------------------
            */

            setShowModal(false);

            setSelectedCandidate(null);


            /*
            |--------------------------------------------------------------------------
            | REFRESH CANDIDATES
            |--------------------------------------------------------------------------
            */

            dispatch(
                getAllCandidates()
            );

        } catch (error) {

            console.error(
                modalMode === "edit"
                    ? "UPDATE CANDIDATE ERROR:"
                    : "ADD CANDIDATE ERROR:",
                error
            );
            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : modalMode === "edit"
                        ? "Failed to update candidate"
                        : "Failed to add candidate"
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | FILTER + SEARCH
    |--------------------------------------------------------------------------
    */
    const filteredCandidates = useMemo(() => {

        const search =
            searchTerm
                .trim()
                .toLowerCase();


        return candidates.filter(
            (candidate) => {

                const currentStatus =
                    getCandidateStatus(candidate);


                const skillsText =
                    Array.isArray(candidate.skills)
                        ? candidate.skills.join(" ")
                        : "";


                const searchMatch = [

                    candidate.fullName,

                    candidate.cvId,

                    candidate.currentDesignation,

                    candidate.location,

                    candidate.cvOwnerName,

                    candidate.email,

                    candidate.phone,

                    candidate.currentEmployer,

                    candidate.source,

                    skillsText,

                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(search)
                    );


                const statusMatch =
                    statusFilter === "All statuses" ||
                    currentStatus === statusFilter;


                return (
                    searchMatch &&
                    statusMatch
                );
            }
        );

    }, [
        candidates,
        searchTerm,
        statusFilter,
        localStatuses,
    ]);


    /*
    |--------------------------------------------------------------------------
    | STATS
    |--------------------------------------------------------------------------
    */
    const total =
        candidates.length;


    const active =
        candidates.filter(
            (candidate) =>
                getCandidateStatus(candidate) ===
                "Active"
        ).length;


    const inactive =
        candidates.filter(
            (candidate) =>
                getCandidateStatus(candidate) ===
                "Inactive"
        ).length;


    const blacklisted =
        candidates.filter(
            (candidate) =>
                getCandidateStatus(candidate) ===
                "Blacklisted"
        ).length;


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */
    if (loading) {

        return (
            <div className="page">

                <div className="candidates-header">

                    <div>

                        <h1>
                            Candidates
                        </h1>

                        <p className="candidates-subtitle">
                            Loading candidates...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */
    if (error && candidates.length === 0) {

        return (
            <div className="page">

                <div className="candidates-header">

                    <div>

                        <h1>
                            Candidates
                        </h1>

                        <p className="candidates-subtitle">
                            Unable to load candidates
                        </p>

                    </div>

                </div>


                <div
                    style={{
                        padding: "20px",
                        color: "#c33443",
                        background: "#fff0f2",
                        borderRadius: "8px",
                    }}
                >
                    {error}
                </div>


                <button
                    className="candidates-add-btn"
                    style={{
                        marginTop: "15px",
                    }}
                    onClick={() =>
                        dispatch(
                            getAllCandidates()
                        )
                    }
                >
                    Retry
                </button>

            </div>
        );
    }


    return (

        <div className="page">

            {/* HEADER */}

            <div className="candidates-header">

                <div>

                    <h1>
                        Candidates
                    </h1>

                    <p className="candidates-subtitle">
                        {total} candidates in your database
                    </p>

                </div>


                <div className="candidates-header-actions">

                    <button
                        className="candidates-export-btn"
                    >
                        <i className="fas fa-download"></i>
                        {" "}Export CSV
                    </button>


                    <button
                        className="candidates-add-btn"
                        onClick={handleAddClick}
                    >
                        <i className="fas fa-plus"></i>
                        {" "}Add candidate
                    </button>

                </div>

            </div>


            {/* STATS */}

            <div className="candidates-stats-grid">

                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {total}
                    </div>

                    <div className="candidate-stat-label">
                        Total
                    </div>

                </div>


                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {active}
                    </div>

                    <div className="candidate-stat-label">
                        Active
                    </div>

                </div>


                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {inactive}
                    </div>

                    <div className="candidate-stat-label">
                        Inactive
                    </div>

                </div>


                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {blacklisted}
                    </div>

                    <div className="candidate-stat-label">
                        Blacklisted
                    </div>

                </div>

            </div>


            {/* SEARCH */}

            <div className="candidates-search-filter">

                <div className="candidates-search-wrapper">

                    <i className="fas fa-search"></i>

                    <input
                        type="text"
                        placeholder="Search name, CV ID, owner, skills..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="candidates-filter-wrapper">

                    <select
                        className="candidates-status-filter"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
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

                        <option value="Blacklisted">
                            Blacklisted
                        </option>

                    </select>


                    <i className="fas fa-chevron-down filter-arrow"></i>

                </div>

            </div>


            {/* TABLE */}

            <div className="candidates-table-wrapper">

                <table className="candidates-table">

                    <thead>

                        <tr>

                            <th>
                                CV ID
                            </th>

                            <th>
                                CANDIDATE
                            </th>

                            <th>
                                CANDIDATE STATUS
                            </th>

                            <th>
                                OWNER · RECRUITER
                            </th>

                            <th>
                                ACTIONS
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredCandidates.map(
                            (candidate) => {

                                const status =
                                    getCandidateStatus(
                                        candidate
                                    );


                                return (

                                    <tr
                                        key={candidate.id}
                                    >

                                        <td className="candidate-cv-id">

                                            {candidate.cvId ||
                                                "-"}

                                        </td>


                                        <td>

                                            <div
                                                className="candidate-name"
                                                onClick={() =>
                                                    handleCandidateClick(candidate)
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {candidate.fullName || "-"}
                                            </div>


                                            <div className="candidate-details">

                                                {candidate.currentDesignation ||
                                                    "-"}

                                                {" · "}

                                                {candidate.location ||
                                                    "-"}

                                            </div>

                                        </td>


                                        <td>

                                            <div className="candidate-status-wrapper">

                                                <span
                                                    className="candidate-status-dot"
                                                    style={{
                                                        backgroundColor:
                                                            getStatusColor(
                                                                status
                                                            ),
                                                    }}
                                                ></span>


                                                <select
                                                    className="candidate-status-select"
                                                    value={status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            candidate,
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            getStatusBgColor(
                                                                status
                                                            ),
                                                        color:
                                                            getStatusColor(
                                                                status
                                                            ),
                                                    }}
                                                >

                                                    <option value="Active">
                                                        Active
                                                    </option>

                                                    <option value="Inactive">
                                                        Inactive
                                                    </option>

                                                    <option value="Blacklisted">
                                                        Blacklisted
                                                    </option>

                                                </select>

                                            </div>

                                        </td>


                                        <td className="candidate-owner">

                                            {candidate.cvOwnerName ||
                                                "-"}

                                        </td>


                                        <td>

                                            <div className="candidate-actions">

                                                <button
                                                    className="candidate-action-btn"
                                                    onClick={() =>
                                                        handleApplications(
                                                            candidate.id
                                                        )
                                                    }
                                                >
                                                    Applications
                                                </button>


                                                <button
                                                    className="candidate-action-btn"
                                                    onClick={() =>
                                                        handleEditClick(
                                                            candidate
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="candidate-action-btn candidate-delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            candidate
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );
                            }
                        )}


                        {filteredCandidates.length === 0 && (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="candidates-empty-state"
                                >

                                    <div>

                                        <i className="fas fa-users"></i>

                                        <strong>
                                            No candidates found
                                        </strong>

                                        <span>
                                            Try adjusting your search or filter
                                        </span>

                                    </div>

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* NOTIFICATION */}

            {notification.show && (
                <div
                    className={`candidate-notification candidate-notification-${notification.type}`}
                >
                    <div className="candidate-notification-icon">
                        {notification.type === "success" && (
                            <i className="fas fa-check"></i>
                        )}

                        {notification.type === "error" && (
                            <i className="fas fa-times"></i>
                        )}

                        {notification.type === "info" && (
                            <i className="fas fa-info"></i>
                        )}
                    </div>

                    <span>
                        {notification.message}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setNotification({
                                show: false,
                                type: "",
                                message: "",
                            })
                        }
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
            {/* MODAL */}

            {showModal && (

                <CandidateModal
                    mode={modalMode}
                    initialData={selectedCandidate}
                    employees={employees}
                    employeesLoading={employeesLoading}
                    employeeError={employeeError}
                    adding={adding}
                    onClose={() =>
                        setShowModal(false)
                    }
                    onSave={handleSave}
                />

            )}
            {/* DELETE CONFIRMATION MODAL */}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}

                onClose={() => {

                    if (deleting) {
                        return;
                    }
                    setShowDeleteModal(false);
                    setCandidateToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete candidate"
                itemName={
                    candidateToDelete?.fullName || ""
                }
                deleteText={
                    deleting
                        ? "Deleting..."
                        : "Delete"
                }
                cancelText="Cancel"
            />

        </div>
    );
};


export default Candidates;