import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Candidate.css";

const candidatesData = [
  {
    initials: "JD",
    name: "Julia Deveraux",
    designation: "SAP FICO Lead",
    location: "London, UK",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "11 yrs",
    skills: ["SAP FICO", "S/4HANA", "ABAP", "Treasury"],
    status: "Submitted",
    cvId: "CV-FA50M",
    owner: "You",
    referredBy: "—",
    email: "julia.d@mail.com",
    phone: "+44 7700 900111",
    notice: "30 days",
    expected: "£88,000",
    aiScore: "100%",
  },
  {
    initials: "OS",
    name: "Omar Salah",
    designation: "Cloud Architect",
    location: "Dubai, UAE",
    appliedFor: "Cloud Security Engineer",
    experience: "9 yrs",
    skills: ["AWS", "IAM"],
    status: "Interview",
    cvId: "CV-OM92X",
    owner: "You",
    referredBy: "—",
    email: "omar@mail.com",
    phone: "+971 500000000",
    notice: "60 days",
    expected: "$95,000",
    aiScore: "94%",
  },
  {
    initials: "AK",
    name: "Anita Kumar",
    designation: "SAP Consultant",
    location: "Pune, IN",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "8 yrs",
    skills: ["SAP FICO", "MM"],
    status: "Actively Sourcing",
    cvId: "CV-AK34P",
    owner: "You",
    referredBy: "—",
    email: "anita@mail.com",
    phone: "+91 9000000000",
    notice: "30 days",
    expected: "₹25,00,000",
    aiScore: "91%",
  },
  {
    initials: "MB",
    name: "Marco Bianchi",
    designation: "ML Engineer",
    location: "Berlin, DE",
    appliedFor: "AI / ML Engineer",
    experience: "6 yrs",
    skills: ["PyTorch", "Python"],
    status: "Pipeline",
    cvId: "CV-MB12A",
    owner: "You",
    referredBy: "—",
    email: "marco@mail.com",
    phone: "+49 000000000",
    notice: "30 days",
    expected: "€82,000",
    aiScore: "89%",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    designation: "DevSecOps Engineer",
    location: "Remote",
    appliedFor: "Cloud Security Engineer",
    experience: "7 yrs",
    skills: ["AWS", "Security"],
    status: "Selected",
    cvId: "CV-PN88K",
    owner: "You",
    referredBy: "—",
    email: "priya@mail.com",
    phone: "+91 9000000000",
    notice: "30 days",
    expected: "₹30,00,000",
    aiScore: "96%",
  },
  {
    initials: "DO",
    name: "David Osei",
    designation: "SAP ABAP Developer",
    location: "Manchester, UK",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "10 yrs",
    skills: ["SAP ABAP", "Fiori"],
    status: "Onboarded",
    cvId: "CV-DO55M",
    owner: "You",
    referredBy: "—",
    email: "david@mail.com",
    phone: "+44 700000000",
    notice: "30 days",
    expected: "£78,000",
    aiScore: "98%",
  },
];

function CandidateDetails() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Profile");
  const [noteText, setNoteText] = useState("");

  const [notes, setNotes] = useState([
    {
      text: "Strong S/4 migration background.",
      label: "Initial note",
    },
  ]);

  const candidate = candidatesData.find(
    (item) => item.name === decodeURIComponent(name)
  );

  if (!candidate) {
    return (
      <div className="candidate-not-found">
        <h2>Candidate not found</h2>

        <button onClick={() => navigate("/dashboard/candidates")}>
          ← Back to Candidates
        </button>
      </div>
    );
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    setNotes([
      ...notes,
      {
        text: noteText.trim(),
        label: "Recruiter note",
      },
    ]);

    setNoteText("");
  };

  return (
    <div className="page">

      <div className="candidate-detail-top">
        <button
          className="back-candidates-btn"
          onClick={() => navigate("/dashboard/candidates")}
        >
          ← Candidates
        </button>
      </div>


      <div className="candidate-profile-header">

        <div className="candidate-profile-left">

          <div className="candidate-profile-avatar">{candidate.initials}</div>
            <div className="candidate-profile-info">
              <div className="candidate-name-row">
                <h1>{candidate.name}</h1>
                <span className="candidate-status-badge">✉ {candidate.status}</span>
              </div>

              <p>{candidate.designation} · {candidate.location}</p>
            </div>
          </div>

          <div className="page-header-actions">
            <button className="primary-btn">Apply to job</button>
            <button className="outline-btn">✉ Message</button>
            <button className="outline-btn">Edit</button>
            <button className="outline-btn detail-delete-btn">Delete</button>
          </div>

        </div>


      {/* =========================================
          TABS
      ========================================= */}

      <div className="candidate-detail-tabs">

        {[
          "Profile",
          "CV",
          "Timeline",
          "Notes",
          "History",
        ].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}

      </div>


      {/* =========================================
          PROFILE TAB
      ========================================= */}

      {activeTab === "Profile" && (

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

                  <strong>{candidate.email}</strong>

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

                  <strong>{candidate.phone}</strong>

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

      )}

{activeTab === "CV" && (

  <div className="candidate-cv-tab">

    {/* ORIGINAL CV CARD */}

    <div className="candidate-cv-card">

      <h2>Original CV</h2>

      <div className="cv-detail-row">

        <span>
          File
        </span>

        <strong>
          —
        </strong>

      </div>

      <div className="cv-no-file">
        No original file stored
      </div>

    </div>


    {/* CV PREVIEW / EMPTY STATE */}

    <div className="cv-preview-empty">

      <div className="cv-document-icon">

        <svg
          width="36"
          height="43"
          viewBox="0 0 36 43"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >

          <path
            d="M5 1H23L34 12V42H5C2.79 42 1 40.21 1 38V5C1 2.79 2.79 1 5 1Z"
            fill="#F8FCFF"
            stroke="#65B8ED"
            strokeWidth="1.5"
          />

          <path
            d="M23 1V12H34"
            stroke="#65B8ED"
            strokeWidth="1.5"
          />

          <path
            d="M9 20H27"
            stroke="#9ACCF0"
            strokeWidth="1.5"
          />

          <path
            d="M9 25H27"
            stroke="#9ACCF0"
            strokeWidth="1.5"
          />

          <path
            d="M9 30H23"
            stroke="#9ACCF0"
            strokeWidth="1.5"
          />

        </svg>

      </div>


      <div className="cv-empty-title">
        No Troy Format CV yet.
      </div>

      <div className="cv-empty-description">
        Open Edit and upload the Troy Word CV.
      </div>

    </div>

  </div>

)}


      {/* =========================================
          TIMELINE TAB
      ========================================= */}

      {activeTab === "Timeline" && (

        <div className="candidate-tab-card">

          <h2>Candidate timeline</h2>

          <div className="candidate-timeline">

            <TimelineItem
              icon="+"
              title="Candidate created"
            />

            <TimelineItem
              icon="📄"
              title="Resume uploaded"
            />

            <TimelineItem
              icon="☎"
              title="Phone screening"
            />

            <TimelineItem
              icon="✉"
              title="Submitted to client"
            />

          </div>

        </div>

      )}


      {/* =========================================
          NOTES TAB
      ========================================= */}

      {activeTab === "Notes" && (

        <div className="candidate-tab-card notes-card">

          <h2>Notes</h2>

          <textarea
            className="candidate-note-input"
            placeholder="Add a recruiter note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          <button
            className="add-note-btn"
            onClick={handleAddNote}
          >
            Add note
          </button>


          <div className="candidate-notes-list">

            {notes.map((note, index) => (

              <div
                className="candidate-note-item"
                key={index}
              >

                <div className="candidate-note-text">
                  {note.text}
                </div>

                <div className="candidate-note-label">
                  {note.label}
                </div>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* =========================================
          HISTORY TAB
      ========================================= */}

      {activeTab === "History" && (

        <div className="candidate-tab-card">

          <h2>History & audit</h2>

          <div className="candidate-history">

            <HistoryItem
              icon="+"
              title="Candidate created"
            />

            <HistoryItem
              icon="📄"
              title="Resume uploaded"
            />

            <HistoryItem
              icon="☎"
              title="Phone screening"
            />

            <HistoryItem
              icon="✉"
              title="Submitted to client"
            />

          </div>

        </div>

      )}

    </div>
  );
}


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

function TimelineItem({ icon, title }) {
  return (
    <div className="timeline-item">

      <div className="timeline-marker">
        {icon}
      </div>

      <div className="timeline-content">

        <div className="timeline-title">
          {title}
        </div>

        <div className="timeline-date">
          —
        </div>

      </div>

    </div>
  );
}


function HistoryItem({ icon, title }) {
  return (
    <div className="history-item">

      <div className="history-icon">
        {icon}
      </div>

      <div className="history-title">
        {title}
      </div>

      <div className="history-date">
        —
      </div>

    </div>
  );
}

export default CandidateDetails;