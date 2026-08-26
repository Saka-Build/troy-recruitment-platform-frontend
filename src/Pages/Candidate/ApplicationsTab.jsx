import React from "react";

const ApplicationsTab = ({ candidate }) => {
    // Sample application data - in real app, this would come from API
    const applications = [
        {
            id: 1,
            jobTitle: "SAP S/4HANA Consultant",
            company: "Nova Manufacturing",
            appliedDate: "3d ago",
            status: "Submitted",
            expectedSalary: "£88,000",
            submissionRate: "missing",
        },
    ];

    // Status color mapping
    const getStatusColor = (status) => {
        const colors = {
            "Submitted": "#6375e8",
            "In Progress": "#f5a623",
            "Interview": "#2f6df6",
            "Selected": "#34c759",
            "Offer Released": "#34c759",
            "Onboarding": "#34c759",
            "Onboarded": "#34c759",
            "Hold": "#ff9500",
            "Deferred": "#ff9500",
            "Withdrawn": "#8e8e93",
            "Rejected": "#ff3b30",
            "Closed": "#8e8e93",
            "Blacklisted": "#ff3b30",
            "Pipeline": "#5ac8fa",
            "Actively Sourcing": "#5ac8fa",
            "Ready to Submit": "#5ac8fa",
        };
        return colors[status] || "#63748f";
    };

    return (
        <div className="candidate-tab-card applications-tab">
            <div className="applications-header">
                <h2>Applications</h2>
                <span className="applications-count">{applications.length} application</span>
            </div>

            <div className="applications-list">
                {applications.map((app) => (
                    <div key={app.id} className="application-item">
                        <div className="application-header">
                            <div className="application-title">
                                <strong>{app.jobTitle}</strong>
                                <span className="application-company">— {app.company}</span>
                            </div>
                            <span className="application-date">applied {app.appliedDate}</span>
                        </div>

                        <div className="application-body">
                            <div className="application-status-row">
                                <div className="application-status">
                                    <span
                                        className="status-dot"
                                        style={{ backgroundColor: getStatusColor(app.status) }}
                                    />
                                    <span className="status-label">{app.status}</span>
                                </div>
                                <div className="application-expected">
                                    <span className="expected-label">Expected:</span>
                                    <span className="expected-value">{app.expectedSalary}</span>
                                    <span className="submission-rate">· submission rate {app.submissionRate}</span>
                                </div>
                            </div>

                            <div className="application-actions">
                                <button className="app-action-btn">View</button>
                                <button className="app-action-btn remove-btn">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApplicationsTab;