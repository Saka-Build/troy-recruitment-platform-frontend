import "./Pipeline.css";

function Pipeline() {
  const stages = [
    {
      title: "Applied",
      count: 1,
      candidates: [
        {
          initials: "MB",
          name: "Marco Bianchi",
          role: "ML Engineer",
          position: "AI / ML Engineer",
          experience: "6y",
          source: "Website",
        },
      ],
    },
    {
      title: "Screening",
      count: 1,
      candidates: [
        {
          initials: "AK",
          name: "Anita Kumar",
          role: "SAP Consultant",
          position: "SAP S/4HANA Consultant",
          experience: "8y",
          source: "Naukri",
        },
      ],
    },
    {
      title: "Submitted",
      count: 1,
      candidates: [
        {
          initials: "JD",
          name: "Julia Deveraux",
          role: "SAP FICO Lead",
          position: "SAP S/4HANA Consultant",
          experience: "11y",
          source: "LinkedIn",
        },
      ],
    },
    {
      title: "Interview",
      count: 1,
      candidates: [
        {
          initials: "OS",
          name: "Omar Salah",
          role: "Cloud Architect",
          position: "Cloud Security Engineer",
          experience: "9y",
          source: "Referral",
        },
      ],
    },
    {
      title: "Offer",
      count: 1,
      candidates: [
        {
          initials: "PN",
          name: "Priya Nair",
          role: "DevSecOps Engineer",
          position: "Cloud Security Engineer",
          experience: "7y",
          source: "LinkedIn",
        },
      ],
    },
  ];

  return (
    <div className="pipeline-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="pipeline-header">

        <div>
          <h1 className="pipeline-title">
            Pipeline
          </h1>

          <p className="pipeline-subtitle">
            Drag candidates between stages — changes save automatically
          </p>
        </div>

        <button className="pipeline-add-btn">
          <i className="bi bi-plus-lg"></i>
          Add candidate
        </button>

      </div>


      {/* =========================================
          PIPELINE BOARD
      ========================================= */}

      <div className="pipeline-board">

        {stages.map((stage) => (

          <div
            className="pipeline-column"
            key={stage.title}
          >

            {/* Column Header */}

            <div className="pipeline-column-header">

              <h3>
                {stage.title}
              </h3>

              <span className="pipeline-count">
                {stage.count}
              </span>

            </div>


            {/* Candidates */}

            <div className="pipeline-candidates">

              {stage.candidates.map((candidate) => (

                <div
                  className="pipeline-candidate"
                  key={candidate.name}
                  draggable
                >

                  {/* Candidate Header */}

                  <div className="candidate-top">

                    <div className="candidate-avatar">
                      {candidate.initials}
                    </div>

                    <div className="candidate-info">

                      <div className="candidate-name">
                        {candidate.name}
                      </div>

                      <div className="candidate-role">
                        {candidate.role}
                      </div>

                    </div>

                  </div>


                  {/* Position */}

                  <div className="candidate-position">
                    {candidate.position}
                  </div>


                  {/* Experience / Source */}

                  <div className="candidate-meta">

                    <span>
                      {candidate.experience}
                    </span>

                    <span className="meta-dot">
                      ·
                    </span>

                    <span>
                      {candidate.source}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Pipeline;