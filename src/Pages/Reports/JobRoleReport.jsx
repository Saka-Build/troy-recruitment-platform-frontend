import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    FiSearch,
    FiRotateCcw,
    FiChevronDown,
    FiMail,
    FiPhone,
    FiDownload,
    FiArrowLeft,
    FiUsers,
    FiUserPlus,
    FiCheckCircle,
    FiClock,
} from "react-icons/fi";

import {
    getAllSubmissions,
} from "../../Redux/Slice/employeeSlice";

import "./JobRoleReport.css";


function JobRoleReport() {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    /*
     * =====================================================
     * SUBMISSIONS STATE
     * =====================================================
     */

    const {
        submissions = [],
        submissionsLoading,
        submissionsError,
        submissionsPagination,
    } = useSelector(
        (state) => state.employees || {}
    );


    /*
     * =====================================================
     * FILTER STATES
     * =====================================================
     */

    const [search, setSearch] = useState("");

    const [jobFilter, setJobFilter] = useState("");

    const [
        applicationStatusFilter,
        setApplicationStatusFilter,
    ] = useState("");

    const [
        subStatusFilter,
        setSubStatusFilter,
    ] = useState("");


    /*
     * =====================================================
     * GET SUBMISSIONS
     * =====================================================
     */

    useEffect(() => {

        dispatch(
            getAllSubmissions()
        );

    }, [dispatch]);


    /*
     * =====================================================
     * JOB OPTIONS
     *
     * Derived from backend response.
     * =====================================================
     */

    const jobs = useMemo(() => {

        const uniqueJobs = {};

        submissions.forEach(
            (item) => {

                if (
                    item.jobId &&
                    !uniqueJobs[item.jobId]
                ) {

                    uniqueJobs[item.jobId] = {

                        id: item.jobId,

                        name:
                            item.jobName ||
                            "Unnamed Job",

                    };

                }

            }
        );

        return Object.values(
            uniqueJobs
        );

    }, [submissions]);


    /*
     * =====================================================
     * APPLICATION STATUS MASTER LIST
     *
     * These are the statuses provided by backend.
     *
     * Backend value:
     * Ready_to_Submit
     *
     * UI label:
     * Ready to Submit
     * =====================================================
     */

    const applicationStatuses = [
        {
            value: "Applied",
            label: "Applied",
        },
        {
            value: "Screening",
            label: "Actively Sourcing",
        },
        {
            value: "Ready_to_Submit",
            label: "Ready to Submit",
        },
        {
            value: "Submitted",
            label: "Submitted",
        },
        {
            value: "Interview",
            label: "Interview",
        },
        {
            value: "Selected",
            label: "Selected",
        },
        {
            value: "Offer Released",
            label: "Offer Released",
        },
        {
            value: "Onboarding",
            label: "Onboarding",
        },
        {
            value: "Onboarded",
            label: "Onboarded",
        },
        {
            value: "Hold",
            label: "Hold",
        },
        {
            value: "Rejected",
            label: "Rejected",
        },
        {
            value: "Offboarded",
            label: "Offboarded",
        },
    ];


    /*
     * =====================================================
     * SUB STATUS OPTIONS
     *
     * Dynamically taken from API response.
     * =====================================================
     */

    const subStatuses = useMemo(() => {

        const uniqueSubStatuses =
            new Set();

        submissions.forEach(
            (item) => {

                if (
                    item.subStatusName
                ) {

                    uniqueSubStatuses.add(
                        item.subStatusName.trim()
                    );

                }

            }
        );

        return Array.from(
            uniqueSubStatuses
        ).sort();

    }, [submissions]);


    /*
     * =====================================================
     * SEARCH + FILTERING
     * =====================================================
     */

    const filteredSubmissions =
        useMemo(() => {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();


            return submissions.filter(
                (item) => {

                    /*
                     * Search
                     */

                    const matchesSearch =
                        !searchValue ||

                        item.candidateName
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.candidateId
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.candidateCVId
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.candidateDesignation
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.candidateEmail
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.candidatePhone
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.jobName
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.troyJobId
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.clientName
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||

                        item.endClientName
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );


                    /*
                     * Job filter
                     */

                    const matchesJob =
                        !jobFilter ||
                        item.jobId ===
                            jobFilter;


                    /*
                     * Application Status
                     */

                    const matchesApplicationStatus =
                        !applicationStatusFilter ||
                        item.statusName
                            ?.trim() ===
                            applicationStatusFilter;


                    /*
                     * Sub Status
                     */

                    const matchesSubStatus =
                        !subStatusFilter ||
                        item.subStatusName
                            ?.trim() ===
                            subStatusFilter;


                    return (
                        matchesSearch &&
                        matchesJob &&
                        matchesApplicationStatus &&
                        matchesSubStatus
                    );

                }
            );

        }, [
            submissions,
            search,
            jobFilter,
            applicationStatusFilter,
            subStatusFilter,
        ]);


    /*
     * =====================================================
     * STATUS CARD COUNTS
     *
     * IMPORTANT:
     * Counts are calculated from the FILTERED data.
     *
     * Cards are informational only.
     * They are NOT clickable.
     * =====================================================
     */

    const statusCounts =
        useMemo(() => {

            const counts = {

                Applied: 0,

                Submitted: 0,

                Interview: 0,

                Onboarded: 0,

            };


            filteredSubmissions.forEach(
                (item) => {

                    const status =
                        item.statusName
                            ?.trim()
                            ?.toLowerCase();


                    if (
                        status ===
                        "applied"
                    ) {

                        counts.Applied++;

                    }


                    if (
                        status ===
                        "submitted"
                    ) {

                        counts.Submitted++;

                    }


                    if (
                        status ===
                            "interview" ||
                        status ===
                            "interviewing"
                    ) {

                        counts.Interview++;

                    }


                    if (
                        status ===
                        "onboarded"
                    ) {

                        counts.Onboarded++;

                    }

                }
            );


            return counts;

        }, [
            filteredSubmissions,
        ]);


    /*
     * =====================================================
     * STATUS CARDS
     * =====================================================
     */

    const statusCards = [

        {
            label: "Applied",

            value:
                statusCounts.Applied,

            icon: FiClock,

            color: "#3B82F6",
        },

        {
            label: "Submitted",

            value:
                statusCounts.Submitted,

            icon: FiUserPlus,

            color: "#8B5CF6",
        },

        {
            label: "Interview",

            value:
                statusCounts.Interview,

            icon: FiUsers,

            color: "#F59E0B",
        },

        {
            label: "Onboarded",

            value:
                statusCounts.Onboarded,

            icon: FiCheckCircle,

            color: "#16A34A",
        },

    ];


    /*
     * =====================================================
     * RESET FILTERS
     * =====================================================
     */

    const resetFilters = () => {

        setSearch("");

        setJobFilter("");

        setApplicationStatusFilter("");

        setSubStatusFilter("");

    };


    /*
     * =====================================================
     * INITIALS
     * =====================================================
     */

    const getInitials = (
        name
    ) => {

        if (!name) {

            return "--";

        }


        return name
            .split(" ")
            .filter(Boolean)
            .map(
                (part) =>
                    part[0]
            )
            .join("")
            .substring(0, 2)
            .toUpperCase();

    };


    /*
     * =====================================================
     * DISPLAY VALUE
     * =====================================================
     */

    const displayValue = (
        value
    ) => {

        return (
            value ||
            "—"
        );

    };


    /*
     * =====================================================
     * BADGE CLASS
     * =====================================================
     */

    const getBadgeClass = (
        value
    ) => {

        return (
            value
                ?.toLowerCase()
                .replace(
                    /_/g,
                    "-"
                )
                .replace(
                    /\s+/g,
                    "-"
                ) ||
            ""
        );

    };


    /*
     * =====================================================
     * APPLICATION STATUS LABEL
     *
     * Converts backend values to UI labels.
     * =====================================================
     */

    const getApplicationStatusLabel =
        (status) => {

            const found =
                applicationStatuses.find(
                    (item) =>
                        item.value ===
                        status
                );


            return (
                found?.label ||
                status ||
                "—"
            );

        };


    /*
     * =====================================================
     * EXPORT CSV
     *
     * Exports CURRENT filtered results.
     * =====================================================
     */

    const handleExport = () => {

        if (
            !filteredSubmissions.length
        ) {

            return;

        }


        const headers = [

            "BDM",

            "Client",

            "End Client",

            "Job Name",

            "Job Priority",

            "Candidate ID",

            "Candidate Name",

            "Candidate Designation",

            "Email",

            "Phone",

            "CV ID",

            "Candidate Status",

            "Candidate Sub Status",

        ];


        const rows =
            filteredSubmissions.map(
                (item) => [

                    item.bdm || "",

                    item.clientName || "",

                    item.endClientName || "",

                    item.jobName || "",

                    item.jobPriority || "",

                    item.candidateId || "",

                    item.candidateName || "",

                    item.candidateDesignation || "",

                    item.candidateEmail || "",

                    item.candidatePhone || "",

                    item.candidateCVId || "",

                    getApplicationStatusLabel(
                        item.statusName
                    ),

                    item.subStatusName || "",

                ]
            );


        const csvContent =
            [
                headers,
                ...rows,
            ]
                .map(
                    (row) =>
                        row
                            .map(
                                (value) =>
                                    `"${String(
                                        value
                                    ).replace(
                                        /"/g,
                                        '""'
                                    )}"`
                            )
                            .join(",")
                )
                .join("\n");


        const blob =
            new Blob(
                [
                    csvContent,
                ],
                {
                    type:
                        "text/csv;charset=utf-8;",
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "submission-report.csv";


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

    };


    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (

        <div className="reports-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="reports-header">

                <div className="report-header-left">

                    <div>

                        <h1>
                            Reports Dashboard
                        </h1>


                        <p>
                            Track candidate submissions,
                            jobs, and recruitment status
                            at a glance
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="primary-btn"
                    onClick={
                        handleExport
                    }
                    disabled={
                        !filteredSubmissions.length
                    }
                >

                    <FiDownload />

                    <span>
                        Export Report
                    </span>

                </button>

            </div>


            {/* =================================================
                STATUS CARDS
                NON CLICKABLE
            ================================================= */}

            <div className="report-status-cards">

                {statusCards.map(
                    (card) => {

                        const Icon =
                            card.icon;


                        return (

                            <div
                                key={
                                    card.label
                                }
                                className="report-status-card"
                            >

                                <div
                                    className="report-status-card-icon"
                                    style={{
                                        background:
                                            `${card.color}15`,
                                        color:
                                            card.color,
                                    }}
                                >

                                    <Icon />

                                </div>


                                <div className="report-status-card-content">

                                    <span className="report-status-card-label">

                                        {
                                            card.label
                                        }

                                    </span>


                                    <strong className="report-status-card-count">

                                        {
                                            card.value
                                        }

                                    </strong>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="reports-filter-card">


                {/* SEARCH */}

                <div className="report-search">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search candidates, IDs, emails..."
                        value={
                            search
                        }
                        onChange={(
                            e
                        ) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* JOB */}

                <div className="report-select">

                    <select
                        value={
                            jobFilter
                        }
                        onChange={(
                            e
                        ) =>
                            setJobFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Jobs
                        </option>


                        {jobs.map(
                            (job) => (

                                <option
                                    key={
                                        job.id
                                    }
                                    value={
                                        job.id
                                    }
                                >

                                    {
                                        job.name
                                    }

                                </option>

                            )
                        )}

                    </select>


                    <FiChevronDown />

                </div>


                {/* APPLICATION STATUS */}

                <div className="report-select">

                    <select
                        value={
                            applicationStatusFilter
                        }
                        onChange={(
                            e
                        ) =>
                            setApplicationStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Application Statuses
                        </option>


                        {applicationStatuses.map(
                            (status) => (

                                <option
                                    key={
                                        status.value
                                    }
                                    value={
                                        status.value
                                    }
                                >

                                    {
                                        status.label
                                    }

                                </option>

                            )
                        )}

                    </select>


                    <FiChevronDown />

                </div>


                {/* SUB STATUS */}

                {/* <div className="report-select">

                    <select
                        value={
                            subStatusFilter
                        }
                        onChange={(
                            e
                        ) =>
                            setSubStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Sub Statuses
                        </option>


                        {subStatuses.map(
                            (status) => (

                                <option
                                    key={
                                        status
                                    }
                                    value={
                                        status
                                    }
                                >

                                    {
                                        status
                                    }

                                </option>

                            )
                        )}

                    </select>


                    <FiChevronDown />

                </div> */}


                {/* RESET */}

                <button
                    className="report-reset-btn"
                    onClick={
                        resetFilters
                    }
                    type="button"
                >

                    <FiRotateCcw />

                    <span>
                        Reset
                    </span>

                </button>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {submissionsLoading ? (

                <div className="reports-table-card">

                    <div className="empty-report">

                        <div className="empty-report-content">

                            <div className="spinner"></div>

                            <strong>
                                Loading submissions...
                            </strong>

                        </div>

                    </div>

                </div>

            ) : submissionsError ? (

                <div className="reports-table-card">

                    <div className="empty-report">

                        <div className="empty-report-content">

                            <strong>
                                Failed to load submissions
                            </strong>


                            <span>
                                {
                                    submissionsError
                                }
                            </span>


                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(
                                        getAllSubmissions()
                                    )
                                }
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </div>

            ) : (

                <div className="reports-table-card">


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="reports-table-wrapper">

                        <table className="reports-table">

                            <thead>

                                <tr>

                                    <th>
                                        BDM
                                    </th>

                                    <th>
                                        Client
                                    </th>

                                    <th>
                                        End Client
                                    </th>

                                    <th>
                                        Job Name
                                    </th>

                                    <th>
                                        Priority
                                    </th>

                                    <th>
                                        Candidate ID
                                    </th>

                                    <th>
                                        Candidate
                                    </th>

                                    <th>
                                        CV ID
                                    </th>

                                    <th>
                                        Cand. Status
                                    </th>

                                    <th>
                                        Cand. Sub Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredSubmissions.length >
                                0 ? (

                                    filteredSubmissions.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.submissionId
                                                }
                                            >


                                                {/* BDM */}

                                                <td>

                                                    <span className="report-text">

                                                        {
                                                            displayValue(
                                                                item.bdm
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* CLIENT */}

                                                <td>

                                                    <span className="report-text report-client">

                                                        {
                                                            displayValue(
                                                                item.clientName
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* END CLIENT */}

                                                <td>

                                                    <span className="report-text">

                                                        {
                                                            displayValue(
                                                                item.endClientName
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* JOB NAME */}

                                                <td>

                                                    <div className="report-job-name-cell">

                                                        <span className="report-job-name">

                                                            {
                                                                displayValue(
                                                                    item.jobName
                                                                )
                                                            }

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* JOB PRIORITY */}

                                                <td>

                                                    <span
                                                        className={`report-job-priority-badge ${getBadgeClass(
                                                            item.jobPriority
                                                        )}`}
                                                    >

                                                        {
                                                            displayValue(
                                                                item.jobPriority
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* CANDIDATE ID */}

                                                <td>

                                                    <span className="report-candidate-id">

                                                        {
                                                            displayValue(
                                                                item.candidateId
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* CANDIDATE */}

                                                <td>

                                                    <div className="report-candidate-cell">


                                                        <div className="report-candidate-avatar">

                                                            {
                                                                getInitials(
                                                                    item.candidateName
                                                                )
                                                            }

                                                        </div>


                                                        <div className="report-candidate-info">


                                                            {/* NAME */}

                                                            <div className="report-candidate-name">

                                                                {
                                                                    displayValue(
                                                                        item.candidateName
                                                                    )
                                                                }

                                                            </div>


                                                            {/* DESIGNATION */}

                                                            <div className="report-candidate-designation">

                                                                {
                                                                    displayValue(
                                                                        item.candidateDesignation
                                                                    )
                                                                }

                                                            </div>


                                                            {/* CONTACT */}

                                                            <div className="report-candidate-contact">


                                                                {/* EMAIL */}

                                                                {item.candidateEmail ? (

                                                                    <a
                                                                        href={`mailto:${item.candidateEmail}`}
                                                                        className="report-candidate-contact-icon"
                                                                        title={
                                                                            item.candidateEmail
                                                                        }
                                                                    >

                                                                        <FiMail />

                                                                    </a>

                                                                ) : (

                                                                    <span
                                                                        className="report-candidate-contact-icon report-candidate-contact-disabled"
                                                                        title="Email not available"
                                                                    >

                                                                        <FiMail />

                                                                    </span>

                                                                )}


                                                                {/* PHONE */}

                                                                {item.candidatePhone ? (

                                                                    <a
                                                                        href={`tel:${item.candidatePhone}`}
                                                                        className="report-candidate-contact-icon"
                                                                        title={
                                                                            item.candidatePhone
                                                                        }
                                                                    >

                                                                        <FiPhone />

                                                                    </a>

                                                                ) : (

                                                                    <span
                                                                        className="report-candidate-contact-icon report-candidate-contact-disabled"
                                                                        title="Phone not available"
                                                                    >

                                                                        <FiPhone />

                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* CV ID */}

                                                <td>

                                                    <span className="report-cv-id">

                                                        {
                                                            displayValue(
                                                                item.candidateCVId
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* APPLICATION STATUS */}

                                                <td>

                                                    <span
                                                        className={`report-application-status-badge ${getBadgeClass(
                                                            item.statusName
                                                        )}`}
                                                    >

                                                        {
                                                            getApplicationStatusLabel(
                                                                item.statusName
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* SUB STATUS */}

                                                <td>

                                                    <span
                                                        className={`report-sub-status-badge ${
                                                            getBadgeClass(
                                                                item.subStatusName
                                                            )
                                                        }`}
                                                    >

                                                        {
                                                            displayValue(
                                                                item.subStatusName
                                                            )
                                                        }

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            className="empty-report"
                                        >

                                            <div className="empty-report-content">

                                                <div className="empty-report-icon">

                                                    <FiSearch />

                                                </div>


                                                <strong>
                                                    No submissions found
                                                </strong>


                                                <span>
                                                    Try adjusting your filters
                                                </span>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="reports-table-footer">

                        <span>

                            Showing{" "}

                            <strong>
                                {
                                    filteredSubmissions.length
                                }
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {
                                    submissionsPagination?.totalElements ??
                                    submissions.length
                                }
                            </strong>

                            {" "}submissions

                        </span>


                        <div className="report-pagination">

                            <button
                                type="button"
                                disabled={
                                    submissionsPagination?.first ??
                                    true
                                }
                            >
                                Previous
                            </button>


                            <span className="active-page">

                                {
                                    (
                                        submissionsPagination?.pageNumber ??
                                        0
                                    ) + 1
                                }

                            </span>


                            <button
                                type="button"
                                disabled={
                                    submissionsPagination?.last ??
                                    true
                                }
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default JobRoleReport;