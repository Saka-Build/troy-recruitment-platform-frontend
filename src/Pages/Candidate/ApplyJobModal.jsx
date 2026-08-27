import React, { useEffect, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import "./Components1.css";

const APPLICATION_STATUSES = [
    "Applied",
    "Actively Sourcing",
    "Ready to Submit",
    "Submitted",
    "Interview",
    "Selected",
    "Offer Released",
    "Onboarding",
    "Onboarded",
    "Hold",
    "Rejected",
    "Offboarded",
];

const ApplyJobModal = ({
    jobs = [],
    jobsLoading = false,
    onClose,
    onApply,
}) => {
    const [selectedJob, setSelectedJob] = useState("");
    const [initialStatus, setInitialStatus] = useState("Ready to Submit");

    useEffect(() => {
        if (jobs.length > 0 && !selectedJob) {
            setSelectedJob(jobs[0]?.id || "");
        }
    }, [jobs, selectedJob]);

    const handleApply = () => {
        if (!selectedJob) {
            return;
        }

        const job = jobs.find(
            (item) => String(item.id) === String(selectedJob)
        );

        onApply({
            jobId: selectedJob,
            job,
            status: initialStatus,
        });
    };

    const getJobLabel = (job) => {
        if (!job) {
            return "Untitled Job";
        }

        const title =
            job.title ||
            job.jobTitle ||
            job.name ||
            "Untitled Job";

        const company =
            job.clientName ||
            job.client?.name ||
            job.client?.companyName ||
            job.company ||
            "";

        return company
            ? `${title} — ${company}`
            : title;
    };

    return (
        <div className="apply-job-modal-overlay">
            <div className="apply-job-modal">
                <div className="apply-job-modal-header">
                    <h3>Apply candidate to a job</h3>

                    <button
                        type="button"
                        className="apply-job-modal-close"
                        onClick={onClose}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="apply-job-modal-body">
                    <div className="apply-job-form-group">
                        <label htmlFor="apply-job">
                            Job / role
                        </label>

                        <div className="apply-job-select-wrapper">
                            <select
                                id="apply-job"
                                value={selectedJob}
                                onChange={(event) =>
                                    setSelectedJob(event.target.value)
                                }
                                disabled={jobsLoading}
                            >
                                {jobsLoading ? (
                                    <option value="">
                                        Loading jobs...
                                    </option>
                                ) : jobs.length === 0 ? (
                                    <option value="">
                                        No open jobs available
                                    </option>
                                ) : (
                                    jobs.map((job) => (
                                        <option
                                            key={job.id}
                                            value={job.id}
                                        >
                                            {getJobLabel(job)}
                                        </option>
                                    ))
                                )}
                            </select>

                            <FiChevronDown className="apply-job-select-icon" />
                        </div>
                    </div>

                    <div className="apply-job-form-group">
                        <label htmlFor="initial-status">
                            Initial status
                        </label>

                        <div className="apply-job-select-wrapper">
                            <select
                                id="initial-status"
                                value={initialStatus}
                                onChange={(event) =>
                                    setInitialStatus(event.target.value)
                                }
                            >
                                {APPLICATION_STATUSES.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <FiChevronDown className="apply-job-select-icon" />
                        </div>
                    </div>
                </div>

                <div className="apply-job-modal-footer">
                    <button
                        type="button"
                        className="apply-job-cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="apply-job-submit-btn"
                        onClick={handleApply}
                        disabled={
                            jobsLoading ||
                            jobs.length === 0 ||
                            !selectedJob
                        }
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyJobModal;