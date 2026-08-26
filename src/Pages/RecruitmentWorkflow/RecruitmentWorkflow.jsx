import React from "react";
import { useNavigate } from "react-router-dom";
import "./RecruitmentWorkflow.css";

const workflowStages = [
  {
    id: "applied",
    label: "Applied",
    count: 1,
    color: "#4169e1",
  },
  {
    id: "screening",
    label: "Screening",
    count: 1,
    color: "#b57b00",
  },
  {
    id: "ready",
    label: "Ready to Submit",
    count: 0,
    color: "#16b5b5",
  },
  {
    id: "submitted",
    label: "Submitted",
    count: 1,
    color: "#336cff",
  },
  {
    id: "interview",
    label: "Interview",
    count: 1,
    color: "#258bb8",
  },
  {
    id: "selected",
    label: "Selected",
    count: 0,
    color: "#8757ed",
  },
  {
    id: "offer",
    label: "Offer",
    count: 1,
    color: "#18a66b",
  },
  {
    id: "joined",
    label: "Joined",
    count: 1,
    color: "#11815a",
  },
];

function RecruitmentWorkflow() {
  const navigate = useNavigate();

  const totalApplications = workflowStages.reduce(
    (total, stage) => total + stage.count,
    0
  );

  const handleStageClick = (stage) => {
    navigate(`/dashboard/recruitment-workflow/${stage.id}`);
  };

  return (
    <div className="page recruitment-workflow-page">

      <div className="page-header">
        <div>
          <h1 className="page-title">
            Recruitment Workflow
          </h1>

          <p className="page-subtitle">
            Each candidate's status for a role — follow the flow. Click a
            stage to see who is in it.
          </p>
        </div>
      </div>

      <div className="workflow-container">

        <div className="workflow-scroll">

          <div className="workflow-stages">

            {workflowStages.map((stage, index) => (
              <React.Fragment key={stage.id}>

                <button
                  type="button"
                  className="workflow-stage"
                  style={{
                    "--stage-color": stage.color,
                  }}
                  onClick={() => handleStageClick(stage)}
                >
                  <span className="workflow-stage-dot"></span>

                  <div className="workflow-stage-count">
                    {stage.count}
                  </div>

                  <div className="workflow-stage-label">
                    {stage.label}
                  </div>
                </button>

                {index < workflowStages.length - 1 && (
                  <div className="workflow-arrow">
                    →
                  </div>
                )}

              </React.Fragment>
            ))}

          </div>

        </div>

        <div className="workflow-summary">
          {totalApplications} active applications across all stages.
        </div>

      </div>

    </div>
  );
}

export default RecruitmentWorkflow;