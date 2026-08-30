import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./Job.css";
import AddCandidateModal from "../Add_Edit_CandidateModal";
import { getJobActivities, getJobById } from "../../Redux/Slice/jobSlice";
import ManualCreationModal from "./ManualCreationModal";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {selectedJob, isFetching, error, activities, isActivitiesLoading, activitiesError,} = useSelector((state) => state.jobs);

  const [activeTab, setActiveTab] = useState("Snapshot");
  const [showManualCreationModal,setShowManualCreationModal,] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getJobById(id));
      dispatch(getJobActivities(id));
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

  const tabs = ["Snapshot","Job Description","Activity",];

  return (
    <div className="page">
      <div className="job-details-back-wrapper">
        <button className="job-details-back-btn" onClick={() => navigate("/dashboard/jobs")}>
          ← Jobs
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title"> {job.title}</h1>
          <p className="page-subtitle"> {job.clientName} {" · "} {job.location}</p>
        </div>

        <div className="page-header-actions">
          <span className={`status-badge status-${job.status?.toLowerCase()}`}> {job.status}</span>
          <button className="primary-btn" onClick={() => setShowManualCreationModal(true)}> Edit</button>
        </div>
      </div>

      <div className="job-details-tabs">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="job-details-content">
        {activeTab === "Snapshot" && (<SnapshotTab job={job} />)}
        {activeTab === "Job Description" && (<JobDescriptionTab job={job} />)}
        {activeTab === "Activity" && (
          <ActivityTab activities={activities} loading={isActivitiesLoading} error={activitiesError}/>
        )}
      </div>

      {showManualCreationModal && (
        <ManualCreationModal
          title="Edit job"
          job={job}
          isEdit={true}
          onClose={() => setShowManualCreationModal(false)}
          onSave={(updatedJob) => {console.log("Job updated:", updatedJob);
                                    setShowManualCreationModal(false);
                                    dispatch(getJobById(id));
                                    dispatch(getJobActivities(id));
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
        <JobSummaryCard label="ROLE ID" value={job.jobId}/>
        <JobSummaryCard label="CLIENT" value={job.clientName}/>
        <JobSummaryCard label="TYPE / MODE" value={`${job.jobType} · ${job.workMode}`}/>
        <JobSummaryCard label="CLIENT RATE" value={clientRate}/>
        <JobSummaryCard label="RATE TO CANDIDATE" value={candidateRate}/>
        <JobSummaryCard label="PRIORITY" value={job.priority}/>
        <JobSummaryCard label="STATUS" value={job.status}/>
        <JobSummaryCard label="LEAD" value={job.ownerName || "Not assigned yet"}/>      
      </div>

      <div className="assigned-recruiter-card">
        <div className="job-summary-label"> ASSIGNED RECRUITERS </div>

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
        <div className="lead-note-title">📝 LEAD NOTE</div>
        <div className="lead-note-text">{job.leadNote || "No note added."}</div>      
      </div>

      <div className="required-skills-card">
        <h2>Required skills</h2>
        <div className="required-skills-list">
          {skills.map((skill) => (
            <span key={skill} className="required-skill"> {skill}</span>
          ))}
        </div>

        <div className="job-location-detail-row">
          <span>Location</span>
          <strong>{job.location}</strong>
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
        <div className="job-description-content">{job.description}</div>
      ) : (
        <div className="job-description-empty">
          <div className="job-description-empty-icon">📝</div>
          <div className="job-description-empty-title">No Job Description yet.</div>
          <div className="job-description-empty-text">No job description has been added.</div> 
        </div>
      )}
    </div>
  );
}

function ActivityTab({ activities = [], loading, error }) {
  const [filters, setFilters] = useState({
    performedBy: "",
    fromDate: "",
    toDate: "",
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityType = (activity) => {
    if (activity.action?.toLowerCase().includes("created")) {
      return "created";
    }

    return "updated";
  };

  const performedByUsers = [
    ...new Set(
      activities
        .map((activity) => activity.performedBy)
        .filter(Boolean)
    ),
  ];

  const filteredActivities = activities.filter((activity) => {
    const performedDate = new Date(activity.performedAt);

    /* Who changed */
    if (
      filters.performedBy &&
      activity.performedBy !== filters.performedBy
    ) {
      return false;
    }

    /* From date */
    if (filters.fromDate) {
      const fromDate = new Date(`${filters.fromDate}T00:00:00`);

      if (performedDate < fromDate) {
        return false;
      }
    }

    /* To date */
    if (filters.toDate) {
      const toDate = new Date(`${filters.toDate}T23:59:59`);

      if (performedDate > toDate) {
        return false;
      }
    }

    return true;
  });

  const hasActiveFilters =
    filters.performedBy ||
    filters.fromDate ||
    filters.toDate;

  const clearFilters = () => {
    setFilters({
      performedBy: "",
      fromDate: "",
      toDate: "",
    });
  };

  return (
    <div className="activity-panel">
      {!loading && !error && activities.length > 0 && (
        <div className="activity-header-row">
          <div className="activity-header-info">
            <div className="d-flex align-items-center gap-2">
                          <h2>Activity & Audit Trail</h2>
                          <span className="activity-count">
                {filteredActivities.length}{" "}
                {filteredActivities.length === 1
                  ? "Activity"
                  : "Activities"}
              </span>
            </div>
            <p>Track changes and actions performed on this job.</p>
          </div>


          {/* FILTERS */}
          <div className="activity-filters">

            {/* WHO CHANGED */}
            <div className="activity-filter-field">
              <label>Changed by</label>

              <select
                value={filters.performedBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    performedBy: e.target.value,
                  }))
                }
              >
                <option value="">All users</option>

                {performedByUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            {/* FROM DATE */}
            <div className="activity-filter-field">
              <label>From date</label>

              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    fromDate: e.target.value,
                  }))
                }
              />
            </div>

            {/* TO DATE */}
            <div className="activity-filter-field">
              <label>To date</label>

              <input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    toDate: e.target.value,
                  }))
                }
              />
            </div>

            {/* CLEAR */}
            {hasActiveFilters && (
              <button
                type="button"
                className="activity-clear-filter"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}

          </div>
        </div>
      )}

      {/* No activities — still show heading */}
      {!loading && !error && activities.length === 0 && (
        <div className="activity-header-row">
          <div className="activity-header-info">
            <h2>Activity & Audit Trail</h2>
            <p>Track changes and actions performed on this job.</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="activity-state">
          <div className="activity-loader"></div>
          <span>Loading activities...</span>
        </div>
      )}

      {!loading && error && (
        <div className="activity-state activity-error">
          <span className="state-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="activity-state">
          <span className="state-icon">i</span>

          <div>
            <strong>No activity yet</strong>
            <span>No activity found for this job.</span>
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        activities.length > 0 &&
        filteredActivities.length === 0 && (
          <div className="activity-state">
            <span className="state-icon">i</span>

            <div>
              <strong>No matching activity</strong>
              <span>
                No activity matches the selected filters.
              </span>
            </div>
          </div>
        )}

      {!loading &&
        !error &&
        filteredActivities.length > 0 && (
          <div className="activity-list">
            {filteredActivities.map((activity) => {
              const activityType = getActivityType(activity);

              const hasChange =
                activity.oldValue !== null &&
                activity.oldValue !== undefined &&
                activity.newValue !== null &&
                activity.newValue !== undefined;

              return (
                <div
                  className="activity-item"
                  key={activity.id}
                >
                  <div className="activity-timeline">
                    <div
                      className={`activity-icon ${
                        activityType === "created"
                          ? "activity-created"
                          : "activity-updated"
                      }`}
                    >
                      {activityType === "created"
                        ? "+"
                        : "↻"}
                    </div>
                  </div>

                  <div className="activity-content">
                    <div className="activity-top">
                      <div>
                        <div className="activity-title">
                          {activity.action}
                        </div>

                        <div className="activity-date">
                          {formatDateTime(
                            activity.performedAt
                          )}
                        </div>
                      </div>
                    </div>

                    {activity.description && (
                      <div className="activity-description">
                        {activity.description}
                      </div>
                    )}

                    <div className="activity-meta">
                      <span className="activity-by">
                        By{" "}
                        <strong>
                          {activity.performedBy ||
                            "Unknown"}
                        </strong>
                      </span>
                    </div>

                    {hasChange && (
                      <div className="activity-change">
                        <span className="change-old">
                          {String(activity.oldValue)}
                        </span>

                        <span className="activity-arrow">
                          →
                        </span>

                        <span className="change-new">
                          {String(activity.newValue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

function JobSummaryCard({label,value,muted = false,}) {
  return (
    <div className="job-detail-summary-card">
      <div className="job-summary-label"> {label}</div>
      <div className={`job-summary-value ${   muted ? "job-summary-muted" : "" }`}> {value}</div>
    </div>
  );
}

export default JobDetails;