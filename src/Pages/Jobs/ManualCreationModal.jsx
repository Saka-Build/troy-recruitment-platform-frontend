import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Job.css";
import {
  fetchClients,
  fetchCountries,
} from "../../Redux/Slice/clientSlice";
import {
  createJob,
  updateJob,
} from "../../Redux/Slice/jobSlice";
import { getAllEmployees } from "../../Redux/Slice/employeeSlice";
import { useNavigate } from "react-router-dom";

function ManualCreationModal({
  title = "Manual creation",
  onClose,
  onSave,
  requisition = false,
  job = null,
  initialData = null,
  isEdit = false,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: clients = [],
    countries = [],
    loading: clientsLoading,
    countriesLoading,
  } = useSelector((state) => state.clients);

  const {
    employees = [],
    isFetching: employeesLoading,
  } = useSelector((state) => state.employees);

  const {
    isCreating = false,
    isUpdating = false,
    createError,
    error,
  } = useSelector((state) => state.jobs);

  const submitting = isCreating || isUpdating;

  const [recruiterDropdownOpen, setRecruiterDropdownOpen] =
    useState(false);
    const [changedFields, setChangedFields] = useState({});

  const editJob = job || initialData;

  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    endClientId: "",
    countryCode: "",
    location: "",
    jobType: "Permanent",
    workMode: "Onsite",

    clientRateAmount: "",
    clientRateCurrency: "INR",
    clientRatePeriod: "month",

    candidateRateAmount: "",
    candidateRateCurrency: "INR",
    candidateRatePeriod: "month",

    skills: "",
    priority: "High",
    status: "Open",

    ownerId: "",
    assignedRecruiters: [],
    description: "",
    industry: "Information Technology",
    leadNote: "",
  });

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchCountries());
    dispatch(getAllEmployees());
  }, [dispatch]);

  const activeClients = useMemo(() => {
    return (clients || []).filter(
      (client) => client.isActive === true
    );
  }, [clients]);

  const selectedClient = useMemo(() => {
    return activeClients.find(
      (client) => client.id === formData.clientId
    );
  }, [activeClients, formData.clientId]);

  const activeEndClients = useMemo(() => {
    if (!selectedClient) {
      return [];
    }

    return (selectedClient.endClients || []).filter(
      (endClient) => endClient.active === true
    );
  }, [selectedClient]);

  const activeEmployees = useMemo(() => {
    return (employees || []).filter(
      (employee) => employee.active === true
    );
  }, [employees]);

  useEffect(() => {
    if (!editJob || !isEdit) {
      return;
    }

    const recruiterIds = Array.isArray(
      editJob.assignedRecruiters
    )
      ? editJob.assignedRecruiters
          .map((recruiter) =>
            typeof recruiter === "string"
              ? recruiter
              : recruiter?.id
          )
          .filter(Boolean)
      : [];

    setFormData({
      title: editJob.title || "",
      clientId:
        editJob.clientId ||
        editJob.client?.id ||
        "",
      endClientId:
        editJob.endClientId ||
        editJob.endClient?.id ||
        "",
      countryCode:
        editJob.countryCode ||
        editJob.country?.code ||
        "",
      location: editJob.location || "",
      jobType: editJob.jobType || "Permanent",
      workMode: editJob.workMode || "Onsite",
      clientRateAmount:
        editJob.clientRateAmount ?? "",
      clientRateCurrency:
        editJob.clientRateCurrency || "INR",
      clientRatePeriod:
        editJob.clientRatePeriod || "month",
      candidateRateAmount:
        editJob.candidateRateAmount ?? "",
      candidateRateCurrency:
        editJob.candidateRateCurrency || "INR",
      candidateRatePeriod:
        editJob.candidateRatePeriod || "month",
      skills: Array.isArray(editJob.skillsRequired)
        ? editJob.skillsRequired.join(", ")
        : "",
      priority: editJob.priority || "High",
      status:
        editJob.status === "On hold"
          ? "on_hold"
          : editJob.status || "Open",
      ownerId:
        editJob.ownerId ||
        editJob.owner?.id ||
        editJob.leadId ||
        editJob.lead ||
        "",
      assignedRecruiters: recruiterIds,
      description: editJob.description || "",
      leadNote: editJob.leadNote || "",
      industry:
        editJob.industry ||
        "Information Technology",
      isTemplate: editJob.isTemplate ?? false,
      templateName: editJob.templateName ?? null,
    });
  }, [editJob, isEdit]);

const handleChange = (e) => {
  const {
    name,
    value,
    type,
    checked,
  } = e.target;

  const newValue =
    type === "checkbox"
      ? checked
      : value;

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  if (isEdit) {
    setChangedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  }
};

const handleClientChange = (e) => {
  const clientId = e.target.value;

  const client = activeClients.find(
    (item) => item.id === clientId
  );

  const newCountryCode = client?.countryCode || "";

  setFormData((prev) => ({
    ...prev,
    clientId,
    endClientId: "",
    countryCode: newCountryCode,
  }));

  if (isEdit) {
    setChangedFields((prev) => ({
      ...prev,
      clientId: true,
      endClientId: true,
      countryCode: true,
    }));
  }
};
const handleCountryChange = (e) => {
  const value = e.target.value;

  setFormData((prev) => ({
    ...prev,
    countryCode: value,
  }));

  if (isEdit) {
    setChangedFields((prev) => ({
      ...prev,
      countryCode: true,
    }));
  }
};
const handleRecruiterToggle = (recruiterId) => {
  setFormData((prev) => {
    const alreadySelected =
      prev.assignedRecruiters.includes(recruiterId);

    return {
      ...prev,
      assignedRecruiters: alreadySelected
        ? prev.assignedRecruiters.filter(
            (id) => id !== recruiterId
          )
        : [
            ...prev.assignedRecruiters,
            recruiterId,
          ],
    };
  });

  if (isEdit) {
    setChangedFields((prev) => ({
      ...prev,
      assignedRecruiters: true,
    }));
  }
};

  const selectedRecruiters = useMemo(() => {
    return activeEmployees.filter((employee) =>
      formData.assignedRecruiters.includes(
        employee.id
      )
    );
  }, [
    activeEmployees,
    formData.assignedRecruiters,
  ]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a job title.");
      return;
    }

    if (!formData.clientId) {
      alert("Please select a client.");
      return;
    }

    if (!formData.endClientId) {
      alert("Please select an end client.");
      return;
    }

    if (!formData.countryCode) {
      alert("Please select a country.");
      return;
    }

    if (!formData.ownerId) {
      alert("Please select a lead.");
      return;
    }

    if (!formData.assignedRecruiters.length) {
      alert(
        "Please select at least one assigned recruiter."
      );
      return;
    }

    const skillsRequired = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

const fullPayload = {
  title: formData.title.trim(),
  clientId: formData.clientId,
  endClientId: formData.endClientId,
  countryCode: formData.countryCode,
  location: formData.location.trim(),
  jobType: formData.jobType,
  workMode: formData.workMode,

  clientRateAmount:
    formData.clientRateAmount !== ""
      ? Number(formData.clientRateAmount)
      : null,

  clientRateCurrency:
    formData.clientRateCurrency,

  clientRatePeriod:
    formData.clientRatePeriod,

  candidateRateAmount:
    formData.candidateRateAmount !== ""
      ? Number(formData.candidateRateAmount)
      : null,

  candidateRateCurrency:
    formData.candidateRateCurrency,

  candidateRatePeriod:
    formData.candidateRatePeriod,

  skillsRequired,

  priority: formData.priority,
  status: formData.status,

  ownerId: formData.ownerId,

  assignedRecruiters:
    formData.assignedRecruiters,

  description:
    formData.description.trim(),

  descriptionSource: "manual",

  leadNote:
    formData.leadNote.trim(),

  industry:
    formData.industry.trim(),

  isTemplate: false,
  templateName: null,
};

const payload = isEdit
  ? Object.keys(fullPayload).reduce((result, key) => {
      result[key] = changedFields[key]
        ? fullPayload[key]
        : null;

      return result;
    }, {})
  : fullPayload;

    console.log(
      isEdit
        ? "UPDATE JOB REQUEST:"
        : "CREATE JOB REQUEST:",
      payload
    );

    try {
      let response;

      if (isEdit) {
        response = await dispatch(
          updateJob({
            id: editJob.id,
            jobData: payload,
          })
        ).unwrap();
      } else {
        response = await dispatch(
          createJob(payload)
        ).unwrap();
      }

      console.log(
        isEdit
          ? "JOB UPDATED:"
          : "JOB CREATED:",
        response
      );

      if (onSave) {
        onSave(response);
      }

      if (!isEdit && response?.id) {
        onClose();
        navigate(`/dashboard/jobs`);
        return;
      }

      onClose();
    } catch (error) {
      console.error(
        isEdit
          ? "Update Job Error:"
          : "Create Job Error:",
        error
      );
    }
  };

  return (
    <div
      className="job-modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="job-modal manual-modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="job-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="job-modal-close"
            onClick={onClose}
            disabled={submitting}
          >
            ×
          </button>
        </div>

        <div className="job-modal-body manual-modal-body">
          {(createError || error) && (
            <div className="job-error">
              {createError || error}
            </div>
          )}

          <div className="job-form-grid">
            <div className="job-form-field full">
              <label>
                {requisition
                  ? "Requirement title *"
                  : "Job title *"}
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="job-form-field">
              <label>Client *</label>

              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleClientChange}
                disabled={
                  clientsLoading || submitting
                }
              >
                <option value="">
                  {clientsLoading
                    ? "Loading clients..."
                    : "Select client"}
                </option>

                {activeClients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="job-form-field">
              <label>End client *</label>

              <select
                name="endClientId"
                value={formData.endClientId}
                onChange={handleChange}
                disabled={
                  !formData.clientId ||
                  submitting
                }
              >
                <option value="">
                  {!formData.clientId
                    ? "Select client first"
                    : activeEndClients.length === 0
                      ? "No active end clients"
                      : "Select end client"}
                </option>

                {activeEndClients.map(
                  (endClient) => (
                    <option
                      key={endClient.id}
                      value={endClient.id}
                    >
                      {endClient.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="job-form-field">
              <label>Country *</label>

              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleCountryChange}
                disabled={
                  countriesLoading ||
                  submitting
                }
              >
                <option value="">
                  {countriesLoading
                    ? "Loading countries..."
                    : "Select country"}
                </option>

                {countries.map((country) => (
                  <option
                    key={country.code}
                    value={country.code}
                  >
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="job-form-field">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="job-form-field">
              <label>Type</label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Permanent">
                  Permanent
                </option>

                <option value="Contract">
                  Contract
                </option>

                <option value="Temporary">
                  Temporary
                </option>
              </select>
            </div>

            <div className="job-form-field">
              <label>Work mode</label>

              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Onsite">
                  Onsite
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="Remote">
                  Remote
                </option>
              </select>
            </div>

            <div className="job-form-field">
              <label>Client rate</label>

              <div className="rate-field">
                <select
                  name="clientRateCurrency"
                  value={formData.clientRateCurrency}
                  onChange={handleChange}
                  className="rate-currency"
                  disabled={submitting}
                >
                  <option value="INR">INR</option>
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>

                <input
                  type="number"
                  name="clientRateAmount"
                  placeholder="Amount"
                  value={formData.clientRateAmount}
                  onChange={handleChange}
                  className="rate-amount"
                  disabled={submitting}
                />

                <select
                  name="clientRatePeriod"
                  value={formData.clientRatePeriod}
                  onChange={handleChange}
                  className="rate-period"
                  disabled={submitting}
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="annum">Annum</option>
                </select>
              </div>
            </div>

            <div className="job-form-field">
              <label>Candidate rate</label>

              <div className="rate-field">
                <select
                  name="candidateRateCurrency"
                  value={formData.candidateRateCurrency}
                  onChange={handleChange}
                  className="rate-currency"
                  disabled={submitting}
                >
                  <option value="INR">INR</option>
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>

                <input
                  type="number"
                  name="candidateRateAmount"
                  placeholder="Amount"
                  value={formData.candidateRateAmount}
                  onChange={handleChange}
                  className="rate-amount"
                  disabled={submitting}
                />

                <select
                  name="candidateRatePeriod"
                  value={formData.candidateRatePeriod}
                  onChange={handleChange}
                  className="rate-period"
                  disabled={submitting}
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="annum">Annum</option>
                </select>
              </div>
            </div>

            <div className="job-form-field full">
              <label>
                Required skills
                (comma separated)
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="AWS, Docker, Kubernetes, Jenkins"
                disabled={submitting}
              />
            </div>

            <div className="job-form-field">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>
            </div>

            <div className="job-form-field">
              <label>Role status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Open">
                  Open
                </option>

                <option value="Closed">
                  Closed
                </option>

                <option value="on_hold">
                  On hold
                </option>
              </select>
            </div>

            <div className="job-form-field">
              <label>Lead *</label>

              <select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                disabled={
                  employeesLoading ||
                  submitting
                }
              >
                <option value="">
                  {employeesLoading
                    ? "Loading employees..."
                    : "Select lead"}
                </option>

                {activeEmployees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.fullName}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="job-form-field">
              <label>
                Assigned recruiters *
              </label>

              <div
                className={`recruiter-dropdown ${
                  recruiterDropdownOpen
                    ? "open"
                    : ""
                }`}
              >
                <button
                  type="button"
                  className="recruiter-dropdown-toggle"
                  onClick={() =>
                    setRecruiterDropdownOpen(
                      (prev) => !prev
                    )
                  }
                  disabled={
                    employeesLoading ||
                    submitting
                  }
                >
                  <span
                    className={
                      selectedRecruiters.length === 0
                        ? "recruiter-placeholder"
                        : "recruiter-selected-text"
                    }
                  >
                    {employeesLoading
                      ? "Loading recruiters..."
                      : selectedRecruiters.length === 0
                        ? "Select recruiters"
                        : selectedRecruiters
                            .map(
                              (recruiter) =>
                                recruiter.fullName
                            )
                            .join(", ")}
                  </span>

                  <span className="recruiter-dropdown-arrow">
                    ▾
                  </span>
                </button>

                {recruiterDropdownOpen && (
                  <div className="recruiter-dropdown-menu">
                    {employeesLoading ? (
                      <div className="recruiter-dropdown-message">
                        Loading employees...
                      </div>
                    ) : activeEmployees.length === 0 ? (
                      <div className="recruiter-dropdown-message">
                        No active employees found
                      </div>
                    ) : (
                      activeEmployees.map(
                        (employee) => {
                          const isSelected =
                            formData.assignedRecruiters.includes(
                              employee.id
                            );

                          return (
                            <div
                              key={employee.id}
                              className={`recruiter-dropdown-option ${
                                isSelected
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                handleRecruiterToggle(
                                  employee.id
                                )
                              }
                            >
                              <span className="recruiter-checkbox">
                                {isSelected
                                  ? "✓"
                                  : ""}
                              </span>

                              <span className="recruiter-name">
                                {employee.fullName}
                              </span>
                            </div>
                          );
                        }
                      )
                    )}
                  </div>
                )}
              </div>

              {selectedRecruiters.length > 0 && (
                <div className="selected-recruiter-tags">
                  {selectedRecruiters.map(
                    (recruiter) => (
                      <span
                        key={recruiter.id}
                        className="recruiter-tag"
                      >
                        {recruiter.fullName}

                        <button
                          type="button"
                          className="recruiter-tag-remove"
                          onClick={() =>
                            handleRecruiterToggle(
                              recruiter.id
                            )
                          }
                          disabled={submitting}
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="job-form-field full">
              <label>Lead note</label>

              <textarea
                className="lead-note-textarea"
                name="leadNote"
                value={formData.leadNote}
                onChange={handleChange}
                placeholder="Enter lead note"
                disabled={submitting}
              />
            </div>
            <div className="job-form-field">
              <label>Industry</label>

              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="job-form-field full">
              <label>Description</label>

              <textarea
                className="lead-note-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter job description"
                disabled={submitting}
              />
            </div>

          </div>
        </div>

        <div className="job-modal-footer">
          <button
            type="button"
            className="job-modal-cancel"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="job-modal-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {requisition
              ? "Create requisition"
              : isEdit
                ? submitting
                  ? "Updating..."
                  : "Update job"
                : submitting
                  ? "Creating..."
                  : "Create job"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManualCreationModal;