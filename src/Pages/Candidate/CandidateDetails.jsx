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


//       {activeTab === "Notes" && (

//         <NotesTab
//           candidate={candidate}
//           noteText={noteText}
//           setNoteText={setNoteText}
//           notes={notes}
//           handleAddNote={handleAddNote}
//         />

//       )}


//       {activeTab === "History" && (

//         <HistoryTab
//           candidate={candidate}
//         />

//       )}

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
import ApplicationsTab from "./ApplicationsTab"; // Add this import

import {
  getCandidateById,
  clearCandidateDetails,
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
  | GET CANDIDATE BY ID
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!id) {
      return;
    }

    dispatch(
      getCandidateById(id)
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


        <div className="page-header-actions">

          <button className="primary-btn">
            Apply to job
          </button>

          <button className="outline-btn">
            ✉ Message
          </button>

          <button className="outline-btn">
            Edit
          </button>

          <button className="outline-btn detail-delete-btn">
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
          "Applications", // Add Applications tab
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


      {activeTab === "Applications" && ( // Add Applications tab render

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
          candidate={candidate}
        />

      )}

    </div>
  );
}


export default CandidateDetails;