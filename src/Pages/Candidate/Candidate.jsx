import "./Candidate.css";

const candidates = [
  {
    initials: "JD",
    name: "Julia Deveraux",
    location: "SAP FICO Lead · London, UK",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "11y",
    skills: "SAP FICO, S/4HANA",
    status: "Submitted",
    statusClass: "status-submitted",
    subStatus: "Submitted",
  },
  {
    initials: "OS",
    name: "Omar Salah",
    location: "Cloud Architect · Dubai, UAE",
    appliedFor: "Cloud Security Engineer",
    experience: "9y",
    skills: "AWS, IAM",
    status: "Interview",
    statusClass: "status-interview",
    subStatus: "Interview",
  },
  {
    initials: "AK",
    name: "Anita Kumar",
    location: "SAP Consultant · Pune, IN",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "8y",
    skills: "SAP FICO, MM",
    status: "Actively Sourcing",
    statusClass: "status-sourcing",
    subStatus: "Actively Sourcing",
  },
  {
    initials: "MB",
    name: "Marco Bianchi",
    location: "ML Engineer · Berlin, DE",
    appliedFor: "AI / ML Engineer",
    experience: "6y",
    skills: "PyTorch, Python",
    status: "Pipeline",
    statusClass: "status-pipeline",
    subStatus: "Pipeline",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    location: "DevSecOps Engineer · Remote",
    appliedFor: "Cloud Security Engineer",
    experience: "7y",
    skills: "AWS, Security",
    status: "Selected",
    statusClass: "status-selected",
    subStatus: "Selected",
  },
  {
    initials: "DO",
    name: "David Osei",
    location: "SAP ABAP Developer · Manchester, UK",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "10y",
    skills: "SAP ABAP, Fiori",
    status: "Onboarded",
    statusClass: "status-onboarded",
    subStatus: "Onboarded",
  },
];

const stats = [
  {
    value: "6",
    label: "Total",
  },
  {
    value: "5",
    label: "Active",
  },
  {
    value: "1",
    label: "Submitted",
  },
  {
    value: "1",
    label: "Interviewing",
  },
  {
    value: "1",
    label: "Offered",
  },
  {
    value: "1",
    label: "Joined",
  },
  {
    value: "0",
    label: "Rejected",
  },
];

function Candidates() {
  return (
    <div className="candidates-page">
      <div className="container-fluid candidates-container">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="candidates-header">

          <div className="candidates-heading">
            <h1 className="candidates-title">
              Candidates
            </h1>

            <p className="candidates-subtitle">
              6 candidates in your database
            </p>
          </div>

          <div className="candidates-actions">

            <button className="candidate-secondary-btn">
              <i className="bi bi-gear"></i>
              <span>Statuses</span>
            </button>

            <button className="candidate-secondary-btn">
              <i className="bi bi-download"></i>
              <span>Export CSV</span>
            </button>

            <button className="candidate-primary-btn">
              <i className="bi bi-plus-lg"></i>
              <span>Add candidate</span>
            </button>

          </div>

        </div>


        {/* =========================================
            STATISTICS
        ========================================= */}

        <div className="candidate-stats">

          {stats.map((stat) => (
            <div
              className="candidate-stat-card"
              key={stat.label}
            >
              <div className="candidate-stat-value">
                {stat.value}
              </div>

              <div className="candidate-stat-label">
                {stat.label}
              </div>
            </div>
          ))}

        </div>


        {/* =========================================
            FILTERS
        ========================================= */}

        <div className="candidate-filters">

          <div className="candidate-search">

            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search name, skills, designation..."
            />

          </div>

          <div className="candidate-filter-select">

            <select defaultValue="">
              <option value="">
                All statuses
              </option>
              <option>Submitted</option>
              <option>Interview</option>
              <option>Actively Sourcing</option>
              <option>Pipeline</option>
              <option>Selected</option>
              <option>Onboarded</option>
            </select>

            <i className="bi bi-chevron-down"></i>

          </div>

          <div className="candidate-filter-select">

            <select defaultValue="">
              <option value="">
                All sub-statuses
              </option>
              <option>Submitted</option>
              <option>Interview</option>
              <option>Actively Sourcing</option>
              <option>Pipeline</option>
              <option>Selected</option>
              <option>Onboarded</option>
            </select>

            <i className="bi bi-chevron-down"></i>

          </div>

          <div className="candidate-filter-select">

            <select defaultValue="">
              <option value="">
                All jobs
              </option>
              <option>SAP S/4HANA Consultant</option>
              <option>Cloud Security Engineer</option>
              <option>AI / ML Engineer</option>
            </select>

            <i className="bi bi-chevron-down"></i>

          </div>

        </div>


        {/* =========================================
            TABLE
        ========================================= */}

        <div className="candidate-table-wrapper">

          <table className="candidate-table">

            <thead>
              <tr>

                <th className="candidate-column">
                  Candidate
                </th>

                <th className="applied-column">
                  Applied for
                </th>

                <th className="experience-column">
                  Exp.
                </th>

                <th className="skills-column">
                  Skills
                </th>

                <th className="status-column">
                  Status
                </th>

                <th className="actions-column">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {candidates.map((candidate) => (

                <tr key={candidate.name}>

                  {/* Candidate */}

                  <td>

                    <div className="candidate-profile">

                      <div className="candidate-avatar">
                        {candidate.initials}
                      </div>

                      <div className="candidate-info">

                        <div className="candidate-name">
                          {candidate.name}
                        </div>

                        <div className="candidate-location">
                          {candidate.location}
                        </div>

                        <div className="candidate-icons">

                          <button title="Resume">
                            <i className="bi bi-file-earmark-text"></i>
                          </button>

                          <button title="Email">
                            <i className="bi bi-envelope"></i>
                          </button>

                          <button title="Messages">
                            <i className="bi bi-chat-dots"></i>
                          </button>

                          <button title="Profile">
                            <i className="bi bi-person"></i>
                          </button>

                        </div>

                      </div>

                    </div>

                  </td>


                  {/* Applied For */}

                  <td>

                    <div className="applied-job">
                      {candidate.appliedFor}
                    </div>

                  </td>


                  {/* Experience */}

                  <td>

                    <span className="candidate-experience">
                      {candidate.experience}
                    </span>

                  </td>


                  {/* Skills */}

                  <td>

                    <div className="candidate-skills">
                      {candidate.skills}
                    </div>

                  </td>


                  {/* Status */}

                  <td>

                    <div className="candidate-status-wrapper">

                      <span
                        className={`candidate-status ${candidate.statusClass}`}
                      >

                        <span className="status-dot"></span>

                        {candidate.status}

                      </span>

                      <div className="candidate-status-select">

                        <select
                          defaultValue={candidate.subStatus}
                        >
                          <option>
                            Submitted
                          </option>

                          <option>
                            Interview
                          </option>

                          <option>
                            Actively Sourcing
                          </option>

                          <option>
                            Pipeline
                          </option>

                          <option>
                            Selected
                          </option>

                          <option>
                            Onboarded
                          </option>

                        </select>

                        <i className="bi bi-chevron-down"></i>

                      </div>

                    </div>

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="candidate-row-actions">

                      <button className="edit-btn">
                        Edit
                      </button>

                      <button className="delete-btn">
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =========================================
            MOBILE TABLE HINT
        ========================================= */}

        <div className="candidate-scroll-hint">

          <i className="bi bi-arrow-left-right"></i>

          <span>
            Swipe horizontally to view all candidate details
          </span>

        </div>

      </div>
    </div>
  );
}

export default Candidates;