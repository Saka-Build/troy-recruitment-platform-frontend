import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiRotateCcw, FiChevronDown, FiMail, FiPhone, FiDownload, FiArrowLeft, FiUsers, FiUserPlus, FiCheckCircle, FiClock } from "react-icons/fi";
import { getAllSubmissions } from "../../Redux/Slice/employeeSlice";
import "./JobRoleReport.css";
import ExcelJS from "exceljs";

function JobRoleReport() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        submissions = [],
        submissionsLoading,
        submissionsError,
        submissionsPagination,
    } = useSelector((state) => state.employees || {});
    const [search, setSearch] = useState("");
    const [jobFilter, setJobFilter] = useState("");
    const [applicationStatusFilter, setApplicationStatusFilter] = useState("");
    const [subStatusFilter, setSubStatusFilter] = useState("");

    useEffect(() => {
        dispatch(getAllSubmissions());
    }, [dispatch]);

    const jobs = useMemo(() => {
        const uniqueJobs = {};
        submissions.forEach((item) => {
            if (item.jobId && !uniqueJobs[item.jobId]) {
                uniqueJobs[item.jobId] = {
                    id: item.jobId,
                    name: item.jobName || "Unnamed Job",
                };
            }
        });
        return Object.values(uniqueJobs);
    }, [submissions]);

    const applicationStatuses = [
        { value: "Applied", label: "Applied" },
        { value: "Screening", label: "Actively Sourcing" },
        { value: "Ready_to_Submit", label: "Ready to Submit" },
        { value: "Submitted", label: "Submitted" },
        { value: "Interview", label: "Interview" },
        { value: "Selected", label: "Selected" },
        { value: "Offer Released", label: "Offer Released" },
        { value: "Onboarding", label: "Onboarding" },
        { value: "Onboarded", label: "Onboarded" },
        { value: "Hold", label: "Hold" },
        { value: "Rejected", label: "Rejected" },
        { value: "Offboarded", label: "Offboarded" },
    ];

    const subStatuses = useMemo(() => {
        const uniqueSubStatuses = new Set();
        submissions.forEach((item) => {
            if (item.subStatusName) {
                uniqueSubStatuses.add(item.subStatusName.trim());
            }
        });
        return Array.from(uniqueSubStatuses).sort();
    }, [submissions]);

    const filteredSubmissions = useMemo(() => {
        const searchValue = search.toLowerCase().trim();
        return submissions.filter((item) => {
            const matchesSearch = !searchValue ||
                item.candidateName?.toLowerCase().includes(searchValue) ||
                item.candidateId?.toLowerCase().includes(searchValue) ||
                item.candidateCVId?.toLowerCase().includes(searchValue) ||
                item.candidateDesignation?.toLowerCase().includes(searchValue) ||
                item.candidateEmail?.toLowerCase().includes(searchValue) ||
                item.candidatePhone?.toLowerCase().includes(searchValue) ||
                item.jobName?.toLowerCase().includes(searchValue) ||
                item.troyJobId?.toLowerCase().includes(searchValue) ||
                item.clientName?.toLowerCase().includes(searchValue) ||
                item.endClientName?.toLowerCase().includes(searchValue);
            const matchesJob = !jobFilter || item.jobId === jobFilter;
            const matchesApplicationStatus = !applicationStatusFilter || item.statusName?.trim() === applicationStatusFilter;
            const matchesSubStatus = !subStatusFilter || item.subStatusName?.trim() === subStatusFilter;
            return matchesSearch && matchesJob && matchesApplicationStatus && matchesSubStatus;
        });
    }, [submissions, search, jobFilter, applicationStatusFilter, subStatusFilter]);

    const statusCounts = useMemo(() => {
        const counts = { Applied: 0, Submitted: 0, Interview: 0, Onboarded: 0 };
        filteredSubmissions.forEach((item) => {
            const status = item.statusName?.trim()?.toLowerCase();
            if (status === "submitted") counts.Submitted++;
            if (status === "interview" || status === "interviewing") counts.Interview++;
            if (status === "onboarded") counts.Onboarded++;
        });
        return counts;
    }, [filteredSubmissions]);

    const statusCards = [
        { label: "Submitted", value: statusCounts.Submitted, icon: FiUserPlus, color: "#8B5CF6" },
        { label: "Interview", value: statusCounts.Interview, icon: FiUsers, color: "#F59E0B" },
        { label: "Onboarded", value: statusCounts.Onboarded, icon: FiCheckCircle, color: "#16A34A" },
    ];

    const resetFilters = () => {
        setSearch("");
        setJobFilter("");
        setApplicationStatusFilter("");
        setSubStatusFilter("");
    };

    const getInitials = (name) => {
        if (!name) return "--";
        return name.split(" ").filter(Boolean).map((part) => part[0]).join("").substring(0, 2).toUpperCase();
    };

    const displayValue = (value) => {
        return value || "—";
    };

    const getBadgeClass = (value) => {
        return value?.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-") || "";
    };

    const getApplicationStatusLabel = (status) => {
        const found = applicationStatuses.find((item) => item.value === status);
        return found?.label || status || "—";
    };

    const handleExport = async () => {
        if (!filteredSubmissions.length) return;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Submission Report");
        worksheet.columns = [
            { header: "BDM", key: "bdm", width: 22 },
            { header: "Client", key: "client", width: 25 },
            { header: "End Client", key: "endClient", width: 25 },
            { header: "Job Name", key: "jobName", width: 32 },
            { header: "Job Priority", key: "jobPriority", width: 15 },
            { header: "CV ID", key: "cvId", width: 20 },
            { header: "Candidate Name", key: "candidateName", width: 25 },
            { header: "Candidate Designation", key: "candidateDesignation", width: 25 },
            { header: "Email", key: "email", width: 32 },
            { header: "Phone", key: "phone", width: 20 },
            { header: "Candidate Status", key: "candidateStatus", width: 22 },
            { header: "Candidate Sub Status", key: "candidateSubStatus", width: 25 },
        ];
        filteredSubmissions.forEach((item) => {
            const phone = item.candidatePhone ? String(item.candidatePhone) : "";
            const row = worksheet.addRow({
                bdm: item.BDM || "",
                client: item.clientName || "",
                endClient: item.endClientName || "",
                jobName: item.jobName || "",
                jobPriority: item.jobPriority || "",
                cvId: item.candidateCVId || "",
                candidateName: item.candidateName || "",
                candidateDesignation: item.candidateDesignation || "",
                email: item.candidateEmail || "",
                phone: phone,
                candidateStatus: getApplicationStatusLabel(item.statusName),
                candidateSubStatus: item.subStatusName || "",
            });
            row.getCell("phone").numFmt = "@";
            row.getCell("phone").value = phone;
        });
        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF263B57" } };
            cell.fill = { type: "pattern", pattern: "none" };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin", color: { argb: "FFD9E1EB" } },
                bottom: { style: "thin", color: { argb: "FFD9E1EB" } },
                left: { style: "thin", color: { argb: "FFD9E1EB" } },
                right: { style: "thin", color: { argb: "FFD9E1EB" } },
            };
        });
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            row.height = 22;
            row.eachCell((cell, columnNumber) => {
                cell.font = { name: "Calibri", size: 11, color: { argb: "FF263B57" } };
                if (columnNumber === 10) {
                    cell.numFmt = "@";
                }
                cell.alignment = {
                    vertical: "middle",
                    horizontal: columnNumber === 5 || columnNumber === 10 || columnNumber === 11 || columnNumber === 12 ? "center" : "left",
                };
                cell.border = {
                    top: { style: "thin", color: { argb: "FFE2E6ED" } },
                    bottom: { style: "thin", color: { argb: "FFE2E6ED" } },
                    left: { style: "thin", color: { argb: "FFE2E6ED" } },
                    right: { style: "thin", color: { argb: "FFE2E6ED" } },
                };
            });
        });
        worksheet.views = [{ state: "frozen", ySplit: 1 }];
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
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
        <div className="reports-page">
            <div className="reports-header">
                <div className="report-header-left">
                    <div>
                        <h1>Reports Dashboard</h1>
                        <p>Track candidate submissions, jobs, and recruitment status at a glance</p>
                    </div>
                </div>
                <button type="button" className="primary-btn" onClick={handleExport} disabled={!filteredSubmissions.length}>
                    <FiDownload />
                    <span>Export Report</span>
                </button>
            </div>
            <div className="report-status-cards">
                {statusCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="report-status-card">
                            <div className="report-status-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
                                <Icon />
                            </div>
                            <div className="report-status-card-content">
                                <span className="report-status-card-label">{card.label}</span>
                                <strong className="report-status-card-count">{card.value}</strong>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="reports-filter-card">
                <div className="report-search">
                    <FiSearch />
                    <input type="text" placeholder="Search candidates, IDs, emails..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="report-select">
                    <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
                        <option value="">All Jobs</option>
                        {jobs.map((job) => (
                            <option key={job.id} value={job.id}>{job.name}</option>
                        ))}
                    </select>
                    <FiChevronDown />
                </div>
                <div className="report-select">
                    <select value={applicationStatusFilter} onChange={(e) => setApplicationStatusFilter(e.target.value)}>
                        <option value="">All Application Statuses</option>
                        {applicationStatuses.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                    <FiChevronDown />
                </div>
                <button className="report-reset-btn" onClick={resetFilters} type="button">
                    <FiRotateCcw />
                    <span>Reset</span>
                </button>
            </div>
            {submissionsLoading ? (
                <div className="reports-table-card">
                    <div className="empty-report">
                        <div className="empty-report-content">
                            <div className="spinner"></div>
                            <strong>Loading submissions...</strong>
                        </div>
                    </div>
                </div>
            ) : submissionsError ? (
                <div className="reports-table-card">
                    <div className="empty-report">
                        <div className="empty-report-content">
                            <strong>Failed to load submissions</strong>
                            <span>{submissionsError}</span>
                            <button type="button" onClick={() => dispatch(getAllSubmissions())}>Try Again</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="reports-table-card">
                    <div className="reports-table-wrapper">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th>BDM</th>
                                    <th>Client</th>
                                    <th>End Client</th>
                                    <th>Job Name</th>
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
                                        <tr key={item.submissionId}>
                                            <td>
                                                <span className="report-text">{displayValue(item.BDM)}</span>
                                            </td>
                                            <td>
                                                <span className="report-text report-client">{displayValue(item.clientName)}</span>
                                            </td>
                                            <td>
                                                <span className="report-text">{displayValue(item.endClientName)}</span>
                                            </td>
                                            <td>
                                                <div className="report-job-name-cell">
                                                    <span className="report-job-name">{displayValue(item.jobName)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`report-job-priority-badge ${getBadgeClass(item.jobPriority)}`}>
                                                    {displayValue(item.jobPriority)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="report-cv-id">{displayValue(item.candidateCVId)}</span>
                                            </td>
                                            <td>
                                                <div className="report-candidate-cell">
                                                    <div className="report-candidate-avatar">
                                                        {getInitials(item.candidateName)}
                                                    </div>
                                                    <div className="report-candidate-info">
                                                        <div className="report-candidate-name">
                                                            {displayValue(item.candidateName)}
                                                        </div>
                                                        <div className="report-candidate-designation">
                                                            {displayValue(item.candidateDesignation)}
                                                        </div>
                                                        <div className="report-candidate-contact">
                                                            {item.candidateEmail ? (
                                                                <a href={`mailto:${item.candidateEmail}`} className="report-candidate-contact-icon" title={item.candidateEmail}>
                                                                    <FiMail />
                                                                </a>
                                                            ) : (
                                                                <span className="report-candidate-contact-icon report-candidate-contact-disabled" title="Email not available">
                                                                    <FiMail />
                                                                </span>
                                                            )}
                                                            {item.candidatePhone ? (
                                                                <a href={`tel:${item.candidatePhone}`} className="report-candidate-contact-icon" title={item.candidatePhone}>
                                                                    <FiPhone />
                                                                </a>
                                                            ) : (
                                                                <span className="report-candidate-contact-icon report-candidate-contact-disabled" title="Phone not available">
                                                                    <FiPhone />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`report-application-status-badge ${getBadgeClass(item.statusName)}`}>
                                                    {getApplicationStatusLabel(item.statusName)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`report-sub-status-badge ${getBadgeClass(item.subStatusName)}`}>
                                                    {displayValue(item.subStatusName)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="empty-report">
                                            <div className="empty-report-content">
                                                <div className="empty-report-icon">
                                                    <FiSearch />
                                                </div>
                                                <strong>No submissions found</strong>
                                                <span>Try adjusting your filters</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="reports-table-footer">
                        <span>
                            Showing <strong>{filteredSubmissions.length}</strong> of <strong>{submissionsPagination?.totalElements ?? submissions.length}</strong> submissions
                        </span>
                        <div className="report-pagination">
                            <button type="button" disabled={submissionsPagination?.first ?? true}>Previous</button>
                            <span className="active-page">{(submissionsPagination?.pageNumber ?? 0) + 1}</span>
                            <button type="button" disabled={submissionsPagination?.last ?? true}>Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobRoleReport;