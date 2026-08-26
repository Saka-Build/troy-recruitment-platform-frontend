import React from "react";

const ProfileTab = ({ candidate }) => {

    if (!candidate) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | FORMAT HELPERS
    |--------------------------------------------------------------------------
    */

    const formatSalary = (
        amount,
        currency,
        period
    ) => {

        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "—";
        }

        return `${currency || ""} ${Number(amount).toLocaleString()} / ${period || ""
            }`;
    };


    const formatExperience = (
        years
    ) => {

        if (
            years === null ||
            years === undefined ||
            years === ""
        ) {
            return "—";
        }

        return `${years} yrs`;
    };


    const formatNotice = (
        days
    ) => {

        if (
            days === null ||
            days === undefined ||
            days === ""
        ) {
            return "—";
        }

        return `${days} days`;
    };


    /*
    |--------------------------------------------------------------------------
    | PROFILE VALUES
    |--------------------------------------------------------------------------
    */

    const appliedFor =
        candidate.appliedFor || "—";

    const experience =
        formatExperience(
            candidate.experienceYears
        );

    const notice =
        formatNotice(
            candidate.noticePeriodDays
        );

    const expected =
        formatSalary(
            candidate.expectedSalaryAmount,
            candidate.expectedSalaryCurrency,
            candidate.expectedSalaryPeriod
        );

    const source =
        candidate.source || "—";


    return (
        <>

            {/* =====================================================
                                SUMMARY CARDS
            ====================================================== */}

            <div className="candidate-summary-grid">

                {/* APPLIED JOB - KEEP AS IT IS */}
                <SummaryCard
                    label="APPLIED FOR"
                    value={appliedFor}
                />

                <SummaryCard
                    label="EXPERIENCE"
                    value={experience}
                />

                <SummaryCard
                    label="NOTICE"
                    value={notice}
                />

                <SummaryCard
                    label="EXPECTED"
                    value={expected}
                />

                <SummaryCard
                    label="SOURCE"
                    value={source}
                />

            </div>


            {/* =====================================================
                            CONTACT & OWNERSHIP
            ====================================================== */}

            <div className="candidate-contact-card">

                <h2>
                    Contact & ownership
                </h2>


                <DetailRow
                    label="CV ID"
                    value={
                        candidate.cvId || "—"
                    }
                />


                <DetailRow
                    label="CV owner · recruiter"
                    value={
                        candidate.cvOwnerName || "—"
                    }
                />


                <DetailRow
                    label="Referred by"
                    value={
                        candidate.referredBy || "—"
                    }
                />


                <DetailRow
                    label="Email"
                    value={
                        <div className="contact-value-with-actions">

                            <strong>
                                {candidate.email || "—"}
                            </strong>

                            <button>
                                ✉
                            </button>

                            <button>
                                ▣
                            </button>

                            <button>
                                ✉
                            </button>

                        </div>
                    }
                />


                <DetailRow
                    label="Phone"
                    value={
                        <div className="contact-value-with-actions">

                            <strong>
                                {candidate.phone || "—"}
                            </strong>

                            <button>
                                💬
                            </button>

                            <button>
                                ✉
                            </button>

                        </div>
                    }
                />


                <DetailRow
                    label="WhatsApp"
                    value={
                        candidate.whatsapp || "—"
                    }
                />


                <DetailRow
                    label="Location"
                    value={
                        candidate.location || "—"
                    }
                />


                <DetailRow
                    label="Current employer"
                    value={
                        candidate.currentEmployer || "—"
                    }
                />


                <DetailRow
                    label="Nationality"
                    value={
                        candidate.nationality || "—"
                    }
                />


                <DetailRow
                    label="Visa status"
                    value={
                        candidate.visaStatus || "—"
                    }
                />


                <DetailRow
                    label="Education"
                    value={
                        candidate.education || "—"
                    }
                />


                <DetailRow
                    label="Current salary"
                    value={
                        formatSalary(
                            candidate.currentSalaryAmount,
                            candidate.currentSalaryCurrency,
                            candidate.currentSalaryPeriod
                        )
                    }
                />


                <DetailRow
                    label="LinkedIn"
                    value={
                        candidate.linkedinUrl ? (
                            <a
                                href={candidate.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View LinkedIn profile
                            </a>
                        ) : (
                            "—"
                        )
                    }
                />


                <DetailRow
                    label="Reference note"
                    value={
                        candidate.referenceNote || "—"
                    }
                />


                {/* =================================================
                                    SKILLS
                ================================================== */}

                <div className="candidate-skills-row">

                    <div className="detail-label">
                        Skills
                    </div>


                    <div className="candidate-skills">

                        {Array.isArray(
                            candidate.skills
                        ) &&
                            candidate.skills.length > 0 ? (

                            candidate.skills.map(
                                (skill, index) => (

                                    <span
                                        key={`${skill}-${index}`}
                                    >
                                        {skill}
                                    </span>

                                )
                            )

                        ) : (

                            <span>
                                —
                            </span>

                        )}

                    </div>

                </div>

            </div>

        </>
    );
};


/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

function SummaryCard({
    label,
    value,
    highlight,
}) {

    return (
        <div className="candidate-summary-card">

            <div className="summary-label">
                {label}
            </div>


            <div
                className={`summary-value ${highlight
                    ? "summary-highlight"
                    : ""
                    }`}
            >
                {value}
            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| DETAIL ROW
|--------------------------------------------------------------------------
*/

function DetailRow({
    label,
    value,
}) {

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