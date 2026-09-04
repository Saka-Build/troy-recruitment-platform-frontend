import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import "./Candidate.css";

import ProfileTab from "./ProfileTab";
import CVTab from "./CVTab";
import NotesTab from "./NotesTab";
import HistoryTab from "./HistoryTab";
import ApplicationsTab from "./ApplicationsTab";

import CandidateModal from "../Candidate/CandidateModal";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import { getOpenJobs, } from "../../Redux/Slice/jobSlice";

import ApplyJobModal from "../Candidate/ApplyJobModal";
import {
  getCandidateById,
  clearCandidateDetails,
  getAllEmployees,
  updateCandidate,
  deleteCandidate,
  //  getSubmissionStatuses,
  createSubmission,
  getCandidateApplications,
  createNote,
  getCandidateNotes,
  getInterviewsBySubmission,
} from "../../Redux/Slice/candidateSlice";
import {
  getSubmissionStatuses,
} from "../../Redux/Slice/recruitmentWorkflowSlice";

function CandidateDetails() {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const {
    selectedCandidate,
    candidateDetailsLoading,
    candidateDetailsError,

    employees = [],
    employeesLoading = false,
    employeeError = null,

    adding = false,

    // submissionStatuses = [],
    // submissionStatusesLoading = false,
    // submissionStatusesError = null,

    creatingSubmission = false,
    createSubmissionError = null,
    notes = [],
    notesLoading = false,
    notesError = null,
    creatingNote = false,
    createNoteError = null,
    candidateApplications = [],
    candidateApplicationsLoading = false,
    interviewsBySubmission = {},
  } = useSelector(
    (state) => state.candidate
  );

  const {
    submissionStatuses = [],
    submissionStatusesLoading = false,
    submissionStatusesError = null,
  } = useSelector(
    (state) => state.recruitmentWorkflow
  );

  const {
    openJobs = [],
    isOpenJobsLoading = false,
  } = useSelector(
    (state) => state.jobs
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab =
    searchParams.get("tab") || "Profile";

  const setActiveTab = (tab) => {
    setSearchParams({
      tab,
    });
  };


  const [
    noteText,
    setNoteText,
  ] = useState("");
  const [
    showApplyJobModal,
    setShowApplyJobModal,
  ] = useState(false);


  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);


  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);


  const [
    deleting,
    setDeleting,
  ] = useState(false);


  const [
    notification,
    setNotification,
  ] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {

    if (!candidateApplications.length) {
      return;
    }

    candidateApplications.forEach((application) => {

      const submissionId =
        application.id ||
        application.submissionId;

      if (!submissionId) {
        return;
      }

      dispatch(
        getInterviewsBySubmission(
          submissionId
        )
      );

    });

  }, [
    candidateApplications,
    dispatch,
  ]);

  useEffect(() => {

    if (!id) {
      return;
    }

    dispatch(
      getCandidateById(id)
    );

    dispatch(
      getAllEmployees()
    );
    dispatch(
      getOpenJobs()
    );
    dispatch(
      getSubmissionStatuses()
    );
    dispatch(
      getCandidateNotes(id)
    );
    dispatch(
      getCandidateApplications(id)
    );

    return () => {

      dispatch(
        clearCandidateDetails()
      );

    };

  }, [
    id,
    dispatch,
  ]);

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


  const handleAddNote = async () => {

    const content = noteText.trim();

    if (!content) {
      showNotification(
        "error",
        "Please enter a note"
      );

      return;
    }

    if (!selectedCandidate?.id) {
      showNotification(
        "error",
        "Candidate ID is missing"
      );

      return;
    }

    try {

      console.log(
        "CREATING NOTE:",
        {
          entityType: "candidate",
          entityId: selectedCandidate.id,
          content,
          chatWith: null,
        }
      );

      await dispatch(
        createNote({
          entityType: "candidate",
          entityId: selectedCandidate.id,
          content,
          chatWith: null,
        })
      ).unwrap();

      // Refresh notes from backend
      await dispatch(
        getCandidateNotes(
          selectedCandidate.id
        )
      ).unwrap();

      setNoteText("");

      showNotification(
        "success",
        "Note added successfully"
      );

    } catch (error) {

      console.error(
        "CREATE NOTE ERROR:",
        error
      );

      showNotification(
        "error",
        typeof error === "string"
          ? error
          : "Failed to add note"
      );
    }
  };

  const handleEditClick = () => {

    if (!selectedCandidate?.id) {

      showNotification(
        "error",
        "Candidate ID is missing"
      );

      return;
    }


    setShowEditModal(true);
  };

  const handleEditSave = async (data) => {

    if (!selectedCandidate?.id) {

      showNotification(
        "error",
        "Candidate ID is missing"
      );

      return;
    }


    const isNull = (value) =>
      value === null;


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
            : Number(data.experience),

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
        isNull(data.noticePeriod)
          ? null
          : data.noticePeriod === ""
            ? ""
            : Number(data.noticePeriod),

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
        isNull(data.currentRateAmount)
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
        isNull(data.dayRateAmount)
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


    console.log(
      "UPDATING CANDIDATE FROM DETAILS:",
      {
        id: selectedCandidate.id,
        candidateData,
      }
    );


    try {

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


      setShowEditModal(false);

      await dispatch(
        getCandidateById(
          selectedCandidate.id
        )
      ).unwrap();


    } catch (error) {

      console.error(
        "UPDATE CANDIDATE ERROR:",
        error
      );


      showNotification(
        "error",
        typeof error === "string"
          ? error
          : "Failed to update candidate"
      );
    }
  };

  const handleDeleteClick = () => {

    if (!selectedCandidate?.id) {

      showNotification(
        "error",
        "Candidate ID is missing"
      );

      return;
    }


    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {

    if (!selectedCandidate?.id) {
      return;
    }


    try {

      setDeleting(true);


      console.log(
        "DELETING CANDIDATE:",
        selectedCandidate.id
      );


      await dispatch(
        deleteCandidate(
          selectedCandidate.id
        )
      ).unwrap();

      setShowDeleteModal(false);


      showNotification(
        "success",
        "Candidate deleted successfully"
      );

      setTimeout(() => {

        navigate(
          "/dashboard/candidates"
        );

      }, 800);


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

  const handleApplyToJob = () => {
    setShowApplyJobModal(true);
  };

  const handleApplyJobSubmit = async ({
    candidateId,
    jobId,
    statusId,
    job,
    status,
  }) => {

    console.log(
      "========== APPLY CANDIDATE TO JOB =========="
    );

    console.log({
      candidateId,
      jobId,
      statusId,
      job,
      status,
    });


    if (!candidateId) {

      showNotification(
        "error",
        "Candidate ID is missing"
      );

      return;
    }


    if (!jobId) {

      showNotification(
        "error",
        "Job ID is missing"
      );

      return;
    }


    if (!statusId) {

      showNotification(
        "error",
        "Submission status is missing"
      );

      return;
    }


    try {

      const result = await dispatch(
        createSubmission({
          candidateId,
          jobId,
          statusId,
        })
      ).unwrap();

      await dispatch(
        getCandidateApplications(candidateId)
      ).unwrap();

      setShowApplyJobModal(false);

      showNotification(
        "success",
        "Candidate application created successfully"
      );

      setActiveTab("Applications");


      console.log(
        "========== SUBMISSION CREATED =========="
      );

      console.log(
        "Create submission response:",
        result
      );


      setShowApplyJobModal(
        false
      );


      showNotification(
        "success",
        "Candidate application created successfully"
      );


      setActiveTab(
        "Applications"
      );


    } catch (error) {

      console.error(
        "CREATE SUBMISSION ERROR:",
        error
      );


      showNotification(
        "error",

        typeof error === "string"
          ? error
          : "Failed to apply candidate to this job"
      );

    }

  };

  if (
    candidateDetailsLoading
  ) {

    return (
      <div className="page">

        <div className="candidate-not-found">

          <h2>
            Loading candidate...
          </h2>

        </div>

      </div>
    );
  }

  if (
    candidateDetailsError
  ) {

    return (
      <div className="page">

        <div className="candidate-not-found">

          <h2>
            Unable to load candidate
          </h2>

          <p>
            {candidateDetailsError}
          </p>

          <button
            onClick={() =>
              navigate(
                "/dashboard/candidates"
              )
            }
          >
            ← Back to Candidates
          </button>

        </div>

      </div>
    );
  }


  if (
    !selectedCandidate
  ) {

    return (
      <div className="page">

        <div className="candidate-not-found">

          <h2>
            Candidate not found
          </h2>

          <button
            onClick={() =>
              navigate(
                "/dashboard/candidates"
              )
            }
          >
            ← Back to Candidates
          </button>

        </div>

      </div>
    );
  }

  const candidate =
    selectedCandidate;
    const appliedForJobName =
    candidateApplications?.[0]?.jobName || "-";

  const getLatestCandidateInterview = () => {

    if (!candidateApplications.length) {
      return null;
    }

    const allInterviews = [];

    candidateApplications.forEach((application) => {

      /*
       * IMPORTANT:
       * Only show interview details when the
       * application status is "Interview".
       */
      const applicationStatus =
        application?.status ||
        application?.statusName ||
        "";

      const isInterviewStatus =
        String(applicationStatus)
          .trim()
          .toLowerCase() === "interview";

      if (!isInterviewStatus) {
        return;
      }

      const submissionId =
        application.id ||
        application.submissionId;

      if (!submissionId) {
        return;
      }

      const key = String(submissionId);

      const rawInterviews =
        interviewsBySubmission[key] ||
        interviewsBySubmission[submissionId];

      if (!rawInterviews) {
        return;
      }

      let interviews = [];

      if (Array.isArray(rawInterviews)) {

        interviews = rawInterviews;

      } else if (Array.isArray(rawInterviews.content)) {

        interviews = rawInterviews.content;

      } else if (Array.isArray(rawInterviews.data)) {

        interviews = rawInterviews.data;

      } else if (
        Array.isArray(rawInterviews.data?.content)
      ) {

        interviews =
          rawInterviews.data.content;

      } else if (
        rawInterviews.interviewDate ||
        rawInterviews.date
      ) {

        interviews = [rawInterviews];

      }

      interviews.forEach((interview) => {

        const status = String(
          interview?.status ||
          interview?.interviewStatus ||
          ""
        )
          .trim()
          .toLowerCase();

        /*
         * Only consider scheduled interviews.
         */
        if (
          !status ||
          status === "scheduled" ||
          status === "schedule"
        ) {

          allInterviews.push({
            ...interview,
            submissionId,
          });

        }

      });

    });

    if (!allInterviews.length) {
      return null;
    }

    const getTimestamp = (interview) => {

      const date =
        interview?.interviewDate ||
        interview?.date;

      const time =
        interview?.interviewTime ||
        interview?.time;

      if (!date) {
        return 0;
      }

      /*
       * DD-MM-YYYY
       */
      if (
        /^\d{2}-\d{2}-\d{4}$/.test(
          String(date)
        )
      ) {

        const [
          day,
          month,
          year,
        ] = String(date).split("-");

        let hours = 0;
        let minutes = 0;

        if (time) {

          const match =
            String(time).match(
              /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
            );

          if (match) {

            hours =
              Number(match[1]);

            minutes =
              Number(match[2]);

            const period =
              match[3]?.toUpperCase();

            if (
              period === "PM" &&
              hours !== 12
            ) {
              hours += 12;
            }

            if (
              period === "AM" &&
              hours === 12
            ) {
              hours = 0;
            }

          }

        }

        return new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          hours,
          minutes
        ).getTime();

      }

      /*
       * YYYY-MM-DD / ISO
       */
      const timestamp =
        new Date(date).getTime();

      return Number.isNaN(timestamp)
        ? 0
        : timestamp;

    };

    return [...allInterviews].sort(
      (a, b) =>
        getTimestamp(b) -
        getTimestamp(a)
    )[0];

  };


  /*
   * NOW call the function only AFTER
   * it has been declared.
   */
  const latestInterview =
    getLatestCandidateInterview();


  const initials =
    candidate.fullName
      ?.split(" ")
      .map(
        (name) =>
          name.charAt(0)
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const formatCandidateInterviewDate = (date) => {

    if (!date) {
      return "-";
    }

    if (
      /^\d{2}-\d{2}-\d{4}$/.test(
        String(date)
      )
    ) {
      return date;
    }

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        String(date)
      )
    ) {

      const [
        year,
        month,
        day,
      ] = String(date).split("-");

      return `${day}-${month}-${year}`;

    }

    return date;
  };


  const formatCandidateInterviewTime = (time) => {

    if (!time) {
      return "";
    }

    if (
      /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(
        String(time)
      )
    ) {

      const [
        timePart,
        period,
      ] = String(time).split(/\s+/);

      const [
        hours,
        minutes,
      ] = timePart.split(":");

      return `${hours.padStart(
        2,
        "0"
      )}:${minutes} ${period.toUpperCase()}`;

    }

    if (
      /^\d{1,2}:\d{2}$/.test(
        String(time)
      )
    ) {

      const [
        hoursString,
        minutes,
      ] = String(time).split(":");

      let hours =
        Number(hoursString);

      const period =
        hours >= 12
          ? "PM"
          : "AM";

      hours =
        hours % 12 || 12;

      return `${String(hours).padStart(
        2,
        "0"
      )}:${minutes} ${period}`;

    }

    return time;
  };


  const getCandidateInterviewRound = (interview) => {

    const round =
      interview?.round || "";

    const normalizedRound =
      String(round)
        .trim()
        .toLowerCase();

    if (normalizedRound === "technical") {
      return "Technical Round";
    }

    if (normalizedRound === "hr") {
      return "HR Round";
    }

    if (normalizedRound === "final") {
      return "Final Round";
    }

    return round || "-";
  };

  return (

    <div className="page">
      <div className="candidate-detail-top">

        <button
          className="back-candidates-btn"
          onClick={() =>
            navigate(
              "/dashboard/candidates"
            )
          }
        >
          ← Candidates
        </button>

      </div>
      <div className="candidate-profile-header">

        <div className="candidate-profile-left">

          <div className="candidate-profile-avatar">
            {initials || "NA"}
          </div>

          <div className="candidate-profile-info">

            <div className="candidate-name-row">

              <h1>
                {candidate.fullName}
              </h1>

              <span className="candidate-status-badge">
                ✉ {candidate.status}
              </span>

            </div>

            <p>
              {candidate.currentDesignation || "-"}
              {" · "}
              {candidate.location || "-"}
            </p>

          </div>

        </div>

        <div className="page-header-actions">

          <button
            className="primary-btn"
            onClick={handleApplyToJob}
          >
            + Apply to job
          </button>

          <button
            type="button"
            className="outline-btn"
            disabled
          >
            ✉ Message
          </button>

          <button
            className="outline-btn"
            onClick={handleEditClick}
          >
            Edit
          </button>

          <button
            className="outline-btn detail-delete-btn"
            onClick={handleDeleteClick}
          >
            Delete
          </button>

        </div>

      </div>

      {latestInterview && (
        <div className="cxandidate-interview-scheduled-box">

          <div className="cxandidate-interview-scheduled-left">

            <div className="cxandidate-interview-scheduled-badge">
              <span className="cxandidate-interview-badge-icon">
                🎤
              </span>

              INTERVIEW SCHEDULED
            </div>

            <div className="cxandidate-interview-scheduled-details">

              <strong>
                {formatCandidateInterviewDate(
                  latestInterview.interviewDate ||
                  latestInterview.date
                )}
              </strong>

              <span className="cxandidate-interview-dot">
                ·
              </span>

              <strong>
                {formatCandidateInterviewTime(
                  latestInterview.interviewTime ||
                  latestInterview.time
                )}
              </strong>

              <span className="cxandidate-interview-dot">
                ·
              </span>

              <span>
                {latestInterview.interviewType ||
                  latestInterview.type ||
                  "-"}
              </span>

              <span className="cxandidate-interview-dot">
                ·
              </span>

              <span>
                {getCandidateInterviewRound(latestInterview)}
              </span>

              {latestInterview.interviewerName && (
                <>
                  <span className="cxandidate-interview-dot">
                    ·
                  </span>

                  <span>
                    {latestInterview.interviewerName}
                  </span>
                </>
              )}

            </div>

          </div>



        </div>
      )}
      <div className="candidate-detail-tabs">

        {[
          "Profile",
          "CV",
          "Applications",
          "Notes",
          "History",
        ].map((tab) => (

          <button
            key={tab}
            className={
              activeTab === tab
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(tab)
            }
          >
            {tab}
          </button>

        ))}

      </div>
      {activeTab === "Profile" && (

        <ProfileTab
          candidate={candidate}
          appliedForJobName={appliedForJobName}
        />

      )}


      {activeTab === "CV" && (

        <CVTab
          candidate={candidate}
        />

      )}


      {activeTab === "Applications" && (
        <ApplicationsTab
          candidateId={candidate.id}

          openJobs={openJobs}
          isOpenJobsLoading={isOpenJobsLoading}

          submissionStatuses={submissionStatuses}
          submissionStatusesLoading={submissionStatusesLoading}
          submissionStatusesError={submissionStatusesError}

          creatingSubmission={creatingSubmission}
          createSubmissionError={createSubmissionError}

          onApplyJob={handleApplyJobSubmit}
        />
      )}


      {activeTab === "Notes" && (

        <NotesTab
          candidate={candidate}
          noteText={noteText}
          setNoteText={setNoteText}
          notes={notes}
          notesLoading={notesLoading}
          notesError={notesError}
          creatingNote={creatingNote}
          createNoteError={createNoteError}
          handleAddNote={handleAddNote}
        />

      )}


      {activeTab === "History" && (

        <HistoryTab
          candidateId={
            candidate.id
          }
        />

      )}
      {notification.show && (

        <div
          className={
            `candidate-notification candidate-notification-${notification.type}`
          }
        >

          <div className="candidate-notification-icon">

            {notification.type === "success" && (
              <i className="fas fa-check"></i>
            )}

            {notification.type === "error" && (
              <i className="fas fa-times"></i>
            )}

            {notification.type === "info" && (
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
      {showEditModal && (

        <CandidateModal
          mode="edit"

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

          onClose={() => {

            if (adding) {
              return;
            }

            setShowEditModal(false);

          }}

          onSave={
            handleEditSave
          }

        />

      )}
      <DeleteConfirmationModal

        isOpen={
          showDeleteModal
        }

        onClose={() => {

          if (deleting) {
            return;
          }

          setShowDeleteModal(false);

        }}

        onConfirm={
          handleConfirmDelete
        }

        title="Delete candidate"

        itemName={
          candidate.fullName || ""
        }

        deleteText={
          deleting
            ? "Deleting..."
            : "Delete"
        }

        cancelText="Cancel"

      />

      {showApplyJobModal && (
        <ApplyJobModal

          candidateId={
            candidate.id
          }

          jobs={
            openJobs
          }

          jobsLoading={
            isOpenJobsLoading
          }

          statuses={
            submissionStatuses
          }

          statusesLoading={
            submissionStatusesLoading
          }

          creatingSubmission={
            creatingSubmission
          }

          onClose={() =>
            setShowApplyJobModal(false)
          }

          onApply={
            handleApplyJobSubmit
          }

        />
      )}

    </div>
  );
}
export default CandidateDetails;