// import React, {
//     useEffect,
//     useMemo,
//     useState,
// } from "react";

// import {
//     useDispatch,
//     useSelector,
// } from "react-redux";

// import "./candidate.css";

// import CandidateModal from "../Candidate/CandidateModal";

// import {
//     getAllCandidates,
//     getAllEmployees,
//     addCandidate,
//     updateCandidate,
//     deleteCandidate,
//     exportCandidates,
// } from "../../Redux/Slice/candidateSlice";
// import * as XLSX from "xlsx";

// import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
// import { useNavigate } from "react-router-dom";
// const Candidates = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const {
//         candidates = [],
//         employees = [],
//         loading,
//         employeesLoading,
//         adding,
//         error,
//         employeeError,
//         exportingCandidates,
//     } = useSelector(
//         (state) => state.candidate
//     );
//     const [searchTerm, setSearchTerm] =
//         useState("");

//     const [showModal, setShowModal] =
//         useState(false);

//     const [modalMode, setModalMode] =
//         useState("add");

//     const [selectedCandidate, setSelectedCandidate] =
//         useState(null);

//     const [statusFilter, setStatusFilter] =
//         useState("All statuses");

//     const [localStatuses, setLocalStatuses] =
//         useState({});
//     const [showDeleteModal, setShowDeleteModal] =
//         useState(false);

//     const [candidateToDelete, setCandidateToDelete] =
//         useState(null);

//     const [deleting, setDeleting] =
//         useState(false);
//     const [notification, setNotification] = useState({
//         show: false,
//         type: "",
//         message: "",
//     });

//     const [exportFromDate, setExportFromDate] =
//         useState("");

//     const [exportToDate, setExportToDate] =
//         useState("");

//     const [exportStatus, setExportStatus] =
//         useState("");
//     const [showFilterModal, setShowFilterModal] = useState(false);

//     const [tempStatusFilter, setTempStatusFilter] =
//         useState(statusFilter);

//     const [showExportModal, setShowExportModal] = useState(false);

//     useEffect(() => {

//         dispatch(getAllCandidates());

//         dispatch(getAllEmployees());

//     }, [dispatch]);

//     const showNotification = (type, message) => {
//         setNotification({
//             show: true,
//             type,
//             message,
//         });

//         setTimeout(() => {
//             setNotification({
//                 show: false,
//                 type: "",
//                 message: "",
//             });
//         }, 3000);
//     };
//     const getStatusColor = (status) => {

//         switch (status) {

//             case "Active":
//                 return "#138f67";

//             case "Inactive":
//                 return "#6b6f78";

//             case "Blacklisted":
//                 return "#c33443";

//             default:
//                 return "#6b6f78";
//         }
//     };


//     const getStatusBgColor = (status) => {

//         switch (status) {

//             case "Active":
//                 return "#e7f8ef";

//             case "Inactive":
//                 return "#f1f3f5";

//             case "Blacklisted":
//                 return "#fff0f2";

//             default:
//                 return "#f1f3f5";
//         }
//     };

//     const getCandidateStatus = (candidate) => {

//         return (
//             localStatuses[candidate.id] ??
//             candidate.status ??
//             "Active"
//         );
//     };


//     const handleStatusChange = async (
//         candidate,
//         newStatus
//     ) => {

//         const previousStatus =
//             getCandidateStatus(candidate);

//         if (previousStatus === newStatus) {
//             return;
//         }
//         setLocalStatuses((previous) => ({
//             ...previous,
//             [candidate.id]: newStatus,
//         }));


//         try {

//             console.log(
//                 "UPDATING CANDIDATE STATUS:",
//                 {
//                     id: candidate.id,
//                     status: newStatus,
//                 }
//             );

//             await dispatch(
//                 updateCandidate({
//                     id: candidate.id,

//                     candidateData: {
//                         status: newStatus,
//                     },
//                 })
//             ).unwrap();


//             console.log(
//                 "Candidate status updated successfully:",
//                 newStatus
//             );
//             dispatch(
//                 getAllCandidates()
//             );


//         } catch (error) {

//             console.error(
//                 "STATUS UPDATE ERROR:",
//                 error
//             );

//             setLocalStatuses((previous) => ({
//                 ...previous,
//                 [candidate.id]: previousStatus,
//             }));
//             showNotification(
//                 "error",
//                 typeof error === "string"
//                     ? error
//                     : "Failed to update candidate status"
//             );
//         }
//     };

//     const handleCandidateClick = (candidate) => {

//         if (!candidate?.id) {
//             console.error("Candidate ID is missing");
//             return;
//         }

//         navigate(
//             `/dashboard/candidates/${candidate.id}`
//         );
//     };
//     const handleDelete = (candidate) => {

//         if (!candidate?.id) {
//             console.error("Candidate ID is missing");
//             return;
//         }

//         setCandidateToDelete(candidate);
//         setShowDeleteModal(true);
//     };

//     const handleConfirmDelete = async () => {

//         if (!candidateToDelete?.id) {
//             return;
//         }

//         try {

//             setDeleting(true);

//             console.log(
//                 "DELETING CANDIDATE:",
//                 candidateToDelete.id
//             );


//             await dispatch(
//                 deleteCandidate(
//                     candidateToDelete.id
//                 )
//             ).unwrap();
//             setLocalStatuses((previous) => {

//                 const updated = {
//                     ...previous,
//                 };

//                 delete updated[
//                     candidateToDelete.id
//                 ];

//                 return updated;
//             });
//             setShowDeleteModal(false);
//             setCandidateToDelete(null);
//             await dispatch(
//                 getAllCandidates()
//             ).unwrap();


//             console.log(
//                 "Candidate deleted successfully"
//             );

//         } catch (error) {

//             console.error(
//                 "DELETE CANDIDATE ERROR:",
//                 error
//             );

//         } finally {

//             setDeleting(false);
//         }
//     };
//     const handleAddClick = () => {

//         setModalMode("add");

//         setSelectedCandidate(null);

//         setShowModal(true);
//     };

//     const handleEditClick = (candidate) => {

//         setModalMode("edit");

//         setSelectedCandidate(candidate);

//         setShowModal(true);
//     };

//     const handleApplications = (id) => {

//         if (!id) {
//             console.error("Candidate ID is missing");
//             return;
//         }

//         navigate(
//             `/dashboard/candidates/${id}?tab=Applications`
//         );
//     };

//     const handleSave = async (data) => {
//         const isNull = (value) => value === null;

//         const candidateData = {
//             fullName: data.fullName,
//             currentDesignation: data.designation,
//             cvOwnerId: data.cvOwnerId,
//             referredBy: data.referredBy,
//             referenceNote: data.referenceNote,
//             email: data.email,
//             phone: data.phone,
//             whatsapp: data.whatsapp,
//             nationality: data.nationality,
//             location: data.currentLocation,
//             currentEmployer: data.currentCompany,
//             experienceYears: isNull(data.experience)
//                 ? null
//                 : data.experience === ""
//                     ? ""
//                     : Number(data.experience),

//             skills: isNull(data.primarySkills)
//                 ? null
//                 : data.primarySkills
//                     ? data.primarySkills
//                         .split(",")
//                         .map((skill) => skill.trim())
//                         .filter(Boolean)
//                     : [],

//             noticePeriodDays: isNull(data.noticePeriod)
//                 ? null
//                 : data.noticePeriod === ""
//                     ? ""
//                     : Number(data.noticePeriod),

//             visaStatus: data.visaStatus,

//             source: data.source,

//             linkedinUrl: data.linkedinUrl,

//             status: data.candidateStatus,

//             education: data.education,

//             currentSalaryAmount: isNull(data.currentRateAmount)
//                 ? null
//                 : data.currentRateAmount === ""
//                     ? ""
//                     : Number(data.currentRateAmount),

//             currentSalaryCurrency: data.currentRateCurrency,

//             currentSalaryPeriod: data.currentRatePeriod,

//             expectedSalaryAmount: isNull(data.dayRateAmount)
//                 ? null
//                 : data.dayRateAmount === ""
//                     ? ""
//                     : Number(data.dayRateAmount),

//             expectedSalaryCurrency: data.dayRateCurrency,

//             expectedSalaryPeriod: data.dayRatePeriod,
//         };

//         console.log("FINAL CANDIDATE PAYLOAD:", candidateData);

//         try {
//             if (modalMode === "add") {
//                 await dispatch(
//                     addCandidate({
//                         candidateData,
//                         originalCV: data.originalCV,
//                         troyCV: data.troyCV,
//                     })
//                 ).unwrap();

//                 showNotification(
//                     "success",
//                     "Candidate added successfully"
//                 );
//             } else if (modalMode === "edit") {
//                 if (!selectedCandidate?.id) {
//                     showNotification(
//                         "error",
//                         "Candidate ID is missing"
//                     );
//                     return;
//                 }

//                 console.log(
//                     "UPDATING CANDIDATE ID:",
//                     selectedCandidate.id
//                 );

//                 await dispatch(
//                     updateCandidate({
//                         id: selectedCandidate.id,
//                         candidateData,
//                         originalCV: data.originalCV,
//                         troyCV: data.troyCV,
//                     })
//                 ).unwrap();

//                 showNotification(
//                     "success",
//                     "Candidate updated successfully"
//                 );
//             }

//             setShowModal(false);
//             setSelectedCandidate(null);

//             dispatch(getAllCandidates());
//         } catch (error) {
//             console.error(
//                 modalMode === "edit"
//                     ? "UPDATE CANDIDATE ERROR:"
//                     : "ADD CANDIDATE ERROR:",
//                 error
//             );

//             showNotification(
//                 "error",
//                 typeof error === "string"
//                     ? error
//                     : modalMode === "edit"
//                         ? "Failed to update candidate"
//                         : "Failed to add candidate"
//             );
//         }
//     };

//     const handleOpenFilterModal = () => {
//         setTempStatusFilter(statusFilter);
//         setShowFilterModal(true);
//     };

//     const handleApplyFilter = () => {
//         setStatusFilter(tempStatusFilter);
//         setShowFilterModal(false);
//     };

//     const handleClearFilter = () => {
//         setTempStatusFilter("All statuses");
//         setStatusFilter("All statuses");
//         setShowFilterModal(false);
//     };

//     const filteredCandidates = useMemo(() => {

//         const search =
//             searchTerm
//                 .trim()
//                 .toLowerCase();


//         return candidates.filter(
//             (candidate) => {

//                 const currentStatus =
//                     getCandidateStatus(candidate);


//                 const skillsText =
//                     Array.isArray(candidate.skills)
//                         ? candidate.skills.join(" ")
//                         : "";


//                 const searchMatch = [

//                     candidate.fullName,

//                     candidate.cvId,

//                     candidate.currentDesignation,

//                     candidate.location,

//                     candidate.cvOwnerName,

//                     candidate.email,

//                     candidate.phone,

//                     candidate.currentEmployer,

//                     candidate.source,

//                     skillsText,

//                 ]
//                     .filter(Boolean)
//                     .some((value) =>
//                         String(value)
//                             .toLowerCase()
//                             .includes(search)
//                     );


//                 const statusMatch =
//                     statusFilter === "All statuses" ||
//                     currentStatus === statusFilter;


//                 return (
//                     searchMatch &&
//                     statusMatch
//                 );
//             }
//         );

//     }, [
//         candidates,
//         searchTerm,
//         statusFilter,
//         localStatuses,
//     ]);
//     const total =
//         candidates.length;


//     const active =
//         candidates.filter(
//             (candidate) =>
//                 getCandidateStatus(candidate) ===
//                 "Active"
//         ).length;


//     const inactive =
//         candidates.filter(
//             (candidate) =>
//                 getCandidateStatus(candidate) ===
//                 "Inactive"
//         ).length;


//     const blacklisted =
//         candidates.filter(
//             (candidate) =>
//                 getCandidateStatus(candidate) ===
//                 "Blacklisted"
//         ).length;
//     if (loading) {

//         return (
//             <div className="page">

//                 <div className="candidates-header">

//                     <div>

//                         <h1>
//                             Candidates
//                         </h1>

//                         <p className="candidates-subtitle">
//                             Loading candidates...
//                         </p>

//                     </div>

//                 </div>

//             </div>
//         );
//     }
//     if (error && candidates.length === 0) {

//         return (
//             <div className="page">

//                 <div className="candidates-header">

//                     <div>

//                         <h1>
//                             Candidates
//                         </h1>

//                         <p className="candidates-subtitle">
//                             Unable to load candidates
//                         </p>

//                     </div>

//                 </div>


//                 <div
//                     style={{
//                         padding: "20px",
//                         color: "#c33443",
//                         background: "#fff0f2",
//                         borderRadius: "8px",
//                     }}
//                 >
//                     {error}
//                 </div>


//                 <button
//                     className="candidates-add-btn"
//                     style={{
//                         marginTop: "15px",
//                     }}
//                     onClick={() =>
//                         dispatch(
//                             getAllCandidates()
//                         )
//                     }
//                 >
//                     Retry
//                 </button>

//             </div>
//         );
//     }

//     const handleExportCandidates = () => {
//         try {
//             let exportData = [...candidates];

//             // -----------------------------------------
//             // STATUS FILTER
//             // -----------------------------------------
//             if (exportStatus) {
//                 exportData = exportData.filter((candidate) => {
//                     const status = getCandidateStatus(candidate);

//                     return status === exportStatus;
//                 });
//             }

//             // -----------------------------------------
//             // DATE FILTER
//             // -----------------------------------------
//             if (exportFromDate || exportToDate) {
//                 exportData = exportData.filter((candidate) => {
//                     /*
//                      * Change this field if your candidate API
//                      * uses another date field.
//                      */
//                     const candidateDate =
//                         candidate.createdAt ||
//                         candidate.createdDate ||
//                         candidate.createdOn;

//                     if (!candidateDate) {
//                         return false;
//                     }

//                     const date = new Date(candidateDate);

//                     if (Number.isNaN(date.getTime())) {
//                         return false;
//                     }

//                     // From date
//                     if (exportFromDate) {
//                         const fromDate = new Date(
//                             `${exportFromDate}T00:00:00`
//                         );

//                         if (date < fromDate) {
//                             return false;
//                         }
//                     }

//                     // To date
//                     if (exportToDate) {
//                         const toDate = new Date(
//                             `${exportToDate}T23:59:59`
//                         );

//                         if (date > toDate) {
//                             return false;
//                         }
//                     }

//                     return true;
//                 });
//             }

//             // -----------------------------------------
//             // CHECK EMPTY RESULT
//             // -----------------------------------------
//             if (exportData.length === 0) {
//                 showNotification(
//                     "error",
//                     "No candidates found for the selected filters"
//                 );

//                 return;
//             }

//             // -----------------------------------------
//             // FORMAT EXCEL DATA
//             // -----------------------------------------
//             const excelData = exportData.map((candidate) => ({
//                 "CV ID":
//                     candidate.cvId || "-",

//                 "Candidate Name":
//                     candidate.fullName || "-",

//                 "Designation":
//                     candidate.currentDesignation || "-",

//                 "Status":
//                     getCandidateStatus(candidate),

//                 "Owner / Recruiter":
//                     candidate.cvOwnerName || "-",

//                 "Email":
//                     candidate.email || "-",

//                 "Phone":
//                     candidate.phone || "-",

//                 "WhatsApp":
//                     candidate.whatsapp || "-",

//                 "Location":
//                     candidate.location || "-",

//                 "Nationality":
//                     candidate.nationality || "-",

//                 "Current Employer":
//                     candidate.currentEmployer || "-",

//                 "Experience (Years)":
//                     candidate.experienceYears ?? "-",

//                 "Skills":
//                     Array.isArray(candidate.skills)
//                         ? candidate.skills.join(", ")
//                         : "-",

//                 "Notice Period (Days)":
//                     candidate.noticePeriodDays ?? "-",

//                 "Visa Status":
//                     candidate.visaStatus || "-",

//                 "Source":
//                     candidate.source || "-",

//                 "LinkedIn":
//                     candidate.linkedinUrl || "-",

//                 "Education":
//                     candidate.education || "-",

//                 "Current Salary":
//                     candidate.currentSalaryAmount ?? "-",

//                 "Current Salary Currency":
//                     candidate.currentSalaryCurrency || "-",

//                 "Current Salary Period":
//                     candidate.currentSalaryPeriod || "-",

//                 "Expected Salary":
//                     candidate.expectedSalaryAmount ?? "-",

//                 "Expected Salary Currency":
//                     candidate.expectedSalaryCurrency || "-",

//                 "Expected Salary Period":
//                     candidate.expectedSalaryPeriod || "-",

//                 "Created Date":
//                     candidate.createdAt
//                         ? new Date(candidate.createdAt).toLocaleDateString()
//                         : "-",
//             }));

//             // -----------------------------------------
//             // CREATE WORKSHEET
//             // -----------------------------------------
//             const worksheet =
//                 XLSX.utils.json_to_sheet(excelData);

//             // -----------------------------------------
//             // AUTO COLUMN WIDTH
//             // -----------------------------------------
//             const columnWidths = Object.keys(excelData[0]).map(
//                 (key) => ({
//                     wch: Math.max(
//                         key.length,
//                         ...excelData.map((row) =>
//                             String(row[key] ?? "").length
//                         )
//                     ) + 2,
//                 })
//             );

//             worksheet["!cols"] = columnWidths;

//             // -----------------------------------------
//             // CREATE WORKBOOK
//             // -----------------------------------------
//             const workbook =
//                 XLSX.utils.book_new();

//             XLSX.utils.book_append_sheet(
//                 workbook,
//                 worksheet,
//                 "Candidates"
//             );

//             // -----------------------------------------
//             // FILE NAME
//             // -----------------------------------------
//             const today =
//                 new Date()
//                     .toISOString()
//                     .split("T")[0];

//             const fileName =
//                 `Candidates_${today}.xlsx`;

//             // -----------------------------------------
//             // DOWNLOAD
//             // -----------------------------------------
//             XLSX.writeFile(
//                 workbook,
//                 fileName
//             );

//             showNotification(
//                 "success",
//                 `${exportData.length} candidate${exportData.length !== 1 ? "s" : ""} exported successfully`
//             );

//             setShowExportModal(false);

//         } catch (error) {
//             console.error(
//                 "FRONTEND EXPORT ERROR:",
//                 error
//             );

//             showNotification(
//                 "error",
//                 "Failed to export candidates"
//             );
//         }
//     };
//     return (

//         <div className="page">

//             {/* HEADER */}

//             <div className="candidates-header">

//                 <div>

//                     <h1>
//                         Candidates
//                     </h1>

//                     <p className="candidates-subtitle">
//                         {total} candidates in your database
//                     </p>

//                 </div>


//                 <div className="candidates-header-actions">
//                     <button
//                         type="button"
//                         className="candidates-export-btn"
//                         onClick={() => setShowExportModal(true)}
//                     >
//                         <i className="fas fa-download"></i>
//                         Export Excel
//                     </button>


//                     <button
//                         className="candidates-add-btn"
//                         onClick={handleAddClick}
//                     >
//                         <i className="fas fa-plus"></i>
//                         {" "}Add candidate
//                     </button>

//                 </div>

//             </div>


//             {/* STATS */}

//             <div className="candidates-stats-grid">

//                 <div className="candidate-stat-card">

//                     <div className="candidate-stat-value">
//                         {total}
//                     </div>

//                     <div className="candidate-stat-label">
//                         Total
//                     </div>

//                 </div>


//                 <div className="candidate-stat-card">

//                     <div className="candidate-stat-value">
//                         {active}
//                     </div>

//                     <div className="candidate-stat-label">
//                         Active
//                     </div>

//                 </div>


//                 <div className="candidate-stat-card">

//                     <div className="candidate-stat-value">
//                         {inactive}
//                     </div>

//                     <div className="candidate-stat-label">
//                         Inactive
//                     </div>

//                 </div>


//                 <div className="candidate-stat-card">

//                     <div className="candidate-stat-value">
//                         {blacklisted}
//                     </div>

//                     <div className="candidate-stat-label">
//                         Blacklisted
//                     </div>

//                 </div>

//             </div>

//             <div className="candidates-search-filter">

//                 <div className="candidates-search-wrapper">

//                     <i className="fas fa-search"></i>

//                     <input
//                         type="text"
//                         placeholder="Search name, CV ID, owner, skills..."
//                         value={searchTerm}
//                         onChange={(e) =>
//                             setSearchTerm(
//                                 e.target.value
//                             )
//                         }
//                     />

//                 </div>


//                 <div className="candidates-filter-wrapper">

//                     <select
//                         className="candidates-status-filter"
//                         value={statusFilter}
//                         onChange={(e) =>
//                             setStatusFilter(
//                                 e.target.value
//                             )
//                         }
//                     >

//                         <option value="All statuses">
//                             All statuses
//                         </option>

//                         <option value="Active">
//                             Active
//                         </option>

//                         <option value="Inactive">
//                             Inactive
//                         </option>

//                         <option value="Blacklisted">
//                             Blacklisted
//                         </option>

//                     </select>


//                     <i className="fas fa-chevron-down filter-arrow"></i>

//                 </div>

//             </div>

//             <div className="candidates-table-wrapper">

//                 <table className="candidates-table">

//                     <thead>

//                         <tr>

//                             <th>
//                                 CV ID
//                             </th>

//                             <th>
//                                 CANDIDATE
//                             </th>

//                             <th>
//                                 CANDIDATE STATUS
//                             </th>

//                             <th>
//                                 OWNER · RECRUITER
//                             </th>

//                             <th>
//                                 ACTIONS
//                             </th>

//                         </tr>

//                     </thead>


//                     <tbody>

//                         {filteredCandidates.map(
//                             (candidate) => {

//                                 const status =
//                                     getCandidateStatus(
//                                         candidate
//                                     );


//                                 return (

//                                     <tr
//                                         key={candidate.id}
//                                     >

//                                         <td className="candidate-cv-id">

//                                             {candidate.cvId ||
//                                                 "-"}

//                                         </td>


//                                         <td>

//                                             <div
//                                                 className="candidate-name"
//                                                 onClick={() =>
//                                                     handleCandidateClick(candidate)
//                                                 }
//                                                 style={{
//                                                     cursor: "pointer",
//                                                 }}
//                                             >
//                                                 {candidate.fullName || "-"}
//                                             </div>


//                                             <div className="candidate-details">

//                                                 {candidate.currentDesignation ||
//                                                     "-"}

//                                                 {" · "}

//                                                 {candidate.location ||
//                                                     "-"}

//                                             </div>

//                                         </td>


//                                         <td>

//                                             <div className="candidate-status-wrapper">

//                                                 <span
//                                                     className="candidate-status-dot"
//                                                     style={{
//                                                         backgroundColor:
//                                                             getStatusColor(
//                                                                 status
//                                                             ),
//                                                     }}
//                                                 ></span>


//                                                 <select
//                                                     className="candidate-status-select"
//                                                     value={status}
//                                                     onChange={(e) =>
//                                                         handleStatusChange(
//                                                             candidate,
//                                                             e.target.value
//                                                         )
//                                                     }
//                                                     style={{
//                                                         backgroundColor:
//                                                             getStatusBgColor(
//                                                                 status
//                                                             ),
//                                                         color:
//                                                             getStatusColor(
//                                                                 status
//                                                             ),
//                                                     }}
//                                                 >

//                                                     <option value="Active">
//                                                         Active
//                                                     </option>

//                                                     <option value="Inactive">
//                                                         Inactive
//                                                     </option>

//                                                     <option value="Blacklisted">
//                                                         Blacklisted
//                                                     </option>

//                                                 </select>

//                                             </div>

//                                         </td>


//                                         <td className="candidate-owner">

//                                             {candidate.cvOwnerName ||
//                                                 "-"}

//                                         </td>


//                                         <td>

//                                             <div className="candidate-actions">

//                                                 <button
//                                                     className="candidate-action-btn"
//                                                     onClick={() =>
//                                                         handleApplications(
//                                                             candidate.id
//                                                         )
//                                                     }
//                                                 >
//                                                     Applications
//                                                 </button>


//                                                 <button
//                                                     className="candidate-action-btn"
//                                                     onClick={() =>
//                                                         handleEditClick(
//                                                             candidate
//                                                         )
//                                                     }
//                                                 >
//                                                     Edit
//                                                 </button>


//                                                 <button
//                                                     className="candidate-action-btn candidate-delete-btn"
//                                                     onClick={() =>
//                                                         handleDelete(
//                                                             candidate
//                                                         )
//                                                     }
//                                                 >
//                                                     Delete
//                                                 </button>

//                                             </div>

//                                         </td>

//                                     </tr>

//                                 );
//                             }
//                         )}


//                         {filteredCandidates.length === 0 && (

//                             <tr>

//                                 <td
//                                     colSpan="5"
//                                     className="candidates-empty-state"
//                                 >

//                                     <div>

//                                         <i className="fas fa-users"></i>

//                                         <strong>
//                                             No candidates found
//                                         </strong>

//                                         <span>
//                                             Try adjusting your search or filter
//                                         </span>

//                                     </div>

//                                 </td>

//                             </tr>

//                         )}

//                     </tbody>

//                 </table>

//             </div>

//             {/* NOTIFICATION */}

//             {notification.show && (
//                 <div
//                     className={`candidate-notification candidate-notification-${notification.type}`}
//                 >
//                     <div className="candidate-notification-icon">
//                         {notification.type === "success" && (
//                             <i className="fas fa-check"></i>
//                         )}

//                         {notification.type === "error" && (
//                             <i className="fas fa-times"></i>
//                         )}

//                         {notification.type === "info" && (
//                             <i className="fas fa-info"></i>
//                         )}
//                     </div>

//                     <span>
//                         {notification.message}
//                     </span>

//                     <button
//                         type="button"
//                         onClick={() =>
//                             setNotification({
//                                 show: false,
//                                 type: "",
//                                 message: "",
//                             })
//                         }
//                     >
//                         <i className="fas fa-times"></i>
//                     </button>
//                 </div>
//             )}
//             {/* MODAL */}

//             {showModal && (

//                 <CandidateModal
//                     mode={modalMode}
//                     initialData={selectedCandidate}
//                     employees={employees}
//                     employeesLoading={employeesLoading}
//                     employeeError={employeeError}
//                     adding={adding}
//                     onClose={() =>
//                         setShowModal(false)
//                     }
//                     onSave={handleSave}
//                 />

//             )}

//             {/* EXPORT EXCEL MODAL */}

//             {showExportModal && (
//                 <div
//                     className="candidate-filter-modal-overlay"
//                     onClick={() => setShowExportModal(false)}
//                 >
//                     <div
//                         className="candidate-filter-modal candidate-export-modal"
//                         onClick={(e) => e.stopPropagation()}
//                     >

//                         {/* HEADER */}

//                         <div className="candidate-filter-modal-header">

//                             <div>
//                                 <h3>
//                                     Export Candidates
//                                 </h3>

//                                 <p>
//                                     Select the filters you want to use for the Excel export.
//                                 </p>
//                             </div>

//                             <button
//                                 type="button"
//                                 className="candidate-filter-close-btn"
//                                 onClick={() => setShowExportModal(false)}
//                             >
//                                 <i className="fas fa-times"></i>
//                             </button>

//                         </div>


//                         {/* BODY */}

//                         <div className="candidate-filter-modal-body">

//                             {/* FROM DATE */}

//                             <div className="candidate-filter-field">

//                                 <label>
//                                     From Date
//                                 </label>

//                                 <input
//                                     type="date"
//                                     value={exportFromDate}
//                                     onChange={(e) =>
//                                         setExportFromDate(e.target.value)
//                                     }
//                                 />

//                             </div>


//                             {/* TO DATE */}

//                             <div
//                                 className="candidate-filter-field"
//                                 style={{ marginTop: "18px" }}
//                             >

//                                 <label>
//                                     To Date
//                                 </label>

//                                 <input
//                                     type="date"
//                                     value={exportToDate}
//                                     onChange={(e) =>
//                                         setExportToDate(e.target.value)
//                                     }
//                                 />

//                             </div>


//                             {/* STATUS */}

//                             <div
//                                 className="candidate-filter-field"
//                                 style={{ marginTop: "18px" }}
//                             >

//                                 <label>
//                                     Candidate Status
//                                 </label>

//                                 <select
//                                     value={exportStatus}
//                                     onChange={(e) =>
//                                         setExportStatus(e.target.value)
//                                     }
//                                 >

//                                     <option value="">
//                                         All statuses
//                                     </option>

//                                     <option value="Active">
//                                         Active
//                                     </option>

//                                     <option value="Inactive">
//                                         Inactive
//                                     </option>

//                                     <option value="Blacklisted">
//                                         Blacklisted
//                                     </option>

//                                 </select>

//                             </div>

//                         </div>


//                         {/* FOOTER */}

//                         <div className="candidate-filter-modal-footer">

//                             <button
//                                 type="button"
//                                 className="candidate-filter-clear-btn"
//                                 onClick={() => {
//                                     setExportFromDate("");
//                                     setExportToDate("");
//                                     setExportStatus("");
//                                 }}
//                             >
//                                 Clear
//                             </button>


//                             <button
//                                 type="button"
//                                 className="candidate-filter-cancel-btn"
//                                 onClick={() => setShowExportModal(false)}
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="button"
//                                 className="candidate-filter-apply-btn"
//                                 onClick={handleExportCandidates}
//                             >
//                                 <i className="fas fa-download"></i>
//                                 Export Excel
//                             </button>

//                         </div>

//                     </div>
//                 </div>
//             )}
//             {/* DELETE CONFIRMATION MODAL */}

//             <DeleteConfirmationModal
//                 isOpen={showDeleteModal}

//                 onClose={() => {

//                     if (deleting) {
//                         return;
//                     }
//                     setShowDeleteModal(false);
//                     setCandidateToDelete(null);
//                 }}
//                 onConfirm={handleConfirmDelete}
//                 title="Delete candidate"
//                 itemName={
//                     candidateToDelete?.fullName || ""
//                 }
//                 deleteText={
//                     deleting
//                         ? "Deleting..."
//                         : "Delete"
//                 }
//                 cancelText="Cancel"
//             />

//         </div>
//     );
// };


// export default Candidates;





import React, {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import "./candidate.css";

import CandidateModal from "../Candidate/CandidateModal";

import {
    getAllCandidates,
    getAllEmployees,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    getCandidateFilters,
    exportCandidates,
} from "../../Redux/Slice/candidateSlice";

import * as XLSX from "xlsx";

import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";

import CommonPagination from "../../Components/CommonPagination";


const Candidates = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    /* =========================================================
       REDUX
    ========================================================= */

const {
    candidates = [],
    employees = [],
    loading,
    employeesLoading,
    adding,
    error,
    employeeError,
    pagination = {},
        exportingCandidates,
    exportCandidatesError,

    candidateFilters = {
        totalCandidates: 0,
        totalActiveCandidates: 0,
        totalInActiveCandidates: 0,
        totalBackListedCandidates: 0,
        statusList: [],
    },
} = useSelector(
    (state) => state.candidate
);


    /* =========================================================
       PAGINATION
    ========================================================= */

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    const totalPages =
        pagination?.totalPages || 0;

    const totalItems =
        pagination?.totalElements || 0;


    /* =========================================================
       SEARCH
    ========================================================= */

    const [searchTerm, setSearchTerm] =
        useState("");

    const [searchInput, setSearchInput] =
        useState("");


    /* =========================================================
       STATUS
    ========================================================= */

    const [statusFilter, setStatusFilter] =
        useState("All statuses");


    /* =========================================================
       MODAL
    ========================================================= */

    const [showModal, setShowModal] =
        useState(false);

    const [modalMode, setModalMode] =
        useState("add");

    const [selectedCandidate, setSelectedCandidate] =
        useState(null);


    /* =========================================================
       LOCAL STATUS
    ========================================================= */

    const [localStatuses, setLocalStatuses] =
        useState({});


    /* =========================================================
       DELETE
    ========================================================= */

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [candidateToDelete, setCandidateToDelete] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);


    /* =========================================================
       NOTIFICATION
    ========================================================= */

    const [notification, setNotification] =
        useState({
            show: false,
            type: "",
            message: "",
        });


    /* =========================================================
       EXPORT
    ========================================================= */

    const [exportFromDate, setExportFromDate] =
        useState("");

    const [exportToDate, setExportToDate] =
        useState("");

    const [exportStatus, setExportStatus] =
        useState("");

    const [showExportModal, setShowExportModal] =
        useState(false);


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

useEffect(() => {
    dispatch(
        getAllCandidates({
            page: 0,
            size: itemsPerPage,
        })
    );

    dispatch(
        getAllEmployees()
    );

    dispatch(
        getCandidateFilters()
    );
}, [dispatch]);


    /* =========================================================
       FETCH CANDIDATES
       BACKEND HANDLES PAGINATION
    ========================================================= */

useEffect(() => {

    const status =
        statusFilter === "All statuses"
            ? undefined
            : statusFilter;

    dispatch(
        getAllCandidates({
            page: currentPage - 1,
            size: itemsPerPage,
            search: searchTerm,
            status,
        })
    );

}, [
    dispatch,
    currentPage,
    searchTerm,
    statusFilter,
]);


    /* =========================================================
       SEARCH HANDLER
    ========================================================= */

    const handleSearch = (value) => {

        setSearchInput(value);

        /*
         * Whenever search changes,
         * go back to first backend page.
         */
        setCurrentPage(1);

        setSearchTerm(value);
    };


    /* =========================================================
       PAGE CHANGE
    ========================================================= */

    const handlePageChange = (page) => {

        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        setCurrentPage(page);
    };


    /* =========================================================
       NOTIFICATION
    ========================================================= */

    const showNotification = (
        type,
        message
    ) => {

        setNotification({
            show: true,
            type,
            message,
        });

        setTimeout(() => {

            setNotification({
                show: false,
                type: "",
                message: "",
            });

        }, 3000);
    };


    /* =========================================================
       STATUS COLORS
    ========================================================= */

    const getStatusColor = (status) => {

        switch (status) {

            case "Active":
                return "#138f67";

            case "Inactive":
                return "#6b6f78";

            case "Blacklisted":
                return "#c33443";

            default:
                return "#6b6f78";
        }
    };


    const getStatusBgColor = (status) => {

        switch (status) {

            case "Active":
                return "#e7f8ef";

            case "Inactive":
                return "#f1f3f5";

            case "Blacklisted":
                return "#fff0f2";

            default:
                return "#f1f3f5";
        }
    };


    /* =========================================================
       GET CANDIDATE STATUS
    ========================================================= */

    const getCandidateStatus = (
        candidate
    ) => {

        return (
            localStatuses[candidate.id] ??
            candidate.status ??
            "Active"
        );
    };


    /* =========================================================
       STATUS CHANGE
    ========================================================= */

    const handleStatusChange = async (
        candidate,
        newStatus
    ) => {

        const previousStatus =
            getCandidateStatus(candidate);

        if (
            previousStatus === newStatus
        ) {
            return;
        }

        setLocalStatuses(
            (previous) => ({
                ...previous,
                [candidate.id]: newStatus,
            })
        );

        try {

            await dispatch(
                updateCandidate({
                    id: candidate.id,

                    candidateData: {
                        status: newStatus,
                    },
                })
            ).unwrap();


            showNotification(
                "success",
                "Candidate status updated successfully"
            );


            /*
             * Refresh the current backend page.
             */
const status =
    statusFilter === "All statuses"
        ? undefined
        : statusFilter;

await dispatch(
    getAllCandidates({
        page: currentPage - 1,
        size: itemsPerPage,
        search: searchTerm,
        status,
    })
).unwrap();

        } catch (error) {

            setLocalStatuses(
                (previous) => ({
                    ...previous,
                    [candidate.id]:
                        previousStatus,
                })
            );

            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : "Failed to update candidate status"
            );
        }
    };


    /* =========================================================
       CANDIDATE DETAILS
    ========================================================= */

    const handleCandidateClick = (
        candidate
    ) => {

        if (!candidate?.id) {
            console.error(
                "Candidate ID is missing"
            );
            return;
        }

        navigate(
            `/dashboard/candidates/${candidate.id}`
        );
    };


    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = (
        candidate
    ) => {

        if (!candidate?.id) {
            console.error(
                "Candidate ID is missing"
            );
            return;
        }

        setCandidateToDelete(candidate);

        setShowDeleteModal(true);
    };


    const handleConfirmDelete = async () => {

        if (!candidateToDelete?.id) {
            return;
        }

        try {

            setDeleting(true);

            await dispatch(
                deleteCandidate(
                    candidateToDelete.id
                )
            ).unwrap();


            setLocalStatuses(
                (previous) => {

                    const updated = {
                        ...previous,
                    };

                    delete updated[
                        candidateToDelete.id
                    ];

                    return updated;
                }
            );


            setShowDeleteModal(false);

            setCandidateToDelete(null);


            /*
             * Refresh current backend page.
             */
const status =
    statusFilter === "All statuses"
        ? undefined
        : statusFilter;

await dispatch(
    getAllCandidates({
        page: currentPage - 1,
        size: itemsPerPage,
        search: searchTerm,
        status,
    })
).unwrap();


            showNotification(
                "success",
                "Candidate deleted successfully"
            );

        } catch (error) {

            console.error(
                "DELETE CANDIDATE ERROR:",
                error
            );

            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : "Failed to delete candidate"
            );

        } finally {

            setDeleting(false);
        }
    };


    /* =========================================================
       ADD
    ========================================================= */

    const handleAddClick = () => {

        setModalMode("add");

        setSelectedCandidate(null);

        setShowModal(true);
    };


    /* =========================================================
       EDIT
    ========================================================= */

    const handleEditClick = (
        candidate
    ) => {

        setModalMode("edit");

        setSelectedCandidate(candidate);

        setShowModal(true);
    };


    /* =========================================================
       APPLICATIONS
    ========================================================= */

    const handleApplications = (
        id
    ) => {

        if (!id) {
            console.error(
                "Candidate ID is missing"
            );
            return;
        }

        navigate(
            `/dashboard/candidates/${id}?tab=Applications`
        );
    };


    /* =========================================================
       SAVE CANDIDATE
    ========================================================= */

    const handleSave = async (
        data
    ) => {

        const isNull = (
            value
        ) => value === null;


        const candidateData = {

            fullName:
                data.fullName,

            currentDesignation:
                data.designation,

            cvOwnerId:
                data.cvOwnerId,

            referredBy:
                data.referredBy,

            referenceNote:
                data.referenceNote,

            email:
                data.email,

            phone:
                data.phone,

            whatsapp:
                data.whatsapp,

            nationality:
                data.nationality,

            location:
                data.currentLocation,

            currentEmployer:
                data.currentCompany,

            experienceYears:
                isNull(data.experience)
                    ? null
                    : data.experience === ""
                        ? ""
                        : Number(
                            data.experience
                        ),

            skills:
                isNull(data.primarySkills)
                    ? null
                    : data.primarySkills
                        ? data.primarySkills
                            .split(",")
                            .map(
                                (skill) =>
                                    skill.trim()
                            )
                            .filter(Boolean)
                        : [],

            noticePeriodDays:
                isNull(
                    data.noticePeriod
                )
                    ? null
                    : data.noticePeriod === ""
                        ? ""
                        : Number(
                            data.noticePeriod
                        ),

            visaStatus:
                data.visaStatus,

            source:
                data.source,

            linkedinUrl:
                data.linkedinUrl,

            status:
                data.candidateStatus,

            education:
                data.education,

            currentSalaryAmount:
                isNull(
                    data.currentRateAmount
                )
                    ? null
                    : data.currentRateAmount === ""
                        ? ""
                        : Number(
                            data.currentRateAmount
                        ),

            currentSalaryCurrency:
                data.currentRateCurrency,

            currentSalaryPeriod:
                data.currentRatePeriod,

            expectedSalaryAmount:
                isNull(
                    data.dayRateAmount
                )
                    ? null
                    : data.dayRateAmount === ""
                        ? ""
                        : Number(
                            data.dayRateAmount
                        ),

            expectedSalaryCurrency:
                data.dayRateCurrency,

            expectedSalaryPeriod:
                data.dayRatePeriod,
        };


        try {

            if (
                modalMode === "add"
            ) {

                await dispatch(
                    addCandidate({
                        candidateData,
                        originalCV:
                            data.originalCV,
                        troyCV:
                            data.troyCV,
                    })
                ).unwrap();


                showNotification(
                    "success",
                    "Candidate added successfully"
                );

            } else if (
                modalMode === "edit"
            ) {

                if (
                    !selectedCandidate?.id
                ) {

                    showNotification(
                        "error",
                        "Candidate ID is missing"
                    );

                    return;
                }


                await dispatch(
                    updateCandidate({
                        id:
                            selectedCandidate.id,

                        candidateData,

                        originalCV:
                            data.originalCV,

                        troyCV:
                            data.troyCV,
                    })
                ).unwrap();


                showNotification(
                    "success",
                    "Candidate updated successfully"
                );
            }


            setShowModal(false);

            setSelectedCandidate(null);


            /*
             * Refresh the same backend page.
             */
const status =
    statusFilter === "All statuses"
        ? undefined
        : statusFilter;

dispatch(
    getAllCandidates({
        page: currentPage - 1,
        size: itemsPerPage,
        search: searchTerm,
        status,
    })
);

        } catch (error) {

            console.error(
                modalMode === "edit"
                    ? "UPDATE CANDIDATE ERROR:"
                    : "ADD CANDIDATE ERROR:",
                error
            );


            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : modalMode === "edit"
                        ? "Failed to update candidate"
                        : "Failed to add candidate"
            );
        }
    };


    /* =========================================================
       STATUS FILTER
    ========================================================= */

    const handleStatusFilterChange = (
        value
    ) => {

        setCurrentPage(1);

        setStatusFilter(value);
    };


    /* =========================================================
       STAT COUNTS
       
       IMPORTANT:
       Since backend is paginated, candidates only contains
       the CURRENT PAGE.

       Therefore these counts are page counts unless backend
       separately provides global counts.
    ========================================================= */

const total =
    candidateFilters?.totalCandidates ?? 0;

const active =
    candidateFilters?.totalActiveCandidates ?? 0;

const inactive =
    candidateFilters?.totalInActiveCandidates ?? 0;

const blacklisted =
    candidateFilters?.totalBackListedCandidates ?? 0;


    /* =========================================================
       EXPORT
    ========================================================= */

const handleExportCandidates = async () => {
    try {
        /*
         * Call backend export API.
         *
         * If filters are empty, an empty object is sent
         * and backend exports all candidates.
         */
        const result = await dispatch(
            exportCandidates({
                fromDate:
                    exportFromDate || null,

                toDate:
                    exportToDate || null,

                status:
                    exportStatus || null,
            })
        ).unwrap();

        /*
         * Backend returns:
         *
         * {
         *     blob,
         *     fileName
         * }
         */

        if (!result?.blob) {
            throw new Error(
                "Export file was not returned by the server"
            );
        }

        /*
         * Create temporary browser URL
         * for the Excel blob.
         */
        const url =
            window.URL.createObjectURL(
                result.blob
            );

        /*
         * Create temporary download link.
         */
        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            result.fileName ||
            "candidates.xlsx";

        document.body.appendChild(
            link
        );

        /*
         * Start download.
         */
        link.click();

        /*
         * Cleanup.
         */
        link.remove();

        window.URL.revokeObjectURL(
            url
        );

        /*
         * Close export modal.
         */
        setShowExportModal(false);

        /*
         * Success notification.
         */
        showNotification(
            "success",
            "Candidates exported successfully"
        );

    } catch (error) {
        console.error(
            "EXPORT CANDIDATES ERROR:",
            error
        );

        showNotification(
            "error",
            typeof error === "string"
                ? error
                : "Failed to export candidates"
        );
    }
};


    /* =========================================================
       LOADING
    ========================================================= */

    if (
        loading &&
        candidates.length === 0
    ) {

        return (

            <div className="page">

                <div className="candidates-header">

                    <div>

                        <h1>
                            Candidates
                        </h1>

                        <p className="candidates-subtitle">
                            Loading candidates...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (
        error &&
        candidates.length === 0
    ) {

        return (

            <div className="page">

                <div className="candidates-header">

                    <div>

                        <h1>
                            Candidates
                        </h1>

                        <p className="candidates-subtitle">
                            Unable to load candidates
                        </p>

                    </div>

                </div>


                <div
                    style={{
                        padding: "20px",
                        color: "#c33443",
                        background: "#fff0f2",
                        borderRadius: "8px",
                    }}
                >
                    {error}
                </div>


                <button
                    className="candidates-add-btn"
                    style={{
                        marginTop: "15px",
                    }}
                    onClick={() => {

const status =
    statusFilter === "All statuses"
        ? undefined
        : statusFilter;

dispatch(
    getAllCandidates({
        page: currentPage - 1,
        size: itemsPerPage,
        search: searchTerm,
        status,
    })
);
                    }}
                >
                    Retry
                </button>

            </div>
        );
    }


    return (

        <div className="page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="candidates-header">

                <div>

                    <h1>
                        Candidates
                    </h1>

                    <p className="candidates-subtitle">
                        {total} candidates in your database
                    </p>

                </div>


                <div className="candidates-header-actions">

                    <button
                        type="button"
                        className="candidates-export-btn"
                        onClick={() =>
                            setShowExportModal(true)
                        }
                    >
                        <i className="fas fa-download"></i>
                        Export Excel
                    </button>


                    <button
                        className="candidates-add-btn"
                        onClick={
                            handleAddClick
                        }
                    >
                        <i className="fas fa-plus"></i>
                        {" "}
                        Add candidate
                    </button>

                </div>

            </div>


            {/* =================================================
                STATS
            ================================================= */}

            <div className="candidates-stats-grid">

                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {total}
                    </div>

                    <div className="candidate-stat-label">
                        Total
                    </div>

                </div>


                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {active}
                    </div>

                    <div className="candidate-stat-label">
                        Active
                    </div>

                </div>


                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {inactive}
                    </div>

                    <div className="candidate-stat-label">
                        Inactive
                    </div>

                </div>


                <div className="candidate-stat-card">

                    <div className="candidate-stat-value">
                        {blacklisted}
                    </div>

                    <div className="candidate-stat-label">
                        Blacklisted
                    </div>

                </div>

            </div>


            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <div className="candidates-search-filter">

                <div className="candidates-search-wrapper">

                    <i className="fas fa-search"></i>

                    <input
                        type="text"
                        placeholder="Search name, CV ID, owner, skills..."
                        value={searchInput}
                        onChange={(e) =>
                            handleSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="candidates-filter-wrapper">
<select
    className="candidates-status-filter"
    value={statusFilter}
    onChange={(e) =>
        handleStatusFilterChange(e.target.value)
    }
>
    <option value="All statuses">
        All statuses
    </option>

    {candidateFilters?.statusList?.map((status) => (
        <option
            key={status}
            value={status}
        >
            {status}
        </option>
    ))}
</select>

                    <i className="fas fa-chevron-down filter-arrow"></i>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="candidates-table-wrapper">

                <table className="candidates-table">

                    <thead>

                        <tr>

                            <th>
                                CV ID
                            </th>

                            <th>
                                CANDIDATE
                            </th>

                            <th>
                                CANDIDATE STATUS
                            </th>

                            <th>
                                OWNER · RECRUITER
                            </th>

                            <th>
                                ACTIONS
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {candidates.map(
                            (candidate) => {

                                const status =
                                    getCandidateStatus(
                                        candidate
                                    );


                                return (

                                    <tr
                                        key={
                                            candidate.id
                                        }
                                    >

                                        <td className="candidate-cv-id">

                                            {candidate.cvId ||
                                                "-"}

                                        </td>


                                        <td>

                                            <div
                                                className="candidate-name"
                                                onClick={() =>
                                                    handleCandidateClick(
                                                        candidate
                                                    )
                                                }
                                                style={{
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >

                                                {candidate.fullName ||
                                                    "-"}

                                            </div>


                                            <div className="candidate-details">

                                                {candidate.currentDesignation ||
                                                    "-"}

                                                {" · "}

                                                {candidate.location ||
                                                    "-"}

                                            </div>

                                        </td>


                                        <td>

                                            <div className="candidate-status-wrapper">

                                                <span
                                                    className="candidate-status-dot"
                                                    style={{
                                                        backgroundColor:
                                                            getStatusColor(
                                                                status
                                                            ),
                                                    }}
                                                ></span>


                                                <select
                                                    className="candidate-status-select"
                                                    value={
                                                        status
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleStatusChange(
                                                            candidate,
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            getStatusBgColor(
                                                                status
                                                            ),
                                                        color:
                                                            getStatusColor(
                                                                status
                                                            ),
                                                    }}
                                                >

                                                    <option value="Active">
                                                        Active
                                                    </option>

                                                    <option value="Inactive">
                                                        Inactive
                                                    </option>

                                                    <option value="Blacklisted">
                                                        Blacklisted
                                                    </option>

                                                </select>

                                            </div>

                                        </td>


                                        <td className="candidate-owner">

                                            {candidate.cvOwnerName ||
                                                "-"}

                                        </td>


                                        <td>

                                            <div className="candidate-actions">

                                                <button
                                                    className="candidate-action-btn"
                                                    onClick={() =>
                                                        handleApplications(
                                                            candidate.id
                                                        )
                                                    }
                                                >
                                                    Applications
                                                </button>


                                                <button
                                                    className="candidate-action-btn"
                                                    onClick={() =>
                                                        handleEditClick(
                                                            candidate
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="candidate-action-btn candidate-delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            candidate
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );
                            }
                        )}


                        {candidates.length === 0 && (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="candidates-empty-state"
                                >

                                    <div>

                                        <i className="fas fa-users"></i>

                                        <strong>
                                            No candidates found
                                        </strong>

                                        <span>
                                            Try adjusting your search or filter
                                        </span>

                                    </div>

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* =================================================
                BACKEND PAGINATION
            ================================================= */}

            <CommonPagination
                currentPage={
                    currentPage
                }
                totalPages={
                    totalPages
                }
                totalItems={
                    totalItems
                }
                itemsPerPage={
                    itemsPerPage
                }
                onPageChange={
                    handlePageChange
                }
                itemLabel="candidates"
            />


            {/* =================================================
                NOTIFICATION
            ================================================= */}

            {notification.show && (

                <div
                    className={`candidate-notification candidate-notification-${notification.type}`}
                >

                    <div className="candidate-notification-icon">

                        {notification.type ===
                            "success" && (
                                <i className="fas fa-check"></i>
                            )}

                        {notification.type ===
                            "error" && (
                                <i className="fas fa-times"></i>
                            )}

                        {notification.type ===
                            "info" && (
                                <i className="fas fa-info"></i>
                            )}

                    </div>


                    <span>
                        {notification.message}
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            setNotification({
                                show: false,
                                type: "",
                                message: "",
                            })
                        }
                    >
                        <i className="fas fa-times"></i>
                    </button>

                </div>

            )}


            {/* =================================================
                CANDIDATE MODAL
            ================================================= */}

            {showModal && (

                <CandidateModal
                    mode={
                        modalMode
                    }

                    initialData={
                        selectedCandidate
                    }

                    employees={
                        employees
                    }

                    employeesLoading={
                        employeesLoading
                    }

                    employeeError={
                        employeeError
                    }

                    adding={
                        adding
                    }

                    onClose={() =>
                        setShowModal(false)
                    }

                    onSave={
                        handleSave
                    }
                />

            )}


            {/* =================================================
                EXPORT MODAL
            ================================================= */}

            {showExportModal && (

                <div
                    className="candidate-filter-modal-overlay"
                    onClick={() =>
                        setShowExportModal(
                            false
                        )
                    }
                >

                    <div
                        className="candidate-filter-modal candidate-export-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="candidate-filter-modal-header">

                            <div>

                                <h3>
                                    Export Candidates
                                </h3>

                                <p>
                                    Select the filters you want to use for the Excel export.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="candidate-filter-close-btn"
                                onClick={() =>
                                    setShowExportModal(
                                        false
                                    )
                                }
                            >
                                <i className="fas fa-times"></i>
                            </button>

                        </div>


                        <div className="candidate-filter-modal-body">

                            <div className="candidate-filter-field">

                                <label>
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        exportFromDate
                                    }
                                    onChange={(e) =>
                                        setExportFromDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div
                                className="candidate-filter-field"
                                style={{
                                    marginTop:
                                        "18px",
                                }}
                            >

                                <label>
                                    To Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        exportToDate
                                    }
                                    onChange={(e) =>
                                        setExportToDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div
                                className="candidate-filter-field"
                                style={{
                                    marginTop:
                                        "18px",
                                }}
                            >

                                <label>
                                    Candidate Status
                                </label>

                                <select
                                    value={
                                        exportStatus
                                    }
                                    onChange={(e) =>
                                        setExportStatus(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All statuses
                                    </option>

                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                    <option value="Blacklisted">
                                        Blacklisted
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="candidate-filter-modal-footer">

                            <button
                                type="button"
                                className="candidate-filter-clear-btn"
                                onClick={() => {

                                    setExportFromDate(
                                        ""
                                    );

                                    setExportToDate(
                                        ""
                                    );

                                    setExportStatus(
                                        ""
                                    );
                                }}
                            >
                                Clear
                            </button>


                            <button
                                type="button"
                                className="candidate-filter-cancel-btn"
                                onClick={() =>
                                    setShowExportModal(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="candidate-filter-apply-btn"
                                onClick={
                                    handleExportCandidates
                                }
                            >

                                <i className="fas fa-download"></i>

                                Export Excel

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            <DeleteConfirmationModal
                isOpen={
                    showDeleteModal
                }

                onClose={() => {

                    if (deleting) {
                        return;
                    }

                    setShowDeleteModal(
                        false
                    );

                    setCandidateToDelete(
                        null
                    );
                }}

                onConfirm={
                    handleConfirmDelete
                }

                title="Delete candidate"

                itemName={
                    candidateToDelete?.fullName ||
                    ""
                }

                deleteText={
                    deleting
                        ? "Deleting..."
                        : "Delete"
                }

                cancelText="Cancel"
            />

        </div>
    );
};


export default Candidates;