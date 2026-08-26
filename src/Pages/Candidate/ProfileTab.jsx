import React from "react";

const ProfileTab = ({ candidate }) => {
    return (
        <>
            {/* SUMMARY CARDS */}
            <div className="candidate-summary-grid">

                <SummaryCard
                    label="APPLIED FOR"
                    value={candidate.appliedFor}
                />

                <SummaryCard
                    label="EXPERIENCE"
                    value={candidate.experience}
                />

                <SummaryCard
                    label="NOTICE"
                    value={candidate.notice}
                />

                <SummaryCard
                    label="EXPECTED"
                    value={candidate.expected}
                />

                <SummaryCard
                    label="SOURCE"
                    value="LinkedIn"
                />

            </div>


            {/* CONTACT & OWNERSHIP */}
            <div className="candidate-contact-card">

                <h2>Contact & ownership</h2>

                <DetailRow
                    label="CV ID"
                    value={candidate.cvId}
                />

                <DetailRow
                    label="CV owner · recruiter"
                    value={candidate.owner}
                />

                <DetailRow
                    label="Referred by"
                    value={candidate.referredBy}
                />

                <DetailRow
                    label="Email"
                    value={
                        <div className="contact-value-with-actions">

                            <strong>
                                {candidate.email}
                            </strong>

                            <button>✉</button>
                            <button>▣</button>
                            <button>✉</button>

                        </div>
                    }
                />

                <DetailRow
                    label="Phone"
                    value={
                        <div className="contact-value-with-actions">

                            <strong>
                                {candidate.phone}
                            </strong>

                            <button>💬</button>
                            <button>✉</button>

                        </div>
                    }
                />

                <DetailRow
                    label="Location"
                    value={candidate.location}
                />


                {/* SKILLS */}
                <div className="candidate-skills-row">

                    <div className="detail-label">
                        Skills
                    </div>

                    <div className="candidate-skills">

                        {candidate.skills.map((skill) => (
                            <span key={skill}>
                                {skill}
                            </span>
                        ))}

                    </div>

                </div>

            </div>
        </>
    );
};


function SummaryCard({ label, value, highlight }) {
    return (
        <div className="candidate-summary-card">

            <div className="summary-label">
                {label}
            </div>

            <div
                className={`summary-value ${
                    highlight ? "summary-highlight" : ""
                }`}
            >
                {value}
            </div>

        </div>
    );
}


function DetailRow({ label, value }) {
    return (
        <div className="candidate-detail-row">

            <span className="detail-label">
                {label}
            </span>

            <span className="detail-value">
                {value}
            </span>

        </div>
    );
}


export default ProfileTab;