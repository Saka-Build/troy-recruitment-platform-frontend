import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiCalendar,
    FiInfo,
    FiX,
    FiChevronDown,
} from "react-icons/fi";

import {
    getSubmissionFilters,
    selectReportJobs,
    selectReportClients,
    selectApplicationStatusList,
    selectReportLoading,
    selectExportLoading,
    exportSubmissions,
} from "../../Redux/Slice/reportSlice";

import "./ReportExportModal.css";


const ReportExportModal = ({
    isOpen,
    onClose,
    onExport,
    initialFilters = {},
}) => {

    const dispatch = useDispatch();


    /* =========================================================
       REDUX DATA
    ========================================================= */

    const jobs = useSelector(selectReportJobs);

    const clients = useSelector(selectReportClients);

    const applicationStatuses = useSelector(
        selectApplicationStatusList
    );
useEffect(() => {
    if (!isOpen) {
        return;
    }

    setJob(initialFilters?.jobId || "");
    setClient(initialFilters?.clientId || "");
    setApplicationStatus(
        initialFilters?.statusId || ""
    );
}, [isOpen, initialFilters]);
    const loading = useSelector(selectReportLoading);

    const exportLoading = useSelector(selectExportLoading);


    /* =========================================================
       LOCAL STATE
    ========================================================= */

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    const [job, setJob] = useState("");

    const [client, setClient] = useState("");

    const [applicationStatus, setApplicationStatus] =
        useState("");

const [openDropdown, setOpenDropdown] = useState("");

const [jobSearch, setJobSearch] = useState("");
const [clientSearch, setClientSearch] = useState("");
const [statusSearch, setStatusSearch] = useState("");
    /* =========================================================
       FETCH FILTER DATA WHEN MODAL OPENS
    ========================================================= */

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        dispatch(getSubmissionFilters());

    }, [isOpen, dispatch]);


    /* =========================================================
       EXPORT
    ========================================================= */

const handleExport = async () => {

    try {

        const result = await dispatch(
            exportSubmissions({
                createdFrom: fromDate,
                createdTo: toDate,
                jobId: job,
                clientId: client,
                statusId: applicationStatus,
            })
        ).unwrap();


        /* =====================================================
           DOWNLOAD EXCEL FILE
        ===================================================== */

        if (result?.blob) {

            const url = window.URL.createObjectURL(
                result.blob
            );

            const link = document.createElement("a");

            link.href = url;

            link.download =
                result.fileName ||
                "submission-report.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        }


        /* =====================================================
           CLOSE MODAL AFTER SUCCESSFUL EXPORT
        ===================================================== */

        handleClose();

    } catch (error) {

        console.error(
            "Failed to export report:",
            error
        );

    }
};


    /* =========================================================
       CLOSE
    ========================================================= */

    const handleClose = () => {

        setFromDate("");
        setToDate("");
        setJob("");
        setClient("");
        setApplicationStatus("");

        onClose?.();
    };


    /* =========================================================
       MODAL
    ========================================================= */

    if (!isOpen) {
        return null;
    }

const filteredJobs = jobs.filter((item) =>
    item.name
        ?.toLowerCase()
        .includes(jobSearch.toLowerCase())
);

const filteredClients = clients.filter((item) =>
    item.name
        ?.toLowerCase()
        .includes(clientSearch.toLowerCase())
);

const filteredStatuses = applicationStatuses.filter((status) =>
    status.name
        ?.toLowerCase()
        .includes(statusSearch.toLowerCase())
);
    return (
        <div className="report-export-overlay">

            <div className="report-export-modal">

                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="report-export-header">

                    <div>

                        <h2>
                            Export Report
                        </h2>

                        <p>
                            Choose optional filters for your report export
                        </p>

                    </div>


                    <button
                        type="button"
                        className="report-export-close"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <FiX size={21} />
                    </button>

                </div>


                {/* =================================================
                   BODY
                ================================================= */}

                <div className="report-export-body">

                    {/* =================================================
                       DATE ROW
                    ================================================= */}

                    <div className="report-export-date-row">

                        {/* FROM DATE */}

                        <div className="report-export-field">

                            <label htmlFor="report-from-date">
                                From date
                            </label>

                            <div className="report-export-date-input">

                                <input
                                    id="report-from-date"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(
                                            e.target.value
                                        )
                                    }
                                />

                                <FiCalendar
                                    className="report-export-calendar-icon"
                                    size={18}
                                />

                            </div>

                        </div>


                        {/* TO DATE */}

                        <div className="report-export-field">

                            <label htmlFor="report-to-date">
                                To date
                            </label>

                            <div className="report-export-date-input">

                                <input
                                    id="report-to-date"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) =>
                                        setToDate(
                                            e.target.value
                                        )
                                    }
                                />

                                <FiCalendar
                                    className="report-export-calendar-icon"
                                    size={18}
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       JOB
                    ================================================= */}

<div className="report-export-field">

    <label htmlFor="report-job">
        Job
    </label>

    <div className="report-searchable-dropdown">

        <div className="report-searchable-input-wrapper">

            <input
                id="report-job"
                type="text"
                placeholder="Search or select job"
                value={
                    openDropdown === "job"
                        ? jobSearch
                        : job
                            ? jobs.find(
                                (item) =>
                                    String(item.id) ===
                                    String(job)
                            )?.name || ""
                            : ""
                }
                onFocus={() => {
                    setOpenDropdown("job");
                    setJobSearch("");
                }}
                onChange={(e) => {
                    setOpenDropdown("job");
                    setJobSearch(e.target.value);
                }}
                disabled={loading}
            />

            <FiChevronDown
                className="report-searchable-input-icon"
                size={18}
            />

        </div>

        {openDropdown === "job" && (
            <div className="report-searchable-dropdown-menu">

                <div
                    className="report-searchable-option"
                    onClick={() => {
                        setJob("");
                        setJobSearch("");
                        setOpenDropdown("");
                    }}
                >
                    All jobs
                </div>

                {filteredJobs.map((item) => (
                    <div
                        key={item.id}
                        className="report-searchable-option"
                        onClick={() => {
                            setJob(item.id);
                            setJobSearch("");
                            setOpenDropdown("");
                        }}
                    >
                        {item.name}
                    </div>
                ))}

                {!filteredJobs.length && (
                    <div className="report-searchable-no-results">
                        No jobs found
                    </div>
                )}

            </div>
        )}

    </div>

</div>


                    {/* =================================================
                       CLIENT
                    ================================================= */}
<div className="report-export-field">

    <label htmlFor="report-client">
        Client
    </label>

    <div className="report-searchable-dropdown">

        <div className="report-searchable-input-wrapper">

            <input
                id="report-client"
                type="text"
                placeholder="Search or select client"
                value={
                    openDropdown === "client"
                        ? clientSearch
                        : client
                            ? clients.find(
                                (item) =>
                                    String(item.id) ===
                                    String(client)
                            )?.name || ""
                            : ""
                }
                onFocus={() => {
                    setOpenDropdown("client");
                    setClientSearch("");
                }}
                onChange={(e) => {
                    setOpenDropdown("client");
                    setClientSearch(e.target.value);
                }}
                disabled={loading}
            />

            <FiChevronDown
                className="report-searchable-input-icon"
                size={18}
            />

        </div>

        {openDropdown === "client" && (
            <div className="report-searchable-dropdown-menu">

                <div
                    className="report-searchable-option"
                    onClick={() => {
                        setClient("");
                        setClientSearch("");
                        setOpenDropdown("");
                    }}
                >
                    All clients
                </div>

                {filteredClients.map((item) => (
                    <div
                        key={item.id}
                        className="report-searchable-option"
                        onClick={() => {
                            setClient(item.id);
                            setClientSearch("");
                            setOpenDropdown("");
                        }}
                    >
                        {item.name}
                    </div>
                ))}

                {!filteredClients.length && (
                    <div className="report-searchable-no-results">
                        No clients found
                    </div>
                )}

            </div>
        )}

    </div>

</div>

                    {/* =================================================
                       APPLICATION STATUS
                    ================================================= */}

<div className="report-export-field">

    <label htmlFor="report-application-status">
        Application Status
    </label>

    <div className="report-searchable-dropdown">

        <div className="report-searchable-input-wrapper">

            <input
                id="report-application-status"
                type="text"
                placeholder="Search or select status"
                value={
                    openDropdown === "status"
                        ? statusSearch
                        : applicationStatus
                            ? applicationStatuses.find(
                                (status) =>
                                    String(status.id) ===
                                    String(applicationStatus)
                            )?.name || ""
                            : ""
                }
                onFocus={() => {
                    setOpenDropdown("status");
                    setStatusSearch("");
                }}
                onChange={(e) => {
                    setOpenDropdown("status");
                    setStatusSearch(e.target.value);
                }}
                disabled={loading}
            />

            <FiChevronDown
                className="report-searchable-input-icon"
                size={18}
            />

        </div>

        {openDropdown === "status" && (
            <div className="report-searchable-dropdown-menu">

                <div
                    className="report-searchable-option"
                    onClick={() => {
                        setApplicationStatus("");
                        setStatusSearch("");
                        setOpenDropdown("");
                    }}
                >
                    All statuses
                </div>

                {filteredStatuses.map((status) => (
                    <div
                        key={status.id}
                        className="report-searchable-option"
                        onClick={() => {
                            setApplicationStatus(status.id);
                            setStatusSearch("");
                            setOpenDropdown("");
                        }}
                    >
                        {status.name}
                    </div>
                ))}

                {!filteredStatuses.length && (
                    <div className="report-searchable-no-results">
                        No statuses found
                    </div>
                )}

            </div>
        )}

    </div>

</div>


                    {/* =================================================
                       INFO MESSAGE
                    ================================================= */}

                    <div className="report-export-info">

                        <div className="report-export-info-icon">

                            <FiInfo size={15} />

                        </div>

                        <span>
                            Leave all filters empty to export all records.
                        </span>

                    </div>

                </div>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <div className="report-export-footer">

                    <button
                        type="button"
                        className="report-export-cancel-btn"
                        onClick={handleClose}
                        disabled={exportLoading}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="report-export-btn"
                        onClick={handleExport}
                        disabled={exportLoading}
                    >

                        {exportLoading
                            ? "Exporting..."
                            : "Export"}

                    </button>

                </div>

            </div>

        </div>
    );
};


export default ReportExportModal;