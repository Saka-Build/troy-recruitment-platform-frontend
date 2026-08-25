import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Job.css";
import { deleteJob, getAllJobs, getJobById } from "../../Redux/Slice/jobSlice";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ManualCreationModal from "./ManualCreationModal";

function JobPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    jobs,
    isFetching,
    isDeleting,
    error,
  } = useSelector((state) => state.jobs);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [showManualModal, setShowManualModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isLoadingJob, setIsLoadingJob] = useState(false);

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase().trim();

      const skills = Array.isArray(job.skillsRequired)
        ? job.skillsRequired.join(" ")
        : "";

      const matchesSearch =
        job.jobId?.toLowerCase().includes(searchText) ||
        job.id?.toLowerCase().includes(searchText) ||
        job.title?.toLowerCase().includes(searchText) ||
        job.clientName?.toLowerCase().includes(searchText) ||
        job.endClientName?.toLowerCase().includes(searchText) ||
        job.location?.toLowerCase().includes(searchText) ||
        skills.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All statuses" ||
        job.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All priorities" ||
        job.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [jobs, search, statusFilter, priorityFilter]);

  const openJobs = jobs.filter(
    (job) => job.status === "Open"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "Closed"
  ).length;

  const holdJobs = jobs.filter(
    (job) => job.status?.toLowerCase() === "on_hold"
  ).length;

  const formatRate = (amount, currency, period) => {
    if (amount === null || amount === undefined) {
      return "—";
    }

    return `${currency || ""} ${amount}/${period || ""}`;
  };

  const handleExport = () => {
    const headers = [
      "Role ID",
      "Job",
      "Client",
      "End Client",
      "Location",
      "Priority",
      "Status",
    ];

    const rows = filteredJobs.map((job) => [
      job.jobId,
      job.title,
      job.clientName,
      job.endClientName,
      job.location,
      job.priority,
      job.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${value ?? ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "jobs.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob?.id) {
      return;
    }

    try {
      await dispatch(
        deleteJob(selectedJob.id)
      ).unwrap();

      setShowDeleteModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Delete Job Error:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedJob(null);
  };

  const handleEditJob = async (job) => {
    try {
      setIsLoadingJob(true);

      const response = await dispatch(
        getJobById(job.id)
      ).unwrap();

      setEditingJob(response);
      setShowManualModal(true);
    } catch (error) {
      console.error("Get Job By ID Error:", error);
    } finally {
      setIsLoadingJob(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "—";

    if (status.toLowerCase() === "on_hold") {
      return "On hold";
    }

    return status;
  };

  return (
    <div className="page job-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Jobs </h1>
          <p className="page-subtitle">{openJobs} open roles</p>
        </div>

        <div className="page-header-actions">
        <button
          className="outline-btn"
          onClick={handleExport}
          disabled={isFetching}
        >
          <i className="bi bi-download"></i>
          Export CSV
        </button>

          <button
            className="primary-btn"
            onClick={() =>
              navigate("/dashboard/jobs/new")
            }
          >
            <i className="bi bi-plus-lg"></i>
            Add job
          </button>
        </div>
      </div>

      <div className="job-stats">
        <JobStatCard
          number={openJobs}
          label="Open"
          highlight
        />

        <JobStatCard
          number={closedJobs}
          label="Closed"
        />

        <JobStatCard
          number={holdJobs}
          label="Hold"
        />
      </div>

      <div className="job-filter-row">
        <div className="job-search-box">
          <span className="job-search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search job title, Role ID, skills..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="job-filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All statuses">
            All statuses
          </option>

          <option value="Open">
            Open
          </option>

          <option value="Closed">
            Closed
          </option>

          <option value="On_hold">
            On hold
          </option>
        </select>

        <select
          className="job-filter-select priority-select"
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option>
            All priorities
          </option>

          <option>
            High
          </option>

          <option>
            Medium
          </option>

          <option>
            Low
          </option>
        </select>
      </div>

      {error && (
        <div className="job-error">
          {error}
        </div>
      )}

      <div className="job-table-wrapper">
        <table className="job-table">
          <thead>
            <tr>
              <th>ROLE ID</th>
              <th>JOB</th>
              <th>CLIENT</th>
              <th>END CLIENT</th>
              <th>LOCATION</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th className="actions-heading">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td
                  colSpan="8"
                  className="no-jobs"
                >
                  Loading jobs...
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <button
                      className="role-id"
                      onClick={() =>
                        navigate(
                          `/dashboard/jobs/${job.id}`
                        )
                      }
                    >
                      {job.jobId}
                    </button>
                  </td>

                  <td>
                    <div className="job-info">
                      <div className="job-title">
                        {job.title}
                      </div>

                      <div className="job-meta">
                        {job.jobType}
                        {" · "}
                        {job.workMode}
                        {" · "}
                        {formatRate(
                          job.clientRateAmount,
                          job.clientRateCurrency,
                          job.clientRatePeriod
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="job-client">
                      {job.clientName}
                    </div>
                  </td>

                  <td>
                    <div className="job-client">
                      {job.endClientName || "—"}
                    </div>
                  </td>

                  <td>
                    <div className="job-location">
                      {job.location}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`priority-badge priority-${job.priority?.toLowerCase()}`}
                    >
                      {job.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${job.status
                        ?.toLowerCase()
                        .replace("_", "-")}`}
                    >
                      {formatStatus(job.status)}
                    </span>
                  </td>

                  <td>
                    <div className="job-actions">
                      <button
                        className="edit-btn"
                        disabled={isLoadingJob}
                        onClick={() =>
                          handleEditJob(job)
                        }
                      >
                        {isLoadingJob
                          ? "Loading..."
                          : "Edit"}
                      </button>

                      <button
                        className="delete-btn"
                        disabled={isDeleting}
                        onClick={() =>
                          handleDeleteClick(job)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {!isFetching &&
              filteredJobs.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="no-jobs"
                  >
                    No jobs found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete job"
        itemName={selectedJob?.title}
        deleteText={
          isDeleting
            ? "Deleting..."
            : "Delete"
        }
      />

      {showManualModal && (
        <ManualCreationModal
          title="Edit job"
          initialData={editingJob}
          isEdit={true}
          onClose={() => {
            setShowManualModal(false);
            setEditingJob(null);
          }}
          onSave={(updatedJob) => {
            console.log(
              "Updated job:",
              updatedJob
            );

            setShowManualModal(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
}

function JobStatCard({
  number,
  label,
  highlight = false,
}) {
  return (
    <div className="job-stat-card">
      <div
        className={`job-stat-number ${
          highlight
            ? "job-stat-number-highlight"
            : ""
        }`}
      >
        {number}
      </div>

      <div className="job-stat-label">
        {label}
      </div>
    </div>
  );
}

export default JobPage;