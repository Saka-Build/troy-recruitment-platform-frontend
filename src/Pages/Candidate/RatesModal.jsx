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
        candidateExpectedPeriod: "day",

        submissionAmount: "",
        submissionCurrency: "INR",
        submissionPeriod: "day",

        offerAmount: "",
        offerCurrency: "INR",
        offerPeriod: "day",
    });

    useEffect(() => {
        if (!application) {
            return;
        }

        setFormData({
            candidateExpectedAmount:
                application.candidateExpectedAmount ??
                "",

            candidateExpectedCurrency:
                application.candidateExpectedCurrency ||
                "INR",

            candidateExpectedPeriod:
                application.candidateExpectedPeriod ||
                "day",

            submissionAmount:
                application.submissionAmount ??
                "",

            submissionCurrency:
                application.submissionCurrency ||
                "INR",

            submissionPeriod:
                application.submissionPeriod ||
                "day",

            offerAmount:
                application.offerAmount ??
                "",

            offerCurrency:
                application.offerCurrency ||
                "INR",

            offerPeriod:
                application.offerPeriod ||
                "day",
        });
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

    const handleChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSave = () => {
        onSave({
            submissionId:
                application.submissionId ||
                application.id,

            candidateExpectedAmount:
                formData.candidateExpectedAmount,

            candidateExpectedCurrency:
                formData.candidateExpectedCurrency,

            candidateExpectedPeriod:
                formData.candidateExpectedPeriod,

            submissionAmount:
                formData.submissionAmount,

            submissionCurrency:
                formData.submissionCurrency,

            submissionPeriod:
                formData.submissionPeriod,

            ...(showOfferRate
                ? {
                      offerAmount:
                          formData.offerAmount,

                      offerCurrency:
                          formData.offerCurrency,

                      offerPeriod:
                          formData.offerPeriod,
                  }
                : {}),
        });
    };

    return (
        <div
            className="cxandidate-rates-overlay"
            onMouseDown={onClose}
        >
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
                                <option value="INR">
                                    INR
                                </option>
                                <option value="USD">
                                    USD
                                </option>
                                <option value="GBP">
                                    GBP
                                </option>
                                <option value="EUR">
                                    EUR
                                </option>
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
                                <option value="day">
                                    day
                                </option>
                                <option value="month">
                                    month
                                </option>
                                <option value="annum">
                                    annum
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
                                <option value="INR">
                                    INR
                                </option>
                                <option value="USD">
                                    USD
                                </option>
                                <option value="GBP">
                                    GBP
                                </option>
                                <option value="EUR">
                                    EUR
                                </option>
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
                                <option value="day">
                                    day
                                </option>
                                <option value="month">
                                    month
                                </option>
                                <option value="annum">
                                    annum
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
                                    <option value="INR">
                                        INR
                                    </option>
                                    <option value="USD">
                                        USD
                                    </option>
                                    <option value="GBP">
                                        GBP
                                    </option>
                                    <option value="EUR">
                                        EUR
                                    </option>
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
                                    <option value="day">
                                        day
                                    </option>
                                    <option value="month">
                                        month
                                    </option>
                                    <option value="annum">
                                        annum
                                    </option>
                                </select>

                            </div>
                        </div>
                    )}

                    <div className="cxandidate-rates-description">
                        Pick the country currency and whether it
                        is per day, month or annum.
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