// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import "./Job.css";
// import {deleteJob,getAllJobs,getJobById,} from "../../Redux/Slice/jobSlice";
// import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
// import CommonPagination from "../../components/CommonPagination";
// import ManualCreationModal from "./ManualCreationModal";
// import ExcelJS from "exceljs";
// import Toast from "../../Components/Toast";

// function JobPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     jobs,
//     isFetching,
//     isDeleting,
//     error,
//   } = useSelector((state) => state.jobs);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All statuses");
//   const [priorityFilter, setPriorityFilter] =
//     useState("All priorities");

//   const [showDeleteModal, setShowDeleteModal] =
//     useState(false);
//   const [selectedJob, setSelectedJob] =
//     useState(null);

//   const [showManualModal, setShowManualModal] =
//     useState(false);
//   const [editingJob, setEditingJob] =
//     useState(null);
//   const [isLoadingJob, setIsLoadingJob] =
//     useState(false);

//     const [toast, setToast] = useState({
//   show: false,
//   type: "success",
//   message: "",
// });
// const showToast = (type, message) => {
//   setToast({
//     show: true,
//     type,
//     message,
//   });
// };
// const closeToast = () => {
//   setToast((prev) => ({
//     ...prev,
//     show: false,
//   }));
// };

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     dispatch(getAllJobs());
//   }, [dispatch]);

//   const filteredJobs = useMemo(() => {
//     return jobs.filter((job) => {
//       const searchText = search.toLowerCase().trim();

//       const skills = Array.isArray(job.skillsRequired)
//         ? job.skillsRequired.join(" ")
//         : "";

//       const matchesSearch =
//         job.jobId?.toLowerCase().includes(searchText) ||
//         job.id?.toLowerCase().includes(searchText) ||
//         job.title?.toLowerCase().includes(searchText) ||
//         job.clientName?.toLowerCase().includes(searchText) ||
//         job.endClientName?.toLowerCase().includes(searchText) ||
//         job.location?.toLowerCase().includes(searchText) ||
//         skills.toLowerCase().includes(searchText);

//       const matchesStatus =
//         statusFilter === "All statuses" ||
//         job.status === statusFilter;

//       const matchesPriority =
//         priorityFilter === "All priorities" ||
//         job.priority === priorityFilter;

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesPriority
//       );
//     });
//   }, [
//     jobs,
//     search,
//     statusFilter,
//     priorityFilter,
//   ]);

//   // Reset pagination when filters/search change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [
//     search,
//     statusFilter,
//     priorityFilter,
//   ]);

//   // Pagination calculations
//   const totalItems = filteredJobs.length;

//   const totalPages = Math.ceil(
//     totalItems / itemsPerPage
//   );

//   const paginatedJobs = useMemo(() => {
//     const startIndex =
//       (currentPage - 1) * itemsPerPage;

//     const endIndex =
//       startIndex + itemsPerPage;

//     return filteredJobs.slice(
//       startIndex,
//       endIndex
//     );
//   }, [
//     filteredJobs,
//     currentPage,
//   ]);

//   const openJobs = jobs.filter(
//     (job) => job.status === "Open"
//   ).length;

//   const closedJobs = jobs.filter(
//     (job) => job.status === "Closed"
//   ).length;

//   const holdJobs = jobs.filter(
//     (job) =>
//       job.status?.toLowerCase() === "on_hold"
//   ).length;

//   const formatRate = (
//     amount,
//     currency,
//     period
//   ) => {
//     if (
//       amount === null ||
//       amount === undefined
//     ) {
//       return "—";
//     }

//     return `${currency || ""} ${amount}/${period || ""}`;
//   };

// const handleExport = async () => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Jobs");

//   worksheet.columns = [
//     { header: "Role ID", key: "roleId", width: 18,},
//     { header: "Job", key: "job", width: 32,},
//     { header: "Client", key: "client", width: 25,},
//     { header: "End Client", key: "endClient", width: 25,},
//     { header: "Location", key: "location", width: 22,},
//     { header: "Priority", key: "priority", width: 14,},
//     { header: "Status", key: "status", width: 15,},
//   ];

//   filteredJobs.forEach((job) => {
//     worksheet.addRow({
//       roleId: job.jobId || "",
//       job: job.title || "",
//       client: job.clientName || "",
//       endClient: job.endClientName || "",
//       location: job.location || "",
//       priority: job.priority || "",
//       status: formatStatus(job.status),
//     });
//   });

//   const headerRow = worksheet.getRow(1);
//   headerRow.height = 25;

//   headerRow.eachCell((cell) => {
//     cell.font = {name: "Calibri",size: 11,bold: true,color: {  argb: "FF263B57",},};
//     cell.fill = {type: "pattern",pattern: "none",};
//     cell.alignment = {horizontal: "center",vertical: "middle",};
//     cell.border = {
//       top: {
//         style: "thin",
//         color: {argb: "FFD9E1EB",},
//       },
//       bottom: {
//         style: "thin",
//         color: {argb: "FFD9E1EB",},
//       },
//       left: {
//         style: "thin",
//         color: {argb: "FFD9E1EB",},
//       },
//       right: {
//         style: "thin",
//         color: {argb: "FFD9E1EB",},
//       },
//     };
//   });


//   worksheet.eachRow((row, rowNumber) => {
//     if (rowNumber === 1) {
//       return;
//     }

//     row.height = 22;

//     row.eachCell((cell, columnNumber) => {
//       cell.font = {
//         name: "Calibri",
//         size: 11,
//         color: {argb: "FF263B57",},
//       };

//       cell.alignment = {
//         vertical: "middle",
//         horizontal: columnNumber === 1 || columnNumber === 6 || columnNumber === 7   ? "center"   : "left",
//       };

//       cell.border = {
//         top: {
//           style: "thin",
//           color: {argb: "FFE2E6ED",},
//         },
//         bottom: {
//           style: "thin",
//           color: {argb: "FFE2E6ED",},
//         },
//         left: {
//           style: "thin",
//           color: {argb: "FFE2E6ED",},
//         },
//         right: {
//           style: "thin",
//           color: {argb: "FFE2E6ED",},
//         },
//       };
//     });
//   });


//   worksheet.views = [ {state: "frozen",ySplit: 1,},];

//   const buffer = await workbook.xlsx.writeBuffer();

//   const blob = new Blob(
//     [buffer],
//     {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",}
//   );

//   const url =URL.createObjectURL(blob);
//   const link =document.createElement("a");

//   link.href = url;
//   link.download = "jobs.xlsx";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };

//   const handleDeleteClick = (job) => {
//     setSelectedJob(job);
//     setShowDeleteModal(true);
//   };

// const handleDeleteConfirm = async () => {
//   if (!selectedJob?.id) {
//     return;
//   }

//   try {
//     await dispatch(
//       deleteJob(selectedJob.id)
//     ).unwrap();

//     setShowDeleteModal(false);
//     setSelectedJob(null);

//     showToast(
//       "success",
//       "Job deleted successfully."
//     );
//   } catch (error) {
//     console.error("Delete Job Error:", error);

//     showToast(
//       "error",
//       error || "Unable to delete job. Please try again."
//     );
//   }
// };

//   const handleDeleteCancel = () => {
//     setShowDeleteModal(false);
//     setSelectedJob(null);
//   };

// const handleEditJob = async (job) => {
//   try {
//     setIsLoadingJob(true);

//     const response = await dispatch(
//       getJobById(job.id)
//     ).unwrap();

//     setEditingJob(response);
//     setShowManualModal(true);
//   } catch (error) {
//     console.error(
//       "Get Job By ID Error:",
//       error
//     );

//     showToast(
//       "error",
//       error || "Unable to load job. Please try again."
//     );
//   } finally {
//     setIsLoadingJob(false);
//   }
// };

//   const formatStatus = (status) => {
//     if (!status) return "—";

//     if (
//       status.toLowerCase() === "on_hold"
//     ) {
//       return "On hold";
//     }

//     return status;
//   };

//   return (
//     <div className="page job-page">
//       <div className="page-header">
//         <div>
//           <h1 className="page-title">
//             Jobs
//           </h1>

//           <p className="page-subtitle">
//             {openJobs} open roles
//           </p>
//         </div>

//         <div className="page-header-actions">
//           <button
//             className="outline-btn"
//             onClick={handleExport}
//             disabled={isFetching}
//           >
//             <i className="bi bi-download"></i>
//             Export Jobs
//           </button>

//           <button
//             className="primary-btn"
//             onClick={() =>
//               navigate(
//                 "/dashboard/jobs/new"
//               )
//             }
//           >
//             <i className="bi bi-plus-lg"></i>
//             Add job
//           </button>
//         </div>
//       </div>

//       <div className="job-stats">
//         <JobStatCard
//           number={openJobs}
//           label="Open"
//           highlight
//         />

//         <JobStatCard
//           number={closedJobs}
//           label="Closed"
//         />

//         <JobStatCard
//           number={holdJobs}
//           label="Hold"
//         />
//       </div>

//       <div className="job-filter-row">
//         <div className="job-search-box">
//           <span className="job-search-icon">
//             ⌕
//           </span>

//           <input
//             type="text"
//             placeholder="Search job title, Role ID, skills..."
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//           />
//         </div>

//         <select
//           className="job-filter-select"
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(e.target.value)
//           }
//         >
//           <option value="All statuses">
//             All statuses
//           </option>

//           <option value="Open">
//             Open
//           </option>

//           <option value="Closed">
//             Closed
//           </option>

//           <option value="on_hold">
//             On hold
//           </option>
//         </select>

//         <select
//           className="job-filter-select priority-select"
//           value={priorityFilter}
//           onChange={(e) =>
//             setPriorityFilter(e.target.value)
//           }
//         >
//           <option>
//             All priorities
//           </option>

//           <option>
//             High
//           </option>

//           <option>
//             Medium
//           </option>

//           <option>
//             Low
//           </option>
//         </select>
//       </div>

//       {error && (
//         <div className="job-error">
//           {error}
//         </div>
//       )}

//       <div className="job-table-wrapper">
//         <table className="job-table">
//           <thead>
//             <tr>
//               <th>ROLE ID</th>
//               <th>JOB</th>
//               <th>CLIENT</th>
//               <th>END CLIENT</th>
//               <th>LOCATION</th>
//               <th>PRIORITY</th>
//               <th>STATUS</th>
//               <th className="actions-heading">
//                 ACTIONS
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {isFetching ? (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="no-jobs"
//                 >
//                   Loading jobs...
//                 </td>
//               </tr>
//             ) : (
//               paginatedJobs.map((job) => (
//                 <tr key={job.id}>
//                   <td>
//                     <button
//                       className="role-id"
//                       onClick={() =>
//                         navigate(
//                           `/dashboard/jobs/${job.id}`
//                         )
//                       }
//                     >
//                       {job.jobId}
//                     </button>
//                   </td>

//                   <td>
//                     <div className="job-info">
//                       <div className="job-title">
//                         {job.title}
//                       </div>

//                       <div className="job-meta">
//                         {job.jobType}
//                         {" · "}
//                         {job.workMode}
//                         {" · "}
//                         {formatRate(
//                           job.clientRateAmount,
//                           job.clientRateCurrency,
//                           job.clientRatePeriod
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   <td>
//                     <div className="job-client">
//                       {job.clientName}
//                     </div>
//                   </td>

//                   <td>
//                     <div className="job-client">
//                       {job.endClientName ||
//                         "—"}
//                     </div>
//                   </td>

//                   <td>
//                     <div className="job-location">
//                       {job.location}
//                     </div>
//                   </td>

//                   <td>
//                     <span
//                       className={`priority-badge priority-${job.priority?.toLowerCase()}`}
//                     >
//                       {job.priority}
//                     </span>
//                   </td>

//                   <td>
//                     <span
//                       className={`status-badge status-${job.status
//                         ?.toLowerCase()
//                         .replace(
//                           "_",
//                           "-"
//                         )}`}
//                     >
//                       {formatStatus(
//                         job.status
//                       )}
//                     </span>
//                   </td>

//                   <td>
//                     <div className="job-actions">
//                       <button
//                         className="edit-btn"
//                         disabled={
//                           isLoadingJob
//                         }
//                         onClick={() =>
//                           handleEditJob(
//                             job
//                           )
//                         }
//                       >
//                         {isLoadingJob
//                           ? "Loading..."
//                           : "Edit"}
//                       </button>

//                       <button
//                         className="delete-btn"
//                         disabled={
//                           isDeleting
//                         }
//                         onClick={() =>
//                           handleDeleteClick(
//                             job
//                           )
//                         }
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}

//             {!isFetching &&
//               filteredJobs.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="no-jobs"
//                   >
//                     No jobs found.
//                   </td>
//                 </tr>
//               )}
//           </tbody>
//         </table>
//       </div>

//       <CommonPagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalItems={totalItems}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         itemLabel="jobs"
//       />

//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={handleDeleteCancel}
//         onConfirm={handleDeleteConfirm}
//         title="Delete job"
//         itemName={selectedJob?.title}
//         deleteText={
//           isDeleting
//             ? "Deleting..."
//             : "Delete"
//         }
//       />

//       {showManualModal && (
//         <ManualCreationModal
//           title="Edit job"
//           initialData={editingJob}
//           isEdit={true}
//           onClose={() => {
//             setShowManualModal(false);
//             setEditingJob(null);
//           }}
// onSave={(updatedJob) => {
//   console.log(
//     "Updated job:",
//     updatedJob
//   );

//   setShowManualModal(false);
//   setEditingJob(null);

//   showToast(
//     "success",
//     "Job updated successfully."
//   );
// }}
//         />
//       )}
//       <Toast
//   show={toast.show}
//   type={toast.type}
//   message={toast.message}
//   onClose={closeToast}
// />
//     </div>
//   );
// }

// function JobStatCard({
//   number,
//   label,
//   highlight = false,
// }) {
//   return (
//     <div className="job-stat-card">
//       <div
//         className={`job-stat-number ${
//           highlight
//             ? "job-stat-number-highlight"
//             : ""
//         }`}
//       >
//         {number}
//       </div>

//       <div className="job-stat-label">
//         {label}
//       </div>
//     </div>
//   );
// }

// export default JobPage;



import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Job.css";

import {
  deleteJob,
  getAllJobs,
  getJobById,
  getJobFilters,
} from "../../Redux/Slice/jobSlice";

import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import CommonPagination from "../../components/CommonPagination";
import ManualCreationModal from "./ManualCreationModal";
import ExcelJS from "exceljs";
import Toast from "../../Components/Toast";
import JobExportModal from "./JobExportModal";

function JobPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    jobs,
    isFetching,
    isDeleting,
    error,
    pagination,

    // Job filter/header API
    jobFilters,
    isJobFiltersLoading,
    jobFiltersError,
  } = useSelector((state) => state.jobs);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [showManualModal, setShowManualModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  /*
   * =========================================================
   * FETCH JOBS
   * =========================================================
   */

  const fetchJobs = (page = 0) => {
    const params = {
      page: page,
      size: itemsPerPage,
    };

    // Search
    if (search.trim()) {
      params.search = search.trim();
    }

    // Status
    if (statusFilter !== "All statuses") {
      if (statusFilter === "on_hold") {
        params.status = "ON_HOLD";
      } else {
        params.status = statusFilter.toUpperCase();
      }
    }

    // Priority
    if (priorityFilter !== "All priorities") {
      params.priority = priorityFilter.toUpperCase();
    }

    dispatch(getAllJobs(params));
  };

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    fetchJobs(0);

    // Get total/header counts + available filters
    dispatch(getJobFilters());
  }, []);

  /*
   * =========================================================
   * FETCH WHEN SEARCH / FILTER CHANGES
   * =========================================================
   */

  useEffect(() => {
    setCurrentPage(0);
    fetchJobs(0);
  }, [search, statusFilter, priorityFilter]);

  /*
   * =========================================================
   * PAGE CHANGE
   * =========================================================
   */

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchJobs(page);
  };

  /*
   * =========================================================
   * JOB DATA
   * =========================================================
   *
   * Jobs are already paginated/filtered by backend.
   */

  const filteredJobs = useMemo(() => {
    return jobs;
  }, [jobs]);

  /*
   * =========================================================
   * HEADER COUNTS
   * =========================================================
   *
   * IMPORTANT:
   * Do NOT calculate these from `jobs`, because `jobs`
   * contains only the current page.
   *
   * Use the jobheader/jobfilters API instead.
   */

  const totalJobs = jobFilters?.totalJobs ?? 0;
  const openJobs = jobFilters?.totalOpenJobs ?? 0;
  const closedJobs = jobFilters?.totalClosedJobs ?? 0;
  const holdJobs = jobFilters?.totalOnHoldJobs ?? 0;

  /*
   * =========================================================
   * FORMAT RATE
   * =========================================================
   */

  const formatRate = (amount, currency, period) => {
    if (amount === null || amount === undefined) {
      return "—";
    }

    return `${currency || ""} ${amount}/${period || ""}`;
  };

  /*
   * =========================================================
   * FORMAT STATUS
   * =========================================================
   */

  const formatStatus = (status) => {
    if (!status) return "—";

    if (status.toLowerCase() === "on_hold") {
      return "On hold";
    }

    return status;
  };

  /*
   * =========================================================
   * EXPORT
   * =========================================================
   */

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Jobs");

    worksheet.columns = [
      { header: "Role ID", key: "roleId", width: 18 },
      { header: "Job", key: "job", width: 32 },
      { header: "Client", key: "client", width: 25 },
      { header: "End Client", key: "endClient", width: 25 },
      { header: "Location", key: "location", width: 22 },
      { header: "Priority", key: "priority", width: 14 },
      { header: "Status", key: "status", width: 15 },
    ];

    filteredJobs.forEach((job) => {
      worksheet.addRow({
        roleId: job.jobId || "",
        job: job.title || "",
        client: job.clientName || "",
        endClient: job.endClientName || "",
        location: job.location || "",
        priority: job.priority || "",
        status: formatStatus(job.status),
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;

    headerRow.eachCell((cell) => {
      cell.font = {
        name: "Calibri",
        size: 11,
        bold: true,
        color: { argb: "FF263B57" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "none",
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: {
          style: "thin",
          color: { argb: "FFD9E1EB" },
        },
        bottom: {
          style: "thin",
          color: { argb: "FFD9E1EB" },
        },
        left: {
          style: "thin",
          color: { argb: "FFD9E1EB" },
        },
        right: {
          style: "thin",
          color: { argb: "FFD9E1EB" },
        },
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      row.height = 22;

      row.eachCell((cell, columnNumber) => {
        cell.font = {
          name: "Calibri",
          size: 11,
          color: { argb: "FF263B57" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal:
            columnNumber === 1 ||
              columnNumber === 6 ||
              columnNumber === 7
              ? "center"
              : "left",
        };

        cell.border = {
          top: {
            style: "thin",
            color: { argb: "FFE2E6ED" },
          },
          bottom: {
            style: "thin",
            color: { argb: "FFE2E6ED" },
          },
          left: {
            style: "thin",
            color: { argb: "FFE2E6ED" },
          },
          right: {
            style: "thin",
            color: { argb: "FFE2E6ED" },
          },
        };
      });
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "jobs.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob?.id) return;

    try {
      await dispatch(deleteJob(selectedJob.id)).unwrap();

      setShowDeleteModal(false);
      setSelectedJob(null);

      showToast(
        "success",
        "Job deleted successfully."
      );

      // Refresh jobs
      fetchJobs(currentPage);

      // Refresh header counts
      dispatch(getJobFilters());

    } catch (error) {
      console.error("Delete Job Error:", error);

      showToast(
        "error",
        error || "Unable to delete job. Please try again."
      );
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedJob(null);
  };

  /*
   * =========================================================
   * EDIT JOB
   * =========================================================
   */

  const handleEditJob = async (job) => {
    try {
      setIsLoadingJob(true);

      const response =
        await dispatch(getJobById(job.id)).unwrap();

      setEditingJob(response);
      setShowManualModal(true);

    } catch (error) {
      console.error(
        "Get Job By ID Error:",
        error
      );

      showToast(
        "error",
        error || "Unable to load job. Please try again."
      );

    } finally {
      setIsLoadingJob(false);
    }
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <div className="page job-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header">

        <div>
          <h1 className="page-title">
            Jobs
          </h1>

          <p className="page-subtitle">
            {isJobFiltersLoading
              ? "Loading..."
              : `${openJobs} open roles`}
          </p>
        </div>

        <div className="page-header-actions">

<button
  className="outline-btn"
  onClick={() => setShowExportModal(true)}
  disabled={isFetching}
>
  <i className="bi bi-download"></i>
  Export Jobs
</button>

          <button
            className="primary-btn"
            onClick={() =>
              navigate("/dashboard/jobs/new")
            }
          >
            <i className="bi bi-plus-lg"></i>
            Add job
          </button>

        </div>

      </div>


      {/* =====================================================
          JOB STATS
      ===================================================== */}

      <div className="job-stats">

        {/* NEW TOTAL CARD */}
        <JobStatCard
          number={
            isJobFiltersLoading
              ? "..."
              : totalJobs
          }
          label="Total"
        />

        <JobStatCard
          number={
            isJobFiltersLoading
              ? "..."
              : openJobs
          }
          label="Open"
          highlight
        />

        <JobStatCard
          number={
            isJobFiltersLoading
              ? "..."
              : closedJobs
          }
          label="Closed"
        />

        <JobStatCard
          number={
            isJobFiltersLoading
              ? "..."
              : holdJobs
          }
          label="Hold"
        />

      </div>


      {/* =====================================================
          FILTER ROW
      ===================================================== */}

      <div className="job-filter-row">

        {/* SEARCH */}

        <div className="job-search-box">

          <span className="job-search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search job title, Role ID, skills..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* STATUS */}

        <select
          className="job-filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All statuses">
            All statuses
          </option>

          {Array.isArray(jobFilters?.statuses) &&
            jobFilters.statuses.map((status) => (

              <option
                key={status}
                value={
                  status === "On_hold"
                    ? "on_hold"
                    : status
                }
              >
                {status === "On_hold"
                  ? "On hold"
                  : status}
              </option>

            ))}

        </select>


        {/* PRIORITY */}

        <select
          className="job-filter-select priority-select"
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >

          <option value="All priorities">
            All priorities
          </option>

          {Array.isArray(jobFilters?.priorities) &&
            jobFilters.priorities.map((priority) => (

              <option
                key={priority}
                value={priority}
              >
                {priority}
              </option>

            ))}

        </select>

      </div>


      {/* =====================================================
          FILTER API ERROR
      ===================================================== */}

      {jobFiltersError && (
        <div className="job-error">
          {jobFiltersError}
        </div>
      )}


      {/* =====================================================
          JOB API ERROR
      ===================================================== */}

      {error && (
        <div className="job-error">
          {error}
        </div>
      )}


      {/* =====================================================
          JOB TABLE
      ===================================================== */}

      <div className="job-table-wrapper">

        <table className="job-table">

          <thead>
            <tr>
              <th>ROLE ID</th>
              <th>JOB</th>
              <th>CLIENT</th>
              <th>END CLIENT</th>
              <th>LOCATION</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th className="actions-heading">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>

            {isFetching ? (

              <tr>
                <td
                  colSpan="8"
                  className="no-jobs"
                >
                  Loading jobs...
                </td>
              </tr>

            ) : (

              filteredJobs.map((job) => (

                <tr key={job.id}>

                  {/* ROLE ID */}

                  <td>

                    <button
                      className="role-id"
                      onClick={() =>
                        navigate(
                          `/dashboard/jobs/${job.id}`
                        )
                      }
                    >
                      {job.jobId}
                    </button>

                  </td>


                  {/* JOB */}

                  <td>

                    <div className="job-info">

                      <div className="job-title">
                        {job.title}
                      </div>

                      <div className="job-meta">
                        {job.jobType}
                        {" · "}
                        {job.workMode}
                        {" · "}
                        {formatRate(
                          job.clientRateAmount,
                          job.clientRateCurrency,
                          job.clientRatePeriod
                        )}
                      </div>

                    </div>

                  </td>


                  {/* CLIENT */}

                  <td>
                    <div className="job-client">
                      {job.clientName}
                    </div>
                  </td>


                  {/* END CLIENT */}

                  <td>
                    <div className="job-client">
                      {job.endClientName || "—"}
                    </div>
                  </td>


                  {/* LOCATION */}

                  <td>
                    <div className="job-location">
                      {job.location}
                    </div>
                  </td>


                  {/* PRIORITY */}

                  <td>

                    <span
                      className={`priority-badge priority-${job.priority?.toLowerCase()}`}
                    >
                      {job.priority}
                    </span>

                  </td>


                  {/* STATUS */}

                  <td>

                    <span
                      className={`status-badge status-${job.status
                        ?.toLowerCase()
                        .replace("_", "-")}`}
                    >
                      {formatStatus(job.status)}
                    </span>

                  </td>


                  {/* ACTIONS */}

                  <td>

                    <div className="job-actions">

                      <button
                        className="edit-btn"
                        disabled={isLoadingJob}
                        onClick={() =>
                          handleEditJob(job)
                        }
                      >
                        {isLoadingJob
                          ? "Loading..."
                          : "Edit"}
                      </button>

                      <button
                        className="delete-btn"
                        disabled={isDeleting}
                        onClick={() =>
                          handleDeleteClick(job)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}


            {/* NO JOBS */}

            {!isFetching &&
              filteredJobs.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    className="no-jobs"
                  >
                    No jobs found.
                  </td>

                </tr>

              )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <CommonPagination
        currentPage={
          pagination.currentPage + 1 || 1
        }
        totalPages={
          pagination.totalPages || 0
        }
        totalItems={
          pagination.totalElements || 0
        }
        itemsPerPage={itemsPerPage}
        onPageChange={(page) =>
          handlePageChange(page - 1)
        }
        itemLabel="jobs"
      />


      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete job"
        itemName={selectedJob?.title}
        deleteText={
          isDeleting
            ? "Deleting..."
            : "Delete"
        }
      />


      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showManualModal && (

        <ManualCreationModal
          title="Edit job"
          initialData={editingJob}
          isEdit={true}

          onClose={() => {
            setShowManualModal(false);
            setEditingJob(null);
          }}

          onSave={(updatedJob) => {

            console.log(
              "Updated job:",
              updatedJob
            );

            setShowManualModal(false);
            setEditingJob(null);

            showToast(
              "success",
              "Job updated successfully."
            );

            // Refresh jobs
            fetchJobs(currentPage);

            // Refresh header counts
            dispatch(getJobFilters());

          }}

        />

      )}


      {/* =====================================================
          TOAST
      ===================================================== */}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />
<JobExportModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
/>
    </div>
  );
}


/*
 * =========================================================
 * JOB STAT CARD
 * =========================================================
 */

function JobStatCard({
  number,
  label,
  highlight = false,
}) {
  return (
    <div className="job-stat-card">

      <div
        className={`job-stat-number ${highlight
            ? "job-stat-number-highlight"
            : ""
          }`}
      >
        {number}
      </div>

      <div className="job-stat-label">
        {label}
      </div>

    </div>
  );
}

export default JobPage;

