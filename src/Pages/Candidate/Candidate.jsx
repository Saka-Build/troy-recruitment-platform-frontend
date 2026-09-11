import React, { useEffect, useState,} from "react";
import { useDispatch, useSelector,} from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Candidate.css";
import CandidateModal from "../Candidate/CandidateModal";
import { getAllCandidates, getAllEmployees, addCandidate, updateCandidate, deleteCandidate, getCandidateFilters, exportCandidates,} from "../../Redux/Slice/candidateSlice";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import CommonPagination from "../../Components/CommonPagination";
import CandidateExportModal from "./CandidateExportModal";
import usePermissions from "../../Utils/permissions";


const Candidates = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { canRead, canWrite, canDelete } = usePermissions();

    const canReadCandidate = canRead("CANDIDATE");
    const canWriteCandidate = canWrite("CANDIDATE");
    const canDeleteCandidate = canDelete("CANDIDATE");

    const {candidates = [],employees = [],loading,employeesLoading,adding,error,employeeError,pagination = {},

    candidateFilters = {
        totalCandidates: 0,
        totalActiveCandidates: 0,
        totalInActiveCandidates: 0,
        totalBackListedCandidates: 0,
        statusList: [],
    },} = useSelector((state) => state.candidate);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const totalPages = pagination?.totalPages || 0;
    const totalItems = pagination?.totalElements || 0;

    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [localStatuses, setLocalStatuses] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [notification, setNotification] = useState({show: false,type: "",message: "",});
    const [exportFromDate, setExportFromDate] = useState("");
    const [exportToDate, setExportToDate] = useState("");
    const [exportStatus, setExportStatus] = useState("");
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        dispatch(getAllCandidates({page: 0,size: itemsPerPage,}));
        dispatch(getAllEmployees());
        dispatch( getCandidateFilters());
    }, [dispatch]);

    useEffect(() => {
        const status = statusFilter === "All statuses"? undefined: statusFilter;
        dispatch(getAllCandidates({page: currentPage - 1,size: itemsPerPage,search: searchTerm,status,}));

    }, [dispatch,currentPage,searchTerm,statusFilter,]);

    const handleSearch = (value) => {
        setSearchInput(value);
        setCurrentPage(1);
        setSearchTerm(value);
    };

    const handlePageChange = (page) => {

        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        setCurrentPage(page);
    };

    const showNotification = (
        type,
        message
    ) => {

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

    const getStatusColor = (status) => {

        switch (status) {
            case "Active": return "#138f67";
            case "Inactive": return "#6b6f78";
            case "Blacklisted": return "#c33443";
            default: return "#6b6f78";
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case "Active": return "#e7f8ef";
            case "Inactive": return "#f1f3f5";
            case "Blacklisted": return "#fff0f2";
            default: return "#f1f3f5";
        }
    };

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

        if (
            previousStatus === newStatus
        ) {
            return;
        }

        setLocalStatuses(
            (previous) => ({
                ...previous,
                [candidate.id]: newStatus,
            })
        );

        try {

            await dispatch(
                updateCandidate({
                    id: candidate.id,

                    candidateData: {
                        status: newStatus,
                    },
                })
            ).unwrap();


            showNotification(
                "success",
                "Candidate status updated successfully"
            );

    const status =
        statusFilter === "All statuses"
            ? undefined
            : statusFilter;

    await dispatch(
        getAllCandidates({
            page: currentPage - 1,
            size: itemsPerPage,
            search: searchTerm,
            status,
        })
    ).unwrap();

        } catch (error) {

            setLocalStatuses(
                (previous) => ({
                    ...previous,
                    [candidate.id]:
                        previousStatus,
                })
            );

            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : "Failed to update candidate status"
            );
        }
    };

    const handleCandidateClick = (
        candidate
    ) => {

        if (!candidate?.id) {
            console.error(
                "Candidate ID is missing"
            );
            return;
        }

        navigate(
            `/dashboard/candidates/${candidate.id}`
        );
    };

    const handleDelete = (
        candidate
    ) => {

        if (!candidate?.id) {
            console.error(
                "Candidate ID is missing"
            );
            return;
        }

        setCandidateToDelete(candidate);

        setShowDeleteModal(true);
    };


    const handleConfirmDelete = async () => {

        if (!candidateToDelete?.id) {
            return;
        }

        try {

            setDeleting(true);

            await dispatch(
                deleteCandidate(
                    candidateToDelete.id
                )
            ).unwrap();


            setLocalStatuses(
                (previous) => {

                    const updated = {
                        ...previous,
                    };

                    delete updated[
                        candidateToDelete.id
                    ];

                    return updated;
                }
            );


            setShowDeleteModal(false);

            setCandidateToDelete(null);


            /*
             * Refresh current backend page.
             */
const status =
    statusFilter === "All statuses"
        ? undefined
        : statusFilter;

await dispatch(
    getAllCandidates({
        page: currentPage - 1,
        size: itemsPerPage,
        search: searchTerm,
        status,
    })
).unwrap();


            showNotification(
                "success",
                "Candidate deleted successfully"
            );

        } catch (error) {

            console.error(
                "DELETE CANDIDATE ERROR:",
                error
            );

            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : "Failed to delete candidate"
            );

        } finally {

            setDeleting(false);
        }
    };

    const handleAddClick = () => {

        setModalMode("add");

        setSelectedCandidate(null);

        setShowModal(true);
    };

    const handleEditClick = (
        candidate
    ) => {

        setModalMode("edit");

        setSelectedCandidate(candidate);

        setShowModal(true);
    }

    const handleApplications = (
        id
    ) => {

        if (!id) {
            console.error(
                "Candidate ID is missing"
            );
            return;
        }

        navigate(
            `/dashboard/candidates/${id}?tab=Applications`
        );
    };

    const handleSave = async (
        data
    ) => {

        const isNull = (
            value
        ) => value === null;


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
                isNull(data.experience)
                    ? null
                    : data.experience === ""
                        ? ""
                        : Number(
                            data.experience
                        ),

            skills:
                isNull(data.primarySkills)
                    ? null
                    : data.primarySkills
                        ? data.primarySkills
                            .split(",")
                            .map(
                                (skill) =>
                                    skill.trim()
                            )
                            .filter(Boolean)
                        : [],

            noticePeriodDays:
                isNull(
                    data.noticePeriod
                )
                    ? null
                    : data.noticePeriod === ""
                        ? ""
                        : Number(
                            data.noticePeriod
                        ),

            visaStatus:
                data.visaStatus,

            source:
                data.source,

            linkedinUrl:
                data.linkedinUrl,

            status:
                data.candidateStatus,

            education:
                data.education,

            currentSalaryAmount:
                isNull(
                    data.currentRateAmount
                )
                    ? null
                    : data.currentRateAmount === ""
                        ? ""
                        : Number(
                            data.currentRateAmount
                        ),

            currentSalaryCurrency:
                data.currentRateCurrency,

            currentSalaryPeriod:
                data.currentRatePeriod,

            expectedSalaryAmount:
                isNull(
                    data.dayRateAmount
                )
                    ? null
                    : data.dayRateAmount === ""
                        ? ""
                        : Number(
                            data.dayRateAmount
                        ),

            expectedSalaryCurrency:
                data.dayRateCurrency,

            expectedSalaryPeriod:
                data.dayRatePeriod,
        };


        try {

            if (
                modalMode === "add"
            ) {

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

            } else if (
                modalMode === "edit"
            ) {

                if (
                    !selectedCandidate?.id
                ) {

                    showNotification(
                        "error",
                        "Candidate ID is missing"
                    );

                    return;
                }


                await dispatch(
                    updateCandidate({
                        id:
                            selectedCandidate.id,

                        candidateData,

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


            setShowModal(false);

            setSelectedCandidate(null);

const status =
    statusFilter === "All statuses"
        ? undefined
        : statusFilter;

dispatch(
    getAllCandidates({ page: currentPage - 1, size: itemsPerPage, search: searchTerm, status,})
);

        } catch (error) {

            console.error(
                modalMode === "edit"? "UPDATE CANDIDATE ERROR:": "ADD CANDIDATE ERROR:",
                error
            );


            showNotification(
                "error",
                typeof error === "string"? error: modalMode === "edit"    ? "Failed to update candidate"    : "Failed to add candidate"
            );
        }
    };

    const handleStatusFilterChange = (
        value
    ) => {

        setCurrentPage(1);

        setStatusFilter(value);
    };

    const total = candidateFilters?.totalCandidates ?? 0;
    const active = candidateFilters?.totalActiveCandidates ?? 0;
    const inactive = candidateFilters?.totalInActiveCandidates ?? 0;
    const blacklisted = candidateFilters?.totalBackListedCandidates ?? 0;

const handleExportCandidates = async () => {
    try {
        const result = await dispatch(
            exportCandidates({
                fromDate: exportFromDate || null,
                toDate: exportToDate || null,
                status: exportStatus || null,
            })
        ).unwrap();

        if (!result?.blob) {
            throw new Error(
                "Export file was not returned by the server"
            );
        }
        const url =
            window.URL.createObjectURL(
                result.blob
            );
        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            result.fileName ||
            "candidates.xlsx";

        document.body.appendChild(
            link
        );
        link.click();
        link.remove();
        window.URL.revokeObjectURL(
            url
        );
        setShowExportModal(false);
        showNotification(
            "success",
            "Candidates exported successfully"
        );

    } catch (error) {
        console.error(
            "EXPORT CANDIDATES ERROR:",
            error
        );

        showNotification(
            "error",
            typeof error === "string"
                ? error
                : "Failed to export candidates"
        );
    }
};

    if (
        loading &&
        candidates.length === 0
    ) {

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

    if (
        error &&
        candidates.length === 0
    ) {

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
                    onClick={() => {

const status =
    statusFilter === "All statuses"
        ? undefined
        : statusFilter;

dispatch(
    getAllCandidates({
        page: currentPage - 1,
        size: itemsPerPage,
        search: searchTerm,
        status,
    })
);
                    }}
                >
                    Retry
                </button>

            </div>
        );
    }

    if (!canReadCandidate) {
    return (
        <div className="page">
            <div className="role-error-message">
                <span>You do not have permission to view Candidates.</span>
            </div>
        </div>
    );
}
    return (

        <div className="page">

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
                        type="button"
                        className="candidates-export-btn"
                        onClick={() =>
                            setShowExportModal(true)
                        }
                    >
                        <i className="fas fa-download"></i>
                        Export Excel
                    </button>


                    {canWriteCandidate && (<button
                        className="candidates-add-btn"
                        onClick={
                            handleAddClick
                        }
                    >
                        <i className="fas fa-plus"></i>
                        {" "}
                        Add candidate
                    </button>)}

                </div>

            </div>

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

            <div className="candidates-search-filter">

                <div className="candidates-search-wrapper">

                    <i className="fas fa-search"></i>

                    <input
                        type="text"
                        placeholder="Search name, CV ID, owner, skills..."
                        value={searchInput}
                        onChange={(e) =>
                            handleSearch(
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
                            handleStatusFilterChange(e.target.value)
                        }
                    >
                        <option value="All statuses">
                            All statuses
                        </option>

                        {candidateFilters?.statusList?.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>
                    <i className="fas fa-chevron-down filter-arrow"></i>
                </div>
            </div>

            <div className="candidates-table-wrapper">
                <table className="candidates-table">
                    <thead>
                        <tr>
                            <th>CV ID</th>
                            <th>CANDIDATE</th>
                            <th>CANDIDATE STATUS</th>
                            <th>OWNER · RECRUITER</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {candidates.map( (candidate) => {
                                const status =  getCandidateStatus( candidate );
                                return (

                                    <tr key={ candidate.id }>
                                        <td className="candidate-cv-id"> {candidate.cvId || "-"}</td>
                                        <td>
                                            <div
                                                className="candidate-name"
                                                onClick={() => handleCandidateClick( candidate )}
                                                style={{ cursor: "pointer", }}
                                            >
                                                {candidate.fullName || "-"}
                                            </div>

                                            <div className="candidate-details">
                                                {candidate.currentDesignation ||"-"}
                                                {" · "}
                                                {candidate.location ||"-"}
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
                                                    value={
                                                        status
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
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
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                    <option value="Blacklisted">Blacklisted</option>
                                                </select>

                                            </div>

                                        </td>

                                        <td className="candidate-owner">
                                            {candidate.cvOwnerName || "-"}
                                        </td>

                                        <td>
                                            <div className="candidate-actions">
                                                <button className="candidate-action-btn" onClick={() =>handleApplications( candidate.id)}> 
                                                    Applications
                                                </button>

                                               {canWriteCandidate && (
                                                 <button className="candidate-action-btn" onClick={() =>handleEditClick( candidate)}> 
                                                    Edit
                                                </button> )}

                                                {canDeleteCandidate && (
                                                <button className="candidate-action-btn candidate-delete-btn" onClick={() =>handleDelete( candidate)}> 
                                                    Delete
                                                </button>)}
                                            </div>

                                        </td>

                                    </tr>

                                );
                            }
                        )}


                        {candidates.length === 0 && (
                            <tr>
                                <td colSpan="5" className="candidates-empty-state">
                                    <div>
                                        <i className="fas fa-users"></i>
                                        <strong> No candidates found</strong>
                                        <span>Try adjusting your search or filter</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CommonPagination
                currentPage={ currentPage}
                totalPages={ totalPages}
                totalItems={ totalItems}
                itemsPerPage={ itemsPerPage}
                onPageChange={ handlePageChange}
                itemLabel="candidates"
            />

            {notification.show && (

                <div
                    className={`candidate-notification candidate-notification-${notification.type}`}
                >

                    <div className="candidate-notification-icon">

                        {notification.type ===
                            "success" && (
                                <i className="fas fa-check"></i>
                            )}

                        {notification.type ===
                            "error" && (
                                <i className="fas fa-times"></i>
                            )}

                        {notification.type ===
                            "info" && (
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

            {showModal && (
                <CandidateModal
                    mode={modalMode}
                    initialData={selectedCandidate}
                    employees={employees}
                    employeesLoading={employeesLoading}
                    employeeError={employeeError}
                    adding={adding}
                    onClose={() =>setShowModal(false)}
                    onSave={handleSave}/>
            )}

            <CandidateExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                fromDate={exportFromDate}
                setFromDate={setExportFromDate}
                toDate={exportToDate}
                setToDate={setExportToDate}
                status={exportStatus}
                setStatus={setExportStatus}
                onClear={() => {
                    setExportFromDate("");
                    setExportToDate("");
                    setExportStatus("");
                }}
                onExport={handleExportCandidates}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    if (deleting) return;
                    setShowDeleteModal(false);
                    setCandidateToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete candidate"
                itemName={candidateToDelete?.fullName || ""}
                deleteText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
            />
        </div>
    );
};
export default Candidates;