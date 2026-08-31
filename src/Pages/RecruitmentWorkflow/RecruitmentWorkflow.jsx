import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./RecruitmentWorkflow.css";
import { getSubmissionCounts } from "../../Redux/Slice/recruitmentWorkflowSlice";

const workflowStages = [
  {
    id: "applied",
    label: "Applied",
    color: "#4F6BED",
    softColor: "#EEF1FF",
    countKey: "totalApplied",
  },
  {
    id: "screening",
    label: "Screening",
    color: "#D89B22",
    softColor: "#FFF7E5",
    countKey: "totalScreening",
  },
  {
    id: "ready",
    label: "Ready to Submit",
    color: "#13A7A7",
    softColor: "#E8FAFA",
    countKey: "totalReadyToSubmit",
  },
  {
    id: "submitted",
    label: "Submitted",
    color: "#4B78E8",
    softColor: "#EDF3FF",
    countKey: "totalSubmitted",
  },
  {
    id: "interview",
    label: "Interview",
    color: "#238BB8",
    softColor: "#E9F7FC",
    countKey: "totalInterview",
  },
  {
    id: "selected",
    label: "Selected",
    color: "#8B5CE6",
    softColor: "#F2ECFF",
    countKey: "totalSelected",
  },
  {
    id: "offer",
    label: "Onboarding",
    color: "#1AA36F",
    softColor: "#E9F8F2",
    countKey: "totalOnBoarding",
  },
  {
    id: "joined",
    label: "Onboarded",
    color: "#12805D",
    softColor: "#E7F7F0",
    countKey: "totalOnBoarded",
  },
];

function RecruitmentWorkflow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    submissionCounts,
    loading,
    error,
  } = useSelector((state) => state.recruitmentWorkflow);

  useEffect(() => {
    dispatch(getSubmissionCounts());
  }, [dispatch]);

  const getStageCount = (stage) => {
    if (!stage.countKey) {
      return 0;
    }

    return submissionCounts?.[stage.countKey] ?? 0;
  };

  const totalApplications = workflowStages.reduce(
    (total, stage) => total + getStageCount(stage),
    0
  );

  const interviewCount = getStageCount(
    workflowStages.find((stage) => stage.id === "interview")
  );

  const selectedCount = getStageCount(
    workflowStages.find((stage) => stage.id === "selected")
  );

  const onboardedCount = getStageCount(
    workflowStages.find((stage) => stage.id === "joined")
  );

  const onboardingCount = getStageCount(
    workflowStages.find((stage) => stage.id === "offer")
  );

  const handleStageClick = (stage) => {
    navigate(`/dashboard/recruitment-workflow/${stage.id}`);
  };

  const getStage = (id) =>
    workflowStages.find((stage) => stage.id === id);

  const mainStages = [
    getStage("applied"),
    getStage("screening"),
    getStage("ready"),
    getStage("submitted"),
    getStage("interview"),
    getStage("selected"),
    getStage("offer"),
    getStage("joined"),
  ];

  return (
    <div className="page recruitment-workflow-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="workflow-header">
        <div>
          <h1 className="page-title">
            Recruitment Workflow
          </h1>

          <p className="page-subtitle">
            Track candidates from application to onboarding
            and keep your recruitment pipeline moving.
          </p>
        </div>

        <div className="workflow-header-total">
          <span className="workflow-header-total-label">
            Total Applications
          </span>

          <strong>
            {loading ? "..." : totalApplications}
          </strong>
        </div>
      </div>


      {/* =====================================================
          MAIN WORKFLOW CARD
      ===================================================== */}

      <div className="workflow-card">

        <div className="workflow-card-header">
          <div>
            <h2>Candidate Pipeline</h2>
            <p>
              Click any stage to view candidates
            </p>
          </div>

          <div className="workflow-live-status">
            <span></span>
            Live Pipeline
          </div>
        </div>

        <div className="workflow-board">

          {/* =================================================
      MAIN WORKFLOW
  ================================================= */}

          <div className="workflow-main-row">

            {mainStages.map((stage, index) => (
              <React.Fragment key={stage.id}>

                <button
                  type="button"
                  className={`workflow-stage ${stage.id === "interview" ? "is-interview" : ""
                    }`}
                  style={{
                    "--stage-color": stage.color,
                    "--stage-soft-color": stage.softColor,
                  }}
                  onClick={() => handleStageClick(stage)}
                  disabled={loading}
                >

                  <div className="workflow-stage-top">

                    <span className="workflow-stage-name">
                      {stage.label}
                    </span>

                  </div>

                  <div className="workflow-stage-count">
                    {loading ? "..." : getStageCount(stage)}
                  </div>

                  <div className="workflow-stage-bottom">
                    Candidates
                  </div>

                </button>


                {/* NORMAL ARROW */}
                {index < mainStages.length - 1 && (
                  <div
                    className="workflow-connector"
                    aria-hidden="true"
                  >
                    <span></span>
                  </div>
                )}

              </React.Fragment>
            ))}

          </div>


          {/* =================================================
      REJECTION BRANCH
  ================================================= */}

          <div className="rejection-branch">

            {/* Vertical line from Interview */}
            <div
              className="rejection-line-vertical"
              aria-hidden="true"
            ></div>


            {/* Horizontal line from Interview to Selected */}
            <div
              className="rejection-line-horizontal"
              aria-hidden="true"
            >
              <span></span>
            </div>


            {/* Rejected card exactly below Selected */}
            <button
              type="button"
              className="rejection-card"
              onClick={() =>
                navigate(
                  "/dashboard/recruitment-workflow/rejection"
                )
              }
              disabled={loading}
            >

              <div className="rejection-card-top">

                <span>
                  Rejected
                </span>

              </div>

              <div className="rejection-count">
                {loading ? "..." : submissionCounts?.totalRejected ?? 0}
              </div>

              <div className="rejection-bottom">
                Candidates
              </div>

            </button>

          </div>

        </div>


        {/* =================================================
            PIPELINE LEGEND
        ================================================= */}

        <div className="workflow-footer">

          <div className="workflow-footer-item">
            <span
              className="workflow-footer-dot"
              style={{
                background: "#238BB8",
              }}
            ></span>

            Active recruitment
          </div>

          <div className="workflow-footer-item">
            <span
              className="workflow-footer-dot"
              style={{
                background: "#8B5CE6",
              }}
            ></span>

            Selection process
          </div>

          <div className="workflow-footer-item">
            <span
              className="workflow-footer-dot"
              style={{
                background: "#1AA36F",
              }}
            ></span>

            Onboarding
          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="workflow-error">
          {error}
        </div>
      )}

      <div className="workflow-summary">
        {loading
          ? "Loading recruitment pipeline..."
          : `${totalApplications} applications currently tracked across the recruitment workflow.`}
      </div>

    </div>
  );
}

export default RecruitmentWorkflow;