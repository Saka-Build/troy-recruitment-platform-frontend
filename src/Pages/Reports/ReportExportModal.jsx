import React, { useEffect, useRef, useState } from "react";
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

    const jobs = useSelector(selectReportJobs) || [];
    const clients = useSelector(selectReportClients) || [];

    const applicationStatuses =
        useSelector(selectApplicationStatusList) || [];

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
        useState([]);

    const [openDropdown, setOpenDropdown] = useState("");

    const [jobSearch, setJobSearch] = useState("");
    const [clientSearch, setClientSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");

    const jobDropdownRef = useRef(null);
    const clientDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

    /* =========================================================
       GET DISPLAY NAME
    ========================================================= */

    const getItemName = (item) => {
        return (
            item?.name ||
            item?.title ||
            item?.jobName ||
            item?.clientName ||
            ""
        );
    };

    /* =========================================================
       CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    ========================================================= */

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsideJob =
                jobDropdownRef.current?.contains(event.target);

            const clickedInsideClient =
                clientDropdownRef.current?.contains(event.target);

            const clickedInsideStatus =
                statusDropdownRef.current?.contains(event.target);

            if (
                !clickedInsideJob &&
                !clickedInsideClient &&
                !clickedInsideStatus
            ) {
                setOpenDropdown("");
                setJobSearch("");
                setClientSearch("");
                setStatusSearch("");
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /* =========================================================
       SET INITIAL FILTERS WHEN MODAL OPENS
    ========================================================= */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setJob(initialFilters?.jobId || "");
        setClient(initialFilters?.clientId || "");

        setApplicationStatus(
            Array.isArray(initialFilters?.statusIds)
                ? initialFilters.statusIds
                : []
        );
    }, [isOpen, initialFilters]);

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
                    statusIds: applicationStatus,
                })
            ).unwrap();

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

        setApplicationStatus([]);

        setOpenDropdown("");

        setJobSearch("");
        setClientSearch("");
        setStatusSearch("");

        onClose?.();
    };

    /* =========================================================
       FILTERED DATA
    ========================================================= */

    if (!isOpen) {
        return null;
    }

    const filteredJobs = jobs.filter((item) =>
        getItemName(item)
            .toLowerCase()
            .includes(jobSearch.toLowerCase())
    );

    const filteredClients = clients.filter((item) =>
        getItemName(item)
            .toLowerCase()
            .includes(clientSearch.toLowerCase())
    );

    const filteredStatuses = applicationStatuses.filter((status) =>
        status.name
            ?.toLowerCase()
            .includes(statusSearch.toLowerCase())
    );

    /* =========================================================
       SELECTED DISPLAY VALUES
    ========================================================= */

    const selectedJobName =
        jobs.find(
            (item) =>
                String(item.id) === String(job)
        );

    const selectedClientName =
        clients.find(
            (item) =>
                String(item.id) === String(client)
        );

    const selectedStatusNames = applicationStatuses
        .filter((status) =>
            applicationStatus.some(
                (selectedId) =>
                    String(selectedId) === String(status.id)
            )
        )
        .map((status) => status.name);

    /* =========================================================
       STATUS HANDLER
    ========================================================= */

    const handleStatusChange = (statusId) => {
        setApplicationStatus((previousStatuses) => {
            const alreadySelected = previousStatuses.some(
                (id) => String(id) === String(statusId)
            );

            if (alreadySelected) {
                return previousStatuses.filter(
                    (id) => String(id) !== String(statusId)
                );
            }

            return [...previousStatuses, statusId];
        });

        setStatusSearch("");

        // Keep dropdown open for multiple selection.
    };

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
                                        setFromDate(e.target.value)
                                    }
                                />

                                <FiCalendar
                                    className="report-export-calendar-icon"
                                    size={18}
                                />

                            </div>

                        </div>

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
                                        setToDate(e.target.value)
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

                        <div
                            className="report-searchable-dropdown"
                            ref={jobDropdownRef}
                        >

                            <div className="report-searchable-input-wrapper">

                                <input
                                    id="report-job"
                                    type="text"
                                    placeholder="Search or select job"
                                    value={
                                        openDropdown === "job"
                                            ? jobSearch
                                            : job
                                                ? getItemName(
                                                    selectedJobName
                                                )
                                                : ""
                                    }
                                    onClick={() => {
                                        setOpenDropdown((previous) =>
                                            previous === "job"
                                                ? ""
                                                : "job"
                                        );

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
                                            {getItemName(item)}
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

                        <div
                            className="report-searchable-dropdown"
                            ref={clientDropdownRef}
                        >

                            <div className="report-searchable-input-wrapper">

                                <input
                                    id="report-client"
                                    type="text"
                                    placeholder="Search or select client"
                                    value={
                                        openDropdown === "client"
                                            ? clientSearch
                                            : client
                                                ? getItemName(
                                                    selectedClientName
                                                )
                                                : ""
                                    }
                                    onClick={() => {
                                        setOpenDropdown((previous) =>
                                            previous === "client"
                                                ? ""
                                                : "client"
                                        );

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
                                            {getItemName(item)}
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

                        <div
                            className="report-searchable-dropdown"
                            ref={statusDropdownRef}
                        >

                            <div className="report-searchable-input-wrapper">

                                <input
                                    id="report-application-status"
                                    type="text"
                                    placeholder="Search or select status"
                                    value={
                                        openDropdown === "status"
                                            ? statusSearch
                                            : selectedStatusNames.join(", ")
                                    }
                                    onClick={() => {
                                        setOpenDropdown((previous) =>
                                            previous === "status"
                                                ? ""
                                                : "status"
                                        );

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
                                <div className="report-status-dropdown-menu">

                                    {/* HEADER */}

                                    <div className="report-status-dropdown-header">

                                        <span>
                                            Application Status
                                        </span>

                                        <button
                                            type="button"
                                            className="report-status-clear-btn"
                                            onClick={() => {
                                                setApplicationStatus([]);
                                                setStatusSearch("");
                                            }}
                                        >
                                            Clear all
                                        </button>

                                    </div>

                                    {/* ALL APPLICATION STATUSES */}

                                    <label className="report-status-option">

                                        <input
                                            type="checkbox"
                                            checked={
                                                applicationStatuses.length > 0 &&
                                                applicationStatus.length ===
                                                applicationStatuses.length
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setApplicationStatus(
                                                        applicationStatuses.map(
                                                            (status) =>
                                                                status.id
                                                        )
                                                    );
                                                } else {
                                                    setApplicationStatus([]);
                                                }
                                            }}
                                        />

                                        <span>
                                            All Application Statuses
                                        </span>

                                    </label>

                                    {/* INDIVIDUAL STATUSES */}

                                    {filteredStatuses.map((status) => {

                                        const isSelected =
                                            applicationStatus.some(
                                                (id) =>
                                                    String(id) ===
                                                    String(status.id)
                                            );

                                        return (
                                            <label
                                                key={status.id}
                                                className="report-status-option"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        handleStatusChange(
                                                            status.id
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {status.name}
                                                </span>

                                            </label>
                                        );
                                    })}

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