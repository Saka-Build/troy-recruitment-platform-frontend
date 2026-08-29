import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import "flag-icons/css/flag-icons.min.css";
import { useDispatch, useSelector } from "react-redux";


function Dashboard() {
    const dispatch = useDispatch();
      const {
    user,
    activeRole,
    roles = [],
  } = useSelector(
    (state) => state.auth || {}
  );

  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedRoleId, setSelectedRoleId] = useState(
    activeRole?.id || ""
  );

  const [switchingRole, setSwitchingRole] = useState(false);


  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

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
      String(roleItem.id) ===
      String(selectedRoleId)
  );

  const currentRoleName =
    activeRole?.id &&
    String(activeRole.id) ===
      String(selectedRoleId)
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
        String(roleItem.id) ===
        String(newRoleId)
    );

    try {
      setSwitchingRole(true);

      const response = await dispatch(
        switchRole(newRoleId)
      ).unwrap();

      console.log(
        "Dashboard role switch response:",
        response
      );

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

      // Update access token
      if (newAccessToken) {
        localStorage.setItem(
          "accessToken",
          newAccessToken
        );
      }

      // Update refresh token
      if (newRefreshToken) {
        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        );
      }

      // Update Redux active role
      if (newActiveRole) {
        dispatch(
          setActiveRole(newActiveRole)
        );
      }

      // Update local selector
      setSelectedRoleId(newRoleId);

    } catch (error) {
      console.error(
        "Dashboard role switch failed:",
        error
      );

      // Restore previous role
      setSelectedRoleId(previousRoleId);

    } finally {
      setSwitchingRole(false);
    }
  };
const summaryCards = [
  {
    title: "Total candidates",
    value: "4",
    icon: "bi-people-fill",
    iconClass: "blue-icon",
  },
  {
    title: "Open jobs",
    value: "2",
    icon: "bi-briefcase-fill",
    iconClass: "blue-icon",
  },
  {
    title: "Active clients",
    value: "1",
    icon: "bi-building-fill",
    iconClass: "blue-icon",
  },
];

const timeZones = [
  {
    country: "India",
    code: "IN",
    timezone: "IST",
    ianaTimezone: "Asia/Kolkata",
  },
  {
    country: "United Kingdom",
    code: "GB",
    timezone: "UK",
    ianaTimezone: "Europe/London",
  },
  {
    country: "Qatar · Middle East",
    code: "QA",
    timezone: "AST",
    ianaTimezone: "Asia/Qatar",
  },
];

const statusCards = [
  {
    icon: "bi-fire",
    value: "2",
    title: "Interviews today",
    subtitle: "0 done · 2 upcoming",
    active: true,
  },
  {
    icon: "bi-file-earmark-text-fill",
    value: "1",
    title: "CVs pending",
    subtitle: "to submit",
  },
  {
    icon: "bi-hourglass-split",
    value: "1",
    title: "Client feedback",
    subtitle: "overdue",
  },
  {
    icon: "bi-briefcase-fill",
    value: "0",
    title: "Offers pending",
    subtitle: "awaiting reply",
  },
  {
    icon: "bi-rocket-takeoff-fill",
    value: "2",
    title: "Joining today",
    subtitle: "",
  },
  {
    icon: "bi-exclamation-triangle-fill",
    value: "2",
    title: "Urgent Roles",
    subtitle: "High Priority",
    active: true,
  },
];

  const todaysInterviews = [
  {
    time: "1:02 PM",
    name: "Julia Deveraux",
    role: "SAP S/4HANA Consultant",
    company: "Nova Manufacturing",
    platform: "Teams",
    interviewer: "Sarah Li (Client)",
    countdown: "11:59",
    status: "upcoming",
  },
  {
    time: "1:37 PM",
    name: "Omar Salah",
    role: "Cloud Security Engineer",
    company: "Meridian Fintech",
    platform: "Google Meet",
    interviewer: "Michael Chen (Client)",
    countdown: "46:59",
    status: "upcoming",
  },
];

const attentionItems = [
  {
    text: "Interview in 12 min — Julia Deveraux",
    type: "danger",
  },
  {
    text: "Candidate not confirmed — Julia Deveraux",
    type: "warning",
  },
  {
    text: "2 CVs pending submission",
    type: "danger",
  },
  {
    text: "1 offer awaiting candidate response",
    type: "warning",
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
  return (
    <div className="page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="container-fluid px-0">

        <div className="page-header">

          <div>
            <h1 className="page-title">
              Super Admin Dashboard
            </h1>

            <p className="page-subtitle">
              Live snapshot of your recruitment pipeline
            </p>
          </div>

<div className="page-header-actions">

  {normalizedRoles.length > 0 ? (
    <select
      className="admin-select"
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
    <div className="admin-select role-display">
      {role || "User"}
    </div>
  )}

</div>

        </div>

        <div className="row g-3 dashboard-row">

          {summaryCards.map((card) => (
            <div
              className="col-12 col-sm-6 col-xl-4"
              key={card.title}
            >
              <div className="dashboard-card summary-card">

                <div className="summary-card-content">

                  <div>
                    <div className="card-label">
                      {card.title}
                    </div>

                    <div className="card-value">
                      {card.value}
                    </div>
                  </div>

<div className={`summary-icon ${card.iconClass}`}>
  <i className={`bi ${card.icon}`}></i>
</div>

                </div>

              </div>
            </div>
          ))}

        </div>


        {/* =========================================
            WORLD CLOCKS
        ========================================= */}

{/* =========================================
    WORLD CLOCKS
========================================= */}

<div className="row g-3 dashboard-row">

  {timeZones.map((zone) => (
    <div
      className="col-12 col-md-4"
      key={zone.country}
    >
      <div className="dashboard-card timezone-card">

        <div className="timezone-main">

          <div className="timezone-flag-container">
  <img
    src={`https://flagcdn.com/w40/${zone.code.toLowerCase()}.png`}
    alt={zone.country}
    className="country-flag"
  />
          </div>

          {/* COUNTRY + TIME DATA */}
          <div className="timezone-info">

            <div className="timezone-header">

              <span className="timezone-country">
                {zone.country}
              </span>

              <span className="timezone-badge">
                {zone.timezone}
              </span>

            </div>

<div className="timezone-time">
  {formatTime(zone.ianaTimezone)}
</div>

<div className="timezone-date">
  {formatDate(zone.ianaTimezone)}
</div>

          </div>

        </div>

      </div>
    </div>
  ))}

</div>


        {/* =========================================
            NEXT INTERVIEW
        ========================================= */}

        <div className="next-interview">

          <div className="interview-left">

            <span className="next-interview-label">
              NEXT INTERVIEW
            </span>

            <span className="candidate-name">
              Julia Deveraux
            </span>

            <span className="candidate-details">
              SAP S/4HANA Consultant · Nova Manufacturing · Teams
            </span>

          </div>

          <div className="interview-right">

            <span className="interview-time">
              8:37 PM
            </span>

            <span className="interview-countdown">
              11:51
            </span>

          </div>

        </div>


        {/* =========================================
            STATUS CARDS
        ========================================= */}

        <div className="row g-3 dashboard-row status-row">

          {statusCards.map((card) => (
            <div
              className="col-12 col-sm-6 col-lg-4 col-xl"
              key={card.title}
            >
              <div
                className={`dashboard-card status-card ${
                  card.active ? "status-card-active" : ""
                }`}
              >

<div className="status-icon">
  <i className={`bi ${card.icon}`}></i>
</div>

                <div className="status-value">
                  {card.value}
                </div>

                <div className="status-title">
                  {card.title}
                </div>

                {card.subtitle && (
                  <div className="status-subtitle">
                    {card.subtitle}
                  </div>
                )}

              </div>
            </div>
          ))}

        </div>


            {/* =========================================
        TODAY'S INTERVIEWS + ATTENTION REQUIRED
    ========================================= */}

    <div className="row g-3 dashboard-row interview-dashboard-row">

      {/* =========================================
          TODAY'S INTERVIEWS
      ========================================= */}

      <div className="col-12 col-xl-7">

        <div className="dashboard-card todays-interviews-card">

          {/* Header */}

          <div className="todays-interviews-header">

            <div className="todays-interviews-title">
              <span className="live-dot"></span>
              <span>Today's interviews</span>
            </div>

            <div className="interviews-header-info">
              live countdown · auto-refresh 30s · demo times
            </div>

          </div>


          {/* Interview List */}

          <div className="interview-list">

            {todaysInterviews.map((interview) => (

              <div
                className={`interview-item interview-${interview.status}`}
                key={`${interview.time}-${interview.name}`}
              >

                {/* Time */}

                <div className="interview-time-column">

                  <div className="interview-time">
                    {interview.time}
                  </div>

                </div>


                {/* Candidate Information */}

                <div className="interview-main">

                  <div className="interview-candidate-name">
                    {interview.name}
                  </div>

                  <div className="interview-role">
                    {interview.role} · {interview.company}
                  </div>

                  <div className="interview-meta">

                    <span>
                      {interview.platform}
                    </span>

                    <span className="interview-meta-separator">
                      ·
                    </span>

                    <span>
                      {interview.interviewer}
                    </span>

                    <span className="interview-action">
                      ◈
                    </span>

                    <span className="interview-action">
                      ♟
                    </span>

                    <span className="interview-action">
                      ◯
                    </span>

                    <span className="interview-action">
                      ▣
                    </span>

                  </div>

                </div>


                {/* Countdown */}

                <div className="interview-countdown-box">
                  {interview.countdown}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* =========================================
          ATTENTION REQUIRED
      ========================================= */}

      <div className="col-12 col-xl-5">

        <div className="dashboard-card attention-card">

          <div className="attention-title">
            <span className="attention-symbol">
              ⚡
            </span>

            <span>
              Attention required
            </span>
          </div>


          <div className="attention-list">

            {attentionItems.map((item, index) => (

              <div
                className={`attention-item attention-${item.type}`}
                key={index}
              >

                <span className="attention-dot"></span>

                <span className="attention-text">
                  {item.text}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

      </div>
    </div>
  );
}

export default Dashboard;