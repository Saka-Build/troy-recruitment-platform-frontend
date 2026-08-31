// import React, { useEffect, useState } from "react";
// import "./layout.css";

// const RECENTLY_VIEWED = [
//   { name: "Anita Kumar", type: "Candidate" },
//   { name: "Julia Deveraux", type: "Candidate" },
// ];

// const STAGE_OPTIONS = [
//   "Any",
//   "Applied",
//   "Screening",
//   "Ready to Submit",
//   "Submitted",
//   "Interview",
//   "Selected",
//   "Offer",
//   "Joined",
//   "Rejected",
// ];

// function Advanced({ isOpen, onClose, onSelectCandidate }) {
//   const [minExperience, setMinExperience] = useState("");
//   const [locationContains, setLocationContains] = useState("");
//   const [noticeContains, setNoticeContains] = useState("");
//   const [stage, setStage] = useState("Any");
//   const [mustHave, setMustHave] = useState("");
//   const [anyOf, setAnyOf] = useState("");
//   const [exclude, setExclude] = useState("");

//   // Close on Escape
//   useEffect(() => {
//     if (!isOpen) return;
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen, onClose]);

//   // Lock body scroll while open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.classList.add("advanced-open");
//     } else {
//       document.body.classList.remove("advanced-open");
//     }
//     return () => document.body.classList.remove("advanced-open");
//   }, [isOpen]);

//   const handleSearch = () => {
//     // Hook up to your search logic here
//     onClose();
//   };

//   const handleSave = () => {
//     // Hook up to your saved-search logic here
//   };

//   const handleCandidateClick = (item) => {
//     // Navigate to the candidate details page.
//     // e.g. navigate(`/candidates/${item.id}`) once wired to your router.
//     onSelectCandidate?.(item);
//     onClose();
//   };

//   return (
//     <>
//       <div
//         className={`advanced-overlay ${isOpen ? "is-visible" : ""}`}
//         onClick={onClose}
//         aria-hidden="true"
//       />
//       <aside
//         className={`advanced-panel ${isOpen ? "is-open" : ""}`}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="advanced-search-title"
//       >
//         <div className="advanced-header">
//           <h2 id="advanced-search-title">Advanced search</h2>
//           <button
//             className="advanced-close-btn"
//             onClick={onClose}
//             aria-label="Close advanced search"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="advanced-body">
//           <section className="advanced-section">
//             <h3 className="advanced-section-title">Boolean builder</h3>

//             <div className="boolean-row">
//               <span className="boolean-tag boolean-tag--and">AND</span>
//               <input
//                 type="text"
//                 className="advanced-input"
//                 placeholder="must have — e.g. SAP, FICO"
//                 value={mustHave}
//                 onChange={(e) => setMustHave(e.target.value)}
//               />
//             </div>

//             <div className="boolean-row">
//               <span className="boolean-tag boolean-tag--or">OR</span>
//               <input
//                 type="text"
//                 className="advanced-input"
//                 placeholder="any of — e.g. S/4HANA, ECC"
//                 value={anyOf}
//                 onChange={(e) => setAnyOf(e.target.value)}
//               />
//             </div>

//             <div className="boolean-row">
//               <span className="boolean-tag boolean-tag--not">NOT</span>
//               <input
//                 type="text"
//                 className="advanced-input"
//                 placeholder="exclude — e.g. junior"
//                 value={exclude}
//                 onChange={(e) => setExclude(e.target.value)}
//               />
//             </div>

//             <button className="boolean-add-row" type="button" aria-label="Add condition">
//               –
//             </button>
//           </section>

//           <section className="advanced-section">
//             <h3 className="advanced-section-title">Filters</h3>

//             <label className="advanced-label" htmlFor="min-experience">
//               Min. experience (years)
//             </label>
//             <input
//               id="min-experience"
//               type="text"
//               className="advanced-input"
//               placeholder="e.g. 5"
//               value={minExperience}
//               onChange={(e) => setMinExperience(e.target.value)}
//             />

//             <label className="advanced-label" htmlFor="location-contains">
//               Location contains
//             </label>
//             <input
//               id="location-contains"
//               type="text"
//               className="advanced-input"
//               placeholder="e.g. London"
//               value={locationContains}
//               onChange={(e) => setLocationContains(e.target.value)}
//             />

//             <label className="advanced-label" htmlFor="notice-contains">
//               Notice period contains
//             </label>
//             <input
//               id="notice-contains"
//               type="text"
//               className="advanced-input"
//               placeholder="e.g. Immediate"
//               value={noticeContains}
//               onChange={(e) => setNoticeContains(e.target.value)}
//             />

//             <label className="advanced-label" htmlFor="stage">
//               Stage
//             </label>
//             <select
//               id="stage"
//               className="advanced-select"
//               value={stage}
//               onChange={(e) => setStage(e.target.value)}
//             >
//               {STAGE_OPTIONS.map((option) => (
//                 <option key={option}>{option}</option>
//               ))}
//             </select>
//           </section>

//           <section className="advanced-section">
//             <h3 className="advanced-section-title">Saved searches</h3>
//             <p className="advanced-empty">No saved searches.</p>
//           </section>

//           <section className="advanced-section">
//             <h3 className="advanced-section-title">Recently viewed</h3>
//             <ul className="recently-viewed-list">
//               {RECENTLY_VIEWED.map((item) => (
//                 <li key={item.name} className="recently-viewed-item">
//                   <button
//                     type="button"
//                     className="recently-viewed-btn"
//                     onClick={() => handleCandidateClick(item)}
//                   >
//                     <span className="recently-viewed-name">{item.name}</span>
//                     <span className="recently-viewed-type">{item.type}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </div>

//         <div className="advanced-footer">
//           <button className="advanced-btn-secondary" onClick={handleSave}>
//             Save
//           </button>
//           <button className="advanced-btn-primary" onClick={handleSearch}>
//             Search
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Advanced;