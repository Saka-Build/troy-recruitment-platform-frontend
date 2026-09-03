import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import "flag-icons/css/flag-icons.min.css";
import { useDispatch, useSelector } from "react-redux";

import {
  getDashboardSummary,
  getSelectedSubmissions,
  getHighPriorityJobs,
  getInterviewSubmissions,
  getReadyToSubmitSubmissions,
  getOnboardedSubmissions,
} from "../../Redux/Slice/dashboardSlice";

import { switchRole } from "../../Redux/Slice/roleSlice";
import { setActiveRole, setRoles } from "../../Redux/Slice/authSlice";
import Toast from "../../Components/Toast";
import DashboardActivityModal from "./DashboardActivityModal";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, activeRole, roles = [] } = useSelector(
    (state) => state.auth || {}
  );

  const {
    summary,
    loading: dashboardLoading,
    error: dashboardError,

    selectedSubmissions,
    highPriorityJobs,
    interviewSubmissions,
    readyToSubmitSubmissions,
    onboardedSubmissions,

    selectedSubmissionsLoading,
    highPriorityJobsLoading,
    interviewSubmissionsLoading,
    readyToSubmitSubmissionsLoading,
    onboardedSubmissionsLoading,

    selectedSubmissionsError,
    highPriorityJobsError,
    interviewSubmissionsError,
    readyToSubmitSubmissionsError,
    onboardedSubmissionsError,
  } = useSelector((state) => state.dashboard || {});

  const [currentTime, setCurrentTime] = useState(new Date());

  const [selectedRoleId, setSelectedRoleId] = useState(
    activeRole?.id || ""
  );

  const [switchingRole, setSwitchingRole] = useState(false);

  const [activityModal, setActivityModal] = useState({
    show: false,
    type: "",
    title: "",
    count: 0,
    items: [],
  });

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

  const openActivityModal = (
    type,
    title,
    items = [],
    count = 0
  ) => {
    setActivityModal({
      show: true,
      type,
      title,
      count,
      items: Array.isArray(items) ? items : [],
    });
  };

  const closeActivityModal = () => {
    setActivityModal({
      show: false,
      type: "",
      title: "",
      count: 0,
      items: [],
    });
  };

  /* =========================================================
     CLOCK
  ========================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =========================================================
     INITIAL DASHBOARD API CALLS
  ========================================================= */

  useEffect(() => {
    dispatch(getDashboardSummary());

    dispatch(
      getSelectedSubmissions({
        page: 0,
        size: 20,
      })
    );

    dispatch(
      getHighPriorityJobs({
        page: 0,
        size: 20,
      })
    );

    dispatch(
      getInterviewSubmissions({
        page: 0,
        size: 20,
        search: "Feedback",
      })
    );

    dispatch(
      getReadyToSubmitSubmissions({
        page: 0,
        size: 20,
      })
    );

    dispatch(
      getOnboardedSubmissions({
        page: 0,
        size: 20,
      })
    );
  }, [dispatch]);

  /* =========================================================
     REFRESH DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      dispatch(getDashboardSummary());

      dispatch(
        getSelectedSubmissions({
          page: 0,
          size: 20,
        })
      );

      dispatch(
        getHighPriorityJobs({
          page: 0,
          size: 20,
        })
      );

      dispatch(
        getInterviewSubmissions({
          page: 0,
          size: 20,
          search: "Feedback",
        })
      );

      dispatch(
        getReadyToSubmitSubmissions({
          page: 0,
          size: 20,
        })
      );

      dispatch(
        getOnboardedSubmissions({
          page: 0,
          size: 20,
        })
      );
    }, 30000);

    return () => clearInterval(refreshTimer);
  }, [dispatch]);

  /* =========================================================
     ROLES
  ========================================================= */

const normalizedRoles = useMemo(() => {
  const roleMap = new Map();

  // Add roles from the roles array
  (roles || []).forEach((roleItem) => {
    const id =
      roleItem?.id ||
      roleItem?.roleId ||
      roleItem?.role?.id;

    const name =
      roleItem?.name ||
      roleItem?.roleName ||
      roleItem?.role?.name;

    if (id && name) {
      roleMap.set(String(id), {
        id,
        name,
      });
    }
  });

  // Also add the currently active role
  // This handles cases where activeRole is not present in roles
  if (activeRole?.id && activeRole?.name) {
    roleMap.set(String(activeRole.id), {
      id: activeRole.id,
      name: activeRole.name,
    });
  }

  return Array.from(roleMap.values());
}, [roles, activeRole]);

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

  /* =========================================================
     ROLE CHANGE
  ========================================================= */

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
const returnedRoles =
  response?.roles ||
  response?.data?.roles ||
  [];
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
}const allRolesMap = new Map();

// Preserve the roles already available in Redux
(roles || []).forEach((roleItem) => {
  const id =
    roleItem?.id ||
    roleItem?.roleId ||
    roleItem?.role?.id;

  const name =
    roleItem?.name ||
    roleItem?.roleName ||
    roleItem?.role?.name;

  if (id && name) {
    allRolesMap.set(String(id), {
      id,
      name,
    });
  }
});

// Add the newly active role
if (newActiveRole?.id && newActiveRole?.name) {
  allRolesMap.set(String(newActiveRole.id), {
    id: newActiveRole.id,
    name: newActiveRole.name,
  });
}

// Add roles returned by the switch-role API
returnedRoles.forEach((roleItem) => {
  const id =
    roleItem?.id ||
    roleItem?.roleId ||
    roleItem?.role?.id;

  const name =
    roleItem?.name ||
    roleItem?.roleName ||
    roleItem?.role?.name;

  if (id && name) {
    allRolesMap.set(String(id), {
      id,
      name,
    });
  }
});

dispatch(setRoles(Array.from(allRolesMap.values())));

      setSelectedRoleId(newRoleId);

      /* =====================================================
         REFRESH ALL DASHBOARD APIs AFTER ROLE SWITCH
      ===================================================== */

      dispatch(getDashboardSummary());

      dispatch(
        getSelectedSubmissions({
          page: 0,
          size: 20,
        })
      );

      dispatch(
        getHighPriorityJobs({
          page: 0,
          size: 20,
        })
      );

      dispatch(
        getInterviewSubmissions({
          page: 0,
          size: 20,
          search: "Feedback",
        })
      );

      dispatch(
        getReadyToSubmitSubmissions({
          page: 0,
          size: 20,
        })
      );

      dispatch(
        getOnboardedSubmissions({
          page: 0,
          size: 20,
        })
      );

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

  /* =========================================================
     SUMMARY
  ========================================================= */

  const dashboardSummary = summary || {};

  const {
    totalCandidates = 0,
    openJobs = 0,
    activeClients = 0,

    totalInterviewsToday = 0,

    todayInterviews = [],
    candidatesNotConfirmed = [],

    totalOfferAwaitingCandidateResponse = 0,
  } = dashboardSummary;

  /* =========================================================
     TODAY'S ACTIVITY API COUNTS
  ========================================================= */

  const selectedSubmissionsCount =
    Number(
      selectedSubmissions?.totalElements
    ) || 0;

  const highPriorityJobsCount =
    Number(
      highPriorityJobs?.totalElements
    ) || 0;

  const interviewSubmissionsCount =
    Number(
      interviewSubmissions?.totalElements
    ) || 0;

  const readyToSubmitCount =
    Number(
      readyToSubmitSubmissions?.totalElements
    ) || 0;

  /*
   * JOINING TODAY
   *
   * Count comes from:
   * /api/v1/submissions?pipelineStage=onboarded
   */
  const onboardedSubmissionsCount =
    Number(
      onboardedSubmissions?.totalElements
    ) || 0;

  /* =========================================================
     TODAY'S ACTIVITY ITEMS
  ========================================================= */

  const selectedSubmissionItems =
    selectedSubmissions?.content || [];

  const highPriorityJobItems =
    highPriorityJobs?.content || [];

  const interviewSubmissionItems =
    interviewSubmissions?.content || [];

  const readyToSubmitItems =
    readyToSubmitSubmissions?.content || [];

  /*
   * JOINING TODAY MODAL ITEMS
   */
  const onboardedSubmissionItems =
    onboardedSubmissions?.content || [];

  const todayInterviewItems =
    todayInterviews || [];

  /* =========================================================
     KPI CARDS
  ========================================================= */

const summaryCards = [
  {
    title: "Total Candidates",
    value: totalCandidates,
    icon: "bi-people-fill",
    className: "kpi-blue",
    description: "Candidates in pipeline",
    navigateTo: "/dashboard/candidates",
  },
  {
    title: "Open Jobs",
    value: openJobs,
    icon: "bi-briefcase-fill",
    className: "kpi-purple",
    description: "Active requirements",
    navigateTo: "/dashboard/jobs",
  },
  {
    title: "Active Clients",
    value: activeClients,
    icon: "bi-buildings-fill",
    className: "kpi-green",
    description: "Currently engaged",
    navigateTo: "/dashboard/clients",
  },
];

  /* =========================================================
     TIMEZONES
  ========================================================= */

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

  /* =========================================================
     INTERVIEW HELPERS
  ========================================================= */

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

  /* =========================================================
     STATUS CARDS
  ========================================================= */

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

      modalType: "interviews",
      modalItems: todayInterviewItems,
      modalTitle: "Today's interviews",
    },

    {
      icon: "bi-file-earmark-text-fill",
      value: readyToSubmitCount,
      title: "CVs Pending",
      subtitle:
        readyToSubmitCount === 0
          ? "No CVs pending"
          : "To submit",
      active: readyToSubmitCount > 0,
      className: "status-orange",

      loading: readyToSubmitSubmissionsLoading,

      modalType: "cvPending",
      modalItems: readyToSubmitItems,
      modalTitle: "CVs pending submission",
    },

    {
      icon: "bi-chat-left-text-fill",
      value: interviewSubmissionsCount,
      title: "Client Feedback",
      subtitle:
        interviewSubmissionsCount === 0
          ? "No feedback pending"
          : "Pending response",
      active: interviewSubmissionsCount > 0,
      className: "status-purple",

      loading: interviewSubmissionsLoading,

      modalType: "feedback",
      modalItems: interviewSubmissionItems,
      modalTitle: "Client feedback overdue",
    },

    {
      icon: "bi-gift-fill",
      value: selectedSubmissionsCount,
      title: "Offers Pending",
      subtitle:
        totalOfferAwaitingCandidateResponse > 0
          ? `${totalOfferAwaitingCandidateResponse} awaiting reply`
          : "Awaiting reply",
      active: selectedSubmissionsCount > 0,
      className: "status-green",

      loading: selectedSubmissionsLoading,

      modalType: "offers",
      modalItems: selectedSubmissionItems,
      modalTitle: "Offers pending",
    },

    /* =====================================================
       JOINING TODAY
    ===================================================== */

    {
      icon: "bi-person-check-fill",
      value: onboardedSubmissionsCount,
      title: "Joining Today",
      subtitle:
        onboardedSubmissionsCount === 0
          ? "No candidates joining"
          : "Candidates joining",
      active: onboardedSubmissionsCount > 0,
      className: "status-teal",

      loading: onboardedSubmissionsLoading,

      modalType: "joining",
      modalItems: onboardedSubmissionItems,
      modalTitle: "Joining today",
    },

    {
      icon: "bi-exclamation-triangle-fill",
      value: highPriorityJobsCount,
      title: "Urgent Roles",
      subtitle:
        highPriorityJobsCount === 0
          ? "No high priority roles"
          : "High priority",
      active: highPriorityJobsCount > 0,
      className: "status-red",

      loading: highPriorityJobsLoading,

      modalType: "urgent",
      modalItems: highPriorityJobItems,
      modalTitle: "Urgent roles",
    },
  ];

  /* =========================================================
     TODAY'S INTERVIEWS
  ========================================================= */

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

  /* =========================================================
     ATTENTION ITEMS
  ========================================================= */

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

    if (readyToSubmitCount > 0) {
      items.push({
        text: `${readyToSubmitCount} CV${
          readyToSubmitCount > 1
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

    if (interviewSubmissionsCount > 0) {
      items.push({
        text: `${interviewSubmissionsCount} client feedback${
          interviewSubmissionsCount > 1
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
    readyToSubmitCount,
    totalOfferAwaitingCandidateResponse,
    interviewSubmissionsCount,
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

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Dashboard
            </h1>

            <p className="page-subtitle">
              Here's what's happening across your
              recruitment pipeline today.
            </p>
          </div>

<div className="dashboard-role-box">
    {normalizedRoles.length > 0 ? (
        <div className="dashboard-role-select-wrapper">
            <i className="bi bi-person-badge dashboard-role-icon" />

            <select
                className="dashboard-role-select"
                value={selectedRoleId}
                onChange={handleRoleChange}
                disabled={switchingRole}
                aria-label="Switch role"
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

            <i className="bi bi-chevron-down dashboard-role-chevron" />

            {switchingRole && (
                <span className="role-switch-spinner">
                    <span className="spinner-border spinner-border-sm" />
                </span>
            )}
        </div>
    ) : (
        <div className="dashboard-role-value">
            {role || "User"}
        </div>
    )}
</div>
        </div>

        {/* Dashboard Loading */}
        {dashboardLoading && !summary && (
          <div className="dashboard-state loading-state">
            <span className="spinner-border spinner-border-sm" />
            Loading dashboard...
          </div>
        )}

        {/* Dashboard Error */}
        {dashboardError && (
          <div className="dashboard-state error-state">
            <i className="bi bi-exclamation-circle-fill" />
            {dashboardError}
          </div>
        )}

        {/* =====================================================
            KPI SECTION
        ===================================================== */}

        <section className="dashboard-section">
<div className="kpi-grid">
  {summaryCards.map((card) => (
    <div
      className={`kpi-card ${card.className} kpi-card-clickable`}
      key={card.title}
      onClick={() => navigate(card.navigateTo)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          navigate(card.navigateTo);
        }
      }}
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
          <i className={`bi ${card.icon}`} />
        </div>
      </div>
    </div>
  ))}
</div>
        </section>

        {/* =====================================================
            TIMEZONE SECTION
        ===================================================== */}

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
                      {formatTime(
                        zone.ianaTimezone
                      )}
                    </div>

                    <div className="timezone-date-new">
                      {formatDate(
                        zone.ianaTimezone
                      )}
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

        {/* =====================================================
            NEXT INTERVIEW
        ===================================================== */}

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

              <p>
                {nextInterviewDetails}
              </p>
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

        {/* =====================================================
            TODAY'S ACTIVITY
        ===================================================== */}

        <section className="dashboard-section">
          <div className="section-heading compact-heading">
            <div>
              <h2>Today's activity</h2>
            </div>
          </div>

          <div className="status-grid">
            {statusCards.map((card) => (
              <div
                className={`status-card-new ${card.className} status-card-clickable`}
                key={card.title}
                onClick={() =>
                  openActivityModal(
                    card.modalType,
                    card.modalTitle,
                    card.modalItems,
                    card.value
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();

                    openActivityModal(
                      card.modalType,
                      card.modalTitle,
                      card.modalItems,
                      card.value
                    );
                  }
                }}
              >
                <div className="status-card-header">
                  <div className="status-card-icon">
                    <i
                      className={`bi ${card.icon}`}
                    />
                  </div>

                  {card.loading ? (
                    <span className="status-loading">
                      <span className="spinner-border spinner-border-sm" />
                    </span>
                  ) : (
                    card.active && (
                      <span className="active-indicator">
                        <span className="indicator-dot" />
                        Active
                      </span>
                    )
                  )}
                </div>

                <div className="status-number">
                  {card.loading ? (
                    <span className="status-number-loading">
                      --
                    </span>
                  ) : (
                    card.value
                  )}
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

        {/* =====================================================
            BOTTOM PANELS
        ===================================================== */}

        <section className="dashboard-section bottom-section">
          <div className="bottom-grid">

            {/* Today's Interviews */}
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

                    <h3>
                      No interviews scheduled
                    </h3>

                    <p>
                      There are no interviews planned
                      for today.
                    </p>
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

            {/* Attention Panel */}
            <div className="attention-panel dashboard-panel">
              <div className="panel-header">
                <div className="panel-title-wrap">
                  <div className="panel-title-icon attention-icon">
                    <i className="bi bi-lightning-charge-fill" />
                  </div>

                  <div>
                    <h2>
                      Attention required
                    </h2>

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

      {/* =====================================================
          TOAST
      ===================================================== */}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />

      {/* =====================================================
          ACTIVITY MODAL
      ===================================================== */}

      <DashboardActivityModal
        show={activityModal.show}
        type={activityModal.type}
        title={activityModal.title}
        count={activityModal.count}
        items={activityModal.items}
        onClose={closeActivityModal}
      />
    </div>
  );
}

export default Dashboard;