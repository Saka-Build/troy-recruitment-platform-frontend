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
}) {

    const fileInputRef =
        useRef(null);


    const isEditMode =
        Boolean(employee);


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

        /*
         * IMPORTANT
         *
         * Backend GET response:
         * active: true / false
         *
         * Create request:
         * isActive: true / false
         *
         * We use isActive in frontend.
         */
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

            /*
             * Existing employee:
             * use backend active value.
             *
             * New employee:
             * default to true.
             */
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


            /*
             * SELECT VALUE IS ALWAYS STRING.
             *
             * Convert status back to boolean.
             */
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


            if (
                !form.fullName.trim()
            ) {

                alert(
                    "Please enter full name."
                );

                return;
            }


            if (
                !form.employeeId.trim()
            ) {

                alert(
                    "Please enter employee ID."
                );

                return;
            }


            if (
                !form.designation.trim()
            ) {

                alert(
                    "Please enter designation."
                );

                return;
            }


            if (
                !form.officialEmail.trim()
            ) {

                alert(
                    "Please enter official email."
                );

                return;
            }


            if (
                !form.countryCode
            ) {

                alert(
                    "Please select country."
                );

                return;
            }


            /*
             * Password required only
             * while creating employee.
             */

            if (
                !isEditMode &&
                !form.password
            ) {

                alert(
                    "Please enter password."
                );

                return;
            }


            onSave(
                form
            );
        };


    /*
     * ---------------------------------------------------------------
     * CLOSE
     * ---------------------------------------------------------------
     */

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


                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="employee-modal-body">

                        {/* PHOTO */}

                        <div className="employee-photo-section">

                            <div className="employee-photo-preview">

                                {form.photoPreview ? (

                                    <img
                                        src={
                                            form.photoPreview
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
                                    value={
                                        form.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter full name"
                                    disabled={
                                        isSubmitting
                                    }
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
                                    value={
                                        form.employeeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="EMP001"
                                    disabled={
                                        isSubmitting ||
                                        isEditMode
                                    }
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
                                    value={
                                        form.designation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Recruiter"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                            </div>


                            <div className="employee-form-group">

                                <label>
                                    Role
                                    <span>*</span>
                                </label>


                                <select
                                    name="role"
                                    value={
                                        form.role
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >

                                    <option value="admin">
                                        Admin
                                    </option>

                                    <option value="recruiter">
                                        Recruiter
                                    </option>

                                    <option value="hr">
                                        HR
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* COUNTRY + STATUS */}

                        <div className="employee-form-row">

                            {/* COUNTRY */}

                            <div className="employee-form-group">

                                <label>
                                    Country
                                    <span>*</span>
                                </label>


                                <select
                                    name="countryCode"
                                    value={
                                        form.countryCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSubmitting ||
                                        countriesLoading
                                    }
                                >

                                    <option value="">

                                        {countriesLoading
                                            ? "Loading countries..."
                                            : "Select country"}

                                    </option>


                                    {countries.map(
                                        (country) => (

                                            <option
                                                key={
                                                    country.id ||
                                                    country.code
                                                }
                                                value={
                                                    country.code
                                                }
                                            >

                                                {country.name}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* STATUS */}

                            <div className="employee-form-group">

                                <label>
                                    Status
                                    <span>*</span>
                                </label>


                                <select
                                    name="isActive"
                                    value={
                                        String(
                                            form.isActive
                                        )
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >

                                    <option value="true">
                                        True
                                    </option>

                                    <option value="false">
                                        False
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* EMAIL ROW */}

                        <div className="employee-form-row">

                            <div className="employee-form-group">

                                <label>
                                    Official Email
                                    <span>*</span>
                                </label>


                                <input
                                    type="email"
                                    name="officialEmail"
                                    value={
                                        form.officialEmail
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="name@troy.com"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                            </div>


                            <div className="employee-form-group">

                                <label>
                                    Personal Email
                                </label>


                                <input
                                    type="email"
                                    name="personalEmail"
                                    value={
                                        form.personalEmail
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="personal@gmail.com"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                            </div>

                        </div>


                        {/* CONTACT ROW */}

                        <div className="employee-form-row">

                            <div className="employee-form-group">

                                <label>
                                    Contact Number
                                </label>


                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={
                                        form.contactNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+919876543210"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                            </div>


                            <div className="employee-form-group">

                                <label>
                                    WhatsApp Number
                                </label>


                                <input
                                    type="text"
                                    name="whatsappNumber"
                                    value={
                                        form.whatsappNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+919876543210"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="employee-form-group">

                            <label>

                                Password

                                {!isEditMode && (
                                    <span>*</span>
                                )}

                            </label>


                            <input
                                type="password"
                                name="password"
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    isEditMode
                                        ? "Leave blank to keep current password"
                                        : "Enter password"
                                }
                                disabled={
                                    isSubmitting
                                }
                            />

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="employee-modal-footer">

                        <button
                            type="button"
                            className="employee-modal-cancel-btn"
                            onClick={
                                handleClose
                            }
                            disabled={
                                isSubmitting
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="employee-modal-save-btn"
                            disabled={
                                isSubmitting
                            }
                        >

                            {isSubmitting ? (

                                <>

                                    <i className="bi bi-arrow-repeat"></i>

                                    Saving...

                                </>

                            ) : (

                                <>

                                    <i className="bi bi-check-lg"></i>

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