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
// import AddCandidateModal from '../Candidate/CandidateModal';
// import {
//     getAllCandidates,
// } from "../../Redux/Slice/candidateSlice";


// const Candidates = () => {

//     const dispatch = useDispatch();

//     /*
//     |--------------------------------------------------------------------------
//     | GET CANDIDATES FROM REDUX
//     |--------------------------------------------------------------------------
//     */
//     const {
//         candidates = [],
//         loading,
//         error,
//     } = useSelector(
//         (state) => state.candidate
//     );


//     /*
//     |--------------------------------------------------------------------------
//     | LOCAL STATE
//     |--------------------------------------------------------------------------
//     */
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [statusFilter, setStatusFilter] =
//         useState("All statuses");

//     /*
//      * Used only for the current UI selection.
//      * Backend update API can be connected later.
//      */
//     const [localStatuses, setLocalStatuses] =
//         useState({});


//     /*
//     |--------------------------------------------------------------------------
//     | FETCH CANDIDATES
//     |--------------------------------------------------------------------------
//     */
//     useEffect(() => {
//         dispatch(getAllCandidates());
//     }, [dispatch]);


//     /*
//     |--------------------------------------------------------------------------
//     | STATUS COLOR
//     |--------------------------------------------------------------------------
//     */
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


//     /*
//     |--------------------------------------------------------------------------
//     | STATUS BACKGROUND COLOR
//     |--------------------------------------------------------------------------
//     */
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


//     /*
//     |--------------------------------------------------------------------------
//     | GET CURRENT STATUS
//     |--------------------------------------------------------------------------
//     */
//     const getCandidateStatus = (candidate) => {

//         return (
//             localStatuses[candidate.id] ??
//             candidate.status ??
//             "Active"
//         );
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | STATUS CHANGE
//     |--------------------------------------------------------------------------
//     */
//     const handleStatusChange = (
//         id,
//         newStatus
//     ) => {

//         setLocalStatuses((previous) => ({
//             ...previous,
//             [id]: newStatus,
//         }));
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | DELETE
//     |--------------------------------------------------------------------------
//     |
//     | Delete API is not provided yet.
//     | Therefore we only show the action for now.
//     |
//     */
//     const handleDelete = (id) => {

//         console.log(
//             "Delete candidate:",
//             id
//         );

//         alert(
//             "Delete API is not connected yet."
//         );
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | EDIT
//     |--------------------------------------------------------------------------
//     */
//     const handleEdit = (id) => {

//         console.log(
//             "Edit candidate:",
//             id
//         );

//         alert(
//             `Edit candidate: ${id}`
//         );
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | APPLICATIONS
//     |--------------------------------------------------------------------------
//     */
//     const handleApplications = (id) => {

//         console.log(
//             "View applications for candidate:",
//             id
//         );

//         alert(
//             `Applications for candidate: ${id}`
//         );
//     };


//     /*
//     |--------------------------------------------------------------------------
//     | FILTER + SEARCH
//     |--------------------------------------------------------------------------
//     */
//     const filteredCandidates = useMemo(() => {

//         const search =
//             searchTerm
//                 .trim()
//                 .toLowerCase();


//         return candidates.filter(
//             (candidate) => {

//                 const currentStatus =
//                     getCandidateStatus(candidate);


//                 /*
//                 |--------------------------------------------------------------------------
//                 | SKILLS
//                 |--------------------------------------------------------------------------
//                 */
//                 const skillsText =
//                     Array.isArray(candidate.skills)
//                         ? candidate.skills.join(" ")
//                         : "";


//                 /*
//                 |--------------------------------------------------------------------------
//                 | SEARCH
//                 |--------------------------------------------------------------------------
//                 */
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


//                 /*
//                 |--------------------------------------------------------------------------
//                 | STATUS FILTER
//                 |--------------------------------------------------------------------------
//                 */
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


//     /*
//     |--------------------------------------------------------------------------
//     | STATS
//     |--------------------------------------------------------------------------
//     */
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


//     /*
//     |--------------------------------------------------------------------------
//     | LOADING
//     |--------------------------------------------------------------------------
//     */
//     if (loading) {

//         return (
//             <div className="candidates-page">

//                 <div className="candidates-content">

//                     <div className="candidates-header">

//                         <div>
//                             <h1>
//                                 Candidates
//                             </h1>

//                             <p className="candidates-subtitle">
//                                 Loading candidates...
//                             </p>
//                         </div>

//                     </div>

//                 </div>

//             </div>
//         );
//     }


//     /*
//     |--------------------------------------------------------------------------
//     | ERROR
//     |--------------------------------------------------------------------------
//     */
//     if (error) {

//         return (
//             <div className="candidates-page">

//                 <div className="candidates-content">

//                     <div className="candidates-header">

//                         <div>
//                             <h1>
//                                 Candidates
//                             </h1>

//                             <p className="candidates-subtitle">
//                                 Unable to load candidates
//                             </p>
//                         </div>

//                     </div>

//                     <div
//                         style={{
//                             padding: "20px",
//                             color: "#c33443",
//                             background: "#fff0f2",
//                             borderRadius: "8px",
//                         }}
//                     >
//                         {error}
//                     </div>

//                     <button
//                         className="candidates-add-btn"
//                         style={{
//                             marginTop: "15px",
//                         }}
//                         onClick={() =>
//                             dispatch(
//                                 getAllCandidates()
//                             )
//                         }
//                     >
//                         Retry
//                     </button>

//                 </div>

//             </div>
//         );
//     }


//     return (

//         <div className="candidates-page">

//             <div className="candidates-content">


//                 {/* =========================================================
//                     HEADER
//                 ========================================================= */}

//                 <div className="candidates-header">

//                     <div>

//                         <h1>
//                             Candidates
//                         </h1>

//                         <p className="candidates-subtitle">
//                             {total} candidates in your database
//                         </p>

//                     </div>


//                     <div className="candidates-header-actions">

//                         <button
//                             className="candidates-export-btn"
//                         >
//                             <i className="fas fa-download"></i>

//                             {" "}Export CSV
//                         </button>


//                         <button
//                             className="candidates-add-btn"
//                              onClick={() => setShowAddModal(true)}
//                         >
//                             <i className="fas fa-plus"></i>

//                             {" "}Add candidate
//                         </button>

//                     </div>

//                 </div>


//                 {/* =========================================================
//                     STATS
//                 ========================================================= */}

//                 <div className="candidates-stats-grid">


//                     <div className="candidate-stat-card">

//                         <div className="candidate-stat-value">
//                             {total}
//                         </div>

//                         <div className="candidate-stat-label">
//                             Total
//                         </div>

//                     </div>


//                     <div className="candidate-stat-card">

//                         <div className="candidate-stat-value">
//                             {active}
//                         </div>

//                         <div className="candidate-stat-label">
//                             Active
//                         </div>

//                     </div>


//                     <div className="candidate-stat-card">

//                         <div className="candidate-stat-value">
//                             {inactive}
//                         </div>

//                         <div className="candidate-stat-label">
//                             Inactive
//                         </div>

//                     </div>


//                     <div className="candidate-stat-card">

//                         <div className="candidate-stat-value">
//                             {blacklisted}
//                         </div>

//                         <div className="candidate-stat-label">
//                             Blacklisted
//                         </div>

//                     </div>

//                 </div>


//                 {/* =========================================================
//                     SEARCH + FILTER
//                 ========================================================= */}

//                 <div className="candidates-search-filter">


//                     <div className="candidates-search-wrapper">

//                         <i className="fas fa-search"></i>

//                         <input
//                             type="text"
//                             placeholder="Search name, CV ID, owner, skills..."
//                             value={searchTerm}
//                             onChange={(e) =>
//                                 setSearchTerm(
//                                     e.target.value
//                                 )
//                             }
//                         />

//                     </div>


//                     <div className="candidates-filter-wrapper">

//                         <select
//                             className="candidates-status-filter"
//                             value={statusFilter}
//                             onChange={(e) =>
//                                 setStatusFilter(
//                                     e.target.value
//                                 )
//                             }
//                         >

//                             <option value="All statuses">
//                                 All statuses
//                             </option>

//                             <option value="Active">
//                                 Active
//                             </option>

//                             <option value="Inactive">
//                                 Inactive
//                             </option>

//                             <option value="Blacklisted">
//                                 Blacklisted
//                             </option>

//                         </select>


//                         <i className="fas fa-chevron-down filter-arrow"></i>

//                     </div>

//                 </div>


//                 {/* =========================================================
//                     TABLE
//                 ========================================================= */}

//                 <div className="candidates-table-wrapper">

//                     <table className="candidates-table">

//                         <thead>

//                             <tr>

//                                 <th>
//                                     CV ID
//                                 </th>

//                                 <th>
//                                     CANDIDATE
//                                 </th>

//                                 <th>
//                                     CANDIDATE STATUS
//                                 </th>

//                                 <th>
//                                     OWNER · RECRUITER
//                                 </th>

//                                 <th>
//                                     ACTIONS
//                                 </th>

//                             </tr>

//                         </thead>


//                         <tbody>

//                             {filteredCandidates.map(
//                                 (candidate) => {

//                                     const status =
//                                         getCandidateStatus(
//                                             candidate
//                                         );


//                                     return (

//                                         <tr
//                                             key={candidate.id}
//                                         >

//                                             {/* CV ID */}

//                                             <td className="candidate-cv-id">

//                                                 {candidate.cvId ||
//                                                     "-"}

//                                             </td>


//                                             {/* CANDIDATE */}

//                                             <td>

//                                                 <div className="candidate-name">

//                                                     {candidate.fullName ||
//                                                         "-"}

//                                                 </div>


//                                                 <div className="candidate-details">

//                                                     {candidate.currentDesignation ||
//                                                         "-"}

//                                                     {" · "}

//                                                     {candidate.location ||
//                                                         "-"}

//                                                 </div>

//                                             </td>


//                                             {/* STATUS */}

//                                             <td>

//                                                 <div className="candidate-status-wrapper">

//                                                     <span
//                                                         className="candidate-status-dot"
//                                                         style={{
//                                                             backgroundColor:
//                                                                 getStatusColor(
//                                                                     status
//                                                                 ),
//                                                         }}
//                                                     ></span>


//                                                     <select
//                                                         className="candidate-status-select"
//                                                         value={status}
//                                                         onChange={(e) =>
//                                                             handleStatusChange(
//                                                                 candidate.id,
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                         style={{
//                                                             backgroundColor:
//                                                                 getStatusBgColor(
//                                                                     status
//                                                                 ),
//                                                             color:
//                                                                 getStatusColor(
//                                                                     status
//                                                                 ),
//                                                         }}
//                                                     >

//                                                         <option value="Active">
//                                                             Active
//                                                         </option>

//                                                         <option value="Inactive">
//                                                             Inactive
//                                                         </option>

//                                                         <option value="Blacklisted">
//                                                             Blacklisted
//                                                         </option>

//                                                     </select>

//                                                 </div>

//                                             </td>


//                                             {/* OWNER */}

//                                             <td className="candidate-owner">

//                                                 {candidate.cvOwnerName ||
//                                                     "-"}

//                                             </td>


//                                             {/* ACTIONS */}

//                                             <td>

//                                                 <div className="candidate-actions">


//                                                     <button
//                                                         className="candidate-action-btn"
//                                                         onClick={() =>
//                                                             handleApplications(
//                                                                 candidate.id
//                                                             )
//                                                         }
//                                                     >
//                                                         Applications
//                                                     </button>


//                                                     <button
//                                                         className="candidate-action-btn"
//                                                         onClick={() =>
//                                                             handleEdit(
//                                                                 candidate.id
//                                                             )
//                                                         }
//                                                     >
//                                                         Edit
//                                                     </button>


//                                                     <button
//                                                         className="candidate-action-btn candidate-delete-btn"
//                                                         onClick={() =>
//                                                             handleDelete(
//                                                                 candidate.id
//                                                             )
//                                                         }
//                                                     >
//                                                         Delete
//                                                     </button>

//                                                 </div>

//                                             </td>

//                                         </tr>

//                                     );
//                                 }
//                             )}


//                             {/* =================================================
//                                 EMPTY STATE
//                             ================================================= */}

//                             {filteredCandidates.length === 0 && (

//                                 <tr>

//                                     <td
//                                         colSpan="5"
//                                         className="candidates-empty-state"
//                                     >

//                                         <div>

//                                             <i className="fas fa-users"></i>

//                                             <strong>
//                                                 No candidates found
//                                             </strong>

//                                             <span>
//                                                 Try adjusting your search or filter
//                                             </span>

//                                         </div>

//                                     </td>

//                                 </tr>

//                             )}

//                         </tbody>

//                     </table>

//                 </div>

//             </div>
//           {showAddModal && (
//             <AddCandidateModal
//               onClose={() => setShowAddModal(false)}
//               onAdd={(newCandidate) => {
//                 // Handle adding candidate
//                 console.log('New candidate:', newCandidate);
//                 setShowAddModal(false);
//               }}
//             />
//           )}
//         </div>
//     );
// };


// export default Candidates;



import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import "./candidate.css";
import CandidateModal from '../Candidate/CandidateModal';
import {
    getAllCandidates,
} from "../../Redux/Slice/candidateSlice";


const Candidates = () => {

    const dispatch = useDispatch();

    /*
    |--------------------------------------------------------------------------
    | GET CANDIDATES FROM REDUX
    |--------------------------------------------------------------------------
    */
    const {
        candidates = [],
        loading,
        error,
    } = useSelector(
        (state) => state.candidate
    );


    /*
    |--------------------------------------------------------------------------
    | LOCAL STATE
    |--------------------------------------------------------------------------
    */
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [statusFilter, setStatusFilter] =
        useState("All statuses");

    /*
     * Used only for the current UI selection.
     * Backend update API can be connected later.
     */
    const [localStatuses, setLocalStatuses] =
        useState({});


    /*
    |--------------------------------------------------------------------------
    | FETCH CANDIDATES
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        dispatch(getAllCandidates());
    }, [dispatch]);


    /*
    |--------------------------------------------------------------------------
    | STATUS COLOR
    |--------------------------------------------------------------------------
    */
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


    /*
    |--------------------------------------------------------------------------
    | STATUS BACKGROUND COLOR
    |--------------------------------------------------------------------------
    */
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


    /*
    |--------------------------------------------------------------------------
    | GET CURRENT STATUS
    |--------------------------------------------------------------------------
    */
    const getCandidateStatus = (candidate) => {

        return (
            localStatuses[candidate.id] ??
            candidate.status ??
            "Active"
        );
    };


    /*
    |--------------------------------------------------------------------------
    | STATUS CHANGE
    |--------------------------------------------------------------------------
    */
    const handleStatusChange = (
        id,
        newStatus
    ) => {

        setLocalStatuses((previous) => ({
            ...previous,
            [id]: newStatus,
        }));
    };


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    |
    | Delete API is not provided yet.
    | Therefore we only show the action for now.
    |
    */
    const handleDelete = (id) => {

        console.log(
            "Delete candidate:",
            id
        );

        alert(
            "Delete API is not connected yet."
        );
    };


    /*
    |--------------------------------------------------------------------------
    | OPEN ADD MODAL
    |--------------------------------------------------------------------------
    */
    const handleAddClick = () => {
        setModalMode('add');
        setSelectedCandidate(null);
        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | OPEN EDIT MODAL
    |--------------------------------------------------------------------------
    */
    const handleEditClick = (candidate) => {
        setModalMode('edit');
        setSelectedCandidate(candidate);
        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | APPLICATIONS
    |--------------------------------------------------------------------------
    */
    const handleApplications = (id) => {

        console.log(
            "View applications for candidate:",
            id
        );

        alert(
            `Applications for candidate: ${id}`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | HANDLE SAVE (ADD/EDIT)
    |--------------------------------------------------------------------------
    */
    const handleSave = (data) => {
        if (modalMode === 'add') {
            // Add new candidate
            const newCandidate = {
                ...data,
                id: Date.now(),
                cvId: data.cvId || `CV-${Date.now().toString().slice(-5)}`,
                // Map fields to match backend expectations
                fullName: data.fullName,
                currentDesignation: data.designation,
                location: data.currentLocation || data.preferredLocation,
                cvOwnerName: data.cvOwner,
                email: data.email,
                phone: data.phone,
                currentEmployer: data.currentCompany,
                skills: data.primarySkills ? data.primarySkills.split(',').map(s => s.trim()) : [],
                status: data.candidateStatus,
                source: data.source,
            };
            
            // Dispatch add action here when API is ready
            console.log('New candidate:', newCandidate);
            alert('Add API is not connected yet. Candidate data saved locally.');
        } else {
            // Edit existing candidate
            const updatedCandidate = {
                ...selectedCandidate,
                ...data,
                fullName: data.fullName,
                currentDesignation: data.designation,
                location: data.currentLocation || data.preferredLocation,
                cvOwnerName: data.cvOwner,
                email: data.email,
                phone: data.phone,
                currentEmployer: data.currentCompany,
                skills: data.primarySkills ? data.primarySkills.split(',').map(s => s.trim()) : [],
                status: data.candidateStatus,
                source: data.source,
            };
            
            // Dispatch update action here when API is ready
            console.log('Updated candidate:', updatedCandidate);
            alert('Edit API is not connected yet. Candidate data updated locally.');
        }
        
        setShowModal(false);
    };


    /*
    |--------------------------------------------------------------------------
    | FILTER + SEARCH
    |--------------------------------------------------------------------------
    */
    const filteredCandidates = useMemo(() => {

        const search =
            searchTerm
                .trim()
                .toLowerCase();


        return candidates.filter(
            (candidate) => {

                const currentStatus =
                    getCandidateStatus(candidate);


                /*
                |--------------------------------------------------------------------------
                | SKILLS
                |--------------------------------------------------------------------------
                */
                const skillsText =
                    Array.isArray(candidate.skills)
                        ? candidate.skills.join(" ")
                        : "";


                /*
                |--------------------------------------------------------------------------
                | SEARCH
                |--------------------------------------------------------------------------
                */
                const searchMatch = [

                    candidate.fullName,

                    candidate.cvId,

                    candidate.currentDesignation,

                    candidate.location,

                    candidate.cvOwnerName,

                    candidate.email,

                    candidate.phone,

                    candidate.currentEmployer,

                    candidate.source,

                    skillsText,

                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(search)
                    );


                /*
                |--------------------------------------------------------------------------
                | STATUS FILTER
                |--------------------------------------------------------------------------
                */
                const statusMatch =
                    statusFilter === "All statuses" ||
                    currentStatus === statusFilter;


                return (
                    searchMatch &&
                    statusMatch
                );
            }
        );

    }, [
        candidates,
        searchTerm,
        statusFilter,
        localStatuses,
    ]);


    /*
    |--------------------------------------------------------------------------
    | STATS
    |--------------------------------------------------------------------------
    */
    const total =
        candidates.length;


    const active =
        candidates.filter(
            (candidate) =>
                getCandidateStatus(candidate) ===
                "Active"
        ).length;


    const inactive =
        candidates.filter(
            (candidate) =>
                getCandidateStatus(candidate) ===
                "Inactive"
        ).length;


    const blacklisted =
        candidates.filter(
            (candidate) =>
                getCandidateStatus(candidate) ===
                "Blacklisted"
        ).length;


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */
    if (loading) {

        return (
            <div className="candidates-page">

                <div className="candidates-content">

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

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */
    if (error) {

        return (
            <div className="candidates-page">

                <div className="candidates-content">

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
                        onClick={() =>
                            dispatch(
                                getAllCandidates()
                            )
                        }
                    >
                        Retry
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="candidates-page">

            <div className="candidates-content">


                {/* =========================================================
                    HEADER
                ========================================================= */}

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
                            className="candidates-export-btn"
                        >
                            <i className="fas fa-download"></i>

                            {" "}Export CSV
                        </button>


                        <button
                            className="candidates-add-btn"
                            onClick={handleAddClick}
                        >
                            <i className="fas fa-plus"></i>

                            {" "}Add candidate
                        </button>

                    </div>

                </div>


                {/* =========================================================
                    STATS
                ========================================================= */}

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


                {/* =========================================================
                    SEARCH + FILTER
                ========================================================= */}

                <div className="candidates-search-filter">


                    <div className="candidates-search-wrapper">

                        <i className="fas fa-search"></i>

                        <input
                            type="text"
                            placeholder="Search name, CV ID, owner, skills..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
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
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="All statuses">
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


                        <i className="fas fa-chevron-down filter-arrow"></i>

                    </div>

                </div>


                {/* =========================================================
                    TABLE
                ========================================================= */}

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

                            {filteredCandidates.map(
                                (candidate) => {

                                    const status =
                                        getCandidateStatus(
                                            candidate
                                        );


                                    return (

                                        <tr
                                            key={candidate.id}
                                        >

                                            {/* CV ID */}

                                            <td className="candidate-cv-id">

                                                {candidate.cvId ||
                                                    "-"}

                                            </td>


                                            {/* CANDIDATE */}

                                            <td>

                                                <div className="candidate-name">

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


                                            {/* STATUS */}

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
                                                        value={status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                candidate.id,
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


                                            {/* OWNER */}

                                            <td className="candidate-owner">

                                                {candidate.cvOwnerName ||
                                                    "-"}

                                            </td>


                                            {/* ACTIONS */}

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
                                                            handleEditClick(candidate)
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="candidate-action-btn candidate-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                candidate.id
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


                            {/* =================================================
                                EMPTY STATE
                            ================================================= */}

                            {filteredCandidates.length === 0 && (

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

            </div>

            {/* =========================================================
                CANDIDATE MODAL
            ========================================================= */}

            {showModal && (
                <CandidateModal
                    mode={modalMode}
                    initialData={selectedCandidate}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}

        </div>
    );
};


export default Candidates;