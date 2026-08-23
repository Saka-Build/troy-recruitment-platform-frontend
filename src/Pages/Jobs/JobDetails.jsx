import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./Job.css";
import AddCandidateModal from "../Add_Edit_CandidateModal";
import { getJobById } from "../../Redux/Slice/jobSlice";
import ManualCreationModal from "./ManualCreationModal";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedJob,
    isFetching,
    error,
  } = useSelector((state) => state.jobs);

  const [activeTab, setActiveTab] = useState("Snapshot");

  const [
    showManualCreationModal,
    setShowManualCreationModal,
  ] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getJobById(id));
    }
  }, [dispatch, id]);

  if (isFetching) {
    return (
      <div className="page">
        <div className="job-not-found">
          <h2>Loading job...</h2>
        </div>
      </div>
    );
  }

  if (error || !selectedJob) {
    return (
      <div className="page">
        <div className="job-not-found">
          <h2>{error || "Job not found"}</h2>

          <button
            className="outline-btn"
            onClick={() => navigate("/dashboard/jobs")}
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const job = selectedJob;

  const tabs = [
    "Snapshot",
    "Job Description",
    "Activity",
  ];

  return (
    <div className="page">
      <div className="job-details-back-wrapper">
        <button
          className="job-details-back-btn"
          onClick={() => navigate("/dashboard/jobs")}
        >
          ← Jobs
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            {job.title}
          </h1>

          <p className="page-subtitle">
            {job.clientName}
            {" · "}
            {job.location}
          </p>
        </div>

        <div className="page-header-actions">
          <span
            className={`status-badge status-${job.status?.toLowerCase()}`}
          >
            {job.status}
          </span>

          <button
            className="primary-btn"
            onClick={() => setShowManualCreationModal(true)}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="job-details-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="job-details-content">
        {activeTab === "Snapshot" && (
          <SnapshotTab job={job} />
        )}

        {activeTab === "Job Description" && (
          <JobDescriptionTab job={job} />
        )}

        {activeTab === "Activity" && (
          <ActivityTab />
        )}
      </div>

      {showManualCreationModal && (
        <ManualCreationModal
          title="Edit job"
          job={job}
          isEdit={true}
          onClose={() => setShowManualCreationModal(false)}
          onSave={(updatedJob) => {
            console.log("Job updated:", updatedJob);

            setShowManualCreationModal(false);
            dispatch(getJobById(id));
          }}
        />
      )}
    </div>
  );
}

function SnapshotTab({ job }) {
  const clientRate =
    job.clientRateAmount !== null &&
    job.clientRateAmount !== undefined
      ? `${job.clientRateCurrency || ""} ${job.clientRateAmount}/${job.clientRatePeriod || ""}`
      : "—";

  const candidateRate =
    job.candidateRateAmount !== null &&
    job.candidateRateAmount !== undefined
      ? `${job.candidateRateCurrency || ""} ${job.candidateRateAmount}/${job.candidateRatePeriod || ""}`
      : "—";

  const assignedRecruiters =
    Array.isArray(job.assignedRecruiters)
      ? job.assignedRecruiters
      : [];

  const skills =
    Array.isArray(job.skillsRequired)
      ? job.skillsRequired
      : [];

  return (
    <div className="snapshot-tab">
      <div className="job-detail-summary-grid">
        <JobSummaryCard
          label="ROLE ID"
          value={job.jobId}
        />

        <JobSummaryCard
          label="CLIENT"
          value={job.clientName}
        />

        <JobSummaryCard
          label="TYPE / MODE"
          value={`${job.jobType} · ${job.workMode}`}
        />

        <JobSummaryCard
          label="CLIENT RATE"
          value={clientRate}
        />

        <JobSummaryCard
          label="RATE TO CANDIDATE"
          value={candidateRate}
        />

        <JobSummaryCard
          label="PRIORITY"
          value={job.priority}
        />

        <JobSummaryCard
          label="STATUS"
          value={job.status}
        />

        <JobSummaryCard
          label="LEAD"
          value={job.ownerName || "Not assigned yet"}
        />
      </div>

      <div className="assigned-recruiter-card">
        <div className="job-summary-label">
          ASSIGNED RECRUITERS
        </div>

        <div className="assigned-recruiter-value">
          {assignedRecruiters.length > 0
            ? assignedRecruiters
                .map((recruiter) => recruiter.fullName)
                .join(", ")
            : "None"}
        </div>
      </div>

      {/* Lead Note */}
      <div className="lead-note-card">
        <div className="lead-note-title">
          📝 LEAD NOTE
        </div>

        <div className="lead-note-text">
          {job.leadNote || "No note added."}
        </div>
      </div>

      <div className="required-skills-card">
        <h2>Required skills</h2>

        <div className="required-skills-list">
          {skills.map((skill) => (
            <span
              key={skill}
              className="required-skill"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="job-location-detail-row">
          <span>Location</span>

          <strong>
            {job.location}
          </strong>
        </div>
      </div>
    </div>
  );
}

function JobDescriptionTab({ job }) {
  const hasDescription =
    typeof job.description === "string" &&
    job.description.trim().length > 0;

  return (
    <div className="job-description-panel">
      <div className="job-description-panel-header">
        <h2>Job Description</h2>
      </div>

      {hasDescription ? (
        <div className="job-description-content">
          {job.description}
        </div>
      ) : (
        <div className="job-description-empty">
          <div className="job-description-empty-icon">
            📝
          </div>

          <div className="job-description-empty-title">
            No Job Description yet.
          </div>

          <div className="job-description-empty-text">
            No job description has been added.
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityTab() {
  const activities = [
    {
      type: "created",
      title: "Job created",
      date: "2026-07-20",
    },
    {
      type: "candidate",
      title: "Julia Deveraux · Submitted",
      subtitle: "linked candidate",
    },
    {
      type: "candidate",
      title: "Anita Kumar · Screening",
      subtitle: "linked candidate",
    },
    {
      type: "candidate",
      title: "David Osei · Joined",
      subtitle: "linked candidate",
    },
  ];

  return (
    <div className="activity-panel">
      <h2>Activity & audit trail</h2>

      <div className="activity-list">
        {activities.map((activity, index) => (
          <div
            className="activity-item"
            key={index}
          >
            <div
              className={`activity-icon ${
                activity.type === "created"
                  ? "activity-created"
                  : "activity-candidate"
              }`}
            >
              {activity.type === "created"
                ? "+"
                : "♟"}
            </div>

            <div className="activity-content">
              <div className="activity-title">
                {activity.title}
              </div>

              {activity.date && (
                <div className="activity-date">
                  {activity.date}
                </div>
              )}

              {activity.subtitle && (
                <div className="activity-subtitle">
                  {activity.subtitle}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobSummaryCard({
  label,
  value,
  muted = false,
}) {
  return (
    <div className="job-detail-summary-card">
      <div className="job-summary-label">
        {label}
      </div>

      <div
        className={`job-summary-value ${
          muted ? "job-summary-muted" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default JobDetails;