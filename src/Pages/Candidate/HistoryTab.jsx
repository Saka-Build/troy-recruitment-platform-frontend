import React from "react";

const HistoryTab = () => {

    return (
        <div className="candidate-tab-card">

            <h2>History & audit</h2>

            <div className="candidate-history">

                <HistoryItem
                    icon="+"
                    title="Candidate created"
                />

                <HistoryItem
                    icon="📄"
                    title="Resume uploaded"
                />

                <HistoryItem
                    icon="☎"
                    title="Phone screening"
                />

                <HistoryItem
                    icon="✉"
                    title="Submitted to client"
                />

            </div>

        </div>
    );
};


function HistoryItem({ icon, title }) {

    return (
        <div className="history-item">

            <div className="history-icon">
                {icon}
            </div>

            <div className="history-title">
                {title}
            </div>

            <div className="history-date">
                —
            </div>

        </div>
    );
}


export default HistoryTab;