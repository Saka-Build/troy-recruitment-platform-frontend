import React, {
  useEffect,
  useState,
} from "react";

import "./CandidateModal.css";


const CandidateModal = ({
  onClose,
  onSave,

  employees = [],
  employeesLoading = false,
  employeeError = null,

  adding = false,

  mode = "add",
  initialData = null,
}) => {

  /*
  |--------------------------------------------------------------------------
  | INITIAL FORM
  |--------------------------------------------------------------------------
  */

  const getInitialFormData = () => ({
    /*
    |----------------------------------------------------------------------
    | FILES
    |----------------------------------------------------------------------
    */
    originalCV: null,
    troyCV: null,

    /*
    |----------------------------------------------------------------------
    | CANDIDATE DETAILS
    |----------------------------------------------------------------------
    */
    fullName: "",
    designation: "",
    cvOwnerId: "",
    referredBy: "",
    referenceNote: "",

    /*
    |----------------------------------------------------------------------
    | CONTACT
    |----------------------------------------------------------------------
    */
    email: "",
    phone: "",
    whatsapp: "",
    nationality: "",
    currentLocation: "",
    preferredLocation: "",

    /*
    |----------------------------------------------------------------------
    | PROFESSIONAL
    |----------------------------------------------------------------------
    */
    currentCompany: "",
    experience: "",
    primarySkills: "",
    secondarySkills: "",

    /*
    |----------------------------------------------------------------------
    | ADDITIONAL
    |----------------------------------------------------------------------
    */
    noticePeriod: "",
    visaStatus: "",

    currentRateCurrency: "INR",
    currentRateAmount: "",
    currentRatePeriod: "month",

    dayRateCurrency: "INR",
    dayRateAmount: "",
    dayRatePeriod: "month",

    source: "LinkedIn",
    candidateStatus: "Active",

    education: "",
    linkedinUrl: "",

    recruiterNotes: "",
  });


  const [formData, setFormData] = useState(
    getInitialFormData()
  );
const [changedFields, setChangedFields] = useState(new Set());

  /*
  |--------------------------------------------------------------------------
  | EXISTING FILE INFORMATION
  |--------------------------------------------------------------------------
  */

  const [existingOriginalCv, setExistingOriginalCv] =
    useState("");

  const [existingTroyCv, setExistingTroyCv] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | LOAD EDIT DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (mode === "edit" && initialData) {

      setFormData({

        originalCV: null,
        troyCV: null,

        fullName:
          initialData.fullName || "",

        designation:
          initialData.currentDesignation || "",

        cvOwnerId:
          initialData.cvOwnerId || "",

        referredBy:
          initialData.referredBy || "",

        referenceNote:
          initialData.referenceNote || "",

        email:
          initialData.email || "",

        phone:
          initialData.phone || "",

        whatsapp:
          initialData.whatsapp || "",

        nationality:
          initialData.nationality || "",

        currentLocation:
          initialData.location || "",

        preferredLocation:
          initialData.preferredLocation || "",

        currentCompany:
          initialData.currentEmployer || "",

        experience:
          initialData.experienceYears ?? "",

        primarySkills:
          Array.isArray(initialData.skills)
            ? initialData.skills.join(", ")
            : "",

        secondarySkills: "",

        noticePeriod:
          initialData.noticePeriodDays ?? "",

        visaStatus:
          initialData.visaStatus || "",

        currentRateCurrency:
          initialData.currentSalaryCurrency ||
          "INR",

        currentRateAmount:
          initialData.currentSalaryAmount ?? "",

        currentRatePeriod:
          initialData.currentSalaryPeriod ||
          "month",

        dayRateCurrency:
          initialData.expectedSalaryCurrency ||
          "INR",

        dayRateAmount:
          initialData.expectedSalaryAmount ?? "",

        dayRatePeriod:
          initialData.expectedSalaryPeriod ||
          "month",

        source:
          initialData.source ||
          "LinkedIn",

        candidateStatus:
          initialData.status ||
          "Active",

        education:
          initialData.education ||
          "",

        linkedinUrl:
          initialData.linkedinUrl ||
          "",

        recruiterNotes: "",
      });


      setExistingOriginalCv(
        initialData.originalCvUrl || ""
      );

      setExistingTroyCv(
        initialData.troyCvUrl || ""
      );

    } else {

      /*
       * ADD MODE
       */
setChangedFields(new Set());

setFormData(getInitialFormData());

      setExistingOriginalCv("");
      setExistingTroyCv("");

    }

  }, [
    mode,
    initialData,
  ]);


  /*
  |--------------------------------------------------------------------------
  | HANDLE INPUT CHANGE
  |--------------------------------------------------------------------------
  */

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));

  if (mode === "edit") {
    setChangedFields((previous) => {
      const updated = new Set(previous);
      updated.add(name);
      return updated;
    });
  }
};


  /*
  |--------------------------------------------------------------------------
  | HANDLE FILE CHANGE
  |--------------------------------------------------------------------------
  */

const handleFileChange = (e, field) => {
  const file = e.target.files?.[0] || null;

  if (!file) {
    return;
  }

  setFormData((previous) => ({
    ...previous,
    [field]: file,
  }));

  if (mode === "edit") {
    setChangedFields((previous) => {
      const updated = new Set(previous);
      updated.add(field);
      return updated;
    });
  }
};


  /*
  |--------------------------------------------------------------------------
  | REMOVE SELECTED FILE
  |--------------------------------------------------------------------------
  */
const removeFile = (field) => {
  setFormData((previous) => ({
    ...previous,
    [field]: null,
  }));

  if (mode === "edit") {
    setChangedFields((previous) => {
      const updated = new Set(previous);
      updated.add(field);
      return updated;
    });
  }
};


  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

const handleSubmit = (e) => {
  e.preventDefault();

  const convertedFormData = {
    ...formData,
    experience:
      formData.experience === ""
        ? ""
        : Number(formData.experience),
    noticePeriod:
      formData.noticePeriod === ""
        ? ""
        : Number(formData.noticePeriod),
    currentRateAmount:
      formData.currentRateAmount === ""
        ? ""
        : Number(formData.currentRateAmount),
    dayRateAmount:
      formData.dayRateAmount === ""
        ? ""
        : Number(formData.dayRateAmount),
  };

  if (mode === "edit") {
    const updateData = {};

    Object.keys(convertedFormData).forEach((field) => {
      updateData[field] = changedFields.has(field)
        ? convertedFormData[field]
        : null;
    });

    onSave(updateData);
    return;
  }

  onSave(convertedFormData);
};


  /*
  |--------------------------------------------------------------------------
  | EMPLOYEE DISPLAY NAME
  |--------------------------------------------------------------------------
  */

  const getEmployeeName = (employee) => {

    return (
      employee.fullName ||
      employee.name ||
      employee.employeeName ||
      employee.username ||
      employee.email ||
      "Unnamed employee"
    );

  };
  const getFileNameFromUrl = (url) => {
    if (!url) {
      return "";
    }

    try {
      const cleanUrl = url.split("?")[0];
      const fileName = cleanUrl.split("/").pop();

      return decodeURIComponent(fileName || "");
    } catch (error) {
      console.error("Unable to extract filename:", error);
      return "";
    }
  };

  return (

    <div
      className="candidate-modal-overlay"
      onClick={onClose}
    >

      <div
        className="candidate-modal candidate-modal-large"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ==========================================================
                            HEADER
        =========================================================== */}

        <div className="candidate-modal-header">

          <div>

            <h2>
              {mode === "edit"
                ? "Edit candidate"
                : "Add candidate"}
            </h2>

          </div>


          <button
            type="button"
            className="candidate-modal-close"
            onClick={onClose}
            disabled={adding}
          >

            <i className="fas fa-times"></i>

          </button>

        </div>


        {/* ==========================================================
                            FORM
        =========================================================== */}

        <form
          className="candidate-form"
          onSubmit={handleSubmit}
        >


          {/* ========================================================
                        1. ORIGINAL CV
          ========================================================= */}

          <div className="candidate-form-section">

            <h3 className="candidate-section-title">
              1. Original CV
            </h3>


            <div className="candidate-upload-area">

              <div className="candidate-upload-box">

                <div className="candidate-upload-label">
                  Upload Original CV
                </div>


                <input
                  type="file"
                  id="originalCV"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      "originalCV"
                    )
                  }
                  style={{
                    display: "none",
                  }}
                  accept=".pdf,.doc,.docx"
                />


                <label
                  htmlFor="originalCV"
                  className="candidate-upload-btn"
                >

                  <i className="fas fa-cloud-upload-alt"></i>

                  {" "}Choose File

                </label>


                <div className="candidate-upload-status">

                  {formData.originalCV
                    ? formData.originalCV.name
                    : existingOriginalCv
                      ? getFileNameFromUrl(existingOriginalCv)
                      : "No file uploaded yet"}

                </div>


                {formData.originalCV && (

                  <div
                    className="candidate-upload-actions"
                    style={{
                      marginTop: "10px",
                    }}
                  >

                    <button
                      type="button"
                      className="candidate-upload-action-btn"
                      onClick={() =>
                        removeFile("originalCV")
                      }
                    >

                      <i className="fas fa-times"></i>

                      {" "}Remove

                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* ========================================================
                        2. TROY CV
          ========================================================= */}

          <div className="candidate-form-section">

            <h3 className="candidate-section-title">
              2. Troy Format CV
            </h3>


            <div className="candidate-upload-area">

              <div className="candidate-upload-box">

                <div className="candidate-upload-label">
                  Upload Troy CV (.docx)
                </div>


                <input
                  type="file"
                  id="troyCV"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      "troyCV"
                    )
                  }
                  style={{
                    display: "none",
                  }}
                  accept=".docx,.doc"
                />


                <label
                  htmlFor="troyCV"
                  className="candidate-upload-btn"
                >

                  <i className="fas fa-cloud-upload-alt"></i>

                  {" "}Choose File

                </label>


                <div className="candidate-upload-status">

                  {formData.troyCV
                    ? formData.troyCV.name
                    : existingTroyCv
                      ? getFileNameFromUrl(existingTroyCv)
                      : "No file uploaded yet"}

                </div>


                {formData.troyCV && (

                  <div
                    className="candidate-upload-actions"
                    style={{
                      marginTop: "10px",
                    }}
                  >

                    <button
                      type="button"
                      className="candidate-upload-action-btn"
                      onClick={() =>
                        removeFile("troyCV")
                      }
                    >

                      <i className="fas fa-times"></i>

                      {" "}Remove

                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* ========================================================
                        3. CANDIDATE DETAILS
          ========================================================= */}

          <div className="candidate-form-section">

            <h3 className="candidate-section-title">
              3. Candidate details
            </h3>


            <div className="candidate-form-grid">


              {/* FULL NAME */}

              <div className="candidate-form-group">

                <label>
                  Full name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />

              </div>


              {/* DESIGNATION */}

              <div className="candidate-form-group">

                <label>
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                />

              </div>


              {/* CV OWNER */}

              <div className="candidate-form-group">

                <label>
                  CV owner · recruiter *
                </label>


                <select
                  name="cvOwnerId"
                  value={formData.cvOwnerId}
                  onChange={handleChange}
                  required
                  disabled={
                    employeesLoading ||
                    adding
                  }
                >

                  <option value="">

                    {employeesLoading
                      ? "Loading employees..."
                      : "Select recruiter"}

                  </option>


                  {employees.map(
                    (employee) => (

                      <option
                        key={employee.id}
                        value={employee.id}
                      >

                        {getEmployeeName(
                          employee
                        )}

                      </option>

                    )
                  )}

                </select>


                {employeeError && (

                  <small
                    style={{
                      color: "#c33443",
                      marginTop: "5px",
                      display: "block",
                    }}
                  >

                    {employeeError}

                  </small>

                )}

              </div>


              {/* REFERRED BY */}

              <div className="candidate-form-group">

                <label>
                  Referred by
                </label>

                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  placeholder="Who referred this candidate"
                />

              </div>


              {/* REFERENCE NOTE */}

              <div className="candidate-form-group">

                <label>
                  Reference note
                </label>

                <input
                  type="text"
                  name="referenceNote"
                  value={formData.referenceNote}
                  onChange={handleChange}
                  placeholder="e.g. ex-colleague of Priya"
                />

              </div>

            </div>

          </div>


          {/* ========================================================
                        4. CONTACT
          ========================================================= */}

          <div className="candidate-form-section">

            <h3 className="candidate-section-title">
              4. Contact & Personal
            </h3>


            <div className="candidate-form-grid">


              <div className="candidate-form-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />

              </div>


              <div className="candidate-form-group">

                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>


              <div className="candidate-form-group">

                <label>WhatsApp</label>

                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                />

              </div>


              <div className="candidate-form-group">

                <label>Nationality</label>

                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Enter nationality"
                />

              </div>


              <div className="candidate-form-group">

                <label>Current location</label>

                <input
                  type="text"
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  placeholder="Enter current location"
                />

              </div>


              <div className="candidate-form-group">

                <label>Preferred location</label>

                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  placeholder="Enter preferred location"
                />

              </div>

            </div>

          </div>


          {/* ========================================================
                        5. PROFESSIONAL
          ========================================================= */}

          <div className="candidate-form-section">

            <h3 className="candidate-section-title">
              5. Professional
            </h3>


            <div className="candidate-form-grid">


              <div className="candidate-form-group">

                <label>
                  Current company
                </label>

                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="Enter current company"
                />

              </div>


              <div className="candidate-form-group">

                <label>
                  Experience (years)
                </label>

                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  step="0.5"
                  min="0"
                />

              </div>


              <div className="candidate-form-group">

                <label>
                  Primary skills
                </label>

                <input
                  type="text"
                  name="primarySkills"
                  value={formData.primarySkills}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, PostgreSQL"
                />

              </div>


              <div className="candidate-form-group">

                <label>
                  Secondary skills
                </label>

                <input
                  type="text"
                  name="secondarySkills"
                  value={formData.secondarySkills}
                  onChange={handleChange}
                  placeholder="AWS, Docker, MongoDB"
                />

              </div>

            </div>

          </div>


          {/* ========================================================
                        6. ADDITIONAL
          ========================================================= */}

          <div className="candidate-form-section">

            <h3 className="candidate-section-title">
              6. Additional Details
            </h3>


            <div className="candidate-form-grid">


              {/* NOTICE */}

              <div className="candidate-form-group">

                <label>
                  Notice period (days)
                </label>

                <input
                  type="number"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  min="0"
                />

              </div>


              {/* VISA */}

              <div className="candidate-form-group">

                <label>
                  Visa status
                </label>

                <input
                  type="text"
                  name="visaStatus"
                  value={formData.visaStatus}
                  onChange={handleChange}
                  placeholder="Enter visa status"
                />

              </div>


              {/* EDUCATION */}

              <div className="candidate-form-group">

                <label>
                  Education
                </label>

                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech Computer Science"
                />

              </div>


              {/* LINKEDIN */}

              <div className="candidate-form-group">

                <label>
                  LinkedIn URL
                </label>

                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />

              </div>


              {/* CURRENT SALARY */}

              <div className="candidate-form-group">

                <label>
                  Current salary
                </label>


                <div className="candidate-rate-group">

                  <select
                    name="currentRateCurrency"
                    value={formData.currentRateCurrency}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >

                    <option value="INR">INR</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>

                  </select>


                  <input
                    type="number"
                    name="currentRateAmount"
                    value={formData.currentRateAmount}
                    onChange={handleChange}
                    placeholder="Amount"
                    className="candidate-rate-input"
                    min="0"
                  />


                  <select
                    name="currentRatePeriod"
                    value={formData.currentRatePeriod}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >

                    <option value="month">month</option>
                    <option value="day">day</option>
                    {/* <option value="hour">hour</option> */}
                    <option value="year">annum</option>

                  </select>

                </div>

              </div>


              {/* EXPECTED SALARY */}

              <div className="candidate-form-group">

                <label>
                  Expected salary
                </label>


                <div className="candidate-rate-group">

                  <select
                    name="dayRateCurrency"
                    value={formData.dayRateCurrency}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >

                    <option value="INR">INR</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>

                  </select>


                  <input
                    type="number"
                    name="dayRateAmount"
                    value={formData.dayRateAmount}
                    onChange={handleChange}
                    placeholder="Amount"
                    className="candidate-rate-input"
                    min="0"
                  />


                  <select
                    name="dayRatePeriod"
                    value={formData.dayRatePeriod}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >

                    <option value="month">month</option>
                    <option value="day">day</option>
                    {/* <option value="hour">hour</option> */}
                    <option value="year">annum</option>

                  </select>

                </div>

              </div>


              {/* SOURCE */}

              <div className="candidate-form-group">

                <label>
                  Source
                </label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                >

                  <option value="LinkedIn">
                    LinkedIn
                  </option>

                  <option value="Referral">
                    Referral
                  </option>

                  <option value="Job Board">
                    Job Board
                  </option>

                  <option value="Website">
                    Website
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* STATUS */}

              <div className="candidate-form-group">

                <label>
                  Candidate status
                </label>

                <select
                  name="candidateStatus"
                  value={formData.candidateStatus}
                  onChange={handleChange}
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


              {/* NOTES */}

              {/* <div className="candidate-form-group candidate-form-full">

                <label>
                  Recruiter notes / latest comment
                </label>

                <textarea
                  name="recruiterNotes"
                  value={formData.recruiterNotes}
                  onChange={handleChange}
                  placeholder="Add any notes or comments about this candidate"
                  rows="3"
                />

              </div> */}

            </div>

          </div>


          {/* ========================================================
                            INFO
          ========================================================= */}

          <div className="candidate-info-note">

            <i className="fas fa-info-circle"></i>

            <span>

              To put this candidate forward for a job,
              save first, then use{" "}

              <strong>
                Apply to a job
              </strong>

              {" "}on their profile.

            </span>

          </div>


          {/* ========================================================
                            FOOTER
          ========================================================= */}

          <div className="candidate-modal-footer">

            <button
              type="button"
              className="candidate-cancel-btn"
              onClick={onClose}
              disabled={adding}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="candidate-save-btn"
              disabled={
                adding ||
                employeesLoading ||
                !formData.cvOwnerId
              }
            >

              {adding
                ? "Adding..."
                : mode === "edit"
                  ? "Save changes"
                  : "Add candidate"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
};


export default CandidateModal;