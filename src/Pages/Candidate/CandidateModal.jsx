import React, { useState } from 'react';
import './CandidateModal.css';

const AddCandidateModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    // Section 1: CV Upload
    originalCV: null,
    troyCV: null,
    
    // Section 2: Candidate Details
    fullName: '',
    designation: '',
    cvId: 'CV-NNO59',
    cvOwner: '',
    referredBy: '',
    referenceNote: '',
    
    // Section 3: Contact & Personal
    email: '',
    phone: '',
    whatsapp: '',
    nationality: '',
    currentLocation: '',
    preferredLocation: '',
    
    // Section 4: Professional
    currentCompany: '',
    experience: '',
    primarySkills: '',
    secondarySkills: '',
    
    // Section 5: Additional
    noticePeriod: '',
    visaStatus: '',
    currentRateCurrency: 'GBP',
    currentRateAmount: '',
    currentRatePeriod: 'month',
    dayRateCurrency: 'GBP',
    dayRateAmount: '',
    dayRatePeriod: 'day',
    source: 'LinkedIn',
    candidateStatus: 'Active',
    recruiterNotes: '',
  });

  const [activeSection, setActiveSection] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="candidate-modal-overlay" onClick={onClose}>
      <div className="candidate-modal candidate-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="candidate-modal-header">
          <div>
            <h2>Add candidate</h2>
          </div>
          <button className="candidate-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body */}
        <form className="candidate-form" onSubmit={handleSubmit}>
          {/* Section 1: Original CV */}
          <div className="candidate-form-section">
            <h3 className="candidate-section-title">1. Original CV</h3>
            <div className="candidate-upload-area">
              <div className="candidate-upload-box">
                <div className="candidate-upload-label">Upload Original CV</div>
                <input
                  type="file"
                  id="originalCV"
                  onChange={(e) => handleFileChange(e, 'originalCV')}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="originalCV" className="candidate-upload-btn">
                  <i className="fas fa-cloud-upload-alt"></i> Choose File
                </label>
                <div className="candidate-upload-status">
                  {formData.originalCV ? formData.originalCV.name : 'No file uploaded yet'}
                </div>
                {formData.originalCV && (
                  <div className="candidate-upload-actions">
                    <button type="button" className="candidate-upload-action-btn">
                      <i className="fas fa-eye"></i> Preview
                    </button>
                    <button type="button" className="candidate-upload-action-btn">
                      <i className="fas fa-download"></i> Download
                    </button>
                    <button type="button" className="candidate-upload-action-btn">
                      <i className="fas fa-sync"></i> Replace
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Troy Format CV */}
          <div className="candidate-form-section">
            <h3 className="candidate-section-title">2. Troy Format CV</h3>
            <div className="candidate-upload-area">
              <div className="candidate-upload-box">
                <div className="candidate-upload-label">Upload Troy CV (.docx)</div>
                <input
                  type="file"
                  id="troyCV"
                  onChange={(e) => handleFileChange(e, 'troyCV')}
                  style={{ display: 'none' }}
                  accept=".docx,.doc"
                />
                <label htmlFor="troyCV" className="candidate-upload-btn">
                  <i className="fas fa-cloud-upload-alt"></i> Choose File
                </label>
                <div className="candidate-upload-status">
                  {formData.troyCV ? formData.troyCV.name : 'No file uploaded yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Candidate Details */}
          <div className="candidate-form-section">
            <h3 className="candidate-section-title">3. Candidate details</h3>
            <div className="candidate-form-grid">
              {/* Row 1 */}
              <div className="candidate-form-group">
                <label>Full name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className="candidate-form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                />
              </div>

              {/* Row 2 */}
              <div className="candidate-form-group">
                <label>CV ID *</label>
                <input
                  type="text"
                  name="cvId"
                  value={formData.cvId}
                  onChange={handleChange}
                  required
                  placeholder="Enter CV ID"
                />
              </div>
              <div className="candidate-form-group">
                <label>CV owner · recruiter *</label>
                <input
                  type="text"
                  name="cvOwner"
                  value={formData.cvOwner}
                  onChange={handleChange}
                  required
                  placeholder="Recruiter who owns this CV"
                />
              </div>

              {/* Row 3 */}
              <div className="candidate-form-group">
                <label>Referred by</label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  placeholder="Who referred this candidate"
                />
              </div>
              <div className="candidate-form-group">
                <label>Reference note</label>
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

          {/* Section 4: Contact & Personal */}
          <div className="candidate-form-section">
            <div className="candidate-form-grid">
              {/* Row 1 */}
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

              {/* Row 2 */}
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

              {/* Row 3 */}
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

          {/* Section 5: Professional */}
          <div className="candidate-form-section">
            <div className="candidate-form-grid">
              <div className="candidate-form-group">
                <label>Current company</label>
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="Enter current company"
                />
              </div>
              <div className="candidate-form-group">
                <label>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  step="0.5"
                />
              </div>

              <div className="candidate-form-group">
                <label>Primary skills (comma separated)</label>
                <input
                  type="text"
                  name="primarySkills"
                  value={formData.primarySkills}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, Python, React"
                />
              </div>
              <div className="candidate-form-group">
                <label>Secondary skills</label>
                <input
                  type="text"
                  name="secondarySkills"
                  value={formData.secondarySkills}
                  onChange={handleChange}
                  placeholder="e.g. AWS, Docker, MongoDB"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Additional Details */}
          <div className="candidate-form-section">
            <div className="candidate-form-grid">
              <div className="candidate-form-group">
                <label>Notice period</label>
                <input
                  type="text"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  placeholder="e.g. 2 weeks, 1 month"
                />
              </div>
              <div className="candidate-form-group">
                <label>Visa status</label>
                <input
                  type="text"
                  name="visaStatus"
                  value={formData.visaStatus}
                  onChange={handleChange}
                  placeholder="Enter visa status"
                />
              </div>

              {/* Current Rate */}
              <div className="candidate-form-group">
                <label>Current rate</label>
                <div className="candidate-rate-group">
                  <select
                    name="currentRateCurrency"
                    value={formData.currentRateCurrency}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >
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
                  />
                  <select
                    name="currentRatePeriod"
                    value={formData.currentRatePeriod}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >
                    <option value="month">month</option>
                    <option value="day">day</option>
                    <option value="hour">hour</option>
                    <option value="year">year</option>
                  </select>
                </div>
              </div>

              {/* Day Rate */}
              <div className="candidate-form-group">
                <label>Day rate</label>
                <div className="candidate-rate-group">
                  <select
                    name="dayRateCurrency"
                    value={formData.dayRateCurrency}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >
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
                  />
                  <select
                    name="dayRatePeriod"
                    value={formData.dayRatePeriod}
                    onChange={handleChange}
                    className="candidate-rate-select"
                  >
                    <option value="day">day</option>
                    <option value="month">month</option>
                    <option value="hour">hour</option>
                    <option value="year">year</option>
                  </select>
                </div>
              </div>

              <div className="candidate-form-group">
                <label>Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Job Board">Job Board</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="candidate-form-group">
                <label>Candidate status</label>
                <select
                  name="candidateStatus"
                  value={formData.candidateStatus}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </div>

              <div className="candidate-form-group candidate-form-full">
                <label>Recruiter notes / latest comment</label>
                <textarea
                  name="recruiterNotes"
                  value={formData.recruiterNotes}
                  onChange={handleChange}
                  placeholder="Add any notes or comments about this candidate"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="candidate-info-note">
            <i className="fas fa-info-circle"></i>
            <span>
              To put this candidate forward for a job, save first, then use <strong>Apply to a job</strong> on their profile (or add them from the Pipeline / a Job). Pipeline status is tracked per application there.
            </span>
          </div>

          {/* Modal Footer */}
          <div className="candidate-modal-footer">
            <button type="button" className="candidate-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="candidate-save-btn">
              Add candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;