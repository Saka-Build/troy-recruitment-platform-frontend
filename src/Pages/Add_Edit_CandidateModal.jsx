import { useRef, useState } from "react";
import "./Add_Edit_CandidateModal.css";

function AddCandidateModal({ show, onClose }) {
  const originalCvRef = useRef(null);
  const troyCvRef = useRef(null);

  const [originalCv, setOriginalCv] = useState(null);
  const [troyCv, setTroyCv] = useState(null);

  const handleOriginalCv = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalCv(file);
    }
  };

  const handleTroyCv = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setTroyCv(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your API call here
    console.log("Candidate added");
  };

  if (!show) return null;

  return (
    <div className="candidate-modal-overlay">
      <div className="candidate-modal">

        {/* ================================
            HEADER
        ================================= */}
        <div className="candidate-modal-header">
          <h2>Add candidate</h2>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>


        <form onSubmit={handleSubmit}>

          <div className="candidate-modal-body">

            {/* ================================
                ORIGINAL CV
            ================================= */}
            <div className="cv-upload-box">

              <div className="cv-upload-header">

                <div className="cv-upload-title">
                  1 · Original CV
                </div>

                <div className="cv-file-types">
                  PDF · DOC · DOCX
                </div>

              </div>


              <div className="cv-upload-actions">

                <input
                  ref={originalCvRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={handleOriginalCv}
                />

                <button
                  type="button"
                  className="primary-small-btn"
                  onClick={() => originalCvRef.current?.click()}
                >
                  <i className="bi bi-upload"></i>
                  Upload Original CV
                </button>


                <button
                  type="button"
                  className="secondary-small-btn"
                  disabled={!originalCv}
                >
                  <i className="bi bi-eye-fill"></i>
                  Preview
                </button>


                <button
                  type="button"
                  className="secondary-small-btn"
                  disabled={!originalCv}
                >
                  <i className="bi bi-download"></i>
                  Download
                </button>


                <button
                  type="button"
                  className="secondary-small-btn"
                  onClick={() => originalCvRef.current?.click()}
                >
                  <i className="bi bi-arrow-up"></i>
                  Replace
                </button>

              </div>


              <div className="cv-file-status">
                {originalCv
                  ? originalCv.name
                  : "No file uploaded yet"}
              </div>

            </div>


            {/* ================================
                TROY FORMAT CV
            ================================= */}
            <div className="cv-upload-box">

              <div className="cv-upload-header">

                <div className="cv-upload-title">
                  2 · Troy Format CV
                </div>

                <div className="cv-file-types">
                  Word .docx
                </div>

              </div>


              <div className="cv-upload-actions">

                <input
                  ref={troyCvRef}
                  type="file"
                  accept=".docx"
                  hidden
                  onChange={handleTroyCv}
                />

                <button
                  type="button"
                  className="primary-small-btn"
                  onClick={() => troyCvRef.current?.click()}
                >
                  <i className="bi bi-upload"></i>
                  Upload Troy CV (.docx)
                </button>


                <button
                  type="button"
                  className="secondary-small-btn"
                  disabled={!troyCv}
                >
                  <i className="bi bi-download"></i>
                  Download
                </button>


                <button
                  type="button"
                  className="secondary-small-btn"
                  onClick={() => troyCvRef.current?.click()}
                >
                  <i className="bi bi-arrow-up"></i>
                  Replace
                </button>

              </div>


              <div className="cv-file-status">
                {troyCv
                  ? troyCv.name
                  : "No file uploaded yet"}
              </div>

            </div>


            {/* ================================
                CANDIDATE DETAILS
            ================================= */}
            <div className="candidate-details-section">

              <h3>3 · Candidate details</h3>


              <div className="candidate-form-grid">

                {/* Full Name */}
                <div className="form-field">

                  <label>
                    Full name <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder=""
                    required
                  />

                </div>


                {/* Designation */}
                <div className="form-field">

                  <label>
                    Designation
                  </label>

                  <input
                    type="text"
                  />

                </div>


                {/* CV ID */}
                <div className="form-field">

                  <label>
                    CV ID <span>*</span>
                  </label>

                  <input
                    type="text"
                    defaultValue="CV-FA50M"
                    required
                  />

                </div>


                {/* CV Owner */}
                <div className="form-field">

                  <label>
                    CV owner · recruiter <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Recruiter who owns this CV"
                    required
                  />

                </div>


                {/* Referred By */}
                <div className="form-field">

                  <label>
                    Referred by
                  </label>

                  <input
                    type="text"
                    placeholder="Name / source (if a referral)"
                  />

                </div>


                {/* Reference Note */}
                <div className="form-field">

                  <label>
                    Reference note
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. ex-colleague of Priya"
                  />

                </div>


                {/* Email */}
                <div className="form-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                  />

                </div>


                {/* Phone */}
                <div className="form-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ================================
              FOOTER
          ================================= */}
          <div className="candidate-modal-footer">

            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-submit-btn"
            >
              Add candidate
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddCandidateModal;