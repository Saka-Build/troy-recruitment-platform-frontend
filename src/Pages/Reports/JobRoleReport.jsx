import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import ExcelJS from "exceljs";

import "./JobRoleReport.css";

import {
    getAllJobs,
} from "../../Redux/Slice/jobSlice";

import {
    getAllCandidates,
    getAllEmployees,
} from "../../Redux/Slice/candidateSlice";


/*
|--------------------------------------------------------------------------
| STATIC APPLICATION DATA
|--------------------------------------------------------------------------
| Temporary until Application API is available.
*/

const STATIC_APPLICATIONS = [
    {
        id: "APP001",
        jobId: "VEAKL317",
        candidateId: "CAND001",
        team: "Aakila",
        roleSubStatus: "Critical",
        applicationStatus: "Submitted",
        candidateSubStatus: "Awaiting client feedback",
    },

    {
        id: "APP002",
        jobId: "VEAKL317",
        candidateId: "CAND002",
        team: "Aakila",
        roleSubStatus: "Critical",
        applicationStatus: "Submitted",
        candidateSubStatus: "Awaiting client feedback",
    },

    {
        id: "APP003",
        jobId: "NTAKL338",
        candidateId: "CAND003",
        team: "Aakila",
        roleSubStatus: "Critical",
        applicationStatus: "Submitted",
        candidateSubStatus: "Awaiting client feedback",
    },

    {
        id: "APP004",
        jobId: "NTDBL501",
        candidateId: "CAND004",
        team: "Sweety",
        roleSubStatus: "Critical",
        applicationStatus: "Submitted",
        candidateSubStatus: "Awaiting client feedback",
    },

    {
        id: "APP005",
        jobId: "NTSPO055",
        candidateId: "CAND005",
        team: "Sweety",
        roleSubStatus: "Critical",
        applicationStatus: "Submitted",
        candidateSubStatus: "Awaiting client feedback",
    },
];


const JobRoleReport = () => {

    const dispatch = useDispatch();


    /*
    |--------------------------------------------------------------------------
    | REDUX
    |--------------------------------------------------------------------------
    */

    const {
        jobs = [],
        isFetching: jobsLoading,
    } = useSelector(
        (state) => state.jobs
    );


    const {
        candidates = [],
        employees = [],
        loading: candidatesLoading,
        employeesLoading,
    } = useSelector(
        (state) => state.candidate
    );


    /*
    |--------------------------------------------------------------------------
    | FILTER STATE
    |--------------------------------------------------------------------------
    */

    const [
        search,
        setSearch,
    ] = useState("");


    const [
        jobStatus,
        setJobStatus,
    ] = useState("All");


    const [
        candidateStatus,
        setCandidateStatus,
    ] = useState("All");


    const [
        applicationStatus,
        setApplicationStatus,
    ] = useState("All");


    const [
        teamFilter,
        setTeamFilter,
    ] = useState("All");


    const [
        ownerFilter,
        setOwnerFilter,
    ] = useState("All");


    const [
        noticePeriodFilter,
        setNoticePeriodFilter,
    ] = useState("All");


    /*
    |--------------------------------------------------------------------------
    | FETCH DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        dispatch(
            getAllJobs()
        );

        dispatch(
            getAllCandidates()
        );

        dispatch(
            getAllEmployees()
        );

    }, [dispatch]);


    /*
    |--------------------------------------------------------------------------
    | CREATE REPORT ROWS
    |--------------------------------------------------------------------------
    */

    const reportRows = useMemo(() => {

        const rows = [];


        STATIC_APPLICATIONS.forEach(
            (application) => {

                const job =
                    jobs.find(
                        (item) =>
                            item.jobId ===
                            application.jobId ||
                            item.id ===
                            application.jobId
                    );


                const candidate =
                    candidates.find(
                        (item) =>
                            item.id ===
                            application.candidateId ||
                            item.cvId ===
                            application.candidateId
                    );


                /*
                 * If application has no matching
                 * job/candidate, still don't crash.
                 */

                if (!job && !candidate) {
                    return;
                }


                const owner =
                    candidate?.cvOwnerName ||
                    "";


                const noticePeriod =
                    candidate?.noticePeriodDays;


                let noticePeriodText =
                    "—";


                if (
                    noticePeriod === 0 ||
                    noticePeriod === "0"
                ) {

                    noticePeriodText =
                        "Immediate";

                } else if (
                    noticePeriod !== null &&
                    noticePeriod !== undefined &&
                    noticePeriod !== ""
                ) {

                    noticePeriodText =
                        `${noticePeriod} days`;

                }


                rows.push({

                    applicationId:
                        application.id,

                    jobId:
                        job?.jobId ||
                        application.jobId ||
                        "—",

                    jobName:
                        job?.title ||
                        "—",

                    client:
                        job?.clientName ||
                        "—",

                    endClient:
                        job?.endClientName ||
                        "—",

                    location:
                        job?.location ||
                        "—",

                    jobStatus:
                        job?.status ||
                        "—",

                    priority:
                        job?.priority ||
                        "—",

                    team:
                        application.team ||
                        "—",

                    roleSubStatus:
                        application.roleSubStatus ||
                        "—",

                    candidateId:
                        candidate?.cvId ||
                        candidate?.id ||
                        "—",

                    candidateName:
                        candidate?.fullName ||
                        "—",

                    candidateStatus:
                        candidate?.status ||
                        "Active",

                    candidateSubStatus:
                        application.candidateSubStatus ||
                        "—",

                    applicationStatus:
                        application.applicationStatus ||
                        "—",

                    noticePeriod:
                        noticePeriodText,

                    noticePeriodDays:
                        noticePeriod,

                    phone:
                        candidate?.phone ||
                        "—",

                    email:
                        candidate?.email ||
                        "—",

                    owner:
                        owner ||
                        "—",

                    originalCV:
                        candidate?.originalCV ||
                        candidate?.originalCv ||
                        null,

                });

            }
        );


        return rows;

    }, [
        jobs,
        candidates,
    ]);


    /*
    |--------------------------------------------------------------------------
    | FILTER OPTIONS
    |--------------------------------------------------------------------------
    */

    const teams =
        useMemo(
            () => [
                "All",
                ...new Set(
                    reportRows
                        .map(
                            (row) =>
                                row.team
                        )
                        .filter(
                            (value) =>
                                value &&
                                value !== "—"
                        )
                ),
            ],
            [reportRows]
        );


    const owners =
        useMemo(
            () => [
                "All",
                ...new Set(
                    reportRows
                        .map(
                            (row) =>
                                row.owner
                        )
                        .filter(
                            (value) =>
                                value &&
                                value !== "—"
                        )
                ),
            ],
            [reportRows]
        );


    /*
    |--------------------------------------------------------------------------
    | FILTERED REPORT
    |--------------------------------------------------------------------------
    */

    const filteredRows =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return reportRows.filter(
                (row) => {

                    const searchMatch =
                        !query ||
                        [
                            row.jobId,
                            row.jobName,
                            row.client,
                            row.endClient,
                            row.candidateId,
                            row.candidateName,
                            row.phone,
                            row.email,
                            row.owner,
                            row.team,
                            row.applicationStatus,
                            row.candidateStatus,
                            row.candidateSubStatus,
                        ]
                            .some(
                                (value) =>
                                    String(
                                        value ||
                                        ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            query
                                        )
                            );


                    const jobStatusMatch =
                        jobStatus === "All" ||
                        row.jobStatus ===
                            jobStatus;


                    const candidateStatusMatch =
                        candidateStatus === "All" ||
                        row.candidateStatus ===
                            candidateStatus;


                    const applicationStatusMatch =
                        applicationStatus === "All" ||
                        row.applicationStatus ===
                            applicationStatus;


                    const teamMatch =
                        teamFilter === "All" ||
                        row.team ===
                            teamFilter;


                    const ownerMatch =
                        ownerFilter === "All" ||
                        row.owner ===
                            ownerFilter;


                    let noticeMatch =
                        true;


                    if (
                        noticePeriodFilter !==
                        "All"
                    ) {

                        if (
                            noticePeriodFilter ===
                            "Immediate"
                        ) {

                            noticeMatch =
                                row.noticePeriodDays ===
                                    0 ||
                                row.noticePeriodDays ===
                                    "0";

                        } else if (
                            noticePeriodFilter ===
                            "30 days"
                        ) {

                            noticeMatch =
                                Number(
                                    row.noticePeriodDays
                                ) === 30;

                        } else if (
                            noticePeriodFilter ===
                            "60+ days"
                        ) {

                            noticeMatch =
                                Number(
                                    row.noticePeriodDays
                                ) >= 60;

                        }

                    }


                    return (
                        searchMatch &&
                        jobStatusMatch &&
                        candidateStatusMatch &&
                        applicationStatusMatch &&
                        teamMatch &&
                        ownerMatch &&
                        noticeMatch
                    );

                }
            );

        }, [
            reportRows,
            search,
            jobStatus,
            candidateStatus,
            applicationStatus,
            teamFilter,
            ownerFilter,
            noticePeriodFilter,
        ]);


    /*
    |--------------------------------------------------------------------------
    | CLEAR FILTERS
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {

        setSearch("");

        setJobStatus("All");

        setCandidateStatus("All");

        setApplicationStatus("All");

        setTeamFilter("All");

        setOwnerFilter("All");

        setNoticePeriodFilter("All");

    };


    /*
    |--------------------------------------------------------------------------
    | GROUP BY JOB ROLE
    |--------------------------------------------------------------------------
    */

    const groupedRows =
        useMemo(() => {

            const groups = {};


            filteredRows.forEach(
                (row) => {

                    if (!groups[row.jobId]) {

                        groups[row.jobId] = {

                            job: row,

                            candidates: [],

                        };

                    }


                    groups[
                        row.jobId
                    ].candidates.push(
                        row
                    );

                }
            );


            return Object.values(
                groups
            );

        }, [
            filteredRows,
        ]);


    /*
    |--------------------------------------------------------------------------
    | STATS
    |--------------------------------------------------------------------------
    */

    const totalApplications =
        filteredRows.length;


    const submitted =
        filteredRows.filter(
            (row) =>
                row.applicationStatus
                    ?.toLowerCase() ===
                "submitted"
        ).length;


    const awaitingFeedback =
        filteredRows.filter(
            (row) =>
                row.candidateSubStatus
                    ?.toLowerCase()
                    .includes(
                        "awaiting"
                    )
        ).length;


    const uniqueRoles =
        new Set(
            filteredRows.map(
                (row) =>
                    row.jobId
            )
        ).size;


    /*
    |--------------------------------------------------------------------------
    | EXPORT EXCEL
    |--------------------------------------------------------------------------
    */

    const handleExportExcel =
        async () => {

            const workbook =
                new ExcelJS.Workbook();


            const worksheet =
                workbook.addWorksheet(
                    "Job Role Report"
                );


            worksheet.columns = [

                {
                    header: "Role Name",
                    key: "jobName",
                    width: 30,
                },

                {
                    header: "Team",
                    key: "team",
                    width: 18,
                },

                {
                    header: "Role Substat",
                    key: "roleSubStatus",
                    width: 18,
                },

                {
                    header: "ID",
                    key: "candidateId",
                    width: 18,
                },

                {
                    header: "Original CV Link",
                    key: "originalCV",
                    width: 25,
                },

                {
                    header: "Name",
                    key: "candidateName",
                    width: 25,
                },

                {
                    header: "Cand Status",
                    key: "candidateStatus",
                    width: 18,
                },

                {
                    header: "Cand. Sub-Status",
                    key: "candidateSubStatus",
                    width: 28,
                },

                {
                    header: "Application Status",
                    key: "applicationStatus",
                    width: 22,
                },

                {
                    header: "NP",
                    key: "noticePeriod",
                    width: 15,
                },

                {
                    header: "Phone",
                    key: "phone",
                    width: 20,
                },

                {
                    header: "Email",
                    key: "email",
                    width: 32,
                },

                {
                    header: "Owner",
                    key: "owner",
                    width: 22,
                },

                {
                    header: "Client",
                    key: "client",
                    width: 22,
                },

                {
                    header: "End Client",
                    key: "endClient",
                    width: 22,
                },

                {
                    header: "Job Status",
                    key: "jobStatus",
                    width: 15,
                },

            ];


            filteredRows.forEach(
                (row) => {

                    worksheet.addRow({

                        jobName:
                            row.jobName,

                        team:
                            row.team,

                        roleSubStatus:
                            row.roleSubStatus,

                        candidateId:
                            row.candidateId,

                        originalCV:
                            row.originalCV ||
                            "",

                        candidateName:
                            row.candidateName,

                        candidateStatus:
                            row.candidateStatus,

                        candidateSubStatus:
                            row.candidateSubStatus,

                        applicationStatus:
                            row.applicationStatus,

                        noticePeriod:
                            row.noticePeriod,

                        phone:
                            row.phone,

                        email:
                            row.email,

                        owner:
                            row.owner,

                        client:
                            row.client,

                        endClient:
                            row.endClient,

                        jobStatus:
                            row.jobStatus,

                    });

                }
            );


            /*
             * Header styling
             */

            const headerRow =
                worksheet.getRow(1);


            headerRow.height = 28;


            headerRow.eachCell(
                (cell) => {

                    cell.font = {
                        bold: true,
                    };

                    cell.alignment = {
                        vertical:
                            "middle",
                        horizontal:
                            "center",
                    };

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


            const blob =
                new Blob(
                    [buffer],
                    {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
                "job-role-report.xlsx";


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
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    const loading =
        jobsLoading ||
        candidatesLoading ||
        employeesLoading;


    return (

        <div className="job-role-report-page">

            {/* HEADER */}

            <div className="job-role-report-header">

                <div>

                    <h1>
                        Job Role Report
                    </h1>

                    <p>
                        Candidate applications
                        by job role
                    </p>

                </div>


                <button
                    type="button"
                    className="job-role-report-export"
                    onClick={
                        handleExportExcel
                    }
                    disabled={
                        filteredRows.length === 0
                    }
                >

                    <i className="bi bi-download"></i>

                    Export Excel

                </button>

            </div>


            {/* STATS */}

            <div className="job-role-report-stats">

                <div className="report-stat-card">

                    <strong>
                        {uniqueRoles}
                    </strong>

                    <span>
                        Job Roles
                    </span>

                </div>


                <div className="report-stat-card">

                    <strong>
                        {totalApplications}
                    </strong>

                    <span>
                        Applications
                    </span>

                </div>


                <div className="report-stat-card">

                    <strong>
                        {submitted}
                    </strong>

                    <span>
                        Submitted
                    </span>

                </div>


                <div className="report-stat-card">

                    <strong>
                        {awaitingFeedback}
                    </strong>

                    <span>
                        Awaiting Feedback
                    </span>

                </div>

            </div>


            {/* FILTERS */}

            <div className="job-role-report-filters">

                <div className="report-search">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search role, candidate, CV ID, email, phone..."
                    />

                </div>


                <select
                    value={jobStatus}
                    onChange={(e) =>
                        setJobStatus(
                            e.target.value
                        )
                    }
                >

                    <option value="All">
                        All job statuses
                    </option>

                    <option value="Open">
                        Open
                    </option>

                    <option value="Closed">
                        Closed
                    </option>

                    <option value="on_hold">
                        On hold
                    </option>

                </select>


                <select
                    value={candidateStatus}
                    onChange={(e) =>
                        setCandidateStatus(
                            e.target.value
                        )
                    }
                >

                    <option value="All">
                        All candidate statuses
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


                <select
                    value={applicationStatus}
                    onChange={(e) =>
                        setApplicationStatus(
                            e.target.value
                        )
                    }
                >

                    <option value="All">
                        All application statuses
                    </option>

                    <option value="Submitted">
                        Submitted
                    </option>

                    <option value="Screening">
                        Screening
                    </option>

                    <option value="Interview">
                        Interview
                    </option>

                    <option value="Selected">
                        Selected
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>

                </select>


                <select
                    value={teamFilter}
                    onChange={(e) =>
                        setTeamFilter(
                            e.target.value
                        )
                    }
                >

                    {teams.map(
                        (team) => (

                            <option
                                key={team}
                                value={team}
                            >
                                {team === "All"
                                    ? "All teams"
                                    : team}
                            </option>

                        )
                    )}

                </select>


                <select
                    value={ownerFilter}
                    onChange={(e) =>
                        setOwnerFilter(
                            e.target.value
                        )
                    }
                >

                    {owners.map(
                        (owner) => (

                            <option
                                key={owner}
                                value={owner}
                            >
                                {owner === "All"
                                    ? "All owners"
                                    : owner}
                            </option>

                        )
                    )}

                </select>


                <select
                    value={noticePeriodFilter}
                    onChange={(e) =>
                        setNoticePeriodFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="All">
                        All notice periods
                    </option>

                    <option value="Immediate">
                        Immediate
                    </option>

                    <option value="30 days">
                        30 days
                    </option>

                    <option value="60+ days">
                        60+ days
                    </option>

                </select>


                <button
                    type="button"
                    className="report-clear-btn"
                    onClick={
                        clearFilters
                    }
                >
                    Clear
                </button>

            </div>


            {/* REPORT */}

            <div className="job-role-report-wrapper">

                {loading ? (

                    <div className="report-empty">

                        Loading report...

                    </div>

                ) : groupedRows.length === 0 ? (

                    <div className="report-empty">

                        No matching applications found.

                    </div>

                ) : (

                    <table className="job-role-report-table">

                        <thead>

                            <tr>

                                <th>ROLE NAME</th>

                                <th>TEAM</th>

                                <th>ROLE SUBSTAT</th>

                                <th>ID</th>

                                <th>ORIGINAL CV LINK</th>

                                <th>NAME</th>

                                <th>CAND STATUS</th>

                                <th>CAND. SUB-STATUS</th>

                                <th>APPLICATION STATUS</th>

                                <th>NP</th>

                                <th>PHONE</th>

                                <th>EMAIL</th>

                                <th>OWNER</th>

                            </tr>

                        </thead>


                        <tbody>

                            {groupedRows.map(
                                (group) => (

                                    <React.Fragment
                                        key={
                                            group.job.jobId
                                        }
                                    >

                                        {group.candidates.map(
                                            (
                                                row,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        row.applicationId
                                                    }
                                                >

                                                    <td>

                                                        {index ===
                                                        0 ? (

                                                            <div className="report-role-cell">

                                                                <strong>
                                                                    {row.jobName}
                                                                </strong>

                                                                <small>
                                                                    {row.jobId}
                                                                </small>

                                                            </div>

                                                        ) : null}

                                                    </td>


                                                    <td>

                                                        {row.team}

                                                    </td>


                                                    <td>

                                                        <span className="report-critical">

                                                            {row.roleSubStatus}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="report-cv-id">

                                                            {row.candidateId}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {row.originalCV ? (

                                                            <button
                                                                type="button"
                                                                className="report-cv-link"
                                                                onClick={() =>
                                                                    window.open(
                                                                        row.originalCV,
                                                                        "_blank"
                                                                    )
                                                                }
                                                            >

                                                                <i className="bi bi-file-earmark-pdf"></i>

                                                                View CV

                                                            </button>

                                                        ) : (

                                                            <span>
                                                                —
                                                            </span>

                                                        )}

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {row.candidateName}
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`report-status report-status-${row.candidateStatus
                                                                ?.toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-"
                                                                )}`}
                                                        >

                                                            {row.candidateStatus}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="report-sub-status">

                                                            {row.candidateSubStatus}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="report-application-status">

                                                            {row.applicationStatus}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="report-np">

                                                            {row.noticePeriod}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {row.phone}

                                                    </td>


                                                    <td>

                                                        <a
                                                            href={`mailto:${row.email}`}
                                                            className="report-email"
                                                        >

                                                            {row.email}

                                                        </a>

                                                    </td>


                                                    <td>

                                                        {row.owner}

                                                    </td>

                                                </tr>

                                            )
                                        )}


                                        {/* JOB TOTAL */}

                                        <tr className="report-role-total">

                                            <td colSpan="7">

                                                <strong>
                                                    {group.job.jobName}
                                                </strong>

                                            </td>

                                            <td colSpan="6">

                                                <strong>
                                                    {group.candidates.length} candidate
                                                    {group.candidates.length !== 1
                                                        ? "s"
                                                        : ""}
                                                </strong>

                                            </td>

                                        </tr>

                                    </React.Fragment>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

};


export default JobRoleReport;