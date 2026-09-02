import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    FiSearch,
    FiRotateCcw,
    FiChevronDown,
    FiChevronRight,
    FiMail,
    FiPhone,
    FiDownload,
    FiUsers,
    FiUserPlus,
    FiCheckCircle,
} from "react-icons/fi";

import { getAllSubmissions } from "../../Redux/Slice/employeeSlice";
import {
    getSubmissionFilters,
} from "../../Redux/Slice/reportSlice";

import "./JobRoleReport.css";
import ExcelJS from "exceljs";
import CommonPagination from "../../Components/CommonPagination";
import ReportExportModal from "./ReportExportModal";


function JobRoleReport() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        submissions = [],
        submissionsLoading,
        submissionsError,
        submissionsPagination,
    } = useSelector((state) => state.employees || {});

    const {
        submissionFilters = {},
    } = useSelector((state) => state.report || {});


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState("");
    const [jobFilter, setJobFilter] = useState("");
    const [applicationStatusFilter, setApplicationStatusFilter] = useState("");
    const [subStatusFilter, setSubStatusFilter] = useState("");
    const [clientFilter, setClientFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showExportModal, setShowExportModal] = useState(false);


    // =========================================================
    // GROUP EXPAND / COLLAPSE STATE
    // =========================================================

    const [expandedClients, setExpandedClients] = useState({});
    const [expandedEndClients, setExpandedEndClients] = useState({});
    const [expandedJobs, setExpandedJobs] = useState({});


    // =========================================================
    // SORT STATE
    // =========================================================

    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: "asc",
    });


    // =========================================================
    // API
    // =========================================================

    // =========================================================
    // JOBS
    // =========================================================

    const jobs = useMemo(() => {
        return submissionFilters?.jobs || [];
    }, [submissionFilters]);


    // =========================================================
    // CLIENTS
    // =========================================================

    const clients = useMemo(() => {
        return submissionFilters?.clients || [];
    }, [submissionFilters]);


    // =========================================================
    // APPLICATION STATUS
    // =========================================================

    const applicationStatuses = useMemo(() => {
        return (
            submissionFilters?.applicationStatusList || []
        ).map((status) => ({
            value: status.name,
            label: status.name?.replace(/_/g, " "),
            id: status.id,
            colourHex: status.colourHex,
        }));
    }, [submissionFilters]);

    useEffect(() => {
        // dispatch(getAllSubmissions());
        dispatch(getSubmissionFilters());
    }, [dispatch]);
useEffect(() => {
    const selectedStatus = applicationStatuses.find(
        (status) =>
            status.value === applicationStatusFilter
    );

    dispatch(
        getAllSubmissions({
            page: currentPage - 1,
            size: 20,
            search: search.trim(),
            jobId: jobFilter,
            statusId: selectedStatus?.id || "",
            clientId: clientFilter,
        })
    );
}, [
    dispatch,
    currentPage,
    search,
    jobFilter,
    applicationStatusFilter,
    clientFilter,
    applicationStatuses,
]);
useEffect(() => {
    setCurrentPage(1);
}, [
    search,
    jobFilter,
    applicationStatusFilter,
    clientFilter,
]);
    // =========================================================
    // SUB STATUS
    // =========================================================

    const subStatuses = useMemo(() => {
        const uniqueSubStatuses = new Set();

        submissions.forEach((item) => {
            if (item.subStatusName) {
                uniqueSubStatuses.add(item.subStatusName.trim());
            }
        });

        return Array.from(uniqueSubStatuses).sort();
    }, [submissions]);


    // =========================================================
    // FILTERED SUBMISSIONS
    // =========================================================

const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
        const matchesSubStatus =
            !subStatusFilter ||
            item.subStatusName?.trim() === subStatusFilter;

        return matchesSubStatus;
    });
}, [
    submissions,
    subStatusFilter,
]);

    // =========================================================
    // SORT
    // =========================================================

    const handleSort = (field) => {
        setSortConfig((current) => {
            if (current.field === field) {
                return {
                    field,
                    direction:
                        current.direction === "asc"
                            ? "desc"
                            : "asc",
                };
            }

            return {
                field,
                direction: "asc",
            };
        });
    };


    const getSortValue = (item, field) => {
        switch (field) {
            case "client":
                return item.clientName || "";

            case "endClient":
                return item.endClientName || "";

            case "job":
                return item.jobName || "";

            default:
                return "";
        }
    };


    // =========================================================
    // GROUPED DATA
    // =========================================================

    const groupedData = useMemo(() => {
        const groups = {};

        filteredSubmissions.forEach((item) => {
            const clientName =
                item.clientName?.trim() || "No Client";

            const endClientName =
                item.endClientName?.trim() || "No End Client";

            const jobName =
                item.jobName?.trim() || "Unnamed Job";


            if (!groups[clientName]) {
                groups[clientName] = {
                    name: clientName,
                    endClients: {},
                };
            }


            if (!groups[clientName].endClients[endClientName]) {
                groups[clientName].endClients[endClientName] = {
                    name: endClientName,
                    jobs: {},
                };
            }


            if (!groups[clientName].endClients[endClientName].jobs[jobName]) {
                groups[clientName].endClients[endClientName].jobs[jobName] = {
                    name: jobName,
                    submissions: [],
                };
            }


            groups[clientName]
                .endClients[endClientName]
                .jobs[jobName]
                .submissions
                .push(item);
        });


        let clientsArray = Object.values(groups);


        clientsArray.forEach((client) => {
            client.endClients = Object.values(client.endClients);

            client.endClients.forEach((endClient) => {
                endClient.jobs = Object.values(endClient.jobs);
            });
        });


        // ---------------------------------------------------------
        // SORT GROUPS
        // ---------------------------------------------------------

        const sortDirection =
            sortConfig.direction === "asc" ? 1 : -1;


        if (sortConfig.field === "client") {
            clientsArray.sort((a, b) =>
                a.name.localeCompare(b.name) * sortDirection
            );
        } else {
            clientsArray.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        }


        clientsArray.forEach((client) => {
            if (
                sortConfig.field === "endClient"
            ) {
                client.endClients.sort((a, b) =>
                    a.name.localeCompare(b.name) * sortDirection
                );
            } else {
                client.endClients.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            }


            client.endClients.forEach((endClient) => {
                if (
                    sortConfig.field === "job"
                ) {
                    endClient.jobs.sort((a, b) =>
                        a.name.localeCompare(b.name) * sortDirection
                    );
                } else {
                    endClient.jobs.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                }
            });
        });


        return clientsArray;
    }, [filteredSubmissions, sortConfig]);


    // =========================================================
    // EXPAND / COLLAPSE
    // =========================================================

    const toggleClient = (clientName) => {
        setExpandedClients((prev) => ({
            ...prev,
            [clientName]: !prev[clientName],
        }));
    };


    const toggleEndClient = (clientKey) => {
        setExpandedEndClients((prev) => ({
            ...prev,
            [clientKey]: !prev[clientKey],
        }));
    };


    const toggleJob = (jobKey) => {
        setExpandedJobs((prev) => ({
            ...prev,
            [jobKey]: !prev[jobKey],
        }));
    };


    // =========================================================
    // EXPAND ALL
    // =========================================================

    const expandAll = () => {
        const clientState = {};
        const endClientState = {};
        const jobState = {};


        groupedData.forEach((client) => {
            clientState[client.name] = true;


            client.endClients.forEach((endClient) => {
                const endKey =
                    `${client.name}__${endClient.name}`;

                endClientState[endKey] = true;


                endClient.jobs.forEach((job) => {
                    const jobKey =
                        `${client.name}__${endClient.name}__${job.name}`;

                    jobState[jobKey] = true;
                });
            });
        });


        setExpandedClients(clientState);
        setExpandedEndClients(endClientState);
        setExpandedJobs(jobState);
    };


    // =========================================================
    // COLLAPSE ALL
    // =========================================================

    const collapseAll = () => {
        setExpandedClients({});
        setExpandedEndClients({});
        setExpandedJobs({});
    };


    // =========================================================
    // STATUS CARDS
    // =========================================================

    const statusCards = [
        {
            label: "Submitted",
            value:
                submissionFilters?.totalSubmittedApplications || 0,
            icon: FiUserPlus,
            color: "#8B5CF6",
        },
        {
            label: "Interview",
            value:
                submissionFilters?.totalInterviewApplications || 0,
            icon: FiUsers,
            color: "#F59E0B",
        },
        {
            label: "Onboarded",
            value:
                submissionFilters?.totalOnboardedApplications || 0,
            icon: FiCheckCircle,
            color: "#16A34A",
        },
    ];


    // =========================================================
    // RESET
    // =========================================================

const resetFilters = () => {
    setSearch("");
    setJobFilter("");
    setClientFilter("");
    setApplicationStatusFilter("");
    setSubStatusFilter("");
    setCurrentPage(1);
};


    // =========================================================
    // HELPERS
    // =========================================================

    const getInitials = (name) => {
        if (!name) return "--";

        return name
            .split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };


    const displayValue = (value) => {
        return value || "—";
    };


    const getBadgeClass = (value) => {
        return (
            value
                ?.toLowerCase()
                .replace(/_/g, "-")
                .replace(/\s+/g, "-") || ""
        );
    };


    const getApplicationStatusLabel = (status) => {
        const found = applicationStatuses.find(
            (item) => item.value === status
        );

        return (
            found?.label ||
            status?.replace(/_/g, " ") ||
            "—"
        );
    };


    const handleCandidateClick = (candidateId) => {
        if (!candidateId) {
            console.warn("Candidate ID is missing");
            return;
        }

        navigate(
            `/dashboard/candidates/${candidateId}`
        );
    };


    // =========================================================
    // SORT ICON
    // =========================================================

    const getSortIcon = (field) => {
        if (sortConfig.field !== field) {
            return (
                <FiChevronDown className="sort-icon-neutral" />
            );
        }

        return (
            <FiChevronDown
                className={
                    sortConfig.direction === "asc"
                        ? "sort-icon-asc"
                        : "sort-icon-desc"
                }
            />
        );
    };


    // =========================================================
    // EXPORT
    // =========================================================

    const handleExport = async () => {
        if (!filteredSubmissions.length) return;


        const workbook = new ExcelJS.Workbook();

        const worksheet =
            workbook.addWorksheet(
                "Submission Report"
            );


        worksheet.columns = [
            {
                header: "Client",
                key: "client",
                width: 25,
            },
            {
                header: "End Client",
                key: "endClient",
                width: 25,
            },
            {
                header: "Job Name",
                key: "jobName",
                width: 32,
            },
            {
                header: "BDM",
                key: "bdm",
                width: 22,
            },
            {
                header: "Job Priority",
                key: "jobPriority",
                width: 15,
            },
            {
                header: "CV ID",
                key: "cvId",
                width: 20,
            },
            {
                header: "Candidate Name",
                key: "candidateName",
                width: 25,
            },
            {
                header: "Candidate Designation",
                key: "candidateDesignation",
                width: 25,
            },
            {
                header: "Email",
                key: "email",
                width: 32,
            },
            {
                header: "Phone",
                key: "phone",
                width: 20,
            },
            {
                header: "Candidate Status",
                key: "candidateStatus",
                width: 22,
            },
            {
                header: "Candidate Sub Status",
                key: "candidateSubStatus",
                width: 25,
            },
        ];


        // Export in grouped/sorted order
        groupedData.forEach((client) => {
            client.endClients.forEach((endClient) => {
                endClient.jobs.forEach((job) => {
                    job.submissions.forEach((item) => {
                        const phone = item.candidatePhone
                            ? String(item.candidatePhone)
                            : "";


                        const row =
                            worksheet.addRow({
                                client:
                                    item.clientName || "",

                                endClient:
                                    item.endClientName || "",

                                jobName:
                                    item.jobName || "",

                                bdm:
                                    item.BDM || "",

                                jobPriority:
                                    item.jobPriority || "",

                                cvId:
                                    item.candidateCVId || "",

                                candidateName:
                                    item.candidateName || "",

                                candidateDesignation:
                                    item.candidateDesignation || "",

                                email:
                                    item.candidateEmail || "",

                                phone,

                                candidateStatus:
                                    getApplicationStatusLabel(
                                        item.statusName
                                    ),

                                candidateSubStatus:
                                    item.subStatusName || "",
                            });


                        row.getCell("phone").numFmt = "@";
                        row.getCell("phone").value =
                            phone;
                    });
                });
            });
        });


        // Header styling
        const headerRow =
            worksheet.getRow(1);

        headerRow.height = 25;


        headerRow.eachCell((cell) => {
            cell.font = {
                name: "Calibri",
                size: 11,
                bold: true,
                color: {
                    argb: "FF263B57",
                },
            };

            cell.alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            cell.border = {
                top: {
                    style: "thin",
                    color: {
                        argb: "FFD9E1EB",
                    },
                },

                bottom: {
                    style: "thin",
                    color: {
                        argb: "FFD9E1EB",
                    },
                },

                left: {
                    style: "thin",
                    color: {
                        argb: "FFD9E1EB",
                    },
                },

                right: {
                    style: "thin",
                    color: {
                        argb: "FFD9E1EB",
                    },
                },
            };
        });


        worksheet.eachRow(
            (row, rowNumber) => {
                if (rowNumber === 1) return;


                row.height = 22;


                row.eachCell(
                    (
                        cell,
                        columnNumber
                    ) => {
                        cell.font = {
                            name: "Calibri",
                            size: 11,
                            color: {
                                argb: "FF263B57",
                            },
                        };


                        if (
                            columnNumber === 10
                        ) {
                            cell.numFmt = "@";
                        }


                        cell.alignment = {
                            vertical:
                                "middle",

                            horizontal:
                                columnNumber ===
                                    5 ||
                                    columnNumber ===
                                    10 ||
                                    columnNumber ===
                                    11 ||
                                    columnNumber ===
                                    12
                                    ? "center"
                                    : "left",
                        };


                        cell.border = {
                            top: {
                                style: "thin",
                                color: {
                                    argb:
                                        "FFE2E6ED",
                                },
                            },

                            bottom: {
                                style: "thin",
                                color: {
                                    argb:
                                        "FFE2E6ED",
                                },
                            },

                            left: {
                                style: "thin",
                                color: {
                                    argb:
                                        "FFE2E6ED",
                                },
                            },

                            right: {
                                style: "thin",
                                color: {
                                    argb:
                                        "FFE2E6ED",
                                },
                            },
                        };
                    }
                );
            }
        );


        worksheet.views = [
            {
                state: "frozen",
                ySplit: 1,
            },
        ];


        const buffer =
            await workbook.xlsx.writeBuffer();


        const blob = new Blob(
            [buffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }
        );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;
        link.download =
            "submission-report.xlsx";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="reports-page">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="reports-header">

                <div className="report-header-left">
                    <div>
                        <h1>
                            Reports Dashboard
                        </h1>

                        <p>
                            Track candidate
                            submissions, jobs,
                            and recruitment
                            status at a glance
                        </p>
                    </div>
                </div>


<button
    type="button"
    className="primary-btn"
    onClick={() => setShowExportModal(true)}
    disabled={!filteredSubmissions.length}
>
    <FiDownload />

    <span>
        Export Report
    </span>
</button>

            </div>


            {/* =====================================================
                STATUS CARDS
            ====================================================== */}

            <div className="report-status-cards">

                {statusCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
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
                                    {card.label}
                                </span>

                                <strong className="report-status-card-count">
                                    {card.value}
                                </strong>

                            </div>
                        </div>
                    );
                })}

            </div>


            {/* =====================================================
                FILTERS
            ====================================================== */}

            <div className="reports-filter-card">

                <div className="report-search">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search candidates, IDs, emails..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* JOB */}

                <div className="report-select">

                    <select
                        value={jobFilter}
                        onChange={(e) =>
                            setJobFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            All Jobs
                        </option>

                        {jobs.map((job) => (
                            <option
                                key={job.id}
                                value={job.id}
                            >
                                {job.name}
                            </option>
                        ))}
                    </select>

                    <FiChevronDown />

                </div>


                {/* CLIENT */}

                <div className="report-select">

                    <select
                        value={clientFilter}
                        onChange={(e) =>
                            setClientFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            All Clients
                        </option>

                        {clients.map((client) => (
                            <option
                                key={client.id}
                                value={client.id}
                            >
                                {client.name}
                            </option>
                        ))}

                    </select>

                    <FiChevronDown />

                </div>


                {/* APPLICATION STATUS */}

                <div className="report-select">

                    <select
                        value={
                            applicationStatusFilter
                        }
                        onChange={(e) =>
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
                                    {status.label}
                                </option>
                            )
                        )}

                    </select>

                    <FiChevronDown />

                </div>


                {/* RESET */}

                <button
                    className="report-reset-btn"
                    onClick={resetFilters}
                    type="button"
                >
                    <FiRotateCcw />

                    <span>
                        Reset
                    </span>

                </button>

            </div>


            {/* =====================================================
                LOADING / ERROR
            ====================================================== */}

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
                                {submissionsError}
                            </span>

                            <button
                                type="button"
onClick={() => {
    const selectedStatus = applicationStatuses.find(
        (status) =>
            status.value === applicationStatusFilter
    );

    dispatch(
        getAllSubmissions({
            page: currentPage - 1,
            size: 20,
            search: search.trim(),
            jobId: jobFilter,
            statusId: selectedStatus?.id || "",
            clientId: clientFilter,
        })
    );
}}
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </div>

            ) : (

                <div className="reports-table-card">

                    {/* =================================================
                        GROUP CONTROLS
                    ================================================== */}

                    <div className="report-group-toolbar">

                        <div className="report-group-title">

                            <strong>
                                Submission Details
                            </strong>

                            <span>
                                {filteredSubmissions.length} submissions
                            </span>

                        </div>


                        <div className="report-group-actions">

                            <button
                                type="button"
                                onClick={expandAll}
                            >
                                Expand All
                            </button>

                            <button
                                type="button"
                                onClick={collapseAll}
                            >
                                Collapse All
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================== */}

                    <div className="reports-table-wrapper">

                        <table className="reports-table">

                            <thead>

                                <tr>

                                    {/* CLIENT */}

                                    <th>
                                        <button
                                            type="button"
                                            className="report-sort-header"
                                            onClick={() =>
                                                handleSort(
                                                    "client"
                                                )
                                            }
                                        >
                                            <span>
                                                Client
                                            </span>

                                            {getSortIcon(
                                                "client"
                                            )}
                                        </button>
                                    </th>


                                    {/* END CLIENT */}

                                    <th>
                                        <button
                                            type="button"
                                            className="report-sort-header"
                                            onClick={() =>
                                                handleSort(
                                                    "endClient"
                                                )
                                            }
                                        >
                                            <span>
                                                End Client
                                            </span>

                                            {getSortIcon(
                                                "endClient"
                                            )}
                                        </button>
                                    </th>


                                    {/* JOB */}

                                    <th>
                                        <button
                                            type="button"
                                            className="report-sort-header"
                                            onClick={() =>
                                                handleSort(
                                                    "job"
                                                )
                                            }
                                        >
                                            <span>
                                                Job Name
                                            </span>

                                            {getSortIcon(
                                                "job"
                                            )}
                                        </button>
                                    </th>


                                    <th>
                                        BDM
                                    </th>

                                    <th>
                                        Priority
                                    </th>

                                    <th>
                                        CV ID
                                    </th>

                                    <th>
                                        Candidate
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

                                {groupedData.length > 0 ? (

                                    groupedData.map(
                                        (client) => {

                                            const clientExpanded =
                                                expandedClients[
                                                client.name
                                                ];


                                            return (
                                                <React.Fragment
                                                    key={
                                                        client.name
                                                    }
                                                >

                                                    {/* =================================================
                                                        CLIENT ROW
                                                    ================================================== */}

                                                    <tr
                                                        className="report-client-group-row"
                                                        onClick={() =>
                                                            toggleClient(
                                                                client.name
                                                            )
                                                        }
                                                    >

                                                        <td
                                                            colSpan="9"
                                                        >

                                                            <div className="report-group-row-content">

                                                                <span className="report-expand-icon">

                                                                    {clientExpanded ? (
                                                                        <FiChevronDown />
                                                                    ) : (
                                                                        <FiChevronRight />
                                                                    )}

                                                                </span>


                                                                <span className="report-group-label report-group-client-label">
                                                                    {client.name}
                                                                </span>


                                                                <span className="report-group-count">
                                                                    {
                                                                        client.endClients.reduce(
                                                                            (
                                                                                total,
                                                                                endClient
                                                                            ) =>
                                                                                total +
                                                                                endClient.jobs.reduce(
                                                                                    (
                                                                                        jobTotal,
                                                                                        job
                                                                                    ) =>
                                                                                        jobTotal +
                                                                                        job.submissions.length,
                                                                                    0
                                                                                ),
                                                                            0
                                                                        )
                                                                    }{" "}
                                                                    submissions
                                                                </span>

                                                            </div>

                                                        </td>

                                                    </tr>


                                                    {/* =================================================
                                                        END CLIENTS
                                                    ================================================== */}

                                                    {clientExpanded &&
                                                        client.endClients.map(
                                                            (
                                                                endClient
                                                            ) => {

                                                                const endKey =
                                                                    `${client.name}__${endClient.name}`;

                                                                const endExpanded =
                                                                    expandedEndClients[
                                                                    endKey
                                                                    ];


                                                                const endClientCount =
                                                                    endClient.jobs.reduce(
                                                                        (
                                                                            total,
                                                                            job
                                                                        ) =>
                                                                            total +
                                                                            job.submissions.length,
                                                                        0
                                                                    );


                                                                return (
                                                                    <React.Fragment
                                                                        key={
                                                                            endKey
                                                                        }
                                                                    >

                                                                        <tr
                                                                            className="report-end-client-group-row"
                                                                            onClick={() =>
                                                                                toggleEndClient(
                                                                                    endKey
                                                                                )
                                                                            }
                                                                        >

                                                                            <td
                                                                                colSpan="9"
                                                                            >

                                                                                <div className="report-group-row-content report-end-client-content">

                                                                                    <span className="report-expand-icon">

                                                                                        {endExpanded ? (
                                                                                            <FiChevronDown />
                                                                                        ) : (
                                                                                            <FiChevronRight />
                                                                                        )}

                                                                                    </span>


                                                                                    <span className="report-group-label report-group-end-client-label">
                                                                                        {endClient.name}
                                                                                    </span>


                                                                                    <span className="report-group-count">
                                                                                        {
                                                                                            endClientCount
                                                                                        }{" "}
                                                                                        submissions
                                                                                    </span>

                                                                                </div>

                                                                            </td>

                                                                        </tr>


                                                                        {/* =========================================
                                                                            JOBS
                                                                        ========================================== */}

                                                                        {endExpanded &&
                                                                            endClient.jobs.map(
                                                                                (
                                                                                    job
                                                                                ) => {

                                                                                    const jobKey =
                                                                                        `${client.name}__${endClient.name}__${job.name}`;

                                                                                    const jobExpanded =
                                                                                        expandedJobs[
                                                                                        jobKey
                                                                                        ];


                                                                                    return (
                                                                                        <React.Fragment
                                                                                            key={
                                                                                                jobKey
                                                                                            }
                                                                                        >

                                                                                            {/* JOB GROUP ROW */}

                                                                                            <tr
                                                                                                className="report-job-group-row"
                                                                                                onClick={() =>
                                                                                                    toggleJob(
                                                                                                        jobKey
                                                                                                    )
                                                                                                }
                                                                                            >

                                                                                                <td
                                                                                                    colSpan="9"
                                                                                                >

                                                                                                    <div className="report-group-row-content report-job-group-content">

                                                                                                        <span className="report-expand-icon">

                                                                                                            {jobExpanded ? (
                                                                                                                <FiChevronDown />
                                                                                                            ) : (
                                                                                                                <FiChevronRight />
                                                                                                            )}

                                                                                                        </span>


                                                                                                        <span className="report-group-label report-group-job-label">
                                                                                                            {job.name}
                                                                                                        </span>


                                                                                                        <span className="report-group-count">
                                                                                                            {
                                                                                                                job.submissions.length
                                                                                                            }{" "}
                                                                                                            candidates
                                                                                                        </span>

                                                                                                    </div>

                                                                                                </td>

                                                                                            </tr>


                                                                                            {/* =========================================
                                                                                                CANDIDATES
                                                                                            ========================================== */}

                                                                                            {jobExpanded &&
                                                                                                job.submissions.map(
                                                                                                    (
                                                                                                        item
                                                                                                    ) => (

                                                                                                        <tr
                                                                                                            key={
                                                                                                                item.submissionId
                                                                                                            }
                                                                                                            className="report-candidate-data-row"
                                                                                                        >

                                                                                                            {/* CLIENT */}

                                                                                                            <td>

                                                                                                                <span className="report-text report-client">

                                                                                                                    {displayValue(
                                                                                                                        item.clientName
                                                                                                                    )}

                                                                                                                </span>

                                                                                                            </td>


                                                                                                            {/* END CLIENT */}

                                                                                                            <td>

                                                                                                                <span className="report-text">

                                                                                                                    {displayValue(
                                                                                                                        item.endClientName
                                                                                                                    )}

                                                                                                                </span>

                                                                                                            </td>


                                                                                                            {/* JOB */}

                                                                                                            <td>

                                                                                                                <div className="report-job-name-cell">

                                                                                                                    <span className="report-job-name">

                                                                                                                        {displayValue(
                                                                                                                            item.jobName
                                                                                                                        )}

                                                                                                                    </span>

                                                                                                                </div>

                                                                                                            </td>


                                                                                                            {/* BDM */}

                                                                                                            <td>

                                                                                                                <span className="report-bdm">

                                                                                                                    {displayValue(
                                                                                                                        item.BDM
                                                                                                                    )}

                                                                                                                </span>

                                                                                                            </td>


                                                                                                            {/* PRIORITY */}

                                                                                                            <td>

                                                                                                                <span
                                                                                                                    className={`report-job-priority-badge ${getBadgeClass(
                                                                                                                        item.jobPriority
                                                                                                                    )}`}
                                                                                                                >

                                                                                                                    {displayValue(
                                                                                                                        item.jobPriority
                                                                                                                    )}

                                                                                                                </span>

                                                                                                            </td>


                                                                                                            {/* CV ID */}

                                                                                                            <td>

                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    className="report-cv-id report-cv-id-clickable"
                                                                                                                    onClick={(
                                                                                                                        e
                                                                                                                    ) => {
                                                                                                                        e.stopPropagation();

                                                                                                                        handleCandidateClick(
                                                                                                                            item.candidateId
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    disabled={
                                                                                                                        !item.candidateId
                                                                                                                    }
                                                                                                                >

                                                                                                                    {displayValue(
                                                                                                                        item.candidateCVId
                                                                                                                    )}

                                                                                                                </button>

                                                                                                            </td>


                                                                                                            {/* CANDIDATE */}

                                                                                                            <td>

                                                                                                                <div className="report-candidate-cell">

                                                                                                                    <div className="report-candidate-avatar">

                                                                                                                        {getInitials(
                                                                                                                            item.candidateName
                                                                                                                        )}

                                                                                                                    </div>


                                                                                                                    <div className="report-candidate-info">

                                                                                                                        <div className="report-candidate-name">

                                                                                                                            {displayValue(
                                                                                                                                item.candidateName
                                                                                                                            )}

                                                                                                                        </div>


                                                                                                                        <div className="report-candidate-designation">

                                                                                                                            {displayValue(
                                                                                                                                item.candidateDesignation
                                                                                                                            )}

                                                                                                                        </div>


                                                                                                                        <div className="report-candidate-contact">

                                                                                                                            {item.candidateEmail ? (

                                                                                                                                <a
                                                                                                                                    href={`mailto:${item.candidateEmail}`}
                                                                                                                                    className="report-candidate-contact-icon"
                                                                                                                                    title={
                                                                                                                                        item.candidateEmail
                                                                                                                                    }
                                                                                                                                    onClick={(
                                                                                                                                        e
                                                                                                                                    ) =>
                                                                                                                                        e.stopPropagation()
                                                                                                                                    }
                                                                                                                                >

                                                                                                                                    <FiMail />

                                                                                                                                </a>

                                                                                                                            ) : (

                                                                                                                                <span className="report-candidate-contact-icon report-candidate-contact-disabled">

                                                                                                                                    <FiMail />

                                                                                                                                </span>

                                                                                                                            )}


                                                                                                                            {item.candidatePhone ? (

                                                                                                                                <a
                                                                                                                                    href={`tel:${item.candidatePhone}`}
                                                                                                                                    className="report-candidate-contact-icon"
                                                                                                                                    title={
                                                                                                                                        item.candidatePhone
                                                                                                                                    }
                                                                                                                                    onClick={(
                                                                                                                                        e
                                                                                                                                    ) =>
                                                                                                                                        e.stopPropagation()
                                                                                                                                    }
                                                                                                                                >

                                                                                                                                    <FiPhone />

                                                                                                                                </a>

                                                                                                                            ) : (

                                                                                                                                <span className="report-candidate-contact-icon report-candidate-contact-disabled">

                                                                                                                                    <FiPhone />

                                                                                                                                </span>

                                                                                                                            )}

                                                                                                                        </div>

                                                                                                                    </div>

                                                                                                                </div>

                                                                                                            </td>


                                                                                                            {/* STATUS */}

                                                                                                            <td>

                                                                                                                <span
                                                                                                                    className={`report-application-status-badge ${getBadgeClass(
                                                                                                                        item.statusName
                                                                                                                    )}`}
                                                                                                                >

                                                                                                                    {getApplicationStatusLabel(
                                                                                                                        item.statusName
                                                                                                                    )}

                                                                                                                </span>

                                                                                                            </td>


                                                                                                            {/* SUB STATUS */}

                                                                                                            <td>

                                                                                                                <span
                                                                                                                    className={`report-sub-status-badge ${getBadgeClass(
                                                                                                                        item.subStatusName
                                                                                                                    )}`}
                                                                                                                >

                                                                                                                    {displayValue(
                                                                                                                        item.subStatusName
                                                                                                                    )}

                                                                                                                </span>

                                                                                                            </td>

                                                                                                        </tr>

                                                                                                    )
                                                                                                )}

                                                                                        </React.Fragment>
                                                                                    );
                                                                                }
                                                                            )}

                                                                    </React.Fragment>
                                                                );
                                                            }
                                                        )}

                                                </React.Fragment>
                                            );
                                        }
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="9"
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
                    ================================================== */}

<CommonPagination
    currentPage={currentPage}
    totalPages={
        submissionsPagination?.totalPages || 0
    }
    totalItems={
        submissionsPagination?.totalElements || 0
    }
    itemsPerPage={
        submissionsPagination?.pageSize || 20
    }
    onPageChange={(page) => {
        setCurrentPage(page);
    }}
    itemLabel="submissions"
/>

                </div>

            )}
            {/* {showExportModal && (
    <ReportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
    />
)} */}
{showExportModal && (
    <ReportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}

        initialFilters={{
            jobId: jobFilter,
            clientId: clientFilter,
            statusId:
                applicationStatuses.find(
                    (status) =>
                        status.value ===
                        applicationStatusFilter
                )?.id || "",
        }}
    />
)}
        </div>
    );
}


export default JobRoleReport;