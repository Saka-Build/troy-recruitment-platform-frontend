// import React, {
//   useEffect,
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

// import "./Candidate.css";

// import ProfileTab from "./ProfileTab";
// import CVTab from "./CVTab";
// import NotesTab from "./NotesTab";
// import HistoryTab from "./HistoryTab";
// import ApplicationsTab from "./ApplicationsTab"; // Add this import

// import {
//   getCandidateById,
//   clearCandidateDetails,
// } from "../../Redux/Slice/candidateSlice";


// function CandidateDetails() {

//   const {
//     id,
//   } = useParams();

//   const navigate =
//     useNavigate();

//   const dispatch =
//     useDispatch();


//   /*
//   |--------------------------------------------------------------------------
//   | REDUX
//   |--------------------------------------------------------------------------
//   */

//   const {
//     selectedCandidate,
//     candidateDetailsLoading,
//     candidateDetailsError,
//   } = useSelector(
//     (state) => state.candidate
//   );


//   /*
//   |--------------------------------------------------------------------------
//   | TAB STATE
//   |--------------------------------------------------------------------------
//   */

//   const [
//     activeTab,
//     setActiveTab,
//   ] = useState("Profile");


//   /*
//   |--------------------------------------------------------------------------
//   | NOTES STATE
//   |--------------------------------------------------------------------------
//   */

//   const [
//     noteText,
//     setNoteText,
//   ] = useState("");


//   const [
//     notes,
//     setNotes,
//   ] = useState([
//     {
//       text: "Strong S/4 migration background.",
//       label: "Initial note",
//     },
//   ]);


//   /*
//   |--------------------------------------------------------------------------
//   | GET CANDIDATE BY ID
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {

//     if (!id) {
//       return;
//     }

//     dispatch(
//       getCandidateById(id)
//     );


//     return () => {

//       dispatch(
//         clearCandidateDetails()
//       );

//     };

//   }, [
//     id,
//     dispatch,
//   ]);


//   /*
//   |--------------------------------------------------------------------------
//   | ADD NOTE
//   |--------------------------------------------------------------------------
//   */

//   const handleAddNote = () => {

//     if (!noteText.trim()) {
//       return;
//     }


//     setNotes([
//       ...notes,

//       {
//         text:
//           noteText.trim(),

//         label:
//           "Recruiter note",
//       },
//     ]);


//     setNoteText("");
//   };


//   /*
//   |--------------------------------------------------------------------------
//   | LOADING
//   |--------------------------------------------------------------------------
//   */

//   if (
//     candidateDetailsLoading
//   ) {

//     return (
//       <div className="page">

//         <div className="candidate-not-found">

//           <h2>
//             Loading candidate...
//           </h2>

//         </div>

//       </div>
//     );
//   }


//   /*
//   |--------------------------------------------------------------------------
//   | ERROR
//   |--------------------------------------------------------------------------
//   */

//   if (
//     candidateDetailsError
//   ) {

//     return (
//       <div className="page">

//         <div className="candidate-not-found">

//           <h2>
//             Unable to load candidate
//           </h2>

//           <p>
//             {candidateDetailsError}
//           </p>

//           <button
//             onClick={() =>
//               navigate(
//                 "/dashboard/candidates"
//               )
//             }
//           >
//             ← Back to Candidates
//           </button>

//         </div>

//       </div>
//     );
//   }


//   /*
//   |--------------------------------------------------------------------------
//   | CANDIDATE NOT FOUND
//   |--------------------------------------------------------------------------
//   */

//   if (
//     !selectedCandidate
//   ) {

//     return (
//       <div className="page">

//         <div className="candidate-not-found">

//           <h2>
//             Candidate not found
//           </h2>

//           <button
//             onClick={() =>
//               navigate(
//                 "/dashboard/candidates"
//               )
//             }
//           >
//             ← Back to Candidates
//           </button>

//         </div>

//       </div>
//     );
//   }


//   /*
//   |--------------------------------------------------------------------------
//   | CANDIDATE
//   |--------------------------------------------------------------------------
//   */

//   const candidate =
//     selectedCandidate;


//   /*
//   |--------------------------------------------------------------------------
//   | INITIALS
//   |--------------------------------------------------------------------------
//   */

//   const initials =
//     candidate.fullName
//       ?.split(" ")
//       .map(
//         (name) =>
//           name.charAt(0)
//       )
//       .join("")
//       .substring(0, 2)
//       .toUpperCase();


//   /*
//   |--------------------------------------------------------------------------
//   | RETURN
//   |--------------------------------------------------------------------------
//   */

//   return (

//     <div className="page">

//       {/* =====================================================
//                                 BACK BUTTON
//             ====================================================== */}

//       <div className="candidate-detail-top">

//         <button
//           className="back-candidates-btn"
//           onClick={() =>
//             navigate(
//               "/dashboard/candidates"
//             )
//           }
//         >
//           ← Candidates
//         </button>

//       </div>


//       {/* =====================================================
//                         CANDIDATE PROFILE HEADER
//             ====================================================== */}

//       <div className="candidate-profile-header">

//         <div className="candidate-profile-left">

//           <div className="candidate-profile-avatar">

//             {initials || "NA"}

//           </div>


//           <div className="candidate-profile-info">

//             <div className="candidate-name-row">

//               <h1>
//                 {candidate.fullName}
//               </h1>

//               <span className="candidate-status-badge">

//                 ✉ {candidate.status}

//               </span>

//             </div>


//             <p>

//               {candidate.currentDesignation || "-"}

//               {" · "}

//               {candidate.location || "-"}

//             </p>

//           </div>

//         </div>


//         <div className="page-header-actions">

//           <button className="primary-btn">
//             Apply to job
//           </button>

//           <button className="outline-btn">
//             ✉ Message
//           </button>

//           <button className="outline-btn">
//             Edit
//           </button>

//           <button className="outline-btn detail-delete-btn">
//             Delete
//           </button>

//         </div>

//       </div>


//       {/* =====================================================
//                                 TABS
//             ====================================================== */}

//       <div className="candidate-detail-tabs">

//         {[
//           "Profile",
//           "CV",
//           "Applications", // Add Applications tab
//           "Notes",
//           "History",
//         ].map((tab) => (

//           <button
//             key={tab}
//             className={
//               activeTab === tab
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(tab)
//             }
//           >
//             {tab}
//           </button>

//         ))}

//       </div>


//       {/* =====================================================
//                             TAB COMPONENTS
//             ====================================================== */}

//       {activeTab === "Profile" && (

//         <ProfileTab
//           candidate={candidate}
//         />

//       )}


//       {activeTab === "CV" && (

//         <CVTab
//           candidate={candidate}
//         />

//       )}


//       {activeTab === "Applications" && ( // Add Applications tab render

//         <ApplicationsTab
//           candidate={candidate}
//         />

//       )}


//       {activeTab === "Notes" && (

//         <NotesTab
//           candidate={candidate}
//           noteText={noteText}
//           setNoteText={setNoteText}
//           notes={notes}
//           handleAddNote={handleAddNote}
//         />

//       )}


// {activeTab === "History" && (
//     <HistoryTab candidateId={candidate.id} />
// )}

//     </div>
//   );
// }


// export default CandidateDetails;



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
} from "react-router-dom";

import "./Candidate.css";

import ProfileTab from "./ProfileTab";
import CVTab from "./CVTab";
import NotesTab from "./NotesTab";
import HistoryTab from "./HistoryTab";
import ApplicationsTab from "./ApplicationsTab";

import CandidateModal from "../Candidate/CandidateModal";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";

import {
  getCandidateById,
  clearCandidateDetails,
  getAllEmployees,
  updateCandidate,
  deleteCandidate,
} from "../../Redux/Slice/candidateSlice";


function CandidateDetails() {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();


  /*
  |--------------------------------------------------------------------------
  | REDUX
  |--------------------------------------------------------------------------
  */

  const {
    selectedCandidate,
    candidateDetailsLoading,
    candidateDetailsError,

    employees = [],
    employeesLoading = false,
    employeeError = null,

    adding = false,
  } = useSelector(
    (state) => state.candidate
  );


  /*
  |--------------------------------------------------------------------------
  | TAB STATE
  |--------------------------------------------------------------------------
  */

  const [
    activeTab,
    setActiveTab,
  ] = useState("Profile");


  /*
  |--------------------------------------------------------------------------
  | NOTES STATE
  |--------------------------------------------------------------------------
  */

  const [
    noteText,
    setNoteText,
  ] = useState("");


  const [
    notes,
    setNotes,
  ] = useState([
    {
      text: "Strong S/4 migration background.",
      label: "Initial note",
    },
  ]);


  /*
  |--------------------------------------------------------------------------
  | EDIT / DELETE STATE
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | FETCH CANDIDATE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!id) {
      return;
    }

    dispatch(
      getCandidateById(id)
    );

    /*
     * Employees are needed by CandidateModal
     * when editing.
     */

    dispatch(
      getAllEmployees()
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


  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | ADD NOTE
  |--------------------------------------------------------------------------
  */

  const handleAddNote = () => {

    if (!noteText.trim()) {
      return;
    }


    setNotes([
      ...notes,

      {
        text:
          noteText.trim(),

        label:
          "Recruiter note",
      },
    ]);


    setNoteText("");
  };


  /*
  |--------------------------------------------------------------------------
  | EDIT CANDIDATE
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | SAVE EDIT
  |--------------------------------------------------------------------------
  */

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


      /*
       * Close modal
       */

      setShowEditModal(false);


      /*
       * Reload candidate details
       */

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


  /*
  |--------------------------------------------------------------------------
  | DELETE CANDIDATE
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | CONFIRM DELETE
  |--------------------------------------------------------------------------
  */

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


      /*
       * Close modal
       */

      setShowDeleteModal(false);


      showNotification(
        "success",
        "Candidate deleted successfully"
      );


      /*
       * Give notification a moment to show,
       * then return to Candidates.
       */

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


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | CANDIDATE NOT FOUND
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | CANDIDATE
  |--------------------------------------------------------------------------
  */

  const candidate =
    selectedCandidate;


  /*
  |--------------------------------------------------------------------------
  | INITIALS
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return (

    <div className="page">


      {/* =====================================================
                            BACK BUTTON
      ====================================================== */}

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


      {/* =====================================================
                    CANDIDATE PROFILE HEADER
      ====================================================== */}

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


        {/* =====================================================
                            HEADER ACTIONS
        ====================================================== */}

        <div className="page-header-actions">

          <button
            className="primary-btn"
          >
            Apply to job
          </button>


          <button
            className="outline-btn"
          >
            ✉ Message
          </button>


          <button
            className="outline-btn"
            onClick={
              handleEditClick
            }
          >
            Edit
          </button>


          <button
            className="outline-btn detail-delete-btn"
            onClick={
              handleDeleteClick
            }
          >
            Delete
          </button>

        </div>

      </div>


      {/* =====================================================
                            TABS
      ====================================================== */}

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


      {/* =====================================================
                        TAB COMPONENTS
      ====================================================== */}

      {activeTab === "Profile" && (

        <ProfileTab
          candidate={candidate}
        />

      )}


      {activeTab === "CV" && (

        <CVTab
          candidate={candidate}
        />

      )}


      {activeTab === "Applications" && (

        <ApplicationsTab
          candidate={candidate}
        />

      )}


      {activeTab === "Notes" && (

        <NotesTab
          candidate={candidate}
          noteText={noteText}
          setNoteText={setNoteText}
          notes={notes}
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


      {/* =====================================================
                            NOTIFICATION
      ====================================================== */}

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


      {/* =====================================================
                        EDIT MODAL
      ====================================================== */}

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


      {/* =====================================================
                    DELETE CONFIRMATION MODAL
      ====================================================== */}

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

    </div>
  );
}


export default CandidateDetails;