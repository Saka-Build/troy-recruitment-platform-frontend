import React from "react";
import "./DashboardActivityModal.css";

function DashboardActivityModal({
  show,
  title,
  count = 0,
  items = [],
  type,
  onClose,
}) {
  if (!show) {
    return null;
  }

  const getCandidateName = (item) => {
    return (
      item?.candidateName ||
      item?.name ||
      "Unknown Candidate"
    );
  };

  const getCandidateDesignation = (item) => {
    if (item?.candidateDesignation) {
      return item.candidateDesignation;
    }

    if (item?.jobName) {
      return item.jobName;
    }

    return "Candidate";
  };

  const getClientName = (item) => {
    return item?.clientName || "";
  };

  const getEndClientName = (item) => {
    return item?.endClientName || "";
  };

  const getJobName = (item) => {
    return (
      item?.jobName ||
      item?.title ||
      "Job not specified"
    );
  };

  const getLocation = (item) => {
    if (item?.location) {
      return item.location;
    }

    const parts = [
      item?.clientName,
      item?.location,
    ].filter(Boolean);

    return parts.join(" · ");
  };

  const formatInterviewTime = (item) => {
    if (!item?.interviewTime) {
      return "--";
    }

    const date = new Date(
      `1970-01-01T${item.interviewTime}`
    );

    if (Number.isNaN(date.getTime())) {
      return item.interviewTime;
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const renderCandidateItem = (item, index) => {
    return (
      <div
        className="dashboard-activity-item"
        key={
          item?.submissionId ||
          item?.candidateId ||
          index
        }
      >
        <div className="dashboard-activity-main">
          <div>
            <div className="dashboard-activity-name">
              {getCandidateName(item)}
            </div>

            <div className="dashboard-activity-subtitle">
              {getCandidateDesignation(item)}

              {getClientName(item) && (
                <>
                  {" · "}
                  {getClientName(item)}
                </>
              )}
            </div>
          </div>

          {item?.subStatusName && (
            <span className="dashboard-activity-badge">
              {item.subStatusName}
            </span>
          )}

          {!item?.subStatusName &&
            item?.statusName && (
              <span className="dashboard-activity-badge">
                {item.statusName}
              </span>
            )}
        </div>
      </div>
    );
  };

  const renderJobItem = (item, index) => {
    return (
      <div
        className="dashboard-activity-item"
        key={item?.jobId || item?.id || index}
      >
        <div className="dashboard-activity-main">
          <div>
            <div className="dashboard-activity-name">
              {getJobName(item)}
            </div>

            <div className="dashboard-activity-subtitle">
              {getClientName(item)}

              {getEndClientName(item) && (
                <>
                  {" · "}
                  {getEndClientName(item)}
                </>
              )}

              {!getEndClientName(item) &&
                getLocation(item) &&
                getLocation(item) !==
                  getClientName(item) && (
                  <>
                    {" · "}
                    {getLocation(item)}
                  </>
                )}
            </div>
          </div>

          <span className="dashboard-activity-badge">
            {item?.priority ||
              item?.jobPriority ||
              "High"}
          </span>
        </div>
      </div>
    );
  };

  const renderInterviewItem = (item, index) => {
    return (
      <div
        className="dashboard-activity-item"
        key={
          item?.interviewId ||
          `${item?.interviewDate}-${item?.interviewTime}-${index}`
        }
      >
        <div className="dashboard-activity-main">
          <div>
            <div className="dashboard-activity-name">
              {getCandidateName(item)}
            </div>

            <div className="dashboard-activity-subtitle">
              {getJobName(item)}

              {getClientName(item) && (
                <>
                  {" · "}
                  {getClientName(item)}
                </>
              )}
            </div>
          </div>

          <span className="dashboard-activity-badge">
            {formatInterviewTime(item)}

            {item?.interviewType && (
              <>
                {" · "}
                {item.interviewType}
              </>
            )}
          </span>
        </div>
      </div>
    );
  };

  const renderItem = (item, index) => {
    switch (type) {
      case "interviews":
        return renderInterviewItem(item, index);

      case "urgent":
        return renderJobItem(item, index);

      case "cvPending":
      case "feedback":
      case "offers":
        return renderCandidateItem(item, index);
      case "joining":
        return renderCandidateItem(item, index);

      default:
        return renderCandidateItem(item, index);
    }
  };

  return (
    <div
      className="dashboard-activity-modal-overlay"
      onClick={onClose}
    >
      <div
        className="dashboard-activity-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="dashboard-activity-modal-header">
          <h2>
            {title} · {count}
          </h2>

          <button
            type="button"
            className="dashboard-activity-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="dashboard-activity-modal-body">
          {items.length === 0 ? (
            <div className="dashboard-activity-empty">
              <div className="dashboard-activity-empty-icon">
                ✓
              </div>

              <div className="dashboard-activity-empty-text">
                Nothing here right now.
              </div>
            </div>
          ) : (
            <div className="dashboard-activity-list">
              {items.map((item, index) =>
                renderItem(item, index)
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="dashboard-activity-modal-footer">
          <button
            type="button"
            className="dashboard-activity-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardActivityModal;