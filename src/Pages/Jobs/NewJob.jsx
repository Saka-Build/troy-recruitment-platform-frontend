import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Job.css";
import ManualCreationModal from "./ManualCreationModal";

function NewJob() {
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);

  const handleBack = () => {
    navigate("/dashboard/jobs");
  };

  const openModal = (type) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="new-job-page">
      <div className="new-job-back-wrapper">
        <button
          type="button"
          className="new-job-back-btn"
          onClick={handleBack}
        >
          ← Back to jobs
        </button>
      </div>

      <div className="new-job-header">

        <h1>New Job</h1>

        <p>
          Choose how you want to create this role
        </p>

      </div>

      <div className="new-job-options">

        {/* MANUAL CREATION */}

        <button
          type="button"
          className="new-job-option manual"
          onClick={() => openModal("manual")}
        >
          <div className="new-job-option-icon">
            📄
          </div>

          <div className="new-job-option-title">
            Manual
            <br />
            Creation
          </div>

          <div className="new-job-option-description">
            Fill in the job details
            <br />
            yourself
          </div>
        </button>


       
      </div>

      {activeModal === "manual" && (
        <ManualCreationModal
          title="Manual creation"
          onClose={closeModal}
        />
      )}


      {activeModal === "requisition" && (
        <ManualCreationModal
          title="New requisition"
          onClose={closeModal}
          requisition
        />
      )}


      {/* {activeModal === "template" && (
        <TemplateModal
          onClose={closeModal}
        />
      )}


      {activeModal === "parse" && (
        <ParseModal
          onClose={closeModal}
        />
      )} */}

    </div>
  );
}




export default NewJob;



 {/* REQUISITION */}

        {/* <button
          type="button"
          className="new-job-option requisition"
          onClick={() => openModal("requisition")}
        >
          <div className="new-job-option-icon">
            📋
          </div>

          <div className="new-job-option-title">
            Requisition
          </div>

          <div className="new-job-option-description">
            Raise or allocate a
            <br />
            client requirement
          </div>
        </button>

        <button
          type="button"
          className="new-job-option template"
          onClick={() => openModal("template")}
        >
          <div className="new-job-option-icon">
            🗂️
          </div>

          <div className="new-job-option-title">
            Job Template
          </div>

          <div className="new-job-option-description">
            Start from a saved role
            <br />
            template
          </div>
        </button>

        <button
          type="button"
          className="new-job-option parse"
          onClick={() => openModal("parse")}
        >
          <div className="new-job-option-icon">
            ☁
          </div>

          <div className="new-job-option-title">
            Parse Job
            <br />
            Details
          </div>

          <div className="new-job-option-description">
            Paste a JD and auto-
            <br />
            extract fields
          </div>
        </button> */}




        
// function TemplateModal({ onClose }) {

//   const templates = [
//     {
//       title: "SAP S/4HANA Consultant",
//       skills: "SAP FICO, S/4HANA, ABAP",
//       type: "Permanent",
//       mode: "Hybrid",
//     },
//     {
//       title: "Cloud / DevOps Engineer",
//       skills: "AWS, Kubernetes, Terraform, CI/CD",
//       type: "Contract",
//       mode: "Remote",
//     },
//     {
//       title: "Data Engineer",
//       skills: "Python, Spark, dbt, SQL",
//       type: "Permanent",
//       mode: "Hybrid",
//     },
//     {
//       title: "Cyber Security Analyst",
//       skills: "SIEM, IAM, Security, Incident Response",
//       type: "Permanent",
//       mode: "Onsite",
//     },
//     {
//       title: "Business Analyst",
//       skills: "Business Analysis, Requirements, Stakeholder Mgmt",
//       type: "Permanent",
//       mode: "Hybrid",
//     },
//   ];

//   return (
//     <div
//       className="job-modal-overlay"
//       onMouseDown={onClose}
//     >

//       <div
//         className="job-modal template-modal"
//         onMouseDown={(e) => e.stopPropagation()}
//       >

//         <div className="job-modal-header">

//           <h2>Choose a template</h2>

//           <button
//             className="job-modal-close"
//             onClick={onClose}
//           >
//             ×
//           </button>

//         </div>


//         <div className="template-modal-body">

//           {templates.map((template, index) => (

//             <button
//               type="button"
//               className="template-item"
//               key={index}
//             >

//               <div className="template-item-info">

//                 <strong>
//                   {template.title}
//                 </strong>

//                 <span>
//                   {template.skills}
//                 </span>

//               </div>

//               <span className="template-badge">
//                 {template.type} · {template.mode}
//               </span>

//             </button>

//           ))}

//         </div>


//         <div className="job-modal-footer">

//           <button
//             type="button"
//             className="job-modal-cancel"
//             onClick={onClose}
//           >
//             Cancel
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }


// function ParseModal({ onClose }) {

//   return (
//     <div
//       className="job-modal-overlay"
//       onMouseDown={onClose}
//     >

//       <div
//         className="job-modal parse-modal"
//         onMouseDown={(e) => e.stopPropagation()}
//       >

//         <div className="job-modal-header">

//           <h2>Parse job details</h2>

//           <button
//             className="job-modal-close"
//             onClick={onClose}
//           >
//             ×
//           </button>

//         </div>


//         <div className="parse-modal-body">

//           <p className="parse-description">
//             Paste the full job description below. We'll extract
//             the title, skills, contract type and work mode
//             automatically, then let you review before saving.
//           </p>

//           <div className="job-form-field full">

//             <label>
//               Job description text
//             </label>

//             <textarea
//               className="parse-textarea"
//               placeholder="Paste the JD here..."
//             />

//           </div>

//           <div className="parse-note">
//             ℹ Uses keyword matching, not an AI model —
//             always review the result.
//           </div>

//         </div>


//         <div className="job-modal-footer">

//           <button
//             type="button"
//             className="job-modal-cancel"
//             onClick={onClose}
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             className="job-modal-primary"
//           >
//             Parse & review →
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }