import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCandidateActivity,
} from "../../Redux/Slice/candidateSlice";

const HistoryTab = ({ candidateId }) => {
    const dispatch = useDispatch();

    const {
        candidateActivity,
        candidateActivityLoading,
        candidateActivityError,
    } = useSelector(
        (state) => state.candidate
    );

    useEffect(() => {
        if (!candidateId) {
            return;
        }

        dispatch(
            getCandidateActivity(candidateId)
        );
    }, [
        candidateId,
        dispatch,
    ]);

    if (candidateActivityLoading) {
        return (
            <div className="candidate-tab-card">
                <h2>History & audit</h2>

                <div className="candidate-history-empty">
                    Loading activity...
                </div>
            </div>
        );
    }

    if (candidateActivityError) {
        return (
            <div className="candidate-tab-card">
                <h2>History & audit</h2>

                <div className="candidate-history-empty">
                    {candidateActivityError}
                </div>
            </div>
        );
    }

    if (!candidateActivity?.length) {
        return (
            <div className="candidate-tab-card">
                <h2>History & audit</h2>

                <div className="candidate-history-empty">
                    No activity found.
                </div>
            </div>
        );
    }

    return (
        <div className="candidate-tab-card">
            <h2>History & audit</h2>

            <div className="candidate-history">
                {candidateActivity.map(
                    (activity) => (
                        <HistoryItem
                            key={activity.id}
                            activity={activity}
                        />
                    )
                )}
            </div>
        </div>
    );
};

const HistoryItem = ({ activity }) => {
    const getIcon = (action) => {
        const value =
            action?.toLowerCase() || "";

        if (value.includes("created")) {
            return "+";
        }

        if (
            value.includes("cv") ||
            value.includes("resume")
        ) {
            return "📄";
        }

        if (
            value.includes("phone") ||
            value.includes("call")
        ) {
            return "☎";
        }

        if (
            value.includes("email") ||
            value.includes("message")
        ) {
            return "✉";
        }

        if (
            value.includes("updated") ||
            value.includes("changed")
        ) {
            return "✎";
        }

        return "•";
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    return (
        <div className="history-item">

            <div className="history-icon">
                {getIcon(activity.action)}
            </div>

            <div className="history-content">

                <div className="history-title">
                    {activity.action || "Activity"}
                </div>

                {activity.description && (
                    <div className="history-description">
                        {activity.description}
                    </div>
                )}

                {activity.performedBy && (
                    <div className="history-performed-by">
                        By {activity.performedBy}
                    </div>
                )}

            </div>

            <div className="history-date">
                {formatDate(
                    activity.performedAt
                )}
            </div>

        </div>
    );
};

export default HistoryTab;