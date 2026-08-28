import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RecruitmentWorkflow.css";

const stages = [
  { id: "applied", label: "Applied" },
  { id: "screening", label: "Screening" },
  { id: "ready", label: "Ready to Submit" },
  { id: "submitted", label: "Submitted" },
  { id: "interview", label: "Interview" },
  { id: "selected", label: "Selected" },
  { id: "offer", label: "Offer" },
  { id: "joined", label: "Joined" },
];

const initialCandidatesData = [
  {
    id: "marco",
    name: "Marco Bianchi",
    initials: "MB",
    designation: "ML Engineer",
    role: "AI / ML Engineer",
    client: "Helix Health AI",
    stage: "applied",
    cvId: "—",
    currentStatus: "Pipeline",
  },
  {
    id: "anita",
    name: "Anita Kumar",
    initials: "AK",
    designation: "SAP Consultant",
    role: "SAP S/4HANA Consultant",
    client: "Nova Manufacturing",
    stage: "screening",
    cvId: "—",
    currentStatus: "Actively Sourcing",
  },
  {
    id: "anita-submitted",
    name: "Anita Kumar",
    initials: "AK",
    designation: "SAP Consultant",
    role: "SAP S/4HANA Consultant",
    client: "Nova Manufacturing",
    stage: "submitted",
    cvId: "—",
    currentStatus: "Submitted",
    expectedCurrency: "INR",
    expectedRate: "₹36 LPA",
  },
  {
    id: "omar-interview",
    name: "Omar Salah",
    initials: "OS",
    designation: "Cloud Architect",
    role: "Cloud Security Engineer",
    client: "Meridian Fintech",
    stage: "interview",
    cvId: "—",
    currentStatus: "Interview",
    expectedCurrency: "AED",
    expectedRate: "$620/day",
    interviewWarning: true,
  },
  {
    id: "omar-selected",
    name: "Omar Salah",
    initials: "OS",
    designation: "Cloud Architect",
    role: "Cloud Security Engineer",
    client: "Meridian Fintech",
    stage: "selected",
    cvId: "—",
    currentStatus: "Selected",
    expectedCurrency: "AED",
    expectedRate: "AED 200 / day",
    submissionRate: "AED 200 / day",
    offerRate: "AED 200 / day",
  },
  {
    id: "omar-offer",
    name: "Omar Salah",
    initials: "OS",
    designation: "Cloud Architect",
    role: "Cloud Security Engineer",
    client: "Meridian Fintech",
    stage: "offer",
    cvId: "—",
    currentStatus: "Offer Released",
    expectedCurrency: "AED",
    expectedRate: "AED 200 / day",
    submissionRate: "AED 200 / day",
    offerRate: "AED 200 / day",
  },
  {
    id: "priya-offer",
    name: "Priya Nair",
    initials: "PN",
    designation: "DevSecOps Engineer",
    role: "Cloud Security Engineer",
    client: "Meridian Fintech",
    stage: "offer",
    cvId: "—",
    currentStatus: "Offer Released",
    expectedCurrency: "AED",
    expectedRate: "",
    submissionRate: "",
    offerRate: "",
    offerRateRequired: true,
  },
  {
    id: "omar-joined",
    name: "Omar Salah",
    initials: "OS",
    designation: "Cloud Architect",
    role: "Cloud Security Engineer",
    client: "Meridian Fintech",
    stage: "joined",
    cvId: "—",
    currentStatus: "Onboarded",
    submissionRate: "AED 200 / day",
    offerRate: "AED 200 / day",
  },
  {
    id: "david-joined",
    name: "David Osei",
    initials: "DO",
    designation: "SAP ABAP Developer",
    role: "SAP S/4HANA Consultant",
    client: "Nova Manufacturing",
    stage: "joined",
    cvId: "—",
    currentStatus: "Onboarded",
  },
];

function RecruitmentWorkflowDetails() {
  const { stage = "applied" } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "recruitment-workflow-candidates"
      );

      return saved
        ? JSON.parse(saved)
        : initialCandidatesData;
    } catch {
      return initialCandidatesData;
    }
  });

  const [search, setSearch] = useState("");
  const [cvSearch, setCvSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  const [modalType, setModalType] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [expectedCurrency, setExpectedCurrency] = useState("INR");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [expectedPeriod, setExpectedPeriod] = useState("day");

  const [submissionCurrency, setSubmissionCurrency] =
    useState("INR");
  const [submissionAmount, setSubmissionAmount] = useState("");
  const [submissionPeriod, setSubmissionPeriod] =
    useState("day");

  const [offerCurrency, setOfferCurrency] = useState("INR");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerPeriod, setOfferPeriod] = useState("day");

  const [toast, setToast] = useState(null);

  const currentStage =
    stages.find((item) => item.id === stage) || stages[0];

  const stageCounts = useMemo(() => {
    return stages.reduce((result, item) => {
      result[item.id] = candidates.filter(
        (candidate) => candidate.stage === item.id
      ).length;

      return result;
    }, {});
  }, [candidates]);

  const currentCandidates = useMemo(() => {
    const text = search.toLowerCase().trim();
    const cvText = cvSearch.toLowerCase().trim();

    return candidates.filter((candidate) => {
      if (candidate.stage !== stage) {
        return false;
      }

      const matchesSearch =
        !text ||
        candidate.name.toLowerCase().includes(text) ||
        candidate.designation.toLowerCase().includes(text) ||
        candidate.role.toLowerCase().includes(text) ||
        candidate.client.toLowerCase().includes(text);

      const matchesCv =
        !cvText ||
        candidate.cvId.toLowerCase().includes(cvText);

      const matchesRole =
        roleFilter === "All roles" ||
        candidate.role === roleFilter;

      return (
        matchesSearch &&
        matchesCv &&
        matchesRole
      );
    });
  }, [
    candidates,
    stage,
    search,
    cvSearch,
    roleFilter,
  ]);

  const roles = useMemo(() => {
    return [
      "All roles",
      ...new Set(
        candidates.map((candidate) => candidate.role)
      ),
    ];
  }, [candidates]);

  const currentStageIndex = stages.findIndex(
    (item) => item.id === stage
  );

  const previousStage =
    stages[currentStageIndex - 1];

  const nextStage =
    stages[currentStageIndex + 1];

  const persistCandidates = (updatedCandidates) => {
    setCandidates(updatedCandidates);

    localStorage.setItem(
      "recruitment-workflow-candidates",
      JSON.stringify(updatedCandidates)
    );
  };

  const showToast = (
    candidateName,
    newStage
  ) => {
    setToast({
      name: candidateName,
      stage: newStage,
    });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const getStageLabel = (stageId) => {
    return (
      stages.find(
        (item) => item.id === stageId
      )?.label || stageId
    );
  };

  const getStatusClass = (candidate) => {
    switch (candidate.currentStatus) {
      case "Submitted":
        return "workflow-status-submitted";
      case "Selected":
        return "workflow-status-selected";

      case "Offer Released":
        return "workflow-status-offer";

      case "Onboarded":
        return "workflow-status-joined";

      case "Ready to Submit":
        return "workflow-status-ready";

      case "Actively Sourcing":
        return "workflow-status-sourcing";

      case "Interview":
        return "workflow-status-interview";

      default:
        return "workflow-status-pipeline";
    }
  };

  const getStatusIcon = (candidate) => {
    switch (candidate.currentStatus) {
      case "Selected":
        return "bi-check-lg";

      case "Offer Released":
        return "bi-briefcase-fill";

      case "Onboarded":
        return "bi-person-check-fill";

      case "Ready to Submit":
        return "bi-send-fill";

      case "Interview":
        return "bi-pin-angle-fill";

      case "Actively Sourcing":
        return "bi-pin-angle-fill";

      case "Submitted":
        return "bi-briefcase-fill";

      default:
        return "bi-briefcase-fill";
    }
  };

  const openRateModal = (
    candidate,
    type
  ) => {
    setSelectedCandidate(candidate);
    setModalType(type);

    const currency =
      candidate.expectedCurrency || "INR";

    setExpectedCurrency(currency);
    setSubmissionCurrency(
      candidate.submissionCurrency || currency
    );
    setOfferCurrency(
      candidate.offerCurrency || currency
    );

    setExpectedAmount(
      candidate.expectedRate
        ?.replace(/[^\d.]/g, "") || ""
    );

    setSubmissionAmount(
      candidate.submissionRate
        ?.replace(/[^\d.]/g, "") || ""
    );

    setOfferAmount(
      candidate.offerRate
        ?.replace(/[^\d.]/g, "") || ""
    );

    setExpectedPeriod(
      candidate.expectedPeriod || "day"
    );

    setSubmissionPeriod(
      candidate.submissionPeriod || "day"
    );

    setOfferPeriod(
      candidate.offerPeriod || "day"
    );
  };

  const handleStageChange = (
    candidate,
    newStage
  ) => {
    if (newStage === candidate.stage) {
      return;
    }

    if (
      newStage === "submitted" ||
      newStage === "selected" ||
      newStage === "offer"
    ) {
      openRateModal(
        candidate,
        newStage
      );

      return;
    }

    moveCandidate(
      candidate,
      newStage
    );
  };

  const moveCandidate = (
    candidate,
    newStage
  ) => {
    const newStatus =
      getStatusForStage(newStage);

    const updatedCandidates =
      candidates.map((item) => {
        if (item.id !== candidate.id) {
          return item;
        }

        return {
          ...item,
          stage: newStage,
          currentStatus: newStatus,
        };
      });

    persistCandidates(
      updatedCandidates
    );

    showToast(
      candidate.name,
      getStageLabel(newStage)
    );

    navigate(
      `/dashboard/recruitment-workflow/${newStage}`
    );
  };

  const getStatusForStage = (stageId) => {
    switch (stageId) {
      case "applied":
        return "Pipeline";

      case "screening":
        return "Actively Sourcing";

      case "ready":
        return "Ready to Submit";

      case "submitted":
        return "Submitted";

      case "interview":
        return "Interview";

      case "selected":
        return "Selected";

      case "offer":
        return "Offer Released";

      case "joined":
        return "Onboarded";

      default:
        return "Pipeline";
    }
  };

  const handleSaveStage = () => {
    if (!selectedCandidate) {
      return;
    }

    if (
      modalType === "submitted" &&
      !submissionAmount.trim()
    ) {
      return;
    }

    if (
      (modalType === "selected" ||
        modalType === "offer") &&
      !offerAmount.trim()
    ) {
      return;
    }

    const targetStage = modalType;

    const updatedCandidates =
      candidates.map((candidate) => {
        if (
          candidate.id !==
          selectedCandidate.id
        ) {
          return candidate;
        }

        const updatedCandidate = {
          ...candidate,
          stage: targetStage,
          currentStatus:
            getStatusForStage(targetStage),

          expectedCurrency,
          expectedPeriod,

          submissionCurrency,
          submissionPeriod,

          offerCurrency,
          offerPeriod,
        };

        if (expectedAmount) {
          updatedCandidate.expectedRate =
            `${expectedCurrency} ${expectedAmount} / ${expectedPeriod}`;
        }

        if (submissionAmount) {
          updatedCandidate.submissionRate =
            `${submissionCurrency} ${submissionAmount} / ${submissionPeriod}`;
        }

        if (offerAmount) {
          updatedCandidate.offerRate =
            `${offerCurrency} ${offerAmount} / ${offerPeriod}`;

          updatedCandidate.offerRateRequired =
            false;
        }

        return updatedCandidate;
      });

    persistCandidates(
      updatedCandidates
    );

    showToast(
      selectedCandidate.name,
      getStageLabel(targetStage)
    );

    setModalType(null);
    setSelectedCandidate(null);

    navigate(
      `/dashboard/recruitment-workflow/${targetStage}`
    );
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCandidate(null);
  };

  const goToStage = (stageId) => {
    if (!stageId) {
      return;
    }

    navigate(
      `/dashboard/recruitment-workflow/${stageId}`
    );
  };

  const modalTitle = () => {
    if (!selectedCandidate) {
      return "";
    }

    if (modalType === "submitted") {
      return `Rate details — ${selectedCandidate.role} → Submitted`;
    }

    if (modalType === "selected") {
      return `Rate details — ${selectedCandidate.role} → Selected`;
    }

    return `Rate details — ${selectedCandidate.role} → Offer Released`;
  };

  const saveButtonText = () => {
    if (modalType === "submitted") {
      return "Save & set Submitted";
    }

    if (modalType === "selected") {
      return "Save & set Selected";
    }

    return "Save & set Offer Released";
  };

  return (
    <div className="page recruitment-workflow-details-page">

      <div className="workflow-details-header">

        <button
          type="button"
          className="workflow-back-btn"
          onClick={() =>
            navigate(
              "/dashboard/recruitment-workflow"
            )
          }
        >
          ← All stages
        </button>

        <div className="workflow-details-heading">

          <div>
            <h1 className="page-title">
              {currentStage.label}

              <span className="workflow-application-count">
                · {stageCounts[stage] || 0} application
                {(stageCounts[stage] || 0) !== 1
                  ? "s"
                  : ""}
              </span>
            </h1>

            <p className="page-subtitle">
              Candidates at the "
              {currentStage.label}"
              stage — with the role they applied for
              and their current status.
            </p>
          </div>

          <div className="workflow-stage-tabs">
            {stages.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`workflow-stage-tab ${item.id === stage
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  goToStage(item.id)
                }
              >
                {item.label}{" "}
                {stageCounts[item.id] || 0}
              </button>
            ))}
          </div>

        </div>

      </div>

      <div className="workflow-filters">

        <div className="workflow-search">
          <input
            type="text"
            placeholder="Search name, designation, skills..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <input
          type="text"
          className="workflow-cv-search"
          placeholder="Candidate / CV ID"
          value={cvSearch}
          onChange={(e) =>
            setCvSearch(e.target.value)
          }
        />

        <select
          className="workflow-role-filter"
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          {roles.map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}
        </select>

      </div>

      <div className="workflow-table-wrapper">

        <table className="workflow-table">

          <thead>
            <tr>
              <th>CANDIDATE</th>
              <th>CV ID</th>
              <th>APPLIED FOR (ROLE)</th>
              <th>CLIENT</th>
              <th>CURRENT STATUS</th>
              <th>MOVE TO STAGE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {currentCandidates.map(
              (candidate) => (
                <tr key={candidate.id}>

                  <td>
                    <div className="workflow-candidate">

                      <div className="workflow-avatar">
                        {candidate.initials}
                      </div>

                      <div className="workflow-candidate-info">

                        <strong>
                          {candidate.name}
                        </strong>

                        <div className="workflow-candidate-bottom">

                          <span>
                            {candidate.designation}
                          </span>

                          <div className="candidate-action-icons">

                            <button type="button">
                              ▧
                            </button>

                            <button type="button">
                              ⇩
                            </button>

                            <button type="button">
                              ▣
                            </button>

                            <button type="button">
                              ▤
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  </td>

                  <td>
                    <span className="workflow-cv-id">
                      {candidate.cvId}
                    </span>
                  </td>

                  <td>
                    <span className="workflow-role">
                      {candidate.role}
                    </span>
                  </td>

                  <td>
                    <span className="workflow-client">
                      {candidate.client}
                    </span>
                  </td>

                  <td>

                    <div className="workflow-status-wrapper">

                      <span
                        className={`workflow-status ${getStatusClass(candidate)}`}
                      >
                        <i
                          className={`bi ${getStatusIcon(candidate)} workflow-status-icon`}
                          aria-hidden="true"
                        ></i>

                        <span className="workflow-status-text">
                          {candidate.currentStatus}
                        </span>
                      </span>

                      {candidate.interviewWarning &&
                        candidate.stage ===
                        "interview" && (
                          <span className="workflow-warning">
                            ⚿ date/time not set
                          </span>
                        )}

                      {candidate.submissionRate && (
                        <span className="workflow-rate">
                          Sub:{" "}
                          {
                            candidate.submissionRate
                          }{" "}
                          · Offer:{" "}
                          {
                            candidate.offerRate ||
                            "-"
                          }
                        </span>
                      )}

                      {candidate.offerRateRequired &&
                        candidate.stage ===
                        "offer" && (
                          <span className="workflow-rate-warning">
                            offer rate needed
                          </span>
                        )}

                    </div>

                  </td>

                  <td>

                    <select
                      className="workflow-move-select"
                      value={
                        candidate.stage
                      }
                      onChange={(e) =>
                        handleStageChange(
                          candidate,
                          e.target.value
                        )
                      }
                    >
                      {stages.map(
                        (item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.label}
                          </option>
                        )
                      )}
                    </select>

                  </td>

                  <td>
                    <button
                      type="button"
                      className="workflow-open-btn"
                      onClick={() =>
                        console.log(
                          "Open candidate:",
                          candidate
                        )
                      }
                    >
                      Open
                    </button>
                  </td>

                </tr>
              )
            )}

            {currentCandidates.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="workflow-empty"
                >
                  No candidates found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      <div className="workflow-navigation">

        {previousStage && (
          <button
            type="button"
            className="workflow-nav-btn"
            onClick={() =>
              goToStage(
                previousStage.id
              )
            }
          >
            ← {previousStage.label}
          </button>
        )}

        {nextStage && (
          <button
            type="button"
            className="workflow-nav-btn"
            onClick={() =>
              goToStage(
                nextStage.id
              )
            }
          >
            {nextStage.label} →
          </button>
        )}

      </div>

      {modalType &&
        selectedCandidate && (
          <div
            className="workflow-modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeModal();
              }
            }}
          >

            <div className="workflow-rate-modal">

              <div className="workflow-modal-header">

                <h2>
                  {modalTitle()}
                </h2>

                <button
                  type="button"
                  className="workflow-modal-close"
                  onClick={closeModal}
                >
                  ×
                </button>

              </div>

              <div className="workflow-modal-body">

                <RateField
                  label="Candidate expected rate"
                  currency={
                    expectedCurrency
                  }
                  setCurrency={
                    setExpectedCurrency
                  }
                  amount={
                    expectedAmount
                  }
                  setAmount={
                    setExpectedAmount
                  }
                  period={
                    expectedPeriod
                  }
                  setPeriod={
                    setExpectedPeriod
                  }
                />

                <div className="workflow-current-rate">
                  current:{" "}
                  {selectedCandidate.expectedRate ||
                    "₹36 LPA"}
                </div>

                <RateField
                  label="Submission rate"
                  required={
                    modalType ===
                    "submitted"
                  }
                  currency={
                    submissionCurrency
                  }
                  setCurrency={
                    setSubmissionCurrency
                  }
                  amount={
                    submissionAmount
                  }
                  setAmount={
                    setSubmissionAmount
                  }
                  period={
                    submissionPeriod
                  }
                  setPeriod={
                    setSubmissionPeriod
                  }
                />

                {(modalType ===
                  "selected" ||
                  modalType ===
                  "offer") && (
                    <RateField
                      label="Offer / release rate"
                      required
                      currency={
                        offerCurrency
                      }
                      setCurrency={
                        setOfferCurrency
                      }
                      amount={
                        offerAmount
                      }
                      setAmount={
                        setOfferAmount
                      }
                      period={
                        offerPeriod
                      }
                      setPeriod={
                        setOfferPeriod
                      }
                    />
                  )}

                <p className="workflow-modal-note">
                  Pick the country currency
                  and whether it is per day,
                  month or annum.{" "}

                  {modalType ===
                    "offer"
                    ? "Offer/release rate is required and shown with submission and expected rate."
                    : "Submission rate is required when submitting to a client."}
                </p>

              </div>

              <div className="workflow-modal-footer">

                <button
                  type="button"
                  className="workflow-modal-cancel"
                  onClick={
                    closeModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="workflow-modal-save"
                  onClick={
                    handleSaveStage
                  }
                >
                  {saveButtonText()}
                </button>

              </div>

            </div>

          </div>
        )}

      {toast && (
        <div className="workflow-stage-toast">
          {toast.name} → {toast.stage}
        </div>
      )}

    </div>
  );
}

function RateField({
  label,
  required = false,
  currency,
  setCurrency,
  amount,
  setAmount,
  period,
  setPeriod,
}) {
  return (
    <div className="workflow-rate-field">

      <label>
        {label}
        {required && " *"}
      </label>

      <div className="workflow-rate-input-row">

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(
              e.target.value
            )
          }
        >
          <option>INR</option>
          <option>AED</option>
          <option>USD</option>
          <option>GBP</option>
          <option>EUR</option>
        </select>

        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

        <select
          value={period}
          onChange={(e) =>
            setPeriod(
              e.target.value
            )
          }
        >
          <option>day</option>
          <option>month</option>
          <option>annum</option>
        </select>

      </div>

    </div>
  );
}

export default RecruitmentWorkflowDetails;