import React from "react";
import {
    FiBriefcase,
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiFileText,
    FiGlobe,
    FiLinkedin,
    FiMapPin,
    FiPhone,
    FiUser,
} from "react-icons/fi";
import "./Components1.css";

const ProfileTab = ({ candidate, appliedForJobName, }) => {
    if (!candidate) {
        return null;
    }

    const formatSalary = (amount, currency, period) => {
        if (amount === null || amount === undefined || amount === "") {
            return "—";
        }

        return `${currency || ""} ${Number(amount).toLocaleString()} / ${period || ""}`;
    };

    const formatExperience = (years) => {
        if (years === null || years === undefined || years === "") {
            return "—";
        }

        return `${years} yrs`;
    };

    const formatNotice = (days) => {
        if (days === null || days === undefined || days === "") {
            return "—";
        }

        return `${days} days`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // const appliedFor = candidate.appliedFor || "—";
    const appliedFor = appliedForJobName || "—";
    const experience = formatExperience(candidate.experienceYears);
    const notice = formatNotice(candidate.noticePeriodDays);

    const expected = formatSalary(
        candidate.expectedSalaryAmount,
        candidate.expectedSalaryCurrency,
        candidate.expectedSalaryPeriod
    );

    const source = candidate.source || "—";

    return (
        <div className="profile-tab">
            <div className="candidate-summary-grid">
                <SummaryCard
                    icon={<FiBriefcase />}
                    label="Applied For"
                    value={appliedFor}
                    type="blue"
                />

                <SummaryCard
                    icon={<FiUser />}
                    label="Experience"
                    value={experience}
                    type="purple"
                />

                <SummaryCard
                    icon={<FiPhone />}
                    label="Notice"
                    value={notice}
                    type="orange"
                />

                <SummaryCard
                    icon={<FiDollarSign />}
                    label="Expected"
                    value={expected}
                    type="green"
                />

                <SummaryCard
                    icon={<FiGlobe />}
                    label="Source"
                    value={source}
                    type="pink"
                />
            </div>

            <div className="profile-details-wrapper">
                <div className="profile-top-grid">
                    <InfoSection
                        icon={<FiUser />}
                        title="Personal Information"
                        color="blue"
                    >
                        <InfoGrid>
                            <InfoItem
                                label="Full Name"
                                value={candidate.fullName || "—"}
                            />

                            <InfoItem
                                label="Email"
                                value={candidate.email || "—"}
                            />

                            <InfoItem
                                label="Phone"
                                value={candidate.phone || "—"}
                            />

                            <InfoItem
                                label="WhatsApp"
                                value={candidate.whatsapp || "—"}
                            />

                            <InfoItem
                                label="Location"
                                value={candidate.location || "—"}
                            />

                            <InfoItem
                                label="Nationality"
                                value={candidate.nationality || "—"}
                            />

                            <InfoItem
                                label="Visa Status"
                                value={candidate.visaStatus || "—"}
                            />

                            <InfoItem
                                label="Status"
                                value={
                                    <span
                                        className={`candidate-status status-${String(
                                            candidate.status || ""
                                        ).toLowerCase()}`}
                                    >
                                        {candidate.status || "—"}
                                    </span>
                                }
                            />
                        </InfoGrid>
                    </InfoSection>

                    <InfoSection
                        icon={<FiBriefcase />}
                        title="Professional Information"
                        color="purple"
                    >
                        <InfoGrid>
                            <InfoItem
                                label="CV ID"
                                value={candidate.cvId || "—"}
                            />

                            <InfoItem
                                label="CV Owner"
                                value={candidate.cvOwnerName || "—"}
                            />

                            <InfoItem
                                label="Designation"
                                value={candidate.currentDesignation || "—"}
                            />

                            <InfoItem
                                label="Current Employer"
                                value={candidate.currentEmployer || "—"}
                            />

                            <InfoItem
                                label="Referred By"
                                value={candidate.referredBy || "—"}
                            />

                            <InfoItem
                                label="Education"
                                value={candidate.education || "—"}
                            />

                            <InfoItem
                                label="Current Salary"
                                value={formatSalary(
                                    candidate.currentSalaryAmount,
                                    candidate.currentSalaryCurrency,
                                    candidate.currentSalaryPeriod
                                )}
                            />

                            <InfoItem
                                label="Expected Salary"
                                value={expected}
                            />

                            <InfoItem
                                label="Experience"
                                value={experience}
                            />

                            <InfoItem
                                label="Notice Period"
                                value={notice}
                            />

                            <InfoItem
                                label="Source"
                                value={candidate.source || "—"}
                            />

                            {/* <InfoItem
                                label="CV Format"
                                value={candidate.originalCvFormat || "—"}
                            /> */}

                            <InfoItem
                                label="Created On"
                                value={formatDate(candidate.createdAt)}
                            />
                        </InfoGrid>
                    </InfoSection>
                </div>
                <div className="skills-section">
                    <InfoSection
                        icon={<FiFileText />}
                        title="Skills & Links"
                        color="green"
                    >
                        <div className="skills-links-grid">
                            <div className="skills-row">
                                <span className="info-label">Skills</span>
                                <span className="info-colon">:</span>

                                <div className="skills-wrapper">
                                    {Array.isArray(candidate.skills) &&
                                        candidate.skills.length > 0 ? (
                                        candidate.skills.map((skill, index) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="skill-badge"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="info-value">—</span>
                                    )}
                                </div>
                            </div>

                            <InfoItem
                                label="LinkedIn"
                                value={
                                    candidate.linkedinUrl ? (
                                        <a
                                            href={candidate.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="linkedin-profile-link"
                                        >
                                            <FiLinkedin />
                                            View Profile
                                        </a>
                                    ) : (
                                        "—"
                                    )
                                }
                            />

                            <InfoItem
                                label="Reference Note"
                                value={candidate.referenceNote || "—"}
                            />

                            <InfoItem
                                label="Original CV"
                                value={
                                    candidate.originalCvUrl ? (
                                        <a
                                            href={candidate.originalCvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-link"
                                        >
                                            <FiFileText />
                                            View CV
                                        </a>
                                    ) : (
                                        "—"
                                    )
                                }
                            />

                            <InfoItem
                                label="Troy CV"
                                value={
                                    candidate.troyCvUrl ? (
                                        <a
                                            href={candidate.troyCvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-link"
                                        >
                                            <FiFileText />
                                            View CV
                                        </a>
                                    ) : (
                                        "—"
                                    )
                                }
                            />
                        </div>
                    </InfoSection>
                </div>
            </div>
        </div>
    );
};

function SummaryCard({ icon, label, value, type }) {
    return (
        <div className={`candidate-summary-card summary-${type}`}>
            <div className="summary-icon">{icon}</div>

            <div className="summary-content">
                <div className="summary-label">{label}</div>
                <div className="summary-value">{value}</div>
            </div>
        </div>
    );
}

function InfoSection({ icon, title, color, children }) {
    return (
        <section className="info-section">
            <div className={`section-heading section-${color}`}>
                <span className="section-icon">{icon}</span>
                <span>{title}</span>
            </div>

            {children}
        </section>
    );
}

function InfoGrid({ children }) {
    return <div className="info-grid">{children}</div>;
}

function InfoItem({ label, value }) {
    return (
        <div className="info-item">
            <span className="info-label">{label}</span>
            <span className="info-colon">:</span>
            <span className="info-value">{value}</span>
        </div>
    );
}

export default ProfileTab;