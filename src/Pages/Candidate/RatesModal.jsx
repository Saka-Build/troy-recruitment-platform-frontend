
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "./Components.css";


const RatesModal = ({
    application,
    onClose,
    onSave,
    saving = false,
}) => {
    const [formData, setFormData] = useState({
        candidateExpectedAmount: "",
        candidateExpectedCurrency: "INR",
        candidateExpectedPeriod: "DAY",

        submissionAmount: "",
        submissionCurrency: "INR",
        submissionPeriod: "DAY",

        offerAmount: "",
        offerCurrency: "INR",
        offerPeriod: "DAY",
    });
    const [changedFields, setChangedFields] = useState({});

    const normalizePeriod = (period) => {
        if (!period) {
            return "DAY";
        }

        return String(period).toUpperCase();
    };
const [saveMessage, setSaveMessage] = useState("");


    useEffect(() => {
        if (!application) {
            return;
        }

        setFormData({
            candidateExpectedAmount:
                application.candidateExpectedAmount ?? "",

            candidateExpectedCurrency:
                application.candidateExpectedCurrency || "INR",

            candidateExpectedPeriod:
                normalizePeriod(
                    application.candidateExpectedPeriod
                ),

            submissionAmount:
                application.submissionAmount ?? "",

            submissionCurrency:
                application.submissionCurrency || "INR",

            submissionPeriod:
                normalizePeriod(
                    application.submissionPeriod
                ),

            offerAmount:
                application.offerAmount ?? "",

            offerCurrency:
                application.offerCurrency || "INR",

            offerPeriod:
                normalizePeriod(
                    application.offerPeriod
                ),
        });

        setChangedFields({});
    }, [application]);

    if (!application) {
        return null;
    }

    const statusName =
        application.statusName ||
        application.status ||
        "";

    const normalizedStatus =
        statusName.trim().toLowerCase();

    const showOfferRate =
        normalizedStatus === "selected" ||
        normalizedStatus === "offer released";

    /*
     * Handle field change.
     *
     * 1. Update formData
     * 2. Mark that exact field as changed
     */
    const handleChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setChangedFields((previous) => ({
            ...previous,
            [field]: true,
        }));
    };

const handleSave = () => {
    const submissionId =
        application.submissionId ||
        application.id;

    if (!submissionId) {
        console.error("Submission ID is missing");
        return;
    }

    // User clicked Save without changing anything
    if (Object.keys(changedFields).length === 0) {
        setSaveMessage(
            "Please change at least one rate field before saving."
        );

        return;
    }

    // Clear message when there is a valid change
    setSaveMessage("");

    const payload = {
        submissionId,

        candidateExpectedAmount: null,
        candidateExpectedCurrency: null,
        candidateExpectedPeriod: null,

        submissionAmount: null,
        submissionCurrency: null,
        submissionPeriod: null,

        offerAmount: null,
        offerCurrency: null,
        offerPeriod: null,
    };

    Object.keys(changedFields).forEach((field) => {
        if (changedFields[field]) {
            payload[field] =
                formData[field] === ""
                    ? null
                    : formData[field];
        }
    });

    console.log("RATE UPDATE PAYLOAD:", payload);

    onSave(payload);
};
    return (
        

        <div
            className="cxandidate-rates-overlay"
            onMouseDown={onClose}
        >
{saveMessage && (
            <div className="cxandidate-rates-save-message">
                <span>!</span>
                {saveMessage}
            </div>
        )}


            <div
                className="cxandidate-rates-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                {/* HEADER */}

                <div className="cxandidate-rates-header">
                    <h3>
                        Rate details —{" "}
                        {application.jobName ||
                            "Job"}{" "}
                        → {statusName}
                    </h3>

                    <button
                        type="button"
                        className="cxandidate-rates-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        <FiX />
                    </button>
                </div>

                {/* BODY */}

                <div className="cxandidate-rates-body">

                    {/* CANDIDATE EXPECTED RATE */}

                    <div className="cxandidate-rate-field-group">
                        <label className="cxandidate-rate-label">
                            Candidate expected rate
                        </label>

                        <div className="cxandidate-rate-row">

                            <select
                                className="cxandidate-rate-currency"
                                value={
                                    formData.candidateExpectedCurrency
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "candidateExpectedCurrency",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="USD">USD</option>
                                <option value="QAR">QAR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                                <option value="PLN">PLN</option>
                                <option value="EUR">EUR</option>
                                <option value="CAD">CAD</option>
                            </select>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="cxandidate-rate-amount"
                                value={
                                    formData.candidateExpectedAmount
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "candidateExpectedAmount",
                                        event.target.value
                                    )
                                }
                            />

                            <select
                                className="cxandidate-rate-period"
                                value={
                                    formData.candidateExpectedPeriod
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "candidateExpectedPeriod",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="HOUR">
                                    Hour
                                </option>

                                <option value="DAY">
                                    Day
                                </option>

                                <option value="WEEK">
                                    Week
                                </option>

                                <option value="MONTH">
                                    Month
                                </option>

                                <option value="YEAR">
                                    Year
                                </option>
                            </select>

                        </div>
                    </div>


                    {/* SUBMISSION RATE */}

                    <div className="cxandidate-rate-field-group">
                        <label className="cxandidate-rate-label">
                            Submission rate *
                        </label>

                        <div className="cxandidate-rate-row">

                            <select
                                className="cxandidate-rate-currency"
                                value={
                                    formData.submissionCurrency
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "submissionCurrency",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="USD">USD</option>
                                <option value="QAR">QAR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                                <option value="PLN">PLN</option>
                                <option value="EUR">EUR</option>
                                <option value="CAD">CAD</option>
                            </select>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="cxandidate-rate-amount"
                                value={
                                    formData.submissionAmount
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "submissionAmount",
                                        event.target.value
                                    )
                                }
                            />

                            <select
                                className="cxandidate-rate-period"
                                value={
                                    formData.submissionPeriod
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "submissionPeriod",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="HOUR">
                                    Hour
                                </option>

                                <option value="DAY">
                                    Day
                                </option>

                                <option value="WEEK">
                                    Week
                                </option>

                                <option value="MONTH">
                                    Month
                                </option>

                                <option value="YEAR">
                                    Year
                                </option>
                            </select>

                        </div>
                    </div>


                    {/* OFFER / RELEASE RATE */}

                    {showOfferRate && (
                        <div className="cxandidate-rate-field-group">

                            <label className="cxandidate-rate-label">
                                Offer / release rate *
                            </label>

                            <div className="cxandidate-rate-row">

                                <select
                                    className="cxandidate-rate-currency"
                                    value={
                                        formData.offerCurrency
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            "offerCurrency",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="USD">USD</option>
                                    <option value="QAR">QAR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="INR">INR</option>
                                    <option value="PLN">PLN</option>
                                    <option value="EUR">EUR</option>
                                    <option value="CAD">CAD</option>
                                </select>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="cxandidate-rate-amount"
                                    value={
                                        formData.offerAmount
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            "offerAmount",
                                            event.target.value
                                        )
                                    }
                                />

                                <select
                                    className="cxandidate-rate-period"
                                    value={
                                        formData.offerPeriod
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            "offerPeriod",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="HOUR">
                                        Hour
                                    </option>

                                    <option value="DAY">
                                        Day
                                    </option>

                                    <option value="WEEK">
                                        Week
                                    </option>

                                    <option value="MONTH">
                                        Month
                                    </option>

                                    <option value="YEAR">
                                        Year
                                    </option>
                                </select>

                            </div>
                        </div>
                    )}

                    <div className="cxandidate-rates-description">
                        Pick the country currency and whether
                        it is per hour, day, week, month or year.
                    </div>

                </div>

                {/* FOOTER */}

                <div className="cxandidate-rates-footer">

                    <button
                        type="button"
                        className="cxandidate-rates-cancel-btn"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="cxandidate-rates-save-btn"
                        onClick={handleSave}
                        disabled={
                            saving ||
                            formData.submissionAmount === ""
                        }
                    >
                        {saving
                            ? "Saving..."
                            : "Save Rates"}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default RatesModal;

