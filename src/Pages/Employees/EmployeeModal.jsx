import {
    useEffect,
    useRef,
    useState,
} from "react";

import "./EmployeeModal.css";


function EmployeeModal({
    employee,
    countries = [],
    countriesLoading = false,
    onClose,
    onSave,
    generateEmployeeId,
    isSubmitting = false,
    error = null,
    onClearError,
}) {

    const fileInputRef = useRef(null);


    const isEditMode = Boolean(employee);

    const [validationError, setValidationError,] = useState("");


    /*
     * ---------------------------------------------------------------
     * FORM
     * ---------------------------------------------------------------
     */

    const [
        form,
        setForm,
    ] = useState({

        fullName:
            employee?.fullName ||
            "",

        employeeId:
            employee?.employeeCode ||
            "",

        designation:
            employee?.designation ||
            "",

        officialEmail:
            employee?.officialEmail ||
            "",

        personalEmail:
            employee?.personalEmail ||
            "",

        contactNumber:
            employee?.phone ||
            "",

        whatsappNumber:
            employee?.whatsapp ||
            "",

        role:
            employee?.role ||
            "admin",

        password:
            "",

        countryCode:
            employee?.country?.code ||
            "",

        isActive:
            employee?.active ??
            true,

        photo:
            null,

        photoPreview:
            null,
    });


    /*
     * ---------------------------------------------------------------
     * RESET FORM WHEN EMPLOYEE CHANGES
     * ---------------------------------------------------------------
     */

    useEffect(() => {

        setForm({

            fullName:
                employee?.fullName ||
                "",

            employeeId:
                employee?.employeeCode ||
                "",

            designation:
                employee?.designation ||
                "",

            officialEmail:
                employee?.officialEmail ||
                "",

            personalEmail:
                employee?.personalEmail ||
                "",

            contactNumber:
                employee?.phone ||
                "",

            whatsappNumber:
                employee?.whatsapp ||
                "",

            role:
                employee?.role ||
                "admin",

            password:
                "",

            countryCode:
                employee?.country?.code ||
                "",

            isActive:
                employee?.active ??
                true,

            photo:
                null,

            photoPreview:
                null,
        });

    }, [
        employee,
    ]);


    /*
     * ---------------------------------------------------------------
     * INPUT CHANGE
     * ---------------------------------------------------------------
     */
    const handleChange =
        (event) => {

            const {
                name,
                value,
            } = event.target;

            // Clear errors when user starts correcting the form
            setValidationError("");

            if (onClearError) {
                onClearError();
            }

            if (
                name === "isActive"
            ) {
                setForm(
                    (current) => ({
                        ...current,
                        isActive:
                            value === "true",
                    })
                );

                return;
            }

            setForm(
                (current) => ({
                    ...current,
                    [name]:
                        value,
                })
            );
        };


    /*
     * ---------------------------------------------------------------
     * PHOTO
     * ---------------------------------------------------------------
     */

    const handlePhotoChange =
        (event) => {

            const file =
                event.target.files?.[0];


            if (!file) {

                return;
            }


            const preview =
                URL.createObjectURL(
                    file
                );


            setForm(
                (current) => ({

                    ...current,

                    photo:
                        file,

                    photoPreview:
                        preview,

                })
            );
        };


    /*
     * ---------------------------------------------------------------
     * SUBMIT
     * ---------------------------------------------------------------
     */

    const handleSubmit =
        (event) => {

            event.preventDefault();

            // Clear previous errors
            setValidationError("");

            if (onClearError) {
                onClearError();
            }

            if (!form.fullName.trim()) {

                setValidationError(
                    "Please enter full name."
                );

                return;
            }

            if (!form.employeeId.trim()) {

                setValidationError(
                    "Please enter employee ID."
                );

                return;
            }

            if (!form.designation.trim()) {

                setValidationError(
                    "Please enter designation."
                );

                return;
            }

            if (!form.officialEmail.trim()) {

                setValidationError(
                    "Please enter official email."
                );

                return;
            }

            if (!form.countryCode) {

                setValidationError(
                    "Please select country."
                );

                return;
            }

            if (
                !isEditMode &&
                !form.password
            ) {

                setValidationError(
                    "Please enter password."
                );

                return;
            }

            onSave(form);
        };

    const handleClose = () => {

        if (
            isSubmitting
        ) {

            return;
        }


        onClose();
    };


    return (

        <div className="employee-modal-overlay">

            <div className="employee-modal">

                {/* HEADER */}

                <div className="employee-modal-header">

                    <div>

                        <h2>

                            {isEditMode
                                ? "Edit Employee"
                                : "Add Employee"}

                        </h2>


                        <p>

                            {isEditMode
                                ? "Update employee information"
                                : "Add a new employee to the Troy team"}

                        </p>

                    </div>


                    <button
                        type="button"
                        className="employee-modal-close-btn"
                        onClick={
                            handleClose
                        }
                        disabled={
                            isSubmitting
                        }
                    >

                        <i className="bi bi-x-lg"></i>

                    </button>

                </div>

                {(validationError || error) && (

                    <div className="employee-modal-error">

                        <i className="bi bi-exclamation-circle-fill"></i>

                        <span>
                            {validationError || error}
                        </span>

                    </div>

                )}
                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="employee-modal-body">

                        {/* PHOTO SECTION */}

                        <div className="employee-photo-section">

                            <div className="employee-photo-preview">

                                {form.photoPreview ? (

                                    <img
                                        src={
                                            form.photoPreview
                                        }
                                        alt="Employee"
                                    />

                                ) : employee?.photoUrl ? (

                                    <img
                                        src={
                                            employee.photoUrl
                                        }
                                        alt="Employee"
                                    />

                                ) : (

                                    <i className="bi bi-person"></i>

                                )}

                            </div>


                            <div>

                                <button
                                    type="button"
                                    className="employee-upload-btn"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >

                                    <i className="bi bi-camera"></i>

                                    Upload photo

                                </button>


                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={
                                        handlePhotoChange
                                    }
                                />


                                <small>

                                    JPG, PNG or WEBP

                                </small>

                            </div>

                        </div>


                        {isEditMode ? (
                            /* 
                             * ============================================================
                             * EDIT MODE LAYOUT
                             * ============================================================
                             */

                            <>
                                {/* FULL NAME + EMPLOYEE ID */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Full Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter full name"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Employee ID
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={form.employeeId}
                                            onChange={handleChange}
                                            placeholder="EMP001"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                </div>

                                {/* DESIGNATION + ROLE */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Designation
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="designation"
                                            value={form.designation}
                                            onChange={handleChange}
                                            placeholder="e.g. Recruiter"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Role
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >

                                            <option value="admin">Admin</option>
                                            <option value="recruiter">Recruiter</option>
                                            <option value="hr">HR</option>

                                        </select>

                                    </div>

                                </div>

                                {/* COUNTRY + STATUS */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Country
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="countryCode"
                                            value={form.countryCode}
                                            onChange={handleChange}
                                            disabled={isSubmitting || countriesLoading}
                                        >

                                            <option value="">
                                                {countriesLoading
                                                    ? "Loading countries..."
                                                    : "Select country"}
                                            </option>

                                            {countries.map(
                                                (country) => (

                                                    <option
                                                        key={country.id || country.code}
                                                        value={country.code}
                                                    >
                                                        {country.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Status
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="isActive"
                                            value={String(form.isActive)}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >

                                            <option value="true">True</option>
                                            <option value="false">False</option>

                                        </select>

                                    </div>

                                </div>

                                {/* OFFICIAL EMAIL + PASSWORD */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Official Email
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            name="officialEmail"
                                            value={form.officialEmail}
                                            onChange={handleChange}
                                            placeholder="name@troy.com"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Leave blank to keep current password"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                </div>

                                {/* CONTACT + WHATSAPP */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Contact Number
                                        </label>

                                        <div className="employee-phone-input-wrapper">
                                            <span className="employee-country-code">+91</span>
                                            <input
                                                type="text"
                                                name="contactNumber"
                                                value={form.contactNumber.replace(/^\+91\s*/, '')}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, '');
                                                    setForm((current) => ({
                                                        ...current,
                                                        contactNumber: rawValue ? `+91${rawValue}` : '',
                                                    }));
                                                }}
                                                placeholder="Enter phone number"
                                                disabled={isSubmitting}
                                                className="employee-phone-input"
                                            />
                                        </div>

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            WhatsApp Number
                                        </label>

                                        <div className="employee-phone-input-wrapper">
                                            <span className="employee-country-code">+91</span>
                                            <input
                                                type="text"
                                                name="whatsappNumber"
                                                value={form.whatsappNumber.replace(/^\+91\s*/, '')}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, '');
                                                    setForm((current) => ({
                                                        ...current,
                                                        whatsappNumber: rawValue ? `+91${rawValue}` : '',
                                                    }));
                                                }}
                                                placeholder="Enter WhatsApp number"
                                                disabled={isSubmitting}
                                                className="employee-phone-input"
                                            />
                                        </div>

                                    </div>

                                </div>
                            </>

                        ) : (
                            /* 
                             * ============================================================
                             * CREATE MODE LAYOUT (ORIGINAL)
                             * ============================================================
                             */

                            <>
                                {/* FULL NAME + EMPLOYEE ID */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Full Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter full name"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Employee ID
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={form.employeeId}
                                            onChange={handleChange}
                                            placeholder="EMP001"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                </div>

                                {/* DESIGNATION + ROLE */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Designation
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="designation"
                                            value={form.designation}
                                            onChange={handleChange}
                                            placeholder="e.g. Recruiter"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Role
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >

                                            <option value="admin">Admin</option>
                                            <option value="recruiter">Recruiter</option>
                                            <option value="hr">HR</option>

                                        </select>

                                    </div>

                                </div>

                                {/* COUNTRY + STATUS */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Country
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="countryCode"
                                            value={form.countryCode}
                                            onChange={handleChange}
                                            disabled={isSubmitting || countriesLoading}
                                        >

                                            <option value="">
                                                {countriesLoading
                                                    ? "Loading countries..."
                                                    : "Select country"}
                                            </option>

                                            {countries.map(
                                                (country) => (

                                                    <option
                                                        key={country.id || country.code}
                                                        value={country.code}
                                                    >
                                                        {country.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Status
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="isActive"
                                            value={String(form.isActive)}
                                            onChange={handleChange}
                                            disabled={isSubmitting || !isEditMode}
                                        >

                                            <option value="true">True</option>
                                            <option value="false">False</option>

                                        </select>

                                    </div>

                                </div>

                                {/* OFFICIAL EMAIL + PERSONAL EMAIL */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Official Email
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            name="officialEmail"
                                            value={form.officialEmail}
                                            onChange={handleChange}
                                            placeholder="name@troy.com"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            Personal Email
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            name="personalEmail"
                                            value={form.personalEmail}
                                            onChange={handleChange}
                                            placeholder="personal@gmail.com"
                                            disabled={isSubmitting}
                                        />

                                    </div>

                                </div>

                                {/* CONTACT + WHATSAPP */}
                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Contact Number
                                        </label>

                                        <div className="employee-phone-input-wrapper">
                                            <span className="employee-country-code">+91</span>
                                            <input
                                                type="text"
                                                name="contactNumber"
                                                value={form.contactNumber.replace(/^\+91\s*/, '')}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, '');
                                                    setForm((current) => ({
                                                        ...current,
                                                        contactNumber: rawValue ? `+91${rawValue}` : '',
                                                    }));
                                                }}
                                                placeholder="Enter phone number"
                                                disabled={isSubmitting}
                                                className="employee-phone-input"
                                            />
                                        </div>

                                    </div>

                                    <div className="employee-form-group">

                                        <label>
                                            WhatsApp Number
                                        </label>

                                        <div className="employee-phone-input-wrapper">
                                            <span className="employee-country-code">+91</span>
                                            <input
                                                type="text"
                                                name="whatsappNumber"
                                                value={form.whatsappNumber.replace(/^\+91\s*/, '')}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, '');
                                                    setForm((current) => ({
                                                        ...current,
                                                        whatsappNumber: rawValue ? `+91${rawValue}` : '',
                                                    }));
                                                }}
                                                placeholder="Enter WhatsApp number"
                                                disabled={isSubmitting}
                                                className="employee-phone-input"
                                            />
                                        </div>

                                    </div>

                                </div>

                                {/* PASSWORD */}
                                <div className="employee-form-group">

                                    <label>
                                        Password
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        disabled={isSubmitting}
                                    />

                                </div>
                            </>
                        )}

                    </div>


                    {/* FOOTER */}

                    <div className="employee-modal-footer">

                        <button
                            type="button"
                            className="employee-modal-cancel-btn"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="employee-modal-save-btn"
                            disabled={isSubmitting}
                        >

                            {isSubmitting ? (

                                <>

                                    <i className="bi bi-arrow-repeat"></i>

                                    Saving...

                                </>

                            ) : (

                                <>

                                    {/* <i className="bi bi-check-lg"></i> */}

                                    {isEditMode
                                        ? "Update Employee"
                                        : "Add Employee"}

                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}


export default EmployeeModal;