import React, { useMemo, useState } from "react";
import AddCandidateModal from "../Add_Edit_CandidateModal";
import "./Candidate.css";
import { useNavigate } from "react-router-dom";

const candidatesData = [
  {
    initials: "JD",
    name: "Julia Deveraux",
    designation: "SAP FICO Lead",
    location: "London, UK",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "11y",
    skills: "SAP FICO, S/4HANA",
    status: "Submitted",
    subStatus: "Submitted",
  },
  {
    initials: "OS",
    name: "Omar Salah",
    designation: "Cloud Architect",
    location: "Dubai, UAE",
    appliedFor: "Cloud Security Engineer",
    experience: "9y",
    skills: "AWS, IAM",
    status: "Interview",
    subStatus: "Interview",
  },
  {
    initials: "AK",
    name: "Anita Kumar",
    designation: "SAP Consultant",
    location: "Pune, IN",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "8y",
    skills: "SAP FICO, MM",
    status: "Actively Sourcing",
    subStatus: "Actively Sourcing",
  },
  {
    initials: "MB",
    name: "Marco Bianchi",
    designation: "ML Engineer",
    location: "Berlin, DE",
    appliedFor: "AI / ML Engineer",
    experience: "6y",
    skills: "PyTorch, Python",
    status: "Pipeline",
    subStatus: "Pipeline",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    designation: "DevSecOps Engineer",
    location: "Remote",
    appliedFor: "Cloud Security Engineer",
    experience: "7y",
    skills: "AWS, Security",
    status: "Selected",
    subStatus: "Selected",
  },
  {
    initials: "DO",
    name: "David Osei",
    designation: "SAP ABAP Developer",
    location: "Manchester, UK",
    appliedFor: "SAP S/4HANA Consultant",
    experience: "10y",
    skills: "SAP ABAP, Fiori",
    status: "Onboarded",
    subStatus: "Onboarded",
  },
];

const statusClass = {
  Submitted: "status-submitted",
  Interview: "status-interview",
  "Actively Sourcing": "status-sourcing",
  Pipeline: "status-pipeline",
  Selected: "status-selected",
  Onboarded: "status-onboarded",
};

const statusIcon = {
  Submitted: "✉",
  Interview: "🔑",
  "Actively Sourcing": "🔍",
  Pipeline: "▣",
  Selected: "✓",
  Onboarded: "🎉",
};

function Candidate() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [subStatusFilter, setSubStatusFilter] = useState("All sub-statuses");
  const [jobFilter, setJobFilter] = useState("All jobs");

  const filteredCandidates = useMemo(() => {
    return candidatesData.filter((candidate) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        candidate.name.toLowerCase().includes(searchText) ||
        candidate.skills.toLowerCase().includes(searchText) ||
        candidate.designation.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All statuses" ||
        candidate.status === statusFilter;

      const matchesSubStatus =
        subStatusFilter === "All sub-statuses" ||
        candidate.subStatus === subStatusFilter;

      const matchesJob =
        jobFilter === "All jobs" ||
        candidate.appliedFor === jobFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSubStatus &&
        matchesJob
      );
    });
  }, [search, statusFilter, subStatusFilter, jobFilter]);

  const statusOptions = [
    "All statuses",
    ...new Set(candidatesData.map((item) => item.status)),
  ];

  const jobOptions = [
    "All jobs",
    ...new Set(candidatesData.map((item) => item.appliedFor)),
  ];

  return (
    <div className="page candidate-page container-fluid px-0">
      {/* ================= HEADER ================= */}
      <div className="page-header row align-items-start">
        <div className="col-12 col-lg">
          <h1 className="page-title">Candidates</h1>
          <p className="page-subtitle">6 candidates in your database</p>
        </div>

        <div className="page-header-actions col-12 col-lg-auto">
          <button className="outline-btn">
            <span>⚙</span>
            Statuses
          </button>

          <button className="outline-btn">
            <span>⇩</span>
            Export CSV
          </button>

          <button className="primary-btn" onClick={() => setShowCandidateModal(true)}>
            <i className="bi bi-plus-lg"></i>
            Add candidate
          </button>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="row candidate-stat-row g-2">
        <StatCard number="6" label="Total" />
        <StatCard number="5" label="Active" />
        <StatCard number="1" label="Submitted" />
        <StatCard number="1" label="Interviewing" />
        <StatCard number="1" label="Offered" />
        <StatCard number="1" label="Joined" />
        <StatCard number="0" label="Rejected" />
      </div>

      {/* ================= FILTERS ================= */}
      <div className="candidate-filters row g-2">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="common-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search name, skills, designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <select
            className="common-select form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <select
            className="common-select form-select"
            value={subStatusFilter}
            onChange={(e) => setSubStatusFilter(e.target.value)}
          >
            <option>All sub-statuses</option>
            {statusOptions.slice(1).map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6 col-xl-2">
          <select
            className="common-select form-select"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            {jobOptions.map((job) => (
              <option key={job}>{job}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="common-table-wrapper">
        <table className=" candidate-table mb-0">
          <thead>
            <tr>
              <th className="candidate-col">CANDIDATE</th>
              <th>APPLIED FOR</th>
              <th>EXP.</th>
              <th>SKILLS</th>
              <th>STATUS</th>
              <th className="actions-col">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.name}>
                {/* Candidate */}
                <td>
                  <div className="candidate-info">
                    <div className="candidate-avatar" onClick={() =>
    navigate(`/dashboard/candidates/${encodeURIComponent(candidate.name)}`)
  }>
                      {candidate.initials}
                    </div>

                    <div className="candidate-details" onClick={(e) => {
    e.stopPropagation();
    navigate(`/dashboard/candidates/${encodeURIComponent(candidate.name)}`);
  }}>
                      <div className="candidate-name">
                        {candidate.name}
                      </div>

                      <div className="candidate-meta">
                        {candidate.designation} · {candidate.location}
                      </div>

                      <div className="candidate-icons">
                        <button title="Email">▧</button>
                        <button title="Call">✉</button>
                        <button title="Chat">◉</button>
                        <button title="Message">✉</button>
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
                  <span className="experience">
                    {candidate.experience}
                  </span>
                </td>

                {/* Skills */}
                <td>
                  <div className="skills">{candidate.skills}</div>
                </td>

                {/* Status */}
                <td>
                  <div className="status-container">
                    <span
                      className={`status-badge ${
                        statusClass[candidate.status]
                      }`}
                    >
                      <span>{statusIcon[candidate.status]}</span>
                      {candidate.status}
                    </span>

                    <select
                      className="status-select"
                      defaultValue={candidate.subStatus}
                    >
                      <option>{candidate.subStatus}</option>
                      {statusOptions.slice(1).map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </td>

                {/* Actions */}
                <td>
                  <div className="candidate-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan="6" className="no-candidates">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
             <AddCandidateModal
  show={showCandidateModal}
  onClose={() => setShowCandidateModal(false)}
/>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="col-6 col-sm-4 col-md-3 col-lg">
      <div className="candidate-stat-card">
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default Candidate;