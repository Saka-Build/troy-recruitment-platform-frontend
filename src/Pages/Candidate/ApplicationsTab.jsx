// import React, { useState } from "react";
// import {
//     FiCalendar,
//     FiClock,
//     FiDollarSign,
//     FiList,
//     FiSearch,
//     FiX,
// } from "react-icons/fi";
// import { FaPlaneDeparture } from "react-icons/fa";
// import { MdWorkOutline } from "react-icons/md";
// import "./Components.css";

// const ApplicationsTab = ({ candidate }) => {
//     const [applications, setApplications] = useState([
//         {
//             id: 1,
//             jobTitle: "Cloud Security Engineer",
//             company: "Meridian Fintech",
//             appliedDate: "7h ago",
//             status: "Onboarded",
//             expectedSalary: "£200 / day",
//             submissionRate: "£200 / day",
//             offer: "£100 / day",
//             historyCount: 12,
//         },
//         {
//             id: 2,
//             jobTitle: "SAP S/4HANA Consultant",
//             company: "Nova Manufacturing",
//             appliedDate: "1h ago",
//             status: "Actively Sourcing",
//             expectedSalary: "£200 / day",
//             submissionRate: null,
//             offer: null,
//             historyCount: 3,
//         },
//     ]);

//     const [showInterviewModal, setShowInterviewModal] = useState(false);
//     const [selectedApplication, setSelectedApplication] = useState(null);

//     const [interviewData, setInterviewData] = useState({
//         date: "27-08-2026",
//         time: "13:16",
//         type: "Teams",
//         round: "HR Round",
//         interviewer: "",
//     });

//     const statuses = [
//         "Applied",
//         "Actively Sourcing",
//         "Ready to Submit",
//         "Submitted",
//         "Interview",
//         "Selected",
//         "Offer Released",
//         "Onboarding",
//         "Onboarded",
//         "Hold",
//         "Rejected",
//         "Offboarded",
//     ];

//     const getStatusClass = (status) => {
//         const classes = {
//             Pipeline: "cxandidate-status-pipeline",
//             "Actively Sourcing": "cxandidate-status-sourcing",
//             "Ready to Submit": "cxandidate-status-ready",
//             Submitted: "cxandidate-status-submitted",
//             "In Progress": "cxandidate-status-progress",
//             Interview: "cxandidate-status-interview",
//             Selected: "cxandidate-status-selected",
//             "Offer Released": "cxandidate-status-selected",
//             Onboarding: "cxandidate-status-selected",
//             Onboarded: "cxandidate-status-selected",
//             Hold: "cxandidate-status-hold",
//             Deferred: "cxandidate-status-hold",
//             Withdrawn: "cxandidate-status-withdrawn",
//             Rejected: "cxandidate-status-rejected",
//             Closed: "cxandidate-status-withdrawn",
//             Blacklisted: "cxandidate-status-rejected",
//         };

//         return classes[status] || "cxandidate-status-default";
//     };

//     const getStatusIcon = (status) => {
//         const icons = {
//             Pipeline: <FiSearch />,
//             "Actively Sourcing": <FiSearch />,
//             "Ready to Submit": <MdWorkOutline />,
//             Submitted: <MdWorkOutline />,
//             "In Progress": <FiClock />,
//             Interview: <FiCalendar />,
//             Selected: <MdWorkOutline />,
//             "Offer Released": <MdWorkOutline />,
//             Onboarding: <MdWorkOutline />,
//             Onboarded: <FaPlaneDeparture />,
//             Hold: <FiClock />,
//             Deferred: <FiClock />,
//             Withdrawn: <FiX />,
//             Rejected: <FiX />,
//             Closed: <FiX />,
//             Blacklisted: <FiX />,
//         };

//         return icons[status] || <MdWorkOutline />;
//     };

//     const handleStatusChange = (id, value) => {
//         setApplications((prev) =>
//             prev.map((application) =>
//                 application.id === id
//                     ? { ...application, status: value }
//                     : application
//             )
//         );
//     };

//     const handleOpenInterview = (application) => {
//         setSelectedApplication(application);
//         setShowInterviewModal(true);
//     };

//     const handleCloseInterview = () => {
//         setShowInterviewModal(false);
//         setSelectedApplication(null);
//     };

//     const handleInterviewChange = (field, value) => {
//         setInterviewData((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };

//     const handleSaveInterview = () => {
//         if (!selectedApplication) return;

//         setApplications((prev) =>
//             prev.map((application) =>
//                 application.id === selectedApplication.id
//                     ? {
//                         ...application,
//                         status: "Interview",
//                     }
//                     : application
//             )
//         );

//         handleCloseInterview();
//     };

//     const handleRemove = (id) => {
//         setApplications((prev) =>
//             prev.filter((application) => application.id !== id)
//         );
//     };

//     return (
//         <>
//             <div className="candidate-tab-card cxandidate applications-tab">
//                 <div className="cxandidate-applications-header d-flex flex-wrap justify-content-between align-items-center gap-3">
//                     <div>
//                         <h2 className="cxandidate-applications-title">
//                             Applications ({applications.length})
//                         </h2>

//                         <p className="cxandidate-applications-description">
//                             Each application is this candidate's journey
//                             through one job — with its own status, interview
//                             and history.
//                         </p>
//                     </div>

//                     <button
//                         type="button"
//                         className="cxandidate-apply-job-btn"
//                     >
//                         + Apply to a job
//                     </button>
//                 </div>

//                 <div className="cxandidate-applications-list">
//                     {applications.map((app) => (
//                         <div
//                             key={app.id}
//                             className="cxandidate-application-card"
//                         >
//                             <div className="cxandidate-application-top">
//                                 <div className="cxandidate-application-title">
//                                     <strong>{app.jobTitle}</strong>
//                                     <span> — {app.company}</span>
//                                 </div>

//                                 <span className="cxandidate-application-date">
//                                     applied {app.appliedDate}
//                                 </span>
//                             </div>

//                             <div className="cxandidate-application-content">
//                                 <div className="cxandidate-application-controls">
//                                     <div
//                                         className={`cxandidate-status-badge ${getStatusClass(
//                                             app.status
//                                         )}`}
//                                     >
//                                         <span className="cxandidate-status-icon">
//                                             {getStatusIcon(app.status)}
//                                         </span>

//                                         <span>{app.status}</span>
//                                     </div>

//                                     <select
//                                         className="cxandidate-status-select"
//                                         value={app.status}
//                                         onChange={(e) =>
//                                             handleStatusChange(
//                                                 app.id,
//                                                 e.target.value
//                                             )
//                                         }
//                                     >
//                                         {statuses.map((status) => (
//                                             <option
//                                                 key={status}
//                                                 value={status}
//                                             >
//                                                 {status}
//                                             </option>
//                                         ))}
//                                     </select>

//                                     <button
//                                         type="button"
//                                         className="cxandidate-application-action"
//                                         onClick={() =>
//                                             handleOpenInterview(app)
//                                         }
//                                     >
//                                         <FiCalendar />
//                                         <span>Interview</span>
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="cxandidate-application-action"
//                                     >
//                                         <FiDollarSign />
//                                         <span>Rates</span>
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="cxandidate-application-action"
//                                     >
//                                         <FiList />
//                                         <span>
//                                             History ({app.historyCount})
//                                         </span>
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="cxandidate-application-action cxandidate-remove-btn"
//                                         onClick={() =>
//                                             handleRemove(app.id)
//                                         }
//                                     >
//                                         <FiX />
//                                         <span>Remove</span>
//                                     </button>
//                                 </div>

//                                 <div className="cxandidate-application-rates">
//                                     <span>
//                                         Expected:{" "}
//                                         <strong>{app.expectedSalary}</strong>
//                                     </span>

//                                     {app.submissionRate && (
//                                         <>
//                                             <span className="cxandidate-rate-separator">
//                                                 ·
//                                             </span>

//                                             <span>
//                                                 Submitted:{" "}
//                                                 <strong>
//                                                     {app.submissionRate}
//                                                 </strong>
//                                             </span>
//                                         </>
//                                     )}

//                                     {app.offer && (
//                                         <>
//                                             <span className="cxandidate-rate-separator">
//                                                 ·
//                                             </span>

//                                             <span className="cxandidate-offer-rate">
//                                                 Offer:{" "}
//                                                 <strong>{app.offer}</strong>
//                                             </span>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {showInterviewModal && selectedApplication && (
//                 <div
//                     className="cxandidate-modal-overlay"
//                     onMouseDown={handleCloseInterview}
//                 >
//                     <div
//                         className="cxandidate-interview-modal"
//                         onMouseDown={(e) => e.stopPropagation()}
//                     >
//                         <div className="cxandidate-interview-modal-header">
//                             <h3>
//                                 Schedule interview —{" "}
//                                 {selectedApplication.jobTitle}
//                             </h3>

//                             <button
//                                 type="button"
//                                 className="cxandidate-modal-close"
//                                 onClick={handleCloseInterview}
//                                 aria-label="Close"
//                             >
//                                 <FiX />
//                             </button>
//                         </div>

//                         <div className="cxandidate-interview-modal-body">
//                             <div className="row g-3">
//                                 <div className="col-md-6">
//                                     <label className="cxandidate-form-label">
//                                         Date *
//                                     </label>

//                                     <div className="cxandidate-input-icon-wrapper">
//                                         <input
//                                             type="text"
//                                             className="form-control cxandidate-form-control"
//                                             value={interviewData.date}
//                                             onChange={(e) =>
//                                                 handleInterviewChange(
//                                                     "date",
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />

//                                         <FiCalendar />
//                                     </div>
//                                 </div>

//                                 <div className="col-md-6">
//                                     <label className="cxandidate-form-label">
//                                         Time
//                                     </label>

//                                     <div className="cxandidate-input-icon-wrapper">
//                                         <input
//                                             type="text"
//                                             className="form-control cxandidate-form-control"
//                                             value={interviewData.time}
//                                             onChange={(e) =>
//                                                 handleInterviewChange(
//                                                     "time",
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />

//                                         <FiClock />
//                                     </div>
//                                 </div>

//                                 <div className="col-md-6">
//                                     <label className="cxandidate-form-label">
//                                         Type
//                                     </label>

//                                     <select
//                                         className="form-select cxandidate-form-control"
//                                         value={interviewData.type}
//                                         onChange={(e) =>
//                                             handleInterviewChange(
//                                                 "type",
//                                                 e.target.value
//                                             )
//                                         }
//                                     >
//                                         <option value="Teams">Teams</option>
//                                         <option value="Zoom">Zoom</option>
//                                         <option value="Phone">Phone</option>
//                                         <option value="Onsite">Onsite</option>
//                                     </select>
//                                 </div>

//                                 <div className="col-md-6">
//                                     <label className="cxandidate-form-label">
//                                         Round
//                                     </label>

//                                     <select
//                                         className="form-select cxandidate-form-control"
//                                         value={interviewData.round}
//                                         onChange={(e) =>
//                                             handleInterviewChange(
//                                                 "round",
//                                                 e.target.value
//                                             )
//                                         }
//                                     >
//                                         <option value="Technical Round">
//                                             Technical Round
//                                         </option>
//                                         <option value="HR Round">
//                                             HR Round
//                                         </option>
//                                         <option value="Final Round">
//                                             Final Round
//                                         </option>
//                                     </select>
//                                 </div>

//                                 <div className="col-12">
//                                     <label className="cxandidate-form-label">
//                                         Interviewer
//                                     </label>

//                                     <input
//                                         type="text"
//                                         className="form-control cxandidate-form-control"
//                                         placeholder="e.g. Sarah Lin (Client)"
//                                         value={interviewData.interviewer}
//                                         onChange={(e) =>
//                                             handleInterviewChange(
//                                                 "interviewer",
//                                                 e.target.value
//                                             )
//                                         }
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="cxandidate-interview-modal-footer">
//                             <button
//                                 type="button"
//                                 className="cxandidate-cancel-btn"
//                                 onClick={handleCloseInterview}
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="button"
//                                 className="cxandidate-save-interview-btn"
//                                 onClick={handleSaveInterview}
//                             >
//                                 Save & set to Interview
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ApplicationsTab;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiList,
    FiSearch,
    FiX,
} from "react-icons/fi";
import { FaPlaneDeparture } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import {
    getCandidateApplications,
    clearCandidateApplications,
} from "../../Redux/Slice/candidateSlice";
import ApplyJobModal from "../Candidate/ApplyJobModal";
import "./Components.css";

const ApplicationsTab = ({ candidateId }) => {
    const dispatch = useDispatch();

    const {
        candidateApplications = [],
        candidateApplicationsLoading = false,
        candidateApplicationsError = null,
    } = useSelector((state) => state.candidate);

    const [applications, setApplications] = useState([]);

    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showApplyJobModal, setShowApplyJobModal] = useState(false);
    const [interviewData, setInterviewData] = useState({
        date: "27-08-2026",
        time: "13:16",
        type: "Teams",
        round: "HR Round",
        interviewer: "",
    });
    const {
        openJobs = [],
        isOpenJobsLoading = false,
    } = useSelector(
        (state) => state.jobs
    );
    const statuses = [
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

    useEffect(() => {
        if (!candidateId) {
            return;
        }

        dispatch(getCandidateApplications(candidateId));

        return () => {
            dispatch(clearCandidateApplications());
        };
    }, [candidateId, dispatch]);

    useEffect(() => {
        setApplications(
            candidateApplications.map((application) => ({
                ...application,
                status:
                    application.status ||
                    application.submissionStatus ||
                    "Applied",
            }))
        );
    }, [candidateApplications]);

    const getJobTitle = (application) => {
        return (
            application.jobTitle ||
            application.job?.title ||
            application.job?.jobTitle ||
            application.job?.name ||
            application.title ||
            "Untitled Job"
        );
    };

    const getCompany = (application) => {
        return (
            application.company ||
            application.companyName ||
            application.clientName ||
            application.job?.clientName ||
            application.job?.client?.name ||
            application.job?.client?.companyName ||
            ""
        );
    };

    const getApplicationDate = (application) => {
        return (
            application.appliedDate ||
            application.createdAt ||
            application.createdDate ||
            application.submittedAt ||
            "-"
        );
    };

    const getExpectedSalary = (application) => {
        if (application.expectedSalary) {
            return application.expectedSalary;
        }

        const amount =
            application.expectedSalaryAmount ??
            application.expectedRateAmount ??
            application.candidateRateAmount;

        const currency =
            application.expectedSalaryCurrency ||
            application.expectedRateCurrency ||
            application.candidateRateCurrency;

        const period =
            application.expectedSalaryPeriod ||
            application.expectedRatePeriod ||
            application.candidateRatePeriod;

        if (amount !== undefined && amount !== null) {
            return `${currency || ""} ${amount} / ${period || "day"}`;
        }

        return "-";
    };

    const getSubmissionRate = (application) => {
        if (application.submissionRate) {
            return application.submissionRate;
        }

        const amount =
            application.submissionRateAmount ??
            application.submittedRateAmount;

        const currency =
            application.submissionRateCurrency ||
            application.submittedRateCurrency;

        const period =
            application.submissionRatePeriod ||
            application.submittedRatePeriod;

        if (amount !== undefined && amount !== null) {
            return `${currency || ""} ${amount} / ${period || "day"}`;
        }

        return null;
    };

    const getOfferRate = (application) => {
        if (application.offer) {
            return application.offer;
        }

        const amount =
            application.offerAmount ||
            application.offerRateAmount;

        const currency =
            application.offerCurrency ||
            application.offerRateCurrency;

        const period =
            application.offerPeriod ||
            application.offerRatePeriod;

        if (amount !== undefined && amount !== null) {
            return `${currency || ""} ${amount} / ${period || "day"}`;
        }

        return null;
    };

    const getHistoryCount = (application) => {
        return (
            application.historyCount ??
            application.activityCount ??
            application.history?.length ??
            0
        );
    };

    const getStatusClass = (status) => {
        const classes = {
            Applied: "cxandidate-status-pipeline",
            "Actively Sourcing": "cxandidate-status-sourcing",
            "Ready to Submit": "cxandidate-status-ready",
            Submitted: "cxandidate-status-submitted",
            Interview: "cxandidate-status-interview",
            Selected: "cxandidate-status-selected",
            "Offer Released": "cxandidate-status-selected",
            Onboarding: "cxandidate-status-selected",
            Onboarded: "cxandidate-status-selected",
            Hold: "cxandidate-status-hold",
            Rejected: "cxandidate-status-rejected",
            Offboarded: "cxandidate-status-withdrawn",
        };

        return classes[status] || "cxandidate-status-default";
    };

    const getStatusIcon = (status) => {
        const icons = {
            Applied: <FiSearch />,
            "Actively Sourcing": <FiSearch />,
            "Ready to Submit": <MdWorkOutline />,
            Submitted: <MdWorkOutline />,
            Interview: <FiCalendar />,
            Selected: <MdWorkOutline />,
            "Offer Released": <MdWorkOutline />,
            Onboarding: <MdWorkOutline />,
            Onboarded: <FaPlaneDeparture />,
            Hold: <FiClock />,
            Rejected: <FiX />,
            Offboarded: <FiX />,
        };

        return icons[status] || <MdWorkOutline />;
    };

    const handleStatusChange = (id, value) => {
        setApplications((prev) =>
            prev.map((application) =>
                application.id === id
                    ? {
                        ...application,
                        status: value,
                    }
                    : application
            )
        );
    };

    const handleOpenInterview = (application) => {
        setSelectedApplication(application);
        setShowInterviewModal(true);
    };

    const handleCloseInterview = () => {
        setShowInterviewModal(false);
        setSelectedApplication(null);
    };

    const handleInterviewChange = (field, value) => {
        setInterviewData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveInterview = () => {
        if (!selectedApplication) {
            return;
        }

        setApplications((prev) =>
            prev.map((application) =>
                application.id === selectedApplication.id
                    ? {
                        ...application,
                        status: "Interview",
                    }
                    : application
            )
        );

        handleCloseInterview();
    };

    const handleRemove = (id) => {
        setApplications((prev) =>
            prev.filter((application) => application.id !== id)
        );
    };
    const handleApplyJobSubmit = ({
        jobId,
        job,
        status,
    }) => {
        console.log("APPLY CANDIDATE TO JOB:", {
            candidateId,
            jobId,
            job,
            status,
        });

        setShowApplyJobModal(false);
    };
    return (
        <>
            <div className="candidate-tab-card cxandidate applications-tab">
                <div className="cxandidate-applications-header d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <h2 className="cxandidate-applications-title">
                            Applications ({applications.length})
                        </h2>

                        <p className="cxandidate-applications-description">
                            Each application is this candidate's journey
                            through one job — with its own status, interview
                            and history.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="cxandidate-apply-job-btn"
                        onClick={() => setShowApplyJobModal(true)}
                    >
                        + Apply to a job
                    </button>
                </div>

                {candidateApplicationsLoading && (
                    <div className="text-center py-4">
                        Loading applications...
                    </div>
                )}

                {!candidateApplicationsLoading &&
                    candidateApplicationsError && (
                        <div className="text-center py-4 text-danger">
                            {candidateApplicationsError}
                        </div>
                    )}

                {!candidateApplicationsLoading &&
                    !candidateApplicationsError &&
                    applications.length === 0 && (
                        <div className="text-center py-5">
                            No applications found for this candidate.
                        </div>
                    )}

                {!candidateApplicationsLoading &&
                    !candidateApplicationsError &&
                    applications.length > 0 && (
                        <div className="cxandidate-applications-list">
                            {applications.map((app, index) => {
                                const jobTitle = getJobTitle(app);
                                const company = getCompany(app);
                                const expectedSalary =
                                    getExpectedSalary(app);
                                const submissionRate =
                                    getSubmissionRate(app);
                                const offerRate =
                                    getOfferRate(app);
                                const historyCount =
                                    getHistoryCount(app);

                                return (
                                    <div
                                        key={
                                            app.id ||
                                            app.submissionId ||
                                            index
                                        }
                                        className="cxandidate-application-card"
                                    >
                                        <div className="cxandidate-application-top">
                                            <div className="cxandidate-application-title">
                                                <strong>
                                                    {jobTitle}
                                                </strong>

                                                {company && (
                                                    <span>
                                                        {" "}
                                                        — {company}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="cxandidate-application-date">
                                                applied{" "}
                                                {getApplicationDate(app)}
                                            </span>
                                        </div>

                                        <div className="cxandidate-application-content">
                                            <div className="cxandidate-application-controls">
                                                <div
                                                    className={`cxandidate-status-badge ${getStatusClass(
                                                        app.status
                                                    )}`}
                                                >
                                                    <span className="cxandidate-status-icon">
                                                        {getStatusIcon(
                                                            app.status
                                                        )}
                                                    </span>

                                                    <span>
                                                        {app.status}
                                                    </span>
                                                </div>

                                                <select
                                                    className="cxandidate-status-select"
                                                    value={app.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            app.id ||
                                                            app.submissionId,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {statuses.map(
                                                        (status) => (
                                                            <option
                                                                key={
                                                                    status
                                                                }
                                                                value={
                                                                    status
                                                                }
                                                            >
                                                                {status}
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action"
                                                    onClick={() =>
                                                        handleOpenInterview(
                                                            app
                                                        )
                                                    }
                                                >
                                                    <FiCalendar />
                                                    <span>
                                                        Interview
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action"
                                                >
                                                    <FiDollarSign />
                                                    <span>
                                                        Rates
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action"
                                                >
                                                    <FiList />
                                                    <span>
                                                        History (
                                                        {
                                                            historyCount
                                                        }
                                                        )
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action cxandidate-remove-btn"
                                                    onClick={() =>
                                                        handleRemove(
                                                            app.id ||
                                                            app.submissionId
                                                        )
                                                    }
                                                >
                                                    <FiX />
                                                    <span>
                                                        Remove
                                                    </span>
                                                </button>
                                            </div>

                                            <div className="cxandidate-application-rates">
                                                <span>
                                                    Expected:{" "}
                                                    <strong>
                                                        {
                                                            expectedSalary
                                                        }
                                                    </strong>
                                                </span>

                                                {submissionRate && (
                                                    <>
                                                        <span className="cxandidate-rate-separator">
                                                            ·
                                                        </span>

                                                        <span>
                                                            Submitted:{" "}
                                                            <strong>
                                                                {
                                                                    submissionRate
                                                                }
                                                            </strong>
                                                        </span>
                                                    </>
                                                )}

                                                {offerRate && (
                                                    <>
                                                        <span className="cxandidate-rate-separator">
                                                            ·
                                                        </span>

                                                        <span className="cxandidate-offer-rate">
                                                            Offer:{" "}
                                                            <strong>
                                                                {
                                                                    offerRate
                                                                }
                                                            </strong>
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
            </div>

            {showInterviewModal &&
                selectedApplication && (
                    <div
                        className="cxandidate-modal-overlay"
                        onMouseDown={
                            handleCloseInterview
                        }
                    >
                        <div
                            className="cxandidate-interview-modal"
                            onMouseDown={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <div className="cxandidate-interview-modal-header">
                                <h3>
                                    Schedule interview —{" "}
                                    {getJobTitle(
                                        selectedApplication
                                    )}
                                </h3>

                                <button
                                    type="button"
                                    className="cxandidate-modal-close"
                                    onClick={
                                        handleCloseInterview
                                    }
                                    aria-label="Close"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="cxandidate-interview-modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Date *
                                        </label>

                                        <div className="cxandidate-input-icon-wrapper">
                                            <input
                                                type="text"
                                                className="form-control cxandidate-form-control"
                                                value={
                                                    interviewData.date
                                                }
                                                onChange={(e) =>
                                                    handleInterviewChange(
                                                        "date",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <FiCalendar />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Time
                                        </label>

                                        <div className="cxandidate-input-icon-wrapper">
                                            <input
                                                type="text"
                                                className="form-control cxandidate-form-control"
                                                value={
                                                    interviewData.time
                                                }
                                                onChange={(e) =>
                                                    handleInterviewChange(
                                                        "time",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <FiClock />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Type
                                        </label>

                                        <select
                                            className="form-select cxandidate-form-control"
                                            value={
                                                interviewData.type
                                            }
                                            onChange={(e) =>
                                                handleInterviewChange(
                                                    "type",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Teams">
                                                Teams
                                            </option>
                                            <option value="Zoom">
                                                Zoom
                                            </option>
                                            <option value="Phone">
                                                Phone
                                            </option>
                                            <option value="Onsite">
                                                Onsite
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Round
                                        </label>

                                        <select
                                            className="form-select cxandidate-form-control"
                                            value={
                                                interviewData.round
                                            }
                                            onChange={(e) =>
                                                handleInterviewChange(
                                                    "round",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Technical Round">
                                                Technical Round
                                            </option>
                                            <option value="HR Round">
                                                HR Round
                                            </option>
                                            <option value="Final Round">
                                                Final Round
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="cxandidate-form-label">
                                            Interviewer
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control cxandidate-form-control"
                                            placeholder="e.g. Sarah Lin (Client)"
                                            value={
                                                interviewData.interviewer
                                            }
                                            onChange={(e) =>
                                                handleInterviewChange(
                                                    "interviewer",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="cxandidate-interview-modal-footer">
                                <button
                                    type="button"
                                    className="cxandidate-cancel-btn"
                                    onClick={
                                        handleCloseInterview
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="cxandidate-save-interview-btn"
                                    onClick={
                                        handleSaveInterview
                                    }
                                >
                                    Save & set to Interview
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {showApplyJobModal && (
                <ApplyJobModal
                    jobs={openJobs}
                    jobsLoading={isOpenJobsLoading}
                    onClose={() => setShowApplyJobModal(false)}
                    onApply={handleApplyJobSubmit}
                />
            )}
        </>
    );
};

export default ApplicationsTab;