// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useDispatch,
//   useSelector,
// } from "react-redux";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import {
//   getSubmissionCounts,
//   getSubmissionsByStage,

// } from "../../Redux/Slice/recruitmentWorkflowSlice";
// import { updateSubmission, } from "../../Redux/Slice/candidateSlice";
// import "./RecruitmentWorkflow.css";

// const stages = [
//   {
//     id: "applied",
//     label: "Applied",
//     apiStage: "applied",
//     statusId: "d80eda28-c91b-4771-a62e-20a13464f168",
//   },
//   {
//     id: "screening",
//     label: "Screening",
//     apiStage: "screening",
//     statusId: "1fdb16fc-7692-4615-9f29-220c5cbf0f7c",
//   },
//   {
//     id: "ready",
//     label: "Ready to Submit",
//     apiStage: "ready_to_submit",
//     statusId: "3c646841-f5c1-4d55-bd62-0186a46bf5ce",
//   },
//   {
//     id: "submitted",
//     label: "Submitted",
//     apiStage: "submitted",
//     statusId: "c43a0459-86f1-4758-840e-838fa02021b1",
//   },
//   {
//     id: "interview",
//     label: "Interview",
//     apiStage: "interview",
//     statusId: "689076b5-7a1e-4378-ae67-f2c613a6f639",
//   },
//   {
//     id: "selected",
//     label: "Selected",
//     apiStage: "selected",
//     statusId: "8aa1b9ea-112d-4b3a-81d9-f9fa22a282c8",
//   },
//   {
//     id: "offer",
//     label: "Offer Released",
//     apiStage: "offer_released",
//     statusId: "24be905e-bb56-4bf9-9c4b-ebbc43b8f116",
//   },
//   {
//     id: "onboarding",
//     label: "Onboarding",
//     apiStage: "onboarding",
//     statusId: "99f11005-9e70-4109-9d6f-f19b569ab2f6",
//   },
//   {
//     id: "joined",
//     label: "Onboarded",
//     apiStage: "onboarded",
//     statusId: "5529adaa-438b-42e5-80e5-cce90baab965",
//   },
// ];

// const normalizeStage = (pipelineStage) => {
//   const value = pipelineStage
//     ?.toLowerCase()
//     .trim()
//     .replace(/\s+/g, "_");

//   switch (value) {
//     case "applied":
//       return "applied";

//     case "screening":
//       return "screening";

//     case "ready_to_submit":
//       return "ready";

//     case "submitted":
//       return "submitted";

//     case "interview":
//       return "interview";

//     case "selected":
//       return "selected";

//     case "offer":
//     case "offer_released":
//       return "offer";

//     case "onboarding":
//       return "onboarding";

//     case "onboarded":
//       return "joined";

//     case "hold":
//       return "hold";

//     case "rejected":
//       return "rejected";

//     case "offboarded":
//       return "offboarded";

//     default:
//       return "applied";
//   }
// };

// const getInitials = (name) => {
//   if (!name) {
//     return "NA";
//   }

//   return name
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((item) =>
//       item.charAt(0).toUpperCase()
//     )
//     .join("");
// };

// function RecruitmentWorkflowDetails() {
//   const { stage = "applied" } = useParams();

//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const {
//     submissions = [],
//     submissionsLoading,
//     submissionsError,
//     submissionCounts,
//     updatingSubmission,
//     updateSubmissionError,
//   } = useSelector(
//     (state) => state.recruitmentWorkflow
//   );

//   const [search, setSearch] = useState("");
//   const [cvSearch, setCvSearch] = useState("");
//   const [roleFilter, setRoleFilter] =
//     useState("All roles");

//   const [toast, setToast] = useState(null);

//   const currentStage =
//     stages.find(
//       (item) => item.id === stage
//     ) || stages[0];

//   useEffect(() => {
//     dispatch(getSubmissionCounts());

//     dispatch(
//       getSubmissionsByStage(
//         currentStage.apiStage
//       )
//     );
//   }, [
//     dispatch,
//     currentStage.apiStage,
//   ]);

//   const candidates = useMemo(() => {
//     return submissions.map(
//       (submission) => {
//         const name =
//           submission.candidateName ||
//           "Unknown Candidate";

//         return {
//           id:
//             submission.submissionId,

//           submissionId:
//             submission.submissionId,

//           candidateId:
//             submission.candidateId,

//           name,

//           initials:
//             getInitials(name),

//           designation:
//             submission.candidateDesignation ||
//             "—",

//           role:
//             submission.jobName ||
//             "—",

//           client:
//             submission.clientName ||
//             "—",

//           endClient:
//             submission.endClientName ||
//             "—",

//           stage:
//             normalizeStage(
//               submission.pipelineStage ||
//               submission.statusName
//             ),

//           pipelineStage:
//             submission.pipelineStage ||
//             "",

//           statusId:
//             submission.statusId ||
//             "",

//           statusName:
//             submission.statusName ||
//             "—",

//           cvId:
//             submission.candidateCVId ||
//             "—",

//           currentStatus:
//             submission.statusName ||
//             "—",

//           email:
//             submission.candidateEmail ||
//             "",

//           phone:
//             submission.candidatePhone ||
//             "",

//           originalCV:
//             submission.candidateOriginalCV ||
//             "",

//           expectedCurrency:
//             submission.candidateExpectedCurrency ||
//             "INR",

//           expectedAmount:
//             submission.candidateExpectedAmount ??
//             "",

//           expectedPeriod:
//             submission.candidateExpectedPeriod ||
//             "day",

//           submissionCurrency:
//             submission.submissionCurrency ||
//             submission.candidateExpectedCurrency ||
//             "INR",

//           submissionAmount:
//             submission.submissionAmount ??
//             "",

//           submissionPeriod:
//             submission.submissionPeriod ||
//             "day",

//           offerCurrency:
//             submission.offerCurrency ||
//             submission.submissionCurrency ||
//             submission.candidateExpectedCurrency ||
//             "INR",

//           offerAmount:
//             submission.offerAmount ??
//             "",

//           offerPeriod:
//             submission.offerPeriod ||
//             "day",

//           notes:
//             submission.notes || "",

//           historyCounts:
//             submission.historyCounts || 0,

//           BDM:
//             submission.BDM || "",

//           interviewDate:
//             submission.interviewDate ||
//             "",

//           interviewTime:
//             submission.interviewTime ||
//             "",
//         };
//       }
//     );
//   }, [submissions]);

//   const stageCounts = useMemo(() => {
//     return {
//       applied:
//         submissionCounts?.totalApplied ??
//         0,

//       screening:
//         submissionCounts?.totalScreening ??
//         0,

//       ready:
//         submissionCounts?.totalReadyToSubmit ??
//         0,

//       submitted:
//         submissionCounts?.totalSubmitted ??
//         0,

//       interview:
//         submissionCounts?.totalInterview ??
//         0,

//       selected:
//         submissionCounts?.totalSelected ??
//         0,

//       offer:
//         submissionCounts?.totalOnBoarding ??
//         0,

//       onboarding:
//         submissionCounts?.totalOnBoarding ??
//         0,

//       joined:
//         submissionCounts?.totalOnBoarded ??
//         0,

//       hold:
//         submissionCounts?.totalHold ??
//         0,

//       rejected:
//         submissionCounts?.totalRejected ??
//         0,

//       offboarded:
//         submissionCounts?.totalOffboarded ??
//         0,
//     };
//   }, [submissionCounts]);

//   const currentCandidates = useMemo(() => {
//     const text =
//       search.toLowerCase().trim();

//     const cvText =
//       cvSearch.toLowerCase().trim();

//     return candidates.filter(
//       (candidate) => {
//         const matchesSearch =
//           !text ||
//           candidate.name
//             .toLowerCase()
//             .includes(text) ||
//           candidate.designation
//             .toLowerCase()
//             .includes(text) ||
//           candidate.role
//             .toLowerCase()
//             .includes(text) ||
//           candidate.client
//             .toLowerCase()
//             .includes(text);

//         const matchesCv =
//           !cvText ||
//           candidate.cvId
//             .toLowerCase()
//             .includes(cvText) ||
//           candidate.name
//             .toLowerCase()
//             .includes(cvText);

//         const matchesRole =
//           roleFilter === "All roles" ||
//           candidate.role === roleFilter;

//         return (
//           matchesSearch &&
//           matchesCv &&
//           matchesRole
//         );
//       }
//     );
//   }, [
//     candidates,
//     search,
//     cvSearch,
//     roleFilter,
//   ]);

//   const roles = useMemo(() => {
//     return [
//       "All roles",
//       ...new Set(
//         candidates.map(
//           (candidate) =>
//             candidate.role
//         )
//       ),
//     ];
//   }, [candidates]);

//   const currentStageIndex =
//     stages.findIndex(
//       (item) => item.id === stage
//     );

//   const previousStage =
//     stages[currentStageIndex - 1];

//   const nextStage =
//     stages[currentStageIndex + 1];

//   const showToast = (
//     candidateName,
//     newStage,
//     type = "success"
//   ) => {
//     setToast({
//       name: candidateName,
//       stage: newStage,
//       type,
//     });

//     setTimeout(() => {
//       setToast(null);
//     }, 2500);
//   };

//   const getStageLabel = (stageId) => {
//     return (
//       stages.find(
//         (item) =>
//           item.id === stageId
//       )?.label || stageId
//     );
//   };

//   const getStatusClass = (
//     candidate
//   ) => {
//     switch (
//     candidate.currentStatus
//     ) {
//       case "Submitted":
//         return "workflow-status-submitted";

//       case "Selected":
//         return "workflow-status-selected";

//       case "Offer Released":
//         return "workflow-status-offer";

//       case "Onboarding":
//         return "workflow-status-interview";

//       case "Onboarded":
//         return "workflow-status-joined";

//       case "Ready to Submit":
//       case "Ready_to_Submit":
//         return "workflow-status-ready";

//       case "Actively Sourcing":
//         return "workflow-status-sourcing";

//       case "Interview":
//         return "workflow-status-interview";

//       case "Rejected":
//         return "workflow-status-rejected";

//       case "Hold":
//         return "workflow-status-offer";

//       case "Offboarded":
//         return "workflow-status-pipeline";

//       default:
//         return "workflow-status-pipeline";
//     }
//   };

//   const getStatusIcon = (
//     candidate
//   ) => {
//     switch (
//     candidate.currentStatus
//     ) {
//       case "Selected":
//         return "bi-check-lg";

//       case "Offer Released":
//         return "bi-briefcase-fill";

//       case "Onboarding":
//         return "bi-person-plus-fill";

//       case "Onboarded":
//         return "bi-person-check-fill";

//       case "Ready to Submit":
//       case "Ready_to_Submit":
//         return "bi-send-fill";

//       case "Interview":
//         return "bi-pin-angle-fill";

//       case "Actively Sourcing":
//         return "bi-search";

//       case "Submitted":
//         return "bi-briefcase-fill";

//       case "Rejected":
//         return "bi-x-circle-fill";

//       case "Hold":
//         return "bi-pause-circle-fill";

//       case "Offboarded":
//         return "bi-person-dash-fill";

//       default:
//         return "bi-briefcase-fill";
//     }
//   };

//   const formatRate = (
//     currency,
//     amount,
//     period
//   ) => {
//     if (
//       amount === null ||
//       amount === undefined ||
//       amount === ""
//     ) {
//       return "";
//     }

//     return `${currency || ""} ${amount} / ${period || "day"
//       }`;
//   };

//   const handleStageChange = async (
//     candidate,
//     newStage
//   ) => {
//     if (
//       !candidate?.submissionId ||
//       !newStage
//     ) {
//       return;
//     }

//     if (
//       newStage === candidate.stage
//     ) {
//       return;
//     }

//     const targetStage =
//       stages.find(
//         (item) =>
//           item.id === newStage
//       );

//     if (!targetStage) {
//       return;
//     }

//     try {
//       const result = await dispatch(
//         updateSubmission({
//           submissionId:
//             candidate.submissionId,
//           statusId:
//             targetStage.statusId,
//           subStatusId: null,
//         })
//       ).unwrap();

//       showToast(
//         candidate.name,
//         targetStage.label
//       );

//       await Promise.all([
//         dispatch(getSubmissionCounts()),
//         dispatch(
//           getSubmissionsByStage(
//             currentStage.apiStage
//           )
//         ),
//       ]);

//       if (
//         targetStage.id !== stage
//       ) {
//         navigate(
//           `/dashboard/recruitment-workflow/${targetStage.id}`
//         );
//       }

//       console.log(
//         "Submission updated:",
//         result
//       );
//     } catch (error) {
//       console.error(
//         "Failed to update submission:",
//         error
//       );

//       showToast(
//         candidate.name,
//         typeof error === "string"
//           ? error
//           : "Failed to update stage",
//         "error"
//       );
//     }
//   };

//   const goToStage = (
//     stageId
//   ) => {
//     if (!stageId) {
//       return;
//     }

//     navigate(
//       `/dashboard/recruitment-workflow/${stageId}`
//     );
//   };

//   return (
//     <div className="page recruitment-workflow-details-page">

//       <div className="workflow-details-header">

//         <button
//           type="button"
//           className="workflow-back-btn"
//           onClick={() =>
//             navigate(
//               "/dashboard/recruitment-workflow"
//             )
//           }
//         >
//           ← All stages
//         </button>

//         <div className="workflow-details-heading">

//           <div>
//             <h1 className="page-title">

//               {currentStage.label}

//               <span className="workflow-application-count">
//                 ·{" "}
//                 {stageCounts[stage] || 0}{" "}
//                 application
//                 {(stageCounts[stage] ||
//                   0) !== 1
//                   ? "s"
//                   : ""}
//               </span>

//             </h1>

//             <p className="page-subtitle">
//               Candidates at the "
//               {currentStage.label}"
//               stage — with the role they
//               applied for and their
//               current status.
//             </p>
//           </div>

//           <div className="workflow-stage-tabs">

//             {stages.map((item) => (
//               <button
//                 key={item.id}
//                 type="button"
//                 className={`workflow-stage-tab ${item.id === stage
//                   ? "active"
//                   : ""
//                   }`}
//                 onClick={() =>
//                   goToStage(item.id)
//                 }
//               >
//                 {item.label}{" "}
//                 {stageCounts[
//                   item.id
//                 ] || 0}
//               </button>
//             ))}

//           </div>

//         </div>

//       </div>

//       <div className="workflow-filters">

//         <div className="workflow-search">

//           <input
//             type="text"
//             placeholder="Search name, designation, skills..."
//             value={search}
//             onChange={(e) =>
//               setSearch(
//                 e.target.value
//               )
//             }
//           />

//         </div>

//         <input
//           type="text"
//           className="workflow-cv-search"
//           placeholder="Candidate / CV ID"
//           value={cvSearch}
//           onChange={(e) =>
//             setCvSearch(
//               e.target.value
//             )
//           }
//         />

//         <select
//           className="workflow-role-filter"
//           value={roleFilter}
//           onChange={(e) =>
//             setRoleFilter(
//               e.target.value
//             )
//           }
//         >
//           {roles.map((role) => (
//             <option
//               key={role}
//               value={role}
//             >
//               {role}
//             </option>
//           ))}
//         </select>

//       </div>

//       <div className="workflow-table-wrapper">

//         <table className="workflow-table">

//           <thead>
//             <tr>
//               <th>CANDIDATE</th>
//               <th>CV ID</th>
//               <th>APPLIED FOR (ROLE)</th>
//               <th>CLIENT</th>
//               <th>CURRENT STATUS</th>
//               <th>MOVE TO STAGE</th>
//               <th>ACTIONS</th>
//             </tr>
//           </thead>

//           <tbody>

//             {submissionsLoading && (
//               <tr>
//                 <td
//                   colSpan="7"
//                   className="workflow-empty"
//                 >
//                   Loading candidates...
//                 </td>
//               </tr>
//             )}

//             {!submissionsLoading &&
//               submissionsError && (
//                 <tr>
//                   <td
//                     colSpan="7"
//                     className="workflow-empty"
//                   >
//                     {submissionsError}
//                   </td>
//                 </tr>
//               )}

//             {!submissionsLoading &&
//               !submissionsError &&
//               currentCandidates.map(
//                 (candidate) => (
//                   <tr
//                     key={
//                       candidate.submissionId
//                     }
//                   >

//                     <td>
//                       <div className="workflow-candidate">

//                         <div className="workflow-avatar">
//                           {candidate.initials}
//                         </div>

//                         <div className="workflow-candidate-info">

//                           <strong>
//                             {candidate.name}
//                           </strong>

//                           <div className="workflow-candidate-bottom">

//                             <span>
//                               {
//                                 candidate.designation
//                               }
//                             </span>

//                             <div className="candidate-action-icons">

//                               <button
//                                 type="button"
//                               >
//                                 ▧
//                               </button>

//                               <button
//                                 type="button"
//                               >
//                                 ⇩
//                               </button>

//                               <button
//                                 type="button"
//                               >
//                                 ▣
//                               </button>

//                               <button
//                                 type="button"
//                               >
//                                 ▤
//                               </button>

//                             </div>

//                           </div>

//                         </div>

//                       </div>
//                     </td>

//                     <td>
//                       <span className="workflow-cv-id">
//                         {candidate.cvId}
//                       </span>
//                     </td>

//                     <td>
//                       <span className="workflow-role">
//                         {candidate.role}
//                       </span>
//                     </td>

//                     <td>
//                       <span className="workflow-client">
//                         {candidate.client}
//                       </span>
//                     </td>

//                     <td>

//                       <div className="workflow-status-wrapper">

//                         <span
//                           className={`workflow-status ${getStatusClass(
//                             candidate
//                           )}`}
//                         >

//                           <i
//                             className={`bi ${getStatusIcon(
//                               candidate
//                             )} workflow-status-icon`}
//                             aria-hidden="true"
//                           ></i>

//                           <span className="workflow-status-text">
//                             {
//                               candidate.currentStatus
//                             }
//                           </span>

//                         </span>

//                         {candidate.stage ===
//                           "interview" &&
//                           (!candidate.interviewDate ||
//                             !candidate.interviewTime) && (
//                             <span className="workflow-warning">
//                               ⚿ date/time not set
//                             </span>
//                           )}

//                         {candidate.submissionAmount && (
//                           <span className="workflow-rate">
//                             Sub:{" "}
//                             {formatRate(
//                               candidate.submissionCurrency,
//                               candidate.submissionAmount,
//                               candidate.submissionPeriod
//                             )}
//                             {" · "}
//                             Offer:{" "}
//                             {candidate.offerAmount
//                               ? formatRate(
//                                 candidate.offerCurrency,
//                                 candidate.offerAmount,
//                                 candidate.offerPeriod
//                               )
//                               : "-"}
//                           </span>
//                         )}

//                       </div>

//                     </td>

//                     <td>

//                       <select
//                         className="workflow-move-select"
//                         value={
//                           candidate.stage
//                         }
//                         disabled={
//                           updatingSubmission
//                         }
//                         onChange={(e) =>
//                           handleStageChange(
//                             candidate,
//                             e.target.value
//                           )
//                         }
//                       >

//                         {stages.map(
//                           (item) => (
//                             <option
//                               key={
//                                 item.id
//                               }
//                               value={
//                                 item.id
//                               }
//                             >
//                               {
//                                 item.label
//                               }
//                             </option>
//                           )
//                         )}

//                       </select>

//                     </td>

//                     <td>

//                       <button
//                         type="button"
//                         className="workflow-open-btn"
//                         onClick={() =>
//                           console.log(
//                             "Open candidate:",
//                             candidate
//                           )
//                         }
//                       >
//                         Open
//                       </button>

//                     </td>

//                   </tr>
//                 )
//               )}

//             {!submissionsLoading &&
//               !submissionsError &&
//               currentCandidates.length ===
//               0 && (
//                 <tr>
//                   <td
//                     colSpan="7"
//                     className="workflow-empty"
//                   >
//                     No candidates found.
//                   </td>
//                 </tr>
//               )}

//           </tbody>

//         </table>

//       </div>

//       <div className="workflow-navigation">

//         {previousStage && (
//           <button
//             type="button"
//             className="workflow-nav-btn"
//             onClick={() =>
//               goToStage(
//                 previousStage.id
//               )
//             }
//           >
//             ←{" "}
//             {previousStage.label}
//           </button>
//         )}

//         {nextStage && (
//           <button
//             type="button"
//             className="workflow-nav-btn"
//             onClick={() =>
//               goToStage(
//                 nextStage.id
//               )
//             }
//           >
//             {nextStage.label} →
//           </button>
//         )}

//       </div>

//       {toast && (
//         <div
//           className={`workflow-stage-toast ${toast.type === "error"
//             ? "error"
//             : ""
//             }`}
//         >
//           {toast.type === "error"
//             ? `${toast.name}: ${toast.stage}`
//             : `${toast.name} → ${toast.stage}`}
//         </div>
//       )}

//       {updateSubmissionError && (
//         <div className="workflow-update-error">
//           {updateSubmissionError}
//         </div>
//       )}

//     </div>
//   );
// }

// export default RecruitmentWorkflowDetails;




import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getSubmissionCounts,
  getSubmissionsByStage,
  getSubmissionStatuses,
} from "../../Redux/Slice/recruitmentWorkflowSlice";

import {
  updateSubmission,
} from "../../Redux/Slice/candidateSlice";

import "./RecruitmentWorkflow.css";

/*
|--------------------------------------------------------------------------
| NORMALIZE WORKFLOW NAME
|--------------------------------------------------------------------------
*/

const normalizeWorkflowName = (value) => {
  if (!value) {
    return "";
  }

  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
};


/*
|--------------------------------------------------------------------------
| CONVERT API WORKFLOW STAGE TO ROUTE ID
|--------------------------------------------------------------------------
*/

const getStageId = (workflowStage) => {
  const normalized =
    normalizeWorkflowName(workflowStage);

  switch (normalized) {
    case "ready_to_submit":
      return "ready";

    case "onboarded":
      return "joined";

    default:
      return normalized;
  }
};


/*
|--------------------------------------------------------------------------
| DISPLAY LABEL
|--------------------------------------------------------------------------
*/

const getStageLabel = (workflowStage) => {
  const normalized =
    normalizeWorkflowName(workflowStage);

  switch (normalized) {
    case "ready_to_submit":
      return "Ready to Submit";

    case "offer_released":
      return "Offer Released";

    case "onboarded":
      return "Onboarded";

    default:
      return workflowStage || "";
  }
};


/*
|--------------------------------------------------------------------------
| INITIALS
|--------------------------------------------------------------------------
*/

const getInitials = (name) => {
  if (!name) {
    return "NA";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) =>
      item.charAt(0).toUpperCase()
    )
    .join("");
};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

function RecruitmentWorkflowDetails() {
  const {
    stage = "applied",
  } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();


  /*
  |--------------------------------------------------------------------------
  | REDUX STATE
  |--------------------------------------------------------------------------
  */

  const {
    submissions = [],
    submissionsLoading,
    submissionsError,

    submissionCounts,

    submissionStatuses = [],
    workflowStages = [],

    submissionStatusesLoading,

    updatingSubmission,
    updateSubmissionError,
  } = useSelector(
    (state) =>
      state.recruitmentWorkflow
  );


  /*
  |--------------------------------------------------------------------------
  | LOCAL STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] =
    useState("");

  const [cvSearch, setCvSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All roles");

  const [toast, setToast] =
    useState(null);


  /*
  |--------------------------------------------------------------------------
  | BUILD WORKFLOW STAGES FROM API
  |
  | workflowStages:
  |
  | [
  |   "Applied",
  |   "Screening",
  |   "Ready_to_submit",
  |   "Submitted",
  |   "Interview",
  |   "Selected",
  |   "Rejected",
  |   "Onboarding",
  |   "Onboarded"
  | ]
  |
  | IMPORTANT:
  | Rejected is intentionally removed from the workflow navigation.
  |
  |--------------------------------------------------------------------------
  */

  const stages = useMemo(() => {
    if (
      !Array.isArray(workflowStages) ||
      !Array.isArray(submissionStatuses)
    ) {
      return [];
    }

    return workflowStages
      .map((workflowStage) => {
        const normalizedWorkflowStage =
          normalizeWorkflowName(
            workflowStage
          );

        /*
        |--------------------------------------------------------------------------
        | Do NOT show Rejected as a workflow stage
        |--------------------------------------------------------------------------
        */

        if (
          normalizedWorkflowStage ===
          "rejected"
        ) {
          return null;
        }

        /*
        |--------------------------------------------------------------------------
        | Find matching status from submissionStatusList
        |--------------------------------------------------------------------------
        */

        const status =
          submissionStatuses.find(
            (item) =>
              normalizeWorkflowName(
                item.name
              ) ===
              normalizedWorkflowStage
          );

        if (!status) {
          return null;
        }

        return {
          id: getStageId(
            workflowStage
          ),

          label: getStageLabel(
            workflowStage
          ),

          apiStage:
            normalizedWorkflowStage,

          statusId:
            status.id,

          colourHex:
            status.colourHex,

          statusName:
            status.name,
        };
      })
      .filter(Boolean);

  }, [
    workflowStages,
    submissionStatuses,
  ]);


  /*
  |--------------------------------------------------------------------------
  | CURRENT STAGE
  |--------------------------------------------------------------------------
  */

  const currentStage =
    stages.find(
      (item) =>
        item.id === stage
    ) || stages[0] || null;


  /*
  |--------------------------------------------------------------------------
  | LOAD STATUS LIST + COUNTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      getSubmissionStatuses()
    );

    dispatch(
      getSubmissionCounts()
    );
  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | LOAD SUBMISSIONS FOR CURRENT WORKFLOW STAGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !currentStage?.apiStage
    ) {
      return;
    }

    dispatch(
      getSubmissionsByStage(
        currentStage.apiStage
      )
    );

  }, [
    dispatch,
    currentStage?.apiStage,
  ]);


  /*
  |--------------------------------------------------------------------------
  | CANDIDATE MAPPING
  |--------------------------------------------------------------------------
  */

  const candidates = useMemo(() => {
    return submissions.map(
      (submission) => {

        const name =
          submission.candidateName ||
          "Unknown Candidate";


        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |
        | candidate.stage = WORKFLOW STAGE
        |
        | candidate.currentStatus = STATUS
        |
        | These are intentionally kept separate.
        |--------------------------------------------------------------------------
        */

        const workflowStage =
          submission.pipelineStage ||
          "";


        const normalizedStage =
          normalizeWorkflowName(
            workflowStage
          );


        const routeStage =
          getStageId(
            normalizedStage
          );


        return {

          id:
            submission.submissionId,

          submissionId:
            submission.submissionId,

          candidateId:
            submission.candidateId,

          name,

          initials:
            getInitials(name),

          designation:
            submission.candidateDesignation ||
            "—",

          role:
            submission.jobName ||
            "—",

          client:
            submission.clientName ||
            "—",

          endClient:
            submission.endClientName ||
            "—",


          /*
          |--------------------------------------------------------------------------
          | WORKFLOW STAGE
          |--------------------------------------------------------------------------
          */

          stage:
            routeStage,

          pipelineStage:
            workflowStage,


          /*
          |--------------------------------------------------------------------------
          | STATUS
          |
          | This is what we display under CURRENT STATUS.
          |--------------------------------------------------------------------------
          */

          statusId:
            submission.statusId ||
            "",

          statusName:
            submission.statusName ||
            "—",

          currentStatus:
            submission.statusName ||
            "—",


          /*
          |--------------------------------------------------------------------------
          | CV
          |--------------------------------------------------------------------------
          */

          cvId:
            submission.candidateCVId ||
            "—",


          /*
          |--------------------------------------------------------------------------
          | CONTACT
          |--------------------------------------------------------------------------
          */

          email:
            submission.candidateEmail ||
            "",

          phone:
            submission.candidatePhone ||
            "",

          originalCV:
            submission.candidateOriginalCV ||
            "",


          /*
          |--------------------------------------------------------------------------
          | EXPECTED RATE
          |--------------------------------------------------------------------------
          */

          expectedCurrency:
            submission.candidateExpectedCurrency ||
            "INR",

          expectedAmount:
            submission.candidateExpectedAmount ??
            "",

          expectedPeriod:
            submission.candidateExpectedPeriod ||
            "day",


          /*
          |--------------------------------------------------------------------------
          | SUBMISSION RATE
          |--------------------------------------------------------------------------
          */

          submissionCurrency:
            submission.submissionCurrency ||
            submission.candidateExpectedCurrency ||
            "INR",

          submissionAmount:
            submission.submissionAmount ??
            "",

          submissionPeriod:
            submission.submissionPeriod ||
            "day",


          /*
          |--------------------------------------------------------------------------
          | OFFER RATE
          |--------------------------------------------------------------------------
          */

          offerCurrency:
            submission.offerCurrency ||
            submission.submissionCurrency ||
            submission.candidateExpectedCurrency ||
            "INR",

          offerAmount:
            submission.offerAmount ??
            "",

          offerPeriod:
            submission.offerPeriod ||
            "day",


          /*
          |--------------------------------------------------------------------------
          | OTHER DATA
          |--------------------------------------------------------------------------
          */

          notes:
            submission.notes ||
            "",

          historyCounts:
            submission.historyCounts ||
            0,

          BDM:
            submission.BDM ||
            "",

          interviewDate:
            submission.interviewDate ||
            "",

          interviewTime:
            submission.interviewTime ||
            "",
        };
      }
    );
  }, [
    submissions,
  ]);


  /*
  |--------------------------------------------------------------------------
  | STAGE COUNTS
  |--------------------------------------------------------------------------
  */

  const stageCounts =
    useMemo(() => {

      return {

        applied:
          submissionCounts?.totalApplied ??
          0,

        screening:
          submissionCounts?.totalScreening ??
          0,

        ready:
          submissionCounts?.totalReadyToSubmit ??
          0,

        submitted:
          submissionCounts?.totalSubmitted ??
          0,

        interview:
          submissionCounts?.totalInterview ??
          0,

        selected:
          submissionCounts?.totalSelected ??
          0,

        onboarding:
          submissionCounts?.totalOnBoarding ??
          0,

        joined:
          submissionCounts?.totalOnBoarded ??
          0,

      };

    }, [
      submissionCounts,
    ]);


  /*
  |--------------------------------------------------------------------------
  | SEARCH + FILTER
  |--------------------------------------------------------------------------
  */

  const currentCandidates =
    useMemo(() => {

      const text =
        search
          .toLowerCase()
          .trim();

      const cvText =
        cvSearch
          .toLowerCase()
          .trim();


      return candidates.filter(
        (candidate) => {

          const matchesSearch =
            !text ||
            candidate.name
              .toLowerCase()
              .includes(text) ||
            candidate.designation
              .toLowerCase()
              .includes(text) ||
            candidate.role
              .toLowerCase()
              .includes(text) ||
            candidate.client
              .toLowerCase()
              .includes(text);


          const matchesCv =
            !cvText ||
            String(candidate.cvId)
              .toLowerCase()
              .includes(cvText) ||
            candidate.name
              .toLowerCase()
              .includes(cvText);


          const matchesRole =
            roleFilter ===
            "All roles" ||
            candidate.role ===
            roleFilter;


          return (
            matchesSearch &&
            matchesCv &&
            matchesRole
          );
        }
      );

    }, [
      candidates,
      search,
      cvSearch,
      roleFilter,
    ]);


  /*
  |--------------------------------------------------------------------------
  | ROLE OPTIONS
  |--------------------------------------------------------------------------
  */

  const roles =
    useMemo(() => {

      return [
        "All roles",
        ...new Set(
          candidates.map(
            (candidate) =>
              candidate.role
          )
        ),
      ];

    }, [
      candidates,
    ]);


  /*
  |--------------------------------------------------------------------------
  | PREVIOUS / NEXT STAGE
  |--------------------------------------------------------------------------
  */

  const currentStageIndex =
    stages.findIndex(
      (item) =>
        item.id === stage
    );


  const previousStage =
    stages[
    currentStageIndex - 1
    ];


  const nextStage =
    stages[
    currentStageIndex + 1
    ];


  /*
  |--------------------------------------------------------------------------
  | TOAST
  |--------------------------------------------------------------------------
  */

  const showToast = (
    candidateName,
    message,
    type = "success"
  ) => {

    setToast({
      name: candidateName,
      stage: message,
      type,
    });


    setTimeout(() => {
      setToast(null);
    }, 2500);
  };


  /*
  |--------------------------------------------------------------------------
  | STATUS CSS CLASS
  |
  | This uses CURRENT STATUS from API.
  |
  | Hold / Rejected / Offboarded can still appear here as statuses,
  | but they are NOT workflow stages.
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (
    candidate
  ) => {

    const status =
      normalizeWorkflowName(
        candidate.currentStatus
      );


    switch (status) {

      case "applied":
        return "workflow-status-pipeline";

      case "screening":
        return "workflow-status-pipeline";

      case "ready_to_submit":
        return "workflow-status-ready";

      case "submitted":
        return "workflow-status-submitted";

      case "interview":
        return "workflow-status-interview";

      case "selected":
        return "workflow-status-selected";

      case "offer_released":
        return "workflow-status-offer";

      case "onboarding":
        return "workflow-status-interview";

      case "onboarded":
        return "workflow-status-joined";

      case "rejected":
        return "workflow-status-rejected";

      case "hold":
        return "workflow-status-offer";

      case "offboarded":
        return "workflow-status-pipeline";

      case "actively_sourcing":
        return "workflow-status-sourcing";

      default:
        return "workflow-status-pipeline";
    }
  };


  /*
  |--------------------------------------------------------------------------
  | STATUS ICON
  |--------------------------------------------------------------------------
  */

  const getStatusIcon = (
    candidate
  ) => {

    const status =
      normalizeWorkflowName(
        candidate.currentStatus
      );


    switch (status) {

      case "selected":
        return "bi-check-lg";

      case "offer_released":
        return "bi-briefcase-fill";

      case "onboarding":
        return "bi-person-plus-fill";

      case "onboarded":
        return "bi-person-check-fill";

      case "ready_to_submit":
        return "bi-send-fill";

      case "interview":
        return "bi-pin-angle-fill";

      case "actively_sourcing":
        return "bi-search";

      case "submitted":
        return "bi-briefcase-fill";

      case "rejected":
        return "bi-x-circle-fill";

      case "hold":
        return "bi-pause-circle-fill";

      case "offboarded":
        return "bi-person-dash-fill";

      default:
        return "bi-briefcase-fill";
    }
  };


  /*
  |--------------------------------------------------------------------------
  | FORMAT RATE
  |--------------------------------------------------------------------------
  */

  const formatRate = (
    currency,
    amount,
    period
  ) => {

    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "";
    }


    return `${currency || ""} ${amount} / ${period || "day"
      }`;
  };


  /*
  |--------------------------------------------------------------------------
  | HANDLE STAGE CHANGE
  |
  | IMPORTANT:
  |
  | Dropdown value = workflow stage.
  |
  | We find that workflow stage inside `stages`.
  |
  | Then use the corresponding status ID returned
  | by /submissions/statuses.
  |--------------------------------------------------------------------------
  */

  const handleStageChange = async (
    candidate,
    newStage
  ) => {

    if (
      !candidate?.submissionId ||
      !newStage
    ) {
      return;
    }


    if (
      newStage ===
      candidate.stage
    ) {
      return;
    }


    const targetStage =
      stages.find(
        (item) =>
          item.id === newStage
      );


    if (!targetStage) {
      return;
    }


    if (
      !targetStage.statusId
    ) {
      showToast(
        candidate.name,
        "Status ID not found",
        "error"
      );

      return;
    }


    try {

      const result =
        await dispatch(
          updateSubmission({
            submissionId:
              candidate.submissionId,

            /*
            |--------------------------------------------------------------------------
            | Use status ID from /submissions/statuses
            |--------------------------------------------------------------------------
            */

            statusId:
              targetStage.statusId,

            /*
            |--------------------------------------------------------------------------
            | No sub status for workflow stage movement
            |--------------------------------------------------------------------------
            */

            subStatusId:
              null,
          })
        ).unwrap();


      showToast(
        candidate.name,
        targetStage.label
      );


      /*
      |--------------------------------------------------------------------------
      | Refresh counts + current stage
      |--------------------------------------------------------------------------
      */

      await Promise.all([
        dispatch(
          getSubmissionCounts()
        ),

        dispatch(
          getSubmissionsByStage(
            currentStage.apiStage
          )
        ),
      ]);


      /*
      |--------------------------------------------------------------------------
      | Navigate to target workflow stage
      |--------------------------------------------------------------------------
      */

      if (
        targetStage.id !== stage
      ) {

        navigate(
          `/dashboard/recruitment-workflow/${targetStage.id}`
        );
      }


      console.log(
        "Submission updated:",
        result
      );

    } catch (error) {

      console.error(
        "Failed to update submission:",
        error
      );


      showToast(
        candidate.name,

        typeof error ===
          "string"
          ? error
          : "Failed to update stage",

        "error"
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | NAVIGATE TO STAGE
  |--------------------------------------------------------------------------
  */

  const goToStage = (
    stageId
  ) => {

    if (!stageId) {
      return;
    }


    navigate(
      `/dashboard/recruitment-workflow/${stageId}`
    );
  };


  /*
  |--------------------------------------------------------------------------
  | LOADING STATUS API
  |--------------------------------------------------------------------------
  */

  if (
    submissionStatusesLoading &&
    stages.length === 0
  ) {

    return (
      <div className="page recruitment-workflow-details-page">

        <div className="workflow-empty">

          Loading workflow stages...

        </div>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div className="page recruitment-workflow-details-page">

      {/* ------------------------------------------------------------------
          HEADER
      ------------------------------------------------------------------ */}

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

              {currentStage?.label ||
                "Recruitment Workflow"}

              <span className="workflow-application-count">

                ·{" "}

                {stageCounts[
                  stage
                ] || 0}{" "}

                application

                {(stageCounts[
                  stage
                ] || 0) !== 1
                  ? "s"
                  : ""}

              </span>

            </h1>


            <p className="page-subtitle">

              Candidates at the "
              {currentStage?.label ||
                "current"}"
              stage — with the role they
              applied for and their
              current status.

            </p>

          </div>


          {/* --------------------------------------------------------------
              WORKFLOW STAGE TABS
          -------------------------------------------------------------- */}

          <div className="workflow-stage-tabs">

            {stages.map(
              (item) => (

                <button
                  key={item.id}
                  type="button"

                  className={`workflow-stage-tab ${item.id === stage
                    ? "active"
                    : ""
                    }`}

                  onClick={() =>
                    goToStage(
                      item.id
                    )
                  }
                >

                  {item.label}{" "}

                  {stageCounts[
                    item.id
                  ] || 0}

                </button>

              )
            )}

          </div>

        </div>

      </div>


      {/* ------------------------------------------------------------------
          FILTERS
      ------------------------------------------------------------------ */}

      <div className="workflow-filters">

        <div className="workflow-search">

          <input
            type="text"
            placeholder="Search name, designation, skills..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <input
          type="text"
          className="workflow-cv-search"
          placeholder="Candidate / CV ID"
          value={cvSearch}
          onChange={(e) =>
            setCvSearch(
              e.target.value
            )
          }
        />


        <select
          className="workflow-role-filter"
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
          }
        >

          {roles.map(
            (role) => (

              <option
                key={role}
                value={role}
              >
                {role}
              </option>

            )
          )}

        </select>

      </div>


      {/* ------------------------------------------------------------------
          TABLE
      ------------------------------------------------------------------ */}

      <div className="workflow-table-wrapper">

        <table className="workflow-table">

          <thead>

            <tr>

              <th>
                CANDIDATE
              </th>

              <th>
                CV ID
              </th>

              <th>
                APPLIED FOR (ROLE)
              </th>

              <th>
                CLIENT
              </th>

              <th>
                CURRENT STATUS
              </th>

              <th>
                MOVE TO STAGE
              </th>

              <th>
                ACTIONS
              </th>

            </tr>

          </thead>


          <tbody>

            {/* ------------------------------------------------------------
                LOADING
            ------------------------------------------------------------ */}

            {submissionsLoading && (

              <tr>

                <td
                  colSpan="7"
                  className="workflow-empty"
                >
                  Loading candidates...
                </td>

              </tr>

            )}


            {/* ------------------------------------------------------------
                ERROR
            ------------------------------------------------------------ */}

            {!submissionsLoading &&
              submissionsError && (

                <tr>

                  <td
                    colSpan="7"
                    className="workflow-empty"
                  >
                    {submissionsError}
                  </td>

                </tr>

              )}


            {/* ------------------------------------------------------------
                CANDIDATES
            ------------------------------------------------------------ */}

            {!submissionsLoading &&
              !submissionsError &&
              currentCandidates.map(
                (candidate) => (

                  <tr
                    key={
                      candidate.submissionId
                    }
                  >

                    {/* ----------------------------------------------------
                        CANDIDATE
                    ---------------------------------------------------- */}

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

                              {
                                candidate.designation
                              }

                            </span>


                            <div className="candidate-action-icons">

                              <button
                                type="button"
                              >
                                ▧
                              </button>

                              <button
                                type="button"
                              >
                                ⇩
                              </button>

                              <button
                                type="button"
                              >
                                ▣
                              </button>

                              <button
                                type="button"
                              >
                                ▤
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    </td>


                    {/* ----------------------------------------------------
                        CV ID
                    ---------------------------------------------------- */}

                    <td>

                      <span className="workflow-cv-id">

                        {candidate.cvId}

                      </span>

                    </td>


                    {/* ----------------------------------------------------
                        ROLE
                    ---------------------------------------------------- */}

                    <td>

                      <span className="workflow-role">

                        {candidate.role}

                      </span>

                    </td>


                    {/* ----------------------------------------------------
                        CLIENT
                    ---------------------------------------------------- */}

                    <td>

                      <span className="workflow-client">

                        {candidate.client}

                      </span>

                    </td>


                    {/* ----------------------------------------------------
                        CURRENT STATUS
                    ---------------------------------------------------- */}

                    <td>

                      <div className="workflow-status-wrapper">

                        <span
                          className={`workflow-status ${getStatusClass(
                            candidate
                          )}`}
                        >

                          <i
                            className={`bi ${getStatusIcon(
                              candidate
                            )} workflow-status-icon`}

                            aria-hidden="true"
                          ></i>


                          <span className="workflow-status-text">

                            {candidate.currentStatus}

                          </span>

                        </span>


                        {/* ------------------------------------------------
                            INTERVIEW WARNING
                        ------------------------------------------------ */}

                        {candidate.stage ===
                          "interview" &&
                          (
                            !candidate.interviewDate ||
                            !candidate.interviewTime
                          ) && (

                            <span className="workflow-warning">

                              ⚿ date/time not set

                            </span>

                          )}


                        {/* ------------------------------------------------
                            RATE
                        ------------------------------------------------ */}

                        {candidate.submissionAmount && (

                          <span className="workflow-rate">

                            Sub:{" "}

                            {formatRate(
                              candidate.submissionCurrency,
                              candidate.submissionAmount,
                              candidate.submissionPeriod
                            )}

                            {" · "}

                            Offer:{" "}

                            {candidate.offerAmount
                              ? formatRate(
                                candidate.offerCurrency,
                                candidate.offerAmount,
                                candidate.offerPeriod
                              )
                              : "-"}

                          </span>

                        )}

                      </div>

                    </td>


                    {/* ----------------------------------------------------
                        MOVE TO STAGE
                    ---------------------------------------------------- */}

                    <td>

                      <select
                        className="workflow-move-select"

                        value={
                          candidate.stage
                        }

                        disabled={
                          updatingSubmission
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
                              key={
                                item.id
                              }
                              value={
                                item.id
                              }
                            >

                              {
                                item.label
                              }

                            </option>

                          )
                        )}

                      </select>

                    </td>


                    {/* ----------------------------------------------------
                        ACTIONS
                    ---------------------------------------------------- */}

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


            {/* ------------------------------------------------------------
                EMPTY
            ------------------------------------------------------------ */}

            {!submissionsLoading &&
              !submissionsError &&
              currentCandidates.length ===
              0 && (

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


      {/* ------------------------------------------------------------------
          PREVIOUS / NEXT NAVIGATION
      ------------------------------------------------------------------ */}

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

            ←{" "}

            {
              previousStage.label
            }

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

            {
              nextStage.label
            }

            →

          </button>

        )}

      </div>


      {/* ------------------------------------------------------------------
          TOAST
      ------------------------------------------------------------------ */}

      {toast && (

        <div
          className={`workflow-stage-toast ${toast.type === "error"
            ? "error"
            : ""
            }`}
        >

          {toast.type === "error"
            ? `${toast.name}: ${toast.stage}`
            : `${toast.name} → ${toast.stage}`}

        </div>

      )}


      {/* ------------------------------------------------------------------
          UPDATE ERROR
      ------------------------------------------------------------------ */}

      {updateSubmissionError && (

        <div className="workflow-update-error">

          {updateSubmissionError}

        </div>

      )}

    </div>
  );
}

export default RecruitmentWorkflowDetails;

