import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {FiSearch,FiRotateCcw,FiChevronDown,FiMail,FiPhone,FiDownload,FiUsers,FiUserPlus,FiCheckCircle,FiFilter,FiX,} from "react-icons/fi";
import { getAllSubmissions } from "../../Redux/Slice/employeeSlice";
import { getSubmissionFilters } from "../../Redux/Slice/reportSlice";
import "./TabularReport.css";
import ExcelJS from "exceljs";
import CommonPagination from "../../Components/CommonPagination";
import ReportExportModal from "./ReportExportModal";

function TabularReport() {
    const dispatch = useDispatch();

    const {submissions = [],submissionsLoading,submissionsError,submissionsPagination,} = useSelector((state) => state.employees || {});
    const { submissionFilters = {} } = useSelector((state) => state.report || {});

    const [search, setSearch] = useState("");
    const [jobFilter, setJobFilter] = useState("");
    const [applicationStatusFilter, setApplicationStatusFilter] = useState([]);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [subStatusFilter, setSubStatusFilter] = useState("");
    const [clientFilter, setClientFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showExportModal, setShowExportModal] = useState(false);

    const jobs = useMemo(() => {
        return submissionFilters?.jobs || [];
    }, [submissionFilters]);

    const clients = useMemo(() => {
        return submissionFilters?.clients || [];
    }, [submissionFilters]);

    const applicationStatuses = useMemo(() => {
        return (submissionFilters?.applicationStatusList || []).map(
            (status) => ({
                value: status.name,
                label: status.name?.replace(/_/g, " "),
                id: status.id,
                colourHex: status.colourHex,
            })
        );
    }, [submissionFilters]);

    useEffect(() => {
        dispatch(getSubmissionFilters());
    }, [dispatch]);

    const handleApplicationStatusChange = (statusValue) => {
        setApplicationStatusFilter((prev) => {
            if (prev.includes(statusValue)) {
                return prev.filter((value) => value !== statusValue);
            }
            return [...prev, statusValue];
        });
    };

    useEffect(() => {
        const selectedStatusIds = applicationStatuses
            .filter((status) => applicationStatusFilter.includes(status.value))
            .map((status) => status.id);

        dispatch(
            getAllSubmissions({
                page: currentPage - 1,
                size: 100,
                search: search.trim(),
                jobId: jobFilter,
                statusId: selectedStatusIds,
                clientId: clientFilter,
            })
        );
    }, [dispatch,currentPage,search,jobFilter,applicationStatusFilter,clientFilter,applicationStatuses,]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search,jobFilter,applicationStatusFilter,clientFilter,]);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter((item) => {
            const matchesSubStatus = !subStatusFilter || item.subStatusName?.trim() === subStatusFilter;
            return matchesSubStatus;
        });
    }, [submissions, subStatusFilter]);

    const statusCards = [
        {
            label: "Submitted",
            value: submissionFilters?.totalSubmittedApplications || 0,
            icon: FiUserPlus,
            color: "#8B5CF6",
            bgColor: "#F3F0FF",
        },
        {
            label: "Interview",
            value: submissionFilters?.totalInterviewApplications || 0,
            icon: FiUsers,
            color: "#F59E0B",
            bgColor: "#FFFBEB",
        },
        {
            label: "Onboarded",
            value: submissionFilters?.totalOnboardedApplications || 0,
            icon: FiCheckCircle,
            color: "#16A34A",
            bgColor: "#F0FDF4",
        },
    ];

    const resetFilters = () => {
        setSearch("");
        setJobFilter("");
        setClientFilter("");
        setApplicationStatusFilter([]);
        setSubStatusFilter("");
        setCurrentPage(1);
    };

    const getInitials = (name) => {
        if (!name) return "--";
        return name.split(" ").filter(Boolean).map((part) => part[0]).join("").substring(0, 2).toUpperCase();};

    const displayValue = (value) => {
        return value || "—";
    };

    const getBadgeClass = (value) => {
        return (value?.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-") || "");
    };

    const getApplicationStatusLabel = (status) => {
        const found = applicationStatuses.find(
            (item) => item.value === status
        );
        return ( found?.label || status?.replace(/_/g, " ") || "—" );
    };

    const handleExport = async () => {
        if (!filteredSubmissions.length) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Submission Report");

        worksheet.columns = [
            { header: "Client", key: "client", width: 25 },
            { header: "End Client", key: "endClient", width: 25 },
            { header: "Job Name", key: "jobName", width: 32 },
            { header: "BDM", key: "bdm", width: 22 },
            { header: "Job Priority", key: "jobPriority", width: 15 },
            { header: "CV ID", key: "cvId", width: 20 },
            { header: "Candidate Name", key: "candidateName", width: 25 },
            { header: "Candidate Designation",key: "candidateDesignation",width: 25,},
            { header: "Email", key: "email", width: 32 },
            { header: "Phone", key: "phone", width: 20 },
            { header: "Candidate Status",key: "candidateStatus",width: 22,},
            { header: "Candidate Sub Status",key: "candidateSubStatus",width: 25,},
        ];

        filteredSubmissions.forEach((item) => {
            const phone = item.candidatePhone? String(item.candidatePhone): "";

            const row = worksheet.addRow({
                client: item.clientName || "",
                endClient: item.endClientName || "",
                jobName: item.jobName || "",
                bdm: item.BDM || "",
                jobPriority: item.jobPriority || "",
                cvId: item.candidateCVId || "",
                candidateName: item.candidateName || "",
                candidateDesignation: item.candidateDesignation || "",
                email: item.candidateEmail || "",
                phone,
                candidateStatus: getApplicationStatusLabel(item.statusName),
                candidateSubStatus: item.subStatusName || "",
            });

            row.getCell("phone").numFmt = "@";
            row.getCell("phone").value = phone;
        });

        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;

        headerRow.eachCell((cell) => {
            cell.font = {name: "Calibri",size: 11,bold: true,color: { argb: "FF263B57" },};
            cell.alignment = {horizontal: "center",vertical: "middle",};
            cell.border = {
                top: {style: "thin",color: { argb: "FFD9E1EB" },},
                bottom: {style: "thin",color: { argb: "FFD9E1EB" },},
                left: {style: "thin",color: { argb: "FFD9E1EB" },},
                right: {style: "thin",color: { argb: "FFD9E1EB" },},
            };
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            row.height = 22;

            row.eachCell((cell, columnNumber) => {
                cell.font = {name: "Calibri",size: 11,color: { argb: "FF263B57" },};

                if (columnNumber === 10) {
                    cell.numFmt = "@";
                }

                cell.alignment = {
                    vertical: "middle",
                    horizontal: columnNumber === 5 ||columnNumber === 10 ||columnNumber === 11 ||columnNumber === 12? "center": "left",
                };

                cell.border = {
                    top: {style: "thin",color: { argb: "FFE2E6ED" },},
                    bottom: {style: "thin",color: { argb: "FFE2E6ED" },},
                    left: {style: "thin",color: { argb: "FFE2E6ED" },},
                    right: {style: "thin",color: { argb: "FFE2E6ED" },},
                };
            });
        });

        worksheet.views = [{state: "frozen",ySplit: 1,},];

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "submission-report.xlsx";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    return (
        <div className="tabular-report-container">
            <div className="tabular-header">
                <div className="tabular-header-left">
                    <div className="tabular-header-content">
                        <h1 className="tabular-title">Reports Dashboard</h1>
                        <p className="tabular-subtitle">
                            Track candidate submissions, jobs, and recruitment status at a glance
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="tabular-export-btn"
                    onClick={() => setShowExportModal(true)}
                    disabled={!filteredSubmissions.length}
                >
                    <FiDownload className="tabular-btn-icon" />
                    <span>Export Report</span>
                </button>
            </div>

            <div className="tabular-status-cards">
                {statusCards.map((card) => { const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="tabular-status-card"
                            style={{  backgroundColor: card.bgColor }}
                        >
                            <div className="tabular-status-card-icon" style={{ color: card.color,backgroundColor: card.bgColor}}>
                                <Icon />
                            </div>

                            <div className="tabular-status-card-content">
                                <span className="tabular-status-card-label">
                                    {card.label}
                                </span>
                                <strong className="tabular-status-card-count">
                                    {card.value}
                                </strong>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter Section */}
            <div className="tabular-filter-card">
                <div className="tabular-filter-grid">
                    <div className="tabular-search-box">
                        <FiSearch className="tabular-search-icon" />
                        <input
                            type="text"
                            placeholder="Search candidates, IDs, emails..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="tabular-search-input"
                        />
                        {search && (
                            <button className="tabular-clear-search" onClick={() => setSearch("")}>
                                <FiX />
                            </button>
                        )}
                    </div>

                    <div className="tabular-select-wrapper">
                        <select
                            className="tabular-select"
                            value={jobFilter}
                            onChange={(e) => setJobFilter(e.target.value)}
                        >
                            <option value="">All Jobs</option>
                            {jobs.map((job) => ( <option key={job.id} value={job.id}> {job.name} </option>))}
                        </select>
                        <FiChevronDown className="tabular-select-icon" />
                    </div>

                    <div className="tabular-select-wrapper">
                        <select
                            className="tabular-select"
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                        >
                            <option value="">All Clients</option>
                            {clients.map((client) => ( <option key={client.id} value={client.id}> {client.name} </option> ))}
                        </select>
                        <FiChevronDown className="tabular-select-icon" />
                    </div>

                    <div className="tabular-multiselect">
                        <button
                            type="button"
                            className="tabular-multiselect-trigger"
                            onClick={() => setShowStatusDropdown((prev) => !prev)}
                        >
                            <FiFilter className="tabular-filter-icon" />
                            <span className="tabular-multiselect-text">
                                {applicationStatusFilter.length === 0
                                    ? "All Application Statuses"
                                    : applicationStatusFilter.length === 1
                                    ? applicationStatuses.find( (status) => status.value === applicationStatusFilter[0] )
                                    ?.label : `${applicationStatusFilter.length} statuses selected`}
                            </span>
                            <FiChevronDown className="tabular-multiselect-chevron" />
                        </button>

                        {showStatusDropdown && (
                            <div className="tabular-multiselect-menu">
                                <div className="tabular-multiselect-header">
                                    <span>Application Status</span>
                                    <button className="tabular-multiselect-clear" onClick={() => setApplicationStatusFilter([])}>
                                        Clear all
                                    </button>
                                </div>
                                <label className="tabular-multiselect-option">
                                    <input
                                        type="checkbox"
                                        checked={applicationStatusFilter.length === 0}
                                        onChange={() => setApplicationStatusFilter([])}
                                    />
                                    <span>All Application Statuses</span>
                                </label>

                                {applicationStatuses.map((status) => (
                                    <label key={status.value} className="tabular-multiselect-option">
                                        <input
                                            type="checkbox"
                                            checked={applicationStatusFilter.includes(status.value )}
                                            onChange={() => handleApplicationStatusChange( status.value )}
                                        />
                                        <span>{status.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        className="tabular-reset-btn"
                        onClick={resetFilters}
                        type="button"
                    >
                        <FiRotateCcw className="tabular-btn-icon" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {submissionsLoading ? (
                <div className="tabular-table-card">
                    <div className="tabular-empty-state">
                        <div className="tabular-loading-spinner"></div>
                        <strong>Loading submissions...</strong>
                    </div>
                </div>
            ) : submissionsError ? (
                <div className="tabular-table-card">
                    <div className="tabular-empty-state">
                        <div className="tabular-error-content">
                            <strong>Failed to load submissions</strong>
                            <span className="tabular-error-message">{submissionsError}</span>
                            <button
                                type="button"
                                className="tabular-retry-btn"
                                onClick={() => {
                                    const selectedStatusIds =
                                        applicationStatuses
                                            .filter((status) => applicationStatusFilter.includes(status.value))
                                            .map((status) => status.id);

                                    dispatch(
                                        getAllSubmissions({
                                            page: currentPage - 1,
                                            size: 100,
                                            search: search.trim(),
                                            jobId: jobFilter,
                                            statusId: selectedStatusIds,
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
                <div className="tabular-table-card">
                    <div className="tabular-table-header">
                        <div className="tabular-table-title">
                            <strong>📋 Submission Details</strong>
                            <span className="tabular-table-count">
                                {filteredSubmissions.length} submissions
                            </span>
                        </div>
                    </div>

                    <div className="tabular-table-wrapper">
                        <table className="tabular-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>End Client</th>
                                    <th>Job Name</th>
                                    <th>BDM</th>
                                    <th>Priority</th>
                                    <th>CV ID</th>
                                    <th>Candidate</th>
                                    <th>Cand. Status</th>
                                    <th>Cand. Sub Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSubmissions.length > 0 ? (
                                    filteredSubmissions.map((item) => (
                                        <tr key={item.submissionId} className="tabular-table-row" >
                                            <td>
                                                <span className="tabular-text tabular-client">
                                                    {displayValue(item.clientName)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="tabular-text">
                                                    {displayValue(item.endClientName)}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="tabular-job-cell">
                                                    <span className="tabular-job-name">
                                                        {displayValue(item.jobName)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="tabular-bdm">
                                                    {displayValue(item.BDM)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`tabular-priority-badge ${getBadgeClass(item.jobPriority )}`} >
                                                    {displayValue(item.jobPriority)}
                                                </span>
                                            </td>

                                            <td>
                                                {item.candidateId ? (
                                                    <a
                                                        href={`${import.meta.env.BASE_URL}dashboard/candidates/${item.candidateId}`}
                                                        className="tabular-cv-id tabular-cv-id-clickable"
                                                        onClick={(e) => { e.stopPropagation();  }}
                                                    >
                                                        {displayValue(item.candidateCVId)}
                                                    </a>
                                                ) : (
                                                    <span className="tabular-cv-id">
                                                        {displayValue(item.candidateCVId)}
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <div className="tabular-candidate-cell">
                                                    <div className="tabular-candidate-avatar">
                                                        {getInitials(item.candidateName)}
                                                    </div>

                                                    <div className="tabular-candidate-info">
                                                        <div className="tabular-candidate-name">
                                                            {displayValue(item.candidateName)}
                                                        </div>

                                                        <div className="tabular-candidate-designation">
                                                            {displayValue(item.candidateDesignation)}
                                                        </div>

                                                        <div className="tabular-candidate-contact">
                                                            {item.candidateEmail ? (
                                                                <a
                                                                    href={`mailto:${item.candidateEmail}`}
                                                                    className="tabular-contact-icon"
                                                                    title={item.candidateEmail}
                                                                    onClick={(e) => e.stopPropagation() }
                                                                >
                                                                    <FiMail />
                                                                </a>
                                                            ) : (
                                                                <span className="tabular-contact-icon tabular-contact-disabled">
                                                                    <FiMail />
                                                                </span>
                                                            )}

                                                            {item.candidatePhone ? (
                                                                <a
                                                                    href={`tel:${item.candidatePhone}`}
                                                                    className="tabular-contact-icon"
                                                                    title={item.candidatePhone}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <FiPhone />
                                                                </a>
                                                            ) : (
                                                                <span className="tabular-contact-icon tabular-contact-disabled">
                                                                    <FiPhone />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`tabular-status-badge ${getBadgeClass(item.statusName)}`}>
                                                    {getApplicationStatusLabel(item.statusName)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`tabular-substatus-badge ${getBadgeClass(item.subStatusName)}`}>
                                                    {displayValue(item.subStatusName)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="tabular-empty-state">
                                            <div className="tabular-empty-content">
                                                <FiSearch className="tabular-empty-icon" />
                                                <strong>No submissions found</strong>
                                                <span>Try adjusting your filters</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <CommonPagination
                        currentPage={currentPage}
                        totalPages={submissionsPagination?.totalPages || 0}
                        totalItems={submissionsPagination?.totalElements || 0}
                        itemsPerPage={submissionsPagination?.pageSize || 20}
                        onPageChange={(page) => {setCurrentPage(page);}}
                        itemLabel="submissions"
                    />
                </div>
            )}

            {showExportModal && (
                <ReportExportModal
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    onExport={handleExport}
                    // initialFilters={{
                    //     jobId: jobFilter,
                    //     clientId: clientFilter,
                    //     statusId: applicationStatuses.filter((status) =>applicationStatusFilter.includes(status.value)).map((status) => status.id),
                    // }}
                />
            )}
        </div>
    );
}

export default TabularReport;