// import { useEffect, useMemo, useState } from "react";
// import "./Dashboard.css";
// import "flag-icons/css/flag-icons.min.css";
// import { useDispatch, useSelector } from "react-redux";
// import { getDashboardSummary } from "../../Redux/Slice/dashboardSlice";
// import { switchRole } from "../../Redux/Slice/roleSlice";

// function Dashboard() {
//   const dispatch = useDispatch();

//   const {
//     user,
//     activeRole,
//     roles = [],
//   } = useSelector(
//     (state) => state.auth || {}
//   );

//   const {
//     summary,
//     loading: dashboardLoading,
//     error: dashboardError,
//   } = useSelector(
//     (state) => state.dashboard || {}
//   );

//   const [showCandidateModal, setShowCandidateModal] =
//     useState(false);

//   const [currentTime, setCurrentTime] =
//     useState(new Date());

//   const [selectedRoleId, setSelectedRoleId] =
//     useState(activeRole?.id || "");

//   const [switchingRole, setSwitchingRole] =
//     useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     dispatch(getDashboardSummary());
//   }, [dispatch]);

//   useEffect(() => {
//     const refreshTimer = setInterval(() => {
//       dispatch(getDashboardSummary());
//     }, 30000);

//     return () => clearInterval(refreshTimer);
//   }, [dispatch]);

//   const normalizedRoles = useMemo(() => {
//     return (roles || [])
//       .map((roleItem) => {
//         const id =
//           roleItem?.id ||
//           roleItem?.roleId ||
//           roleItem?.role?.id;

//         const name =
//           roleItem?.name ||
//           roleItem?.roleName ||
//           roleItem?.role?.name;

//         if (!id || !name) {
//           return null;
//         }

//         return {
//           id,
//           name,
//         };
//       })
//       .filter(Boolean);
//   }, [roles]);

//   useEffect(() => {
//     if (activeRole?.id) {
//       setSelectedRoleId(activeRole.id);
//     }
//   }, [activeRole?.id]);

//   const currentRole = normalizedRoles.find(
//     (roleItem) =>
//       String(roleItem.id) ===
//       String(selectedRoleId)
//   );

//   const currentRoleName =
//     activeRole?.id &&
//     String(activeRole.id) ===
//       String(selectedRoleId)
//       ? activeRole?.name
//       : currentRole?.name;

//   const role =
//     currentRoleName ||
//     activeRole?.name ||
//     user?.role ||
//     "";

//   const handleRoleChange = async (event) => {
//     const newRoleId = event.target.value;

//     if (
//       !newRoleId ||
//       String(newRoleId) ===
//         String(selectedRoleId)
//     ) {
//       return;
//     }

//     const previousRoleId =
//       selectedRoleId;

//     const selectedRole =
//       normalizedRoles.find(
//         (roleItem) =>
//           String(roleItem.id) ===
//           String(newRoleId)
//       );

//     try {
//       setSwitchingRole(true);

//       const response = await dispatch(
//         switchRole(newRoleId)
//       ).unwrap();

//       console.log(
//         "Dashboard role switch response:",
//         response
//       );

//       const newAccessToken =
//         response?.accessToken ||
//         response?.data?.accessToken;

//       const newRefreshToken =
//         response?.refreshToken ||
//         response?.data?.refreshToken;

//       const newActiveRole =
//         response?.activeRole ||
//         response?.data?.activeRole ||
//         selectedRole;

//       if (newAccessToken) {
//         localStorage.setItem(
//           "accessToken",
//           newAccessToken
//         );
//       }

//       if (newRefreshToken) {
//         localStorage.setItem(
//           "refreshToken",
//           newRefreshToken
//         );
//       }

//       if (newActiveRole) {
//         dispatch(
//           setActiveRole(newActiveRole)
//         );
//       }

//       setSelectedRoleId(newRoleId);

//       dispatch(getDashboardSummary());
//     } catch (error) {
//       console.error(
//         "Dashboard role switch failed:",
//         error
//       );

//       setSelectedRoleId(
//         previousRoleId
//       );
//     } finally {
//       setSwitchingRole(false);
//     }
//   };

//   const dashboardSummary = summary || {};

//   const {
//     totalCandidates = 0,
//     openJobs = 0,
//     activeClients = 0,
//     totalInterviewsToday = 0,
//     totalCvSubmissionPending = 0,
//     totalOffersPending = 0,
//     totalJoiningToday = 0,
//     totalUrgentRoles = 0,
//     totalClientFeedbackPending = 0,
//     totalOfferAwaitingCandidateResponse = 0,
//     earliestInterview = null,
//     todayInterviews = [],
//     candidatesNotConfirmed = [],
//   } = dashboardSummary;

//   const summaryCards = [
//     {
//       title: "Total candidates",
//       value: totalCandidates,
//       icon: "bi-people-fill",
//       iconClass: "blue-icon",
//     },
//     {
//       title: "Open jobs",
//       value: openJobs,
//       icon: "bi-briefcase-fill",
//       iconClass: "blue-icon",
//     },
//     {
//       title: "Active clients",
//       value: activeClients,
//       icon: "bi-building-fill",
//       iconClass: "blue-icon",
//     },
//   ];

//   const timeZones = [
//     {
//       country: "India",
//       code: "IN",
//       timezone: "IST",
//       ianaTimezone: "Asia/Kolkata",
//     },
//     {
//       country: "United Kingdom",
//       code: "GB",
//       timezone: "UK",
//       ianaTimezone: "Europe/London",
//     },
//     {
//       country: "Qatar · Middle East",
//       code: "QA",
//       timezone: "AST",
//       ianaTimezone: "Asia/Qatar",
//     },
//   ];

//   const formatTime = (timeZone) => {
//     return new Intl.DateTimeFormat(
//       "en-US",
//       {
//         timeZone,
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true,
//       }
//     ).format(currentTime);
//   };

//   const formatDate = (timeZone) => {
//     return new Intl.DateTimeFormat(
//       "en-US",
//       {
//         timeZone,
//         weekday: "short",
//         month: "short",
//         day: "2-digit",
//         year: "numeric",
//       }
//     ).format(currentTime);
//   };

//   const getInterviewDateTime = (
//     interview
//   ) => {
//     if (
//       !interview?.interviewDate ||
//       !interview?.interviewTime
//     ) {
//       return null;
//     }

//     const dateTimeString =
//       `${interview.interviewDate}T${interview.interviewTime}`;

//     const date = new Date(
//       dateTimeString
//     );

//     if (
//       Number.isNaN(date.getTime())
//     ) {
//       return null;
//     }

//     return date;
//   };

//   const formatCountdown = (
//     interview
//   ) => {
//     const interviewDateTime =
//       getInterviewDateTime(interview);

//     if (!interviewDateTime) {
//       return "--:--";
//     }

//     const difference =
//       interviewDateTime.getTime() -
//       currentTime.getTime();

//     if (difference <= 0) {
//       return "Started";
//     }

//     const totalSeconds =
//       Math.floor(
//         difference / 1000
//       );

//     const days = Math.floor(
//       totalSeconds /
//         (24 * 60 * 60)
//     );

//     const hours = Math.floor(
//       (totalSeconds %
//         (24 * 60 * 60)) /
//         (60 * 60)
//     );

//     const minutes = Math.floor(
//       (totalSeconds %
//         (60 * 60)) /
//         60
//     );

//     const seconds =
//       totalSeconds % 60;

//     if (days > 0) {
//       return `${days}d ${String(
//         hours
//       ).padStart(2, "0")}h`;
//     }

//     if (hours > 0) {
//       return `${String(
//         hours
//       ).padStart(
//         2,
//         "0"
//       )}:${String(
//         minutes
//       ).padStart(
//         2,
//         "0"
//       )}:${String(
//         seconds
//       ).padStart(
//         2,
//         "0"
//       )}`;
//     }

//     return `${String(
//       minutes
//     ).padStart(
//       2,
//       "0"
//     )}:${String(
//       seconds
//     ).padStart(
//       2,
//       "0"
//     )}`;
//   };

//   const formatInterviewTime = (
//     interview
//   ) => {
//     if (!interview?.interviewTime) {
//       return "--";
//     }

//     const date = new Date(
//       `1970-01-01T${interview.interviewTime}`
//     );

//     if (
//       Number.isNaN(date.getTime())
//     ) {
//       return interview.interviewTime;
//     }

//     return new Intl.DateTimeFormat(
//       "en-US",
//       {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       }
//     ).format(date);
//   };

//   const statusCards = [
//     {
//       icon: "bi-fire",
//       value: totalInterviewsToday,
//       title: "Interviews today",
//       subtitle:
//         totalInterviewsToday === 0
//           ? "No interviews scheduled"
//           : "scheduled for today",
//       active:
//         totalInterviewsToday > 0,
//     },
//     {
//       icon: "bi-file-earmark-text-fill",
//       value: totalCvSubmissionPending,
//       title: "CVs pending",
//       subtitle: "to submit",
//       active:
//         totalCvSubmissionPending > 0,
//     },
//     {
//       icon: "bi-chat-left-text-fill",
//       value:
//         totalClientFeedbackPending,
//       title: "Client feedback",
//       subtitle: "pending",
//       active:
//         totalClientFeedbackPending > 0,
//     },
//     {
//       icon: "bi-briefcase-fill",
//       value: totalOffersPending,
//       title: "Offers pending",
//       subtitle:
//         totalOfferAwaitingCandidateResponse >
//         0
//           ? `${totalOfferAwaitingCandidateResponse} awaiting reply`
//           : "awaiting reply",
//       active:
//         totalOffersPending > 0,
//     },
//     {
//       icon: "bi-rocket-takeoff-fill",
//       value: totalJoiningToday,
//       title: "Joining today",
//       subtitle: "",
//       active:
//         totalJoiningToday > 0,
//     },
//     {
//       icon: "bi-exclamation-triangle-fill",
//       value: totalUrgentRoles,
//       title: "Urgent Roles",
//       subtitle: "High Priority",
//       active:
//         totalUrgentRoles > 0,
//     },
//   ];

//   const todaysInterviews = useMemo(() => {
//     const interviews =
//       (todayInterviews || []).map(
//         (interview, index) => ({
//           ...interview,

//           id: `${interview.interviewDate || ""}-${interview.interviewTime || ""}-${interview.candidateName || index}`,

//           time:
//             formatInterviewTime(
//               interview
//             ),

//           name:
//             interview.candidateName ||
//             "Unknown Candidate",

//           role:
//             interview.jobName ||
//             "Job not specified",

//           company:
//             interview.skillName || "",

//           platform:
//             interview.interviewType ||
//             "Interview",

//           interviewer:
//             interview.interviewerName ||
//             "Not assigned",

//           countdown:
//             formatCountdown(
//               interview
//             ),

//           status:
//             interview.interviewStatus ===
//             "Completed"
//               ? "completed"
//               : interview.interviewStatus ===
//                 "Cancelled"
//               ? "cancelled"
//               : "upcoming",
//         })
//       );

//     return interviews.sort(
//       (a, b) => {
//         const getTimeInSeconds =
//           (time) => {
//             if (!time) {
//               return Number.MAX_SAFE_INTEGER;
//             }

//             const match =
//               String(time).match(
//                 /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
//               );

//             if (!match) {
//               return Number.MAX_SAFE_INTEGER;
//             }

//             const hours =
//               Number(match[1]);

//             const minutes =
//               Number(match[2]);

//             const seconds =
//               Number(match[3] || 0);

//             return (
//               hours * 60 * 60 +
//               minutes * 60 +
//               seconds
//             );
//           };

//         return (
//           getTimeInSeconds(
//             a.interviewTime
//           ) -
//           getTimeInSeconds(
//             b.interviewTime
//           )
//         );
//       }
//     );
//   }, [
//     todayInterviews,
//     currentTime,
//   ]);

//   const nextInterview =
//     todaysInterviews.length > 0
//       ? todaysInterviews[0]
//       : null;

//   const attentionItems = useMemo(() => {
//     const items = [];

//     if (nextInterview) {
//       const countdown =
//         nextInterview.countdown;

//       if (
//         countdown !== "Started" &&
//         countdown !== "--:--"
//       ) {
//         items.push({
//           text: `Interview in ${countdown} — ${
//             nextInterview.name ||
//             "Candidate"
//           }`,
//           type: "danger",
//         });
//       }
//     }

//     if (
//       Array.isArray(
//         candidatesNotConfirmed
//       ) &&
//       candidatesNotConfirmed.length > 0
//     ) {
//       candidatesNotConfirmed.forEach(
//         (candidate) => {
//           const candidateName =
//             typeof candidate === "string"
//               ? candidate
//               : candidate?.candidateName ||
//                 candidate?.name ||
//                 "Candidate";

//           items.push({
//             text: `Candidate not confirmed — ${candidateName}`,
//             type: "warning",
//           });
//         }
//       );
//     }

//     if (
//       totalCvSubmissionPending > 0
//     ) {
//       items.push({
//         text: `${totalCvSubmissionPending} CV${
//           totalCvSubmissionPending >
//           1
//             ? "s"
//             : ""
//         } pending submission`,
//         type: "danger",
//       });
//     }

//     if (
//       totalOfferAwaitingCandidateResponse >
//       0
//     ) {
//       items.push({
//         text: `${totalOfferAwaitingCandidateResponse} offer${
//           totalOfferAwaitingCandidateResponse >
//           1
//             ? "s"
//             : ""
//         } awaiting candidate response`,
//         type: "warning",
//       });
//     }

//     if (
//       totalClientFeedbackPending >
//       0
//     ) {
//       items.push({
//         text: `${totalClientFeedbackPending} client feedback${
//           totalClientFeedbackPending >
//           1
//             ? "s"
//             : ""
//         } pending`,
//         type: "warning",
//       });
//     }

//     return items;
//   }, [
//     nextInterview,
//     candidatesNotConfirmed,
//     totalCvSubmissionPending,
//     totalOfferAwaitingCandidateResponse,
//     totalClientFeedbackPending,
//   ]);

//   const nextInterviewCountdown =
//     nextInterview
//       ? nextInterview.countdown
//       : "--:--";

//   const nextInterviewTime =
//     nextInterview
//       ? nextInterview.time
//       : "--";

//   const nextInterviewDetails =
//     nextInterview
//       ? [
//           nextInterview.role,
//           nextInterview.platform,
//         ]
//           .filter(Boolean)
//           .join(" · ")
//       : "No upcoming interviews";

//   return (
//     <div className="page">
//       <div className="container-fluid px-0">
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">
//               Super Admin Dashboard
//             </h1>

//             <p className="page-subtitle">
//               Live snapshot of your
//               recruitment pipeline
//             </p>
//           </div>

//           <div className="page-header-actions">
//             {normalizedRoles.length >
//             0 ? (
//               <select
//                 className="admin-select"
//                 value={selectedRoleId}
//                 onChange={
//                   handleRoleChange
//                 }
//                 disabled={
//                   switchingRole
//                 }
//               >
//                 {normalizedRoles.map(
//                   (roleItem) => (
//                     <option
//                       key={
//                         roleItem.id
//                       }
//                       value={
//                         roleItem.id
//                       }
//                     >
//                       {
//                         roleItem.name
//                       }
//                     </option>
//                   )
//                 )}
//               </select>
//             ) : (
//               <div className="admin-select role-display">
//                 {role || "User"}
//               </div>
//             )}
//           </div>
//         </div>

//         {dashboardLoading &&
//           !summary && (
//             <div className="dashboard-loading">
//               Loading dashboard...
//             </div>
//           )}

//         {dashboardError && (
//           <div className="dashboard-error">
//             {dashboardError}
//           </div>
//         )}

//         <div className="row g-3 dashboard-row">
//           {summaryCards.map(
//             (card) => (
//               <div
//                 className="col-12 col-sm-6 col-xl-4"
//                 key={card.title}
//               >
//                 <div className="dashboard-card summary-card">
//                   <div className="summary-card-content">
//                     <div>
//                       <div className="card-label">
//                         {card.title}
//                       </div>

//                       <div className="card-value">
//                         {card.value}
//                       </div>
//                     </div>

//                     <div
//                       className={`summary-icon ${card.iconClass}`}
//                     >
//                       <i
//                         className={`bi ${card.icon}`}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )
//           )}
//         </div>

//         <div className="row g-3 dashboard-row">
//           {timeZones.map(
//             (zone) => (
//               <div
//                 className="col-12 col-md-4"
//                 key={zone.country}
//               >
//                 <div className="dashboard-card timezone-card">
//                   <div className="timezone-main">
//                     <div className="timezone-flag-container">
//                       <img
//                         src={`https://flagcdn.com/w40/${zone.code.toLowerCase()}.png`}
//                         alt={
//                           zone.country
//                         }
//                         className="country-flag"
//                       />
//                     </div>

//                     <div className="timezone-info">
//                       <div className="timezone-header">
//                         <span className="timezone-country">
//                           {
//                             zone.country
//                           }
//                         </span>

//                         <span className="timezone-badge">
//                           {
//                             zone.timezone
//                           }
//                         </span>
//                       </div>

//                       <div className="timezone-time">
//                         {formatTime(
//                           zone.ianaTimezone
//                         )}
//                       </div>

//                       <div className="timezone-date">
//                         {formatDate(
//                           zone.ianaTimezone
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )
//           )}
//         </div>

//         <div className="next-interview">
//           <div className="interview-left">
//             <span className="next-interview-label">
//               NEXT INTERVIEW
//             </span>

//             <span className="dashboard-candidate-name">
//               {nextInterview?.name ||
//                 "No upcoming interview"}
//             </span>

//             <span className="dashboard-candidate-details">
//               {nextInterviewDetails}
//             </span>
//           </div>

//           <div className="interview-right">
//             <span className="interview-time">
//               {nextInterviewTime}
//             </span>

//             <span className="interview-countdown">
//               {
//                 nextInterviewCountdown
//               }
//             </span>
//           </div>
//         </div>

//         <div className="row g-3 dashboard-row status-row">
//           {statusCards.map(
//             (card) => (
//               <div
//                 className="col-12 col-sm-6 col-lg-4 col-xl"
//                 key={card.title}
//               >
//                 <div
//                   className={`dashboard-card status-card ${
//                     card.active
//                       ? "status-card-active"
//                       : ""
//                   }`}
//                 >
//                   <div className="status-icon">
//                     <i
//                       className={`bi ${card.icon}`}
//                     />
//                   </div>

//                   <div className="status-value">
//                     {card.value}
//                   </div>

//                   <div className="status-title">
//                     {card.title}
//                   </div>

//                   {card.subtitle && (
//                     <div className="status-subtitle">
//                       {
//                         card.subtitle
//                       }
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )
//           )}
//         </div>

//         <div className="row g-3 dashboard-row interview-dashboard-row">
//           <div className="col-12 col-xl-7">
//             <div className="dashboard-card todays-interviews-card">
//               <div className="todays-interviews-header">
//                 <div className="todays-interviews-title">
//                   <span className="live-dot" />
//                   <span>
//                     Today's interviews
//                   </span>
//                 </div>

//                 <div className="interviews-header-info">
//                   live countdown ·
//                   auto-refresh 30s
//                 </div>
//               </div>

//               <div className="interview-list">
//                 {todaysInterviews.length ===
//                 0 ? (
//                   <div className="empty-interviews">
//                     No interviews
//                     scheduled for
//                     today.
//                   </div>
//                 ) : (
//                   todaysInterviews.map(
//                     (interview) => (
//                       <div
//                         className={`interview-item interview-${interview.status} ${
//                           nextInterview &&
//                           interview.id ===
//                             nextInterview.id
//                             ? "interview-next"
//                             : ""
//                         }`}
//                         key={
//                           interview.id
//                         }
//                       >
//                         <div className="interview-time-column">
//                           <div className="interview-time">
//                             {
//                               interview.time
//                             }
//                           </div>
//                         </div>

//                         <div className="interview-main">
//                           <div className="interview-candidate-name">
//                             {
//                               interview.name
//                             }
//                           </div>

//                           <div className="interview-role">
//                             {
//                               interview.role
//                             }

//                             {interview.company && (
//                               <>
//                                 {" · "}
//                                 {
//                                   interview.company
//                                 }
//                               </>
//                             )}
//                           </div>

//                           <div className="interview-meta">
//                             <span>
//                               {
//                                 interview.platform
//                               }
//                             </span>

//                             <span className="interview-meta-separator">
//                               ·
//                             </span>

//                             <span>
//                               {
//                                 interview.interviewer
//                               }
//                             </span>

//                             <span className="interview-action">
//                               ◈
//                             </span>

//                             <span className="interview-action">
//                               ♟
//                             </span>

//                             <span className="interview-action">
//                               ◯
//                             </span>

//                             <span className="interview-action">
//                               ▣
//                             </span>
//                           </div>
//                         </div>

//                         <div className="interview-countdown-box">
//                           {
//                             interview.countdown
//                           }
//                         </div>
//                       </div>
//                     )
//                   )
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="col-12 col-xl-5">
//             <div className="dashboard-card attention-card">
//               <div className="attention-title">
//                 <span className="attention-symbol">
//                   ⚡
//                 </span>

//                 <span>
//                   Attention required
//                 </span>
//               </div>

//               <div className="attention-list">
//                 {attentionItems.length ===
//                 0 ? (
//                   <div className="empty-attention">
//                     No pending actions.
//                     Everything looks
//                     good.
//                   </div>
//                 ) : (
//                   attentionItems.map(
//                     (item, index) => (
//                       <div
//                         className={`attention-item attention-${item.type}`}
//                         key={`${item.text}-${index}`}
//                       >
//                         <span className="attention-dot" />

//                         <span className="attention-text">
//                           {
//                             item.text
//                           }
//                         </span>
//                       </div>
//                     )
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import "flag-icons/css/flag-icons.min.css";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardSummary } from "../../Redux/Slice/dashboardSlice";
import { switchRole } from "../../Redux/Slice/roleSlice";
import { setActiveRole } from "../../Redux/Slice/authSlice";
import Toast from "../../Components/Toast";

function Dashboard() {
  const dispatch = useDispatch();

  const { user, activeRole, roles = [] } = useSelector(
    (state) => state.auth || {}
  );

  const {
    summary,
    loading: dashboardLoading,
    error: dashboardError,
  } = useSelector((state) => state.dashboard || {});

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRoleId, setSelectedRoleId] = useState(
    activeRole?.id || ""
  );
  const [switchingRole, setSwitchingRole] = useState(false);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(getDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      dispatch(getDashboardSummary());
    }, 30000);

    return () => clearInterval(refreshTimer);
  }, [dispatch]);

  const normalizedRoles = useMemo(() => {
    return (roles || [])
      .map((roleItem) => {
        const id =
          roleItem?.id ||
          roleItem?.roleId ||
          roleItem?.role?.id;

        const name =
          roleItem?.name ||
          roleItem?.roleName ||
          roleItem?.role?.name;

        if (!id || !name) {
          return null;
        }

        return {
          id,
          name,
        };
      })
      .filter(Boolean);
  }, [roles]);

  useEffect(() => {
    if (activeRole?.id) {
      setSelectedRoleId(activeRole.id);
    }
  }, [activeRole?.id]);

  const currentRole = normalizedRoles.find(
    (roleItem) =>
      String(roleItem.id) === String(selectedRoleId)
  );

  const currentRoleName =
    activeRole?.id &&
    String(activeRole.id) === String(selectedRoleId)
      ? activeRole?.name
      : currentRole?.name;

  const role =
    currentRoleName ||
    activeRole?.name ||
    user?.role ||
    "";

const handleRoleChange = async (event) => {
  const newRoleId = event.target.value;

  if (
    !newRoleId ||
    String(newRoleId) === String(selectedRoleId)
  ) {
    return;
  }

  const previousRoleId = selectedRoleId;

  const selectedRole = normalizedRoles.find(
    (roleItem) =>
      String(roleItem.id) === String(newRoleId)
  );

  try {
    setSwitchingRole(true);

    const response = await dispatch(
      switchRole(newRoleId)
    ).unwrap();

    const newAccessToken =
      response?.accessToken ||
      response?.data?.accessToken;

    const newRefreshToken =
      response?.refreshToken ||
      response?.data?.refreshToken;

    const newActiveRole =
      response?.activeRole ||
      response?.data?.activeRole ||
      selectedRole;

    if (newAccessToken) {
      localStorage.setItem(
        "accessToken",
        newAccessToken
      );
    }

    if (newRefreshToken) {
      localStorage.setItem(
        "refreshToken",
        newRefreshToken
      );
    }

    if (newActiveRole) {
      dispatch(setActiveRole(newActiveRole));
    }

    setSelectedRoleId(newRoleId);

    dispatch(getDashboardSummary());

    showToast(
      "success",
      `Role switched to ${
        selectedRole?.name || "selected role"
      } successfully.`
    );
  } catch (error) {
    console.error(
      "Dashboard role switch failed:",
      error
    );

    setSelectedRoleId(previousRoleId);

    showToast(
      "error",
      error ||
        "Unable to switch role. Please try again."
    );
  } finally {
    setSwitchingRole(false);
  }
};

  const dashboardSummary = summary || {};

  const {
    totalCandidates = 0,
    openJobs = 0,
    activeClients = 0,
    totalInterviewsToday = 0,
    totalCvSubmissionPending = 0,
    totalOffersPending = 0,
    totalJoiningToday = 0,
    totalUrgentRoles = 0,
    totalClientFeedbackPending = 0,
    totalOfferAwaitingCandidateResponse = 0,
    todayInterviews = [],
    candidatesNotConfirmed = [],
  } = dashboardSummary;

  const summaryCards = [
    {
      title: "Total Candidates",
      value: totalCandidates,
      icon: "bi-people-fill",
      className: "kpi-blue",
      description: "Candidates in pipeline",
    },
    {
      title: "Open Jobs",
      value: openJobs,
      icon: "bi-briefcase-fill",
      className: "kpi-purple",
      description: "Active requirements",
    },
    {
      title: "Active Clients",
      value: activeClients,
      icon: "bi-buildings-fill",
      className: "kpi-green",
      description: "Currently engaged",
    },
  ];

  const timeZones = [
    {
      country: "India",
      code: "IN",
      timezone: "IST",
      ianaTimezone: "Asia/Kolkata",
      city: "Mumbai / Delhi",
    },
    {
      country: "United Kingdom",
      code: "GB",
      timezone: "UK",
      ianaTimezone: "Europe/London",
      city: "London",
    },
    {
      country: "Qatar · Middle East",
      code: "QA",
      timezone: "AST",
      ianaTimezone: "Asia/Qatar",
      city: "Doha",
    },
  ];

  const formatTime = (timeZone) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(currentTime);
  };

  const formatDate = (timeZone) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(currentTime);
  };

  const getInterviewDateTime = (interview) => {
    if (
      !interview?.interviewDate ||
      !interview?.interviewTime
    ) {
      return null;
    }

    const dateTimeString = `${interview.interviewDate}T${interview.interviewTime}`;

    const date = new Date(dateTimeString);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  const formatCountdown = (interview) => {
    const interviewDateTime =
      getInterviewDateTime(interview);

    if (!interviewDateTime) {
      return "--:--";
    }

    const difference =
      interviewDateTime.getTime() -
      currentTime.getTime();

    if (difference <= 0) {
      return "Started";
    }

    const totalSeconds = Math.floor(
      difference / 1000
    );

    const days = Math.floor(
      totalSeconds / (24 * 60 * 60)
    );

    const hours = Math.floor(
      (totalSeconds % (24 * 60 * 60)) /
        (60 * 60)
    );

    const minutes = Math.floor(
      (totalSeconds % (60 * 60)) / 60
    );

    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${String(hours).padStart(
        2,
        "0"
      )}h`;
    }

    if (hours > 0) {
      return `${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const formatInterviewTime = (interview) => {
    if (!interview?.interviewTime) {
      return "--";
    }

    const date = new Date(
      `1970-01-01T${interview.interviewTime}`
    );

    if (Number.isNaN(date.getTime())) {
      return interview.interviewTime;
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const statusCards = [
    {
      icon: "bi-camera-video-fill",
      value: totalInterviewsToday,
      title: "Interviews Today",
      subtitle:
        totalInterviewsToday === 0
          ? "No interviews scheduled"
          : "Scheduled for today",
      active: totalInterviewsToday > 0,
      className: "status-blue",
    },
    {
      icon: "bi-file-earmark-text-fill",
      value: totalCvSubmissionPending,
      title: "CVs Pending",
      subtitle: "To submit",
      active: totalCvSubmissionPending > 0,
      className: "status-orange",
    },
    {
      icon: "bi-chat-left-text-fill",
      value: totalClientFeedbackPending,
      title: "Client Feedback",
      subtitle: "Pending response",
      active: totalClientFeedbackPending > 0,
      className: "status-purple",
    },
    {
      icon: "bi-gift-fill",
      value: totalOffersPending,
      title: "Offers Pending",
      subtitle:
        totalOfferAwaitingCandidateResponse > 0
          ? `${totalOfferAwaitingCandidateResponse} awaiting reply`
          : "Awaiting reply",
      active: totalOffersPending > 0,
      className: "status-green",
    },
    {
      icon: "bi-person-check-fill",
      value: totalJoiningToday,
      title: "Joining Today",
      subtitle: "Candidates joining",
      active: totalJoiningToday > 0,
      className: "status-teal",
    },
    {
      icon: "bi-exclamation-triangle-fill",
      value: totalUrgentRoles,
      title: "Urgent Roles",
      subtitle: "High priority",
      active: totalUrgentRoles > 0,
      className: "status-red",
    },
  ];

  const todaysInterviews = useMemo(() => {
    const interviews = (todayInterviews || []).map(
      (interview, index) => ({
        ...interview,

        id: `${interview.interviewDate || ""}-${
          interview.interviewTime || ""
        }-${interview.candidateName || index}`,

        time: formatInterviewTime(interview),

        name:
          interview.candidateName ||
          "Unknown Candidate",

        role:
          interview.jobName ||
          "Job not specified",

        company: interview.skillName || "",

        platform:
          interview.interviewType ||
          "Interview",

        interviewer:
          interview.interviewerName ||
          "Not assigned",

        countdown: formatCountdown(interview),

        status:
          interview.interviewStatus === "Completed"
            ? "completed"
            : interview.interviewStatus === "Cancelled"
            ? "cancelled"
            : "upcoming",
      })
    );

    return interviews.sort((a, b) => {
      const getTimeInSeconds = (time) => {
        if (!time) {
          return Number.MAX_SAFE_INTEGER;
        }

        const match = String(time).match(
          /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
        );

        if (!match) {
          return Number.MAX_SAFE_INTEGER;
        }

        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        const seconds = Number(match[3] || 0);

        return (
          hours * 60 * 60 +
          minutes * 60 +
          seconds
        );
      };

      return (
        getTimeInSeconds(a.interviewTime) -
        getTimeInSeconds(b.interviewTime)
      );
    });
  }, [todayInterviews, currentTime]);

  const nextInterview =
    todaysInterviews.length > 0
      ? todaysInterviews[0]
      : null;

  const attentionItems = useMemo(() => {
    const items = [];

    if (nextInterview) {
      const countdown =
        nextInterview.countdown;

      if (
        countdown !== "Started" &&
        countdown !== "--:--"
      ) {
        items.push({
          text: `Interview in ${countdown} — ${
            nextInterview.name || "Candidate"
          }`,
          type: "danger",
          icon: "bi-clock-fill",
        });
      }
    }

    if (
      Array.isArray(candidatesNotConfirmed) &&
      candidatesNotConfirmed.length > 0
    ) {
      candidatesNotConfirmed.forEach(
        (candidate) => {
          const candidateName =
            typeof candidate === "string"
              ? candidate
              : candidate?.candidateName ||
                candidate?.name ||
                "Candidate";

          items.push({
            text: `Candidate not confirmed — ${candidateName}`,
            type: "warning",
            icon: "bi-person-x-fill",
          });
        }
      );
    }

    if (totalCvSubmissionPending > 0) {
      items.push({
        text: `${totalCvSubmissionPending} CV${
          totalCvSubmissionPending > 1
            ? "s"
            : ""
        } pending submission`,
        type: "danger",
        icon: "bi-file-earmark-text-fill",
      });
    }

    if (
      totalOfferAwaitingCandidateResponse > 0
    ) {
      items.push({
        text: `${totalOfferAwaitingCandidateResponse} offer${
          totalOfferAwaitingCandidateResponse >
          1
            ? "s"
            : ""
        } awaiting candidate response`,
        type: "warning",
        icon: "bi-gift-fill",
      });
    }

    if (totalClientFeedbackPending > 0) {
      items.push({
        text: `${totalClientFeedbackPending} client feedback${
          totalClientFeedbackPending > 1
            ? "s"
            : ""
        } pending`,
        type: "warning",
        icon: "bi-chat-left-text-fill",
      });
    }

    return items;
  }, [
    nextInterview,
    candidatesNotConfirmed,
    totalCvSubmissionPending,
    totalOfferAwaitingCandidateResponse,
    totalClientFeedbackPending,
  ]);

  const nextInterviewCountdown = nextInterview
    ? nextInterview.countdown
    : "--:--";

  const nextInterviewTime = nextInterview
    ? nextInterview.time
    : "--";

  const nextInterviewDetails = nextInterview
    ? [
        nextInterview.role,
        nextInterview.platform,
      ]
        .filter(Boolean)
        .join(" · ")
    : "No upcoming interviews";

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Page Header - Jobs Template Style */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Here's what's happening across your recruitment pipeline today.
            </p>
          </div>

          <div className="dashboard-role-box">
            {normalizedRoles.length > 0 ? (
              <select
                className="dashboard-role-select"
                value={selectedRoleId}
                onChange={handleRoleChange}
                disabled={switchingRole}
              >
                {normalizedRoles.map((roleItem) => (
                  <option
                    key={roleItem.id}
                    value={roleItem.id}
                  >
                    {roleItem.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="dashboard-role-value">
                {role || "User"}
              </div>
            )}
            {switchingRole && (
              <span className="role-switch-spinner">
                <span className="spinner-border spinner-border-sm" />
              </span>
            )}
          </div>
        </div>

        {dashboardLoading && !summary && (
          <div className="dashboard-state loading-state">
            <span className="spinner-border spinner-border-sm" />
            Loading dashboard...
          </div>
        )}

        {dashboardError && (
          <div className="dashboard-state error-state">
            <i className="bi bi-exclamation-circle-fill" />
            {dashboardError}
          </div>
        )}

        {/* Enhanced KPI Section - Icon on Right */}
        <section className="dashboard-section">
          <div className="kpi-grid">
            {summaryCards.map((card) => (
              <div
                className={`kpi-card ${card.className}`}
                key={card.title}
              >
                <div className="kpi-content">
                  <div className="kpi-data">
                    <div className="kpi-value">
                      {card.value.toLocaleString()}
                    </div>

                    <div className="kpi-title">
                      {card.title}
                    </div>

                    <div className="kpi-description">
                      {card.description}
                    </div>
                  </div>

                  <div className="kpi-icon-wrapper">
                    <i
                      className={`bi ${card.icon}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Timezone Section - Badge on Right */}
        <section className="dashboard-section">
          <div className="timezone-grid">
            {timeZones.map((zone) => (
              <div
                className="timezone-card-new"
                key={zone.country}
              >
                <div className="timezone-content">
                  <div className="timezone-data">
                    <div className="timezone-location">
                      <img
                        src={`https://flagcdn.com/w40/${zone.code.toLowerCase()}.png`}
                        alt={zone.country}
                        className="country-flag-new"
                      />

                      <div>
                        <div className="timezone-country-new">
                          {zone.country}
                        </div>

                        <div className="timezone-city">
                          {zone.city}
                        </div>
                      </div>
                    </div>

                    <div className="timezone-time-new">
                      {formatTime(zone.ianaTimezone)}
                    </div>

                    <div className="timezone-date-new">
                      {formatDate(zone.ianaTimezone)}
                    </div>
                  </div>

                  <div className="timezone-right">
                    <span className="timezone-badge-new">
                      {zone.timezone}
                    </span>

                    <div className="timezone-indicator">
                      <span className="timezone-dot" />
                      Active
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Next Interview Card */}
        <section className="next-interview-card">
          <div className="next-interview-content">
            <div className="next-interview-icon">
              <i className="bi bi-camera-video-fill" />
            </div>

            <div className="next-interview-info">
              <span className="next-label">
                <i className="bi bi-star-fill" />
                NEXT INTERVIEW
              </span>

              <h3>
                {nextInterview?.name ||
                  "No upcoming interview"}
              </h3>

              <p>{nextInterviewDetails}</p>
            </div>
          </div>

          <div className="next-interview-timing">
            <div className="next-time">
              <i className="bi bi-clock" />
              {nextInterviewTime}
            </div>

            <div className="next-countdown">
              <i className="bi bi-hourglass-split" />
              {nextInterviewCountdown}
            </div>
          </div>
        </section>

        {/* Enhanced Status Grid */}
        <section className="dashboard-section">
          <div className="section-heading compact-heading">
            <div>
              <h2>Today's activity</h2>
            </div>
          </div>

          <div className="status-grid">
            {statusCards.map((card) => (
              <div
                className={`status-card-new ${card.className}`}
                key={card.title}
              >
                <div className="status-card-header">
                  <div className="status-card-icon">
                    <i
                      className={`bi ${card.icon}`}
                    />
                  </div>

                  {card.active && (
                    <span className="active-indicator">
                      <span className="indicator-dot" />
                      Active
                    </span>
                  )}
                </div>

                <div className="status-number">
                  {card.value}
                </div>

                <div className="status-name">
                  {card.title}
                </div>

                <div className="status-description">
                  {card.subtitle}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Bottom Panels */}
        <section className="dashboard-section bottom-section">
          <div className="bottom-grid">
            {/* Enhanced Interviews Panel */}
            <div className="interviews-panel dashboard-panel">
              <div className="panel-header">
                <div className="panel-title-wrap">
                  <div className="panel-title-icon">
                    <i className="bi bi-calendar2-week-fill" />
                  </div>

                  <div>
                    <h2>Today's interviews</h2>
                    <p>
                      {todaysInterviews.length} scheduled
                      interview
                      {todaysInterviews.length !== 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="live-status">
                  <span className="live-dot-new" />
                  LIVE
                </div>
              </div>

              <div className="interview-list-new">
                {todaysInterviews.length === 0 ? (
                  <div className="empty-panel">
                    <div className="empty-icon">
                      <i className="bi bi-calendar-x" />
                    </div>

                    <h3>No interviews scheduled</h3>

                    <p>
                      There are no interviews planned
                      for today.
                    </p>
                    {/* <button className="empty-action-btn">
                      <i className="bi bi-plus-circle" />
                      Schedule Interview
                    </button> */}
                  </div>
                ) : (
                  todaysInterviews.map(
                    (interview) => (
                      <div
                        className={`interview-row-new interview-${interview.status} ${
                          nextInterview &&
                          interview.id ===
                            nextInterview.id
                            ? "is-next"
                            : ""
                        }`}
                        key={interview.id}
                      >
                        <div className="interview-time-new">
                          <span>
                            {interview.time}
                          </span>

                          {nextInterview &&
                            interview.id ===
                              nextInterview.id && (
                              <small>NEXT</small>
                            )}
                        </div>

                        <div className="interview-avatar">
                          {interview.name
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                        <div className="interview-details-new">
                          <h3>
                            {interview.name}
                          </h3>

                          <p>
                            {interview.role}

                            {interview.company && (
                              <>
                                {" · "}
                                {interview.company}
                              </>
                            )}
                          </p>

                          <div className="interview-tags">
                            <span>
                              <i className="bi bi-camera-video" />
                              {interview.platform}
                            </span>

                            <span>
                              <i className="bi bi-person" />
                              {interview.interviewer}
                            </span>
                          </div>
                        </div>

                        <div className="interview-countdown-new">
                          {interview.countdown}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            {/* Enhanced Attention Panel */}
            <div className="attention-panel dashboard-panel">
              <div className="panel-header">
                <div className="panel-title-wrap">
                  <div className="panel-title-icon attention-icon">
                    <i className="bi bi-lightning-charge-fill" />
                  </div>

                  <div>
                    <h2>Attention required</h2>
                    <p>
                      Items that need your attention
                    </p>
                  </div>
                </div>

                <span className="attention-count">
                  {attentionItems.length}
                </span>
              </div>

              <div className="attention-list-new">
                {attentionItems.length === 0 ? (
                  <div className="empty-panel attention-empty">
                    <div className="empty-icon success-empty">
                      <i className="bi bi-check2-circle" />
                    </div>

                    <h3>All clear</h3>

                    <p>
                      No pending actions require
                      attention.
                    </p>
                    <span className="all-clear-badge">
                      <i className="bi bi-check-circle-fill" />
                      Everything's on track
                    </span>
                  </div>
                ) : (
                  attentionItems.map(
                    (item, index) => (
                      <div
                        className={`attention-row-new ${item.type}`}
                        key={`${item.text}-${index}`}
                      >
                        <div className="attention-row-icon">
                          <i
                            className={`bi ${item.icon}`}
                          />
                        </div>

                        <div className="attention-row-content">
                          <span>
                            {item.text}
                          </span>

                          <small>
                            {item.type ===
                            "danger"
                              ? "⚠️ Requires immediate attention"
                              : "📋 Review when available"}
                          </small>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Toast
  show={toast.show}
  type={toast.type}
  message={toast.message}
  onClose={closeToast}
/>
    </div>
  );
}

export default Dashboard;