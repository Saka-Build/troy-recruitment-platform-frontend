// job.jsx
import React from "react";
import "./Job.css"; // external CSS for custom overrides

const JobPage = () => {
  return (
    <div className="container-fluid job-page">
      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-2">
          <div className="stat-card">
            <h2>3</h2>
            <p>Open jobs</p>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="stat-card">
            <h2>0</h2>
            <p>Closed</p>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="stat-card">
            <h2>6</h2>
            <p>Applications</p>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="stat-card">
            <h2>100%</h2>
            <p>Interview ratio</p>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="stat-card">
            <h2>50%</h2>
            <p>Offer ratio</p>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="stat-card">
            <h2>50%</h2>
            <p>Joining ratio</p>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table job-table">
              <thead>
                <tr>
                  <th>JOB</th>
                  <th>CLIENT</th>
                  <th>LOCATION</th>
                  <th>CANDIDATES</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>SAP S/4HANA Consultant</strong>
                    <br />
                    <span className="job-meta">Permanent - Hybrid - €85,000</span>
                  </td>
                  <td>Nova Manufacturing</td>
                  <td>London, United Kingdom</td>
                  <td>3</td>
                  <td><span className="badge bg-success">Open</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Cloud Security Engineer</strong>
                    <br />
                    <span className="job-meta">Contract - Remote - €650/day</span>
                  </td>
                  <td>Meridian Fintech</td>
                  <td>Dubai, UAE</td>
                  <td>2</td>
                  <td><span className="badge bg-success">Open</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>AI / ML Engineer</strong>
                    <br />
                    <span className="job-meta">Permanent - Hybrid - €95,000</span>
                  </td>
                  <td>Helix Health AI</td>
                  <td>Berlin, Germany</td>
                  <td>1</td>
                  <td><span className="badge bg-success">Open</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;