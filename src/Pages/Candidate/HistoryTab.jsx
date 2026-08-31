import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCandidateActivity } from "../../Redux/Slice/candidateSlice";

const HistoryTab = ({ candidateId }) => {
    const dispatch = useDispatch();

    const {
        candidateActivity,
        candidateActivityLoading,
        candidateActivityError,
    } = useSelector((state) => state.candidate);
   const [showAllActivities, setShowAllActivities] = useState(false);
    const [filters, setFilters] = useState({
        performedBy: "",
        fromDate: "",
        toDate: "",
    });

    useEffect(() => {
        if (!candidateId) {
            return;
        }

        dispatch(getCandidateActivity(candidateId));
    }, [candidateId, dispatch]);

    const activities = Array.isArray(candidateActivity)
        ? candidateActivity
        : [];

    const performedByUsers = [
        ...new Set(
            activities
                .map((activity) => activity.performedBy)
                .filter(Boolean)
        ),
    ];

    const filteredActivities = activities.filter((activity) => {
        const performedDate = new Date(activity.performedAt);

        if (
            filters.performedBy &&
            activity.performedBy !== filters.performedBy
        ) {
            return false;
        }

        if (filters.fromDate) {
            const fromDate = new Date(
                `${filters.fromDate}T00:00:00`
            );

            if (performedDate < fromDate) {
                return false;
            }
        }

        if (filters.toDate) {
            const toDate = new Date(
                `${filters.toDate}T23:59:59`
            );

            if (performedDate > toDate) {
                return false;
            }
        }

        return true;
    });

    const visibleActivities = showAllActivities
    ? filteredActivities
    : filteredActivities.slice(0, 5);

const hasMoreActivities =
    filteredActivities.length > 5;

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

    const formatDateTime = (dateString) => {
        if (!dateString) {
            return "";
        }

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

    return (
        <div className="candidate-history-panel">
            {!candidateActivityLoading &&
                !candidateActivityError &&
                activities.length > 0 && (
                    <div className="candidate-history-header-row">
                        <div className="candidate-history-header-info">
                            <div className="candidate-history-title-row">
                                <h2>History & Audit Trail</h2>

                                <span className="candidate-history-count">
                                    {filteredActivities.length}{" "}
                                    {filteredActivities.length === 1
                                        ? "Activity"
                                        : "Activities"}
                                </span>
                            </div>

                            <p>
                                Track changes and actions performed on this
                                candidate.
                            </p>
                        </div>

                        <div className="candidate-history-filters">
                            <div className="candidate-history-filter-field">
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

                            <div className="candidate-history-filter-field">
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

                            <div className="candidate-history-filter-field">
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

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="candidate-history-clear-filter"
                                    onClick={clearFilters}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                )}

            {!candidateActivityLoading &&
                !candidateActivityError &&
                activities.length === 0 && (
                    <div className="candidate-history-header-row">
                        <div className="candidate-history-header-info">
                            <h2>History & Audit Trail</h2>

                            <p>
                                Track changes and actions performed on this
                                candidate.
                            </p>
                        </div>
                    </div>
                )}

            {candidateActivityLoading && (
                <div className="candidate-history-state">
                    <div className="candidate-history-loader"></div>
                    <span>Loading activities...</span>
                </div>
            )}

            {!candidateActivityLoading &&
                candidateActivityError && (
                    <div className="candidate-history-state candidate-history-error">
                        <span className="candidate-history-state-icon">
                            !
                        </span>

                        <span>{candidateActivityError}</span>
                    </div>
                )}

            {!candidateActivityLoading &&
                !candidateActivityError &&
                activities.length === 0 && (
                    <div className="candidate-history-state">
                        <span className="candidate-history-state-icon">
                            i
                        </span>

                        <div>
                            <strong>No activity yet</strong>

                            <span>
                                No activity found for this candidate.
                            </span>
                        </div>
                    </div>
                )}

            {!candidateActivityLoading &&
                !candidateActivityError &&
                activities.length > 0 &&
                filteredActivities.length === 0 && (
                    <div className="candidate-history-state">
                        <span className="candidate-history-state-icon">
                            i
                        </span>

                        <div>
                            <strong>No matching activity</strong>

                            <span>
                                No activity matches the selected filters.
                            </span>
                        </div>
                    </div>
                )}

            {!candidateActivityLoading &&
                !candidateActivityError &&
                filteredActivities.length > 0 && (
                    <div className="candidate-history-list">
                        {visibleActivities.map((activity) => {
                            const activityType =
                                getActivityType(activity);

                            const hasChange =
                                activity.oldValue !== null &&
                                activity.oldValue !== undefined &&
                                activity.newValue !== null &&
                                activity.newValue !== undefined;

                            return (
                                <div
                                    className="candidate-history-item"
                                    key={activity.id}
                                >
                                    <div className="candidate-history-timeline">
                                        <div
                                            className={`candidate-history-icon ${
                                                activityType === "created"
                                                    ? "candidate-history-created"
                                                    : "candidate-history-updated"
                                            }`}
                                        >
                                            {activityType === "created"
                                                ? "+"
                                                : "↻"}
                                        </div>
                                    </div>

                                    <div className="candidate-history-content">
                                        <div className="candidate-history-activity-title">
                                            {activity.action || "Activity"}
                                        </div>

                                        <div className="candidate-history-date">
                                            {formatDateTime(
                                                activity.performedAt
                                            )}
                                        </div>

                                        {activity.description && (
                                            <div className="candidate-history-description">
                                                {activity.description}
                                            </div>
                                        )}

                                        <div className="candidate-history-meta">
                                            <span className="candidate-history-by">
                                                By{" "}
                                                <strong>
                                                    {activity.performedBy ||
                                                        "Unknown"}
                                                </strong>
                                            </span>
                                        </div>

                                        {hasChange && (
                                            <div className="candidate-history-change">
                                                <span className="candidate-history-old">
                                                    {String(
                                                        activity.oldValue
                                                    )}
                                                </span>

                                                <span className="candidate-history-arrow">
                                                    →
                                                </span>

                                                <span className="candidate-history-new">
                                                    {String(
                                                        activity.newValue
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                 {hasMoreActivities && (
                <div className="candidate-history-read-more">
                    <button
                        type="button"
                        onClick={() =>
                            setShowAllActivities(
                                (previous) => !previous
                            )
                        }
                    >
                        {showAllActivities
                            ? "Show less"
                            : `Read more (${filteredActivities.length - 5} more)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryTab;