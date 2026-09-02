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
  getAllJobsName,
  getSubmissionCounts,
  getSubmissionsByStage,
  getSubmissionStatuses,
  
} from "../../Redux/Slice/recruitmentWorkflowSlice";

import {
  updateSubmission,
  getInterviewsBySubmission,
} from "../../Redux/Slice/candidateSlice";
import Toast from "../../Components/Toast";
import CommonPagination from "../../Components/CommonPagination";

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

  // const {
  //   submissions = [],
  //   submissionsLoading,
  //   submissionsError,

  //   submissionCounts,

  //   submissionStatuses = [],
  //   workflowStages = [],

  //   submissionStatusesLoading,

  //   updatingSubmission,
  //   updateSubmissionError,
  // } = useSelector(
  //   (state) =>
  //     state.recruitmentWorkflow
  // );

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

  submissionsPagination = {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    numberOfElements: 0,
    first: true,
    last: true,
    empty: true,
  },
    allJobsName = [],
  allJobsNameLoading,
  allJobsNameError,

} = useSelector(
  (state) =>
    state.recruitmentWorkflow
);
const {
  interviewsBySubmission = {},
  interviewsBySubmissionLoading = {},
  interviewsBySubmissionError = {},
} = useSelector(
  (state) =>
    state.candidate
);


  const [search, setSearch] =
    useState("");

  const [cvSearch, setCvSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All roles");

const [toast, setToast] = useState(null);
const [currentPage, setCurrentPage] =
  useState(1);

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
  dispatch(getSubmissionStatuses());
  dispatch(getSubmissionCounts());
}, [dispatch]);

useEffect(() => {
  if (!currentStage?.apiStage) {
    return;
  }

  console.log(
    "Fetching job names for pipeline stage:",
    currentStage.apiStage
  );

  dispatch(
    getAllJobsName(currentStage.apiStage)
  );
}, [
  dispatch,
  currentStage?.apiStage,
]);


  /*
  |--------------------------------------------------------------------------
  | LOAD SUBMISSIONS FOR CURRENT WORKFLOW STAGE
  |--------------------------------------------------------------------------
  */

  // useEffect(() => {
  //   if (
  //     !currentStage?.apiStage
  //   ) {
  //     return;
  //   }

  //   dispatch(
  //     getSubmissionsByStage(
  //       currentStage.apiStage
  //     )
  //   );

  // }, [
  //   dispatch,
  //   currentStage?.apiStage,
  // ]);


  useEffect(() => {
  if (
    !currentStage?.apiStage
  ) {
    return;
  }

  dispatch(
    getSubmissionsByStage({
      pipelineStage:
        currentStage.apiStage,

      page:
        currentPage - 1,

      size: 20,
    })
  );

}, [
  dispatch,
  currentStage?.apiStage,
  currentPage,
]);
useEffect(() => {
  setCurrentPage(1);
}, [
  currentStage?.apiStage,
]);
  /*
|--------------------------------------------------------------------------
| LOAD INTERVIEWS FOR EACH SUBMISSION
|--------------------------------------------------------------------------
*/

useEffect(() => {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return;
  }

  submissions.forEach((submission) => {
    if (!submission?.submissionId) {
      return;
    }

    dispatch(
      getInterviewsBySubmission(
        submission.submissionId
      )
    );
  });

}, [
  dispatch,
  submissions,
]);
  /*
  |--------------------------------------------------------------------------
  | CANDIDATE MAPPING
  |--------------------------------------------------------------------------
  */

  const candidates = useMemo(() => {
    return submissions.map(
      (submission) => {

        const interviews =
  interviewsBySubmission[
    submission.submissionId
  ] || [];

const latestInterview =
  interviews.length > 0
    ? interviews[interviews.length - 1]
    : null;

        const name =
          submission.candidateName ||
          "Unknown Candidate";

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
          interviews,

latestInterview,

interviewDate:
  latestInterview?.interviewDate ||
  submission.interviewDate ||
  "",

interviewTime:
  latestInterview?.interviewTime ||
  submission.interviewTime ||
  "",
        };
      }
    );
  }, [
    submissions,
    interviewsBySubmission,

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

  // const roles =
  //   useMemo(() => {

  //     return [
  //       "All roles",
  //       ...new Set(
  //         candidates.map(
  //           (candidate) =>
  //             candidate.role
  //         )
  //       ),
  //     ];

  //   }, [
  //     candidates,
  //   ]);

  const roles =
  useMemo(() => {

    const uniqueJobs = [
      ...new Set(
        allJobsName
          .filter(Boolean)
          .map((job) =>
            job
              .toString()
              .trim()
          )
          .filter(Boolean)
      ),
    ];

    return [
      "All roles",
      ...uniqueJobs,
    ];

  }, [
    allJobsName,
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

const showToast = (
  message,
  type = "success"
) => {
  setToast({
    message,
    type,
  });
};

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
    newStage === candidate.stage
  ) {
    return;
  }

  const targetStage = stages.find(
    (item) =>
      item.id === newStage
  );

  if (!targetStage) {
    return;
  }

  if (!targetStage.statusId) {
    showToast(
      "Status ID not found",
      "danger"
    );

    return;
  }

  try {
    const result =
      await dispatch(
        updateSubmission({
          submissionId:
            candidate.submissionId,

          statusId:
            targetStage.statusId,

          subStatusId:
            null,
        })
      ).unwrap();

    /*
     * SUCCESS TOAST
     */
    showToast(
      `${candidate.name} moved to ${targetStage.label}`,
      "success"
    );

    /*
     * REFRESH COUNTS + CURRENT STAGE
     */
    await Promise.all([
      dispatch(
        getSubmissionCounts()
      ),

      // dispatch(
      //   getSubmissionsByStage(
      //     currentStage.apiStage
      //   )
      // ),

      dispatch(
  getSubmissionsByStage({
    pipelineStage:
      currentStage.apiStage,

    page:
      currentPage - 1,

    size: 20,
  })
)
    ]);

    /*
     * NAVIGATE TO TARGET STAGE
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

    /*
     * BACKEND ERROR TOAST
     */
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message ||
          error?.error ||
          "Failed to update stage";

    showToast(
      `${candidate.name}: ${errorMessage}`,
      "danger"
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


            {/* <p className="page-subtitle">

              Candidates at the "
              {currentStage?.label ||
                "current"}"
              stage — with the role they
              applied for and their
              current status.

            </p> */}

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

                          {candidate.stage === "interview" && (
                            <>
                              {interviewsBySubmissionLoading[
                                candidate.submissionId
                              ] && !candidate.latestInterview && (
                                <span className="workflow-warning">
                                  Loading interview...
                                </span>
                              )}

                              {!interviewsBySubmissionLoading[
                                candidate.submissionId
                              ] && candidate.latestInterview && (
                                <div className="workflow-interview-info">

                                  <div className="workflow-interview-date-time">
                                    <strong>
                                      {candidate.latestInterview.interviewDate || "—"}
                                    </strong>

                                    <span>
                                      {candidate.latestInterview.interviewTime || "—"}
                                    </span>
                                  </div>

                                  <div className="workflow-interview-meta">
                                    <span>
                                      {candidate.latestInterview.interviewType || "—"}
                                    </span>

                                    <span>
                                      {candidate.latestInterview.round || "—"}
                                    </span>
                                  </div>

                                  <div className="workflow-interview-interviewer">
                                    Interviewer:{" "}
                                    {candidate.latestInterview.interviewerName || "—"}
                                  </div>

                                </div>
                              )}

                              {!interviewsBySubmissionLoading[
                                candidate.submissionId
                              ] && !candidate.latestInterview && (
                                <span className="workflow-warning">
                                  ⚿ date/time not set
                                </span>
                              )}
                            </>
                          )}

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
  <Toast
    type={toast.type}
    message={toast.message}
    onClose={() => setToast(null)}
    duration={3000}
  />
)}
<CommonPagination
        currentPage={currentPage}
        totalPages={
          submissionsPagination.totalPages
        }
        totalItems={
          submissionsPagination.totalElements
        }
        itemsPerPage={
          submissionsPagination.size
        }
        onPageChange={(page) =>
          setCurrentPage(page)
        }
        itemLabel="applications"
      />

    </div>
  );
}

export default RecruitmentWorkflowDetails;

