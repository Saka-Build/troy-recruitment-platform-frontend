// import { useEffect, useRef, useState } from "react";
// import "./EmployeeModal.css";

// function EmployeeModal({
//     employee,
//     onClose,
//     onSave,
//     generateEmployeeId,
// }) {
//     const fileInputRef = useRef(null);

//     const [form, setForm] = useState({
//         fullName: "",
//         employeeId: "",
//         designation: "",
//         contactNumber: "",
//         whatsappNumber: "",
//         officialEmail: "",
//         personalEmail: "",
//         photo: "",
//     });

//     const [errors, setErrors] = useState({});

//     const isEditMode = Boolean(employee);

//     useEffect(() => {
//         if (employee) {
//             setForm({
//                 fullName: employee.fullName || "",
//                 employeeId: employee.employeeId || "",
//                 designation: employee.designation || "",
//                 contactNumber: employee.contactNumber || "",
//                 whatsappNumber: employee.whatsappNumber || "",
//                 officialEmail: employee.officialEmail || "",
//                 personalEmail: employee.personalEmail || "",
//                 photo: employee.photo || "",
//             });
//         } else {
//             setForm({
//                 fullName: "",
//                 employeeId: generateEmployeeId(),
//                 designation: "",
//                 contactNumber: "",
//                 whatsappNumber: "",
//                 officialEmail: "",
//                 personalEmail: "",
//                 photo: "",
//             });
//         }

//         setErrors({});
//     }, [employee, generateEmployeeId]);

//     const handleChange = (event) => {
//         const { name, value } = event.target;

//         setForm((current) => ({
//             ...current,
//             [name]: value,
//         }));

//         setErrors((current) => ({
//             ...current,
//             [name]: "",
//         }));
//     };

//     const handlePhotoUpload = (event) => {
//         const file = event.target.files?.[0];

//         if (!file) return;

//         const allowedTypes = [
//             "image/jpeg",
//             "image/png",
//         ];

//         if (!allowedTypes.includes(file.type)) {
//             setErrors((current) => ({
//                 ...current,
//                 photo: "Only JPG and PNG images are allowed.",
//             }));

//             event.target.value = "";
//             return;
//         }

//         if (file.size > 2 * 1024 * 1024) {
//             setErrors((current) => ({
//                 ...current,
//                 photo: "Photo size must be less than 2 MB.",
//             }));

//             event.target.value = "";
//             return;
//         }

//         const reader = new FileReader();

//         reader.onload = (loadEvent) => {
//             setForm((current) => ({
//                 ...current,
//                 photo: loadEvent.target.result,
//             }));

//             setErrors((current) => ({
//                 ...current,
//                 photo: "",
//             }));
//         };

//         reader.readAsDataURL(file);
//     };

//     const removePhoto = () => {
//         setForm((current) => ({
//             ...current,
//             photo: "",
//         }));

//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         }
//     };

//     const validate = () => {
//         const newErrors = {};

//         if (!form.fullName.trim()) {
//             newErrors.fullName = "Full name is required.";
//         }

//         if (!form.employeeId.trim()) {
//             newErrors.employeeId = "Employee ID is required.";
//         }

//         if (!form.designation.trim()) {
//             newErrors.designation = "Designation is required.";
//         }

//         if (!form.contactNumber.trim()) {
//             newErrors.contactNumber = "Contact number is required.";
//         } else if (!/^[+0-9()\-\s]{7,20}$/.test(form.contactNumber)) {
//             newErrors.contactNumber = "Enter a valid contact number.";
//         }

//         if (!form.whatsappNumber.trim()) {
//             newErrors.whatsappNumber = "WhatsApp number is required.";
//         } else if (!/^[+0-9()\-\s]{7,20}$/.test(form.whatsappNumber)) {
//             newErrors.whatsappNumber = "Enter a valid WhatsApp number.";
//         }

//         if (!form.officialEmail.trim()) {
//             newErrors.officialEmail = "Official email is required.";
//         } else if (
//             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//                 form.officialEmail
//             )
//         ) {
//             newErrors.officialEmail = "Enter a valid email address.";
//         }

//         if (!form.personalEmail.trim()) {
//             newErrors.personalEmail = "Personal email is required.";
//         } else if (
//             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//                 form.personalEmail
//             )
//         ) {
//             newErrors.personalEmail = "Enter a valid email address.";
//         }

//         setErrors(newErrors);

//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();

//         if (!validate()) {
//             return;
//         }

//         onSave({
//             ...form,
//             fullName: form.fullName.trim(),
//             employeeId: form.employeeId.trim(),
//             designation: form.designation.trim(),
//             contactNumber: form.contactNumber.trim(),
//             whatsappNumber: form.whatsappNumber.trim(),
//             officialEmail: form.officialEmail.trim().toLowerCase(),
//             personalEmail: form.personalEmail.trim().toLowerCase(),
//         });
//     };

//     const initials = (name) => {
//         if (!name) return "T";

//         return name
//             .split(" ")
//             .filter(Boolean)
//             .slice(0, 2)
//             .map((part) => part[0])
//             .join("")
//             .toUpperCase();
//     };

//     return (
//         <div className="employee-modal-overlay">

//             <div className="employee-modal">

//                 {/* =========================================
//                     MODAL HEADER
//                 ========================================= */}

//                 <div className="employee-modal-header">

//                     <h2>
//                         {isEditMode
//                             ? "Edit Troy employee"
//                             : "Add Troy employee"}
//                     </h2>

//                     <button
//                         type="button"
//                         className="employee-modal-close"
//                         onClick={onClose}
//                         aria-label="Close"
//                     >
//                         ×
//                     </button>

//                 </div>

//                 {/* =========================================
//                     FORM
//                 ========================================= */}

//                 <form onSubmit={handleSubmit}>

//                     <div className="employee-modal-body">

//                         {/* PHOTO */}

//                         <div className="employee-photo-section">

//                             <div className="employee-photo-preview">

//                                 {form.photo ? (

//                                     <img
//                                         src={form.photo}
//                                         alt="Employee"
//                                     />

//                                 ) : (

//                                     <div className="employee-photo-placeholder">
//                                         <i className="bi bi-person-fill"></i>
//                                     </div>

//                                 )}

//                             </div>

//                             <div className="employee-photo-actions">

//                                 <button
//                                     type="button"
//                                     className="upload-photo-btn"
//                                     onClick={() =>
//                                         fileInputRef.current?.click()
//                                     }
//                                 >
//                                     <i className="bi bi-upload"></i>
//                                     Upload photo
//                                 </button>

//                                 <span>
//                                     JPG / PNG
//                                 </span>

//                                 {form.photo && (
//                                     <button
//                                         type="button"
//                                         className="remove-photo-btn"
//                                         onClick={removePhoto}
//                                     >
//                                         Remove photo
//                                     </button>
//                                 )}

//                                 {errors.photo && (
//                                     <small className="field-error">
//                                         {errors.photo}
//                                     </small>
//                                 )}

//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     accept=".jpg,.jpeg,.png,image/jpeg,image/png"
//                                     hidden
//                                     onChange={handlePhotoUpload}
//                                 />

//                             </div>

//                         </div>

//                         {/* FORM GRID */}

//                         <div className="employee-form-grid">

//                             {/* FULL NAME */}

//                             <div className="employee-form-field">

//                                 <label>
//                                     Full name <span>*</span>
//                                 </label>

//                                 <input
//                                     type="text"
//                                     name="fullName"
//                                     value={form.fullName}
//                                     onChange={handleChange}
//                                     placeholder=""
//                                     autoComplete="off"
//                                 />

//                                 {errors.fullName && (
//                                     <small className="field-error">
//                                         {errors.fullName}
//                                     </small>
//                                 )}

//                             </div>

//                             {/* EMPLOYEE ID */}

//                             <div className="employee-form-field">

//                                 <label>
//                                     Employee ID <span>*</span>
//                                 </label>

//                                 <input
//                                     type="text"
//                                     name="employeeId"
//                                     value={form.employeeId}
//                                     onChange={handleChange}
//                                     placeholder="TROY-6126"
//                                     autoComplete="off"
//                                 />

//                                 {errors.employeeId && (
//                                     <small className="field-error">
//                                         {errors.employeeId}
//                                     </small>
//                                 )}

//                             </div>

//                             {/* DESIGNATION */}

//                             <div className="employee-form-field">

//                                 <label>
//                                     Designation <span>*</span>
//                                 </label>

//                                 <input
//                                     type="text"
//                                     name="designation"
//                                     value={form.designation}
//                                     onChange={handleChange}
//                                     placeholder=""
//                                     autoComplete="off"
//                                 />

//                                 {errors.designation && (
//                                     <small className="field-error">
//                                         {errors.designation}
//                                     </small>
//                                 )}

//                             </div>

//                             {/* CONTACT */}

//                             <div className="employee-form-field">

//                                 <label>
//                                     Contact number <span>*</span>
//                                 </label>

//                                 <input
//                                     type="tel"
//                                     name="contactNumber"
//                                     value={form.contactNumber}
//                                     onChange={handleChange}
//                                     placeholder="+44..."
//                                     autoComplete="off"
//                                 />

//                                 {errors.contactNumber && (
//                                     <small className="field-error">
//                                         {errors.contactNumber}
//                                     </small>
//                                 )}

//                             </div>

//                             {/* WHATSAPP */}

//                             <div className="employee-form-field">

//                                 <label>
//                                     WhatsApp number <span>*</span>
//                                 </label>

//                                 <input
//                                     type="tel"
//                                     name="whatsappNumber"
//                                     value={form.whatsappNumber}
//                                     onChange={handleChange}
//                                     placeholder="+44..."
//                                     autoComplete="off"
//                                 />

//                                 {errors.whatsappNumber && (
//                                     <small className="field-error">
//                                         {errors.whatsappNumber}
//                                     </small>
//                                 )}

//                             </div>

//                             {/* OFFICIAL EMAIL */}

//                             <div className="employee-form-field">

//                                 <label>
//                                     Official email <span>*</span>
//                                 </label>

//                                 <input
//                                     type="email"
//                                     name="officialEmail"
//                                     value={form.officialEmail}
//                                     onChange={handleChange}
//                                     placeholder="name@troy.com"
//                                     autoComplete="off"
//                                 />

//                                 {errors.officialEmail && (
//                                     <small className="field-error">
//                                         {errors.officialEmail}
//                                     </small>
//                                 )}

//                             </div>

//                             {/* PERSONAL EMAIL */}

//                             <div className="employee-form-field">

//                                 <label>
//                                     Personal email <span>*</span>
//                                 </label>

//                                 <input
//                                     type="email"
//                                     name="personalEmail"
//                                     value={form.personalEmail}
//                                     onChange={handleChange}
//                                     placeholder="name@gmail.com"
//                                     autoComplete="off"
//                                 />

//                                 {errors.personalEmail && (
//                                     <small className="field-error">
//                                         {errors.personalEmail}
//                                     </small>
//                                 )}

//                             </div>

//                         </div>

//                     </div>

//                     {/* =========================================
//                         FOOTER
//                     ========================================= */}

//                     <div className="employee-modal-footer">

//                         <button
//                             type="button"
//                             className="employee-cancel-btn"
//                             onClick={onClose}
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             className="employee-save-btn"
//                         >
//                             {isEditMode
//                                 ? "Save changes"
//                                 : "Add employee"}
//                         </button>

//                     </div>

//                 </form>

//             </div>

//         </div>
//     );
// }

// export default EmployeeModal;


import {
    useEffect,
    useRef,
    useState,
} from "react";

import "./EmployeeModal.css";


function EmployeeModal({
    employee,
    onClose,
    onSave,
    generateEmployeeId,
    isSubmitting = false,
}) {

    const fileInputRef = useRef(null);


    const [form, setForm] = useState({

        fullName: "",

        employeeId: "",

        designation: "",

        contactNumber: "",

        whatsappNumber: "",

        officialEmail: "",

        personalEmail: "",

        role: "admin",

        password: "",

        isActive: true,

        countryCode: "IN",

        photo: null,

        photoPreview: "",
    });


    const [errors, setErrors] = useState({});


    const isEditMode = Boolean(employee);


    /*
     * INITIALIZE FORM
     */
    useEffect(() => {

        if (employee) {

            setForm({

                fullName:
                    employee.fullName || "",

                employeeId:
                    employee.employeeId ||
                    employee.employeeCode ||
                    "",

                designation:
                    employee.designation || "",

                contactNumber:
                    employee.contactNumber ||
                    employee.phone ||
                    "",

                whatsappNumber:
                    employee.whatsappNumber ||
                    employee.whatsapp ||
                    "",

                officialEmail:
                    employee.officialEmail || "",

                personalEmail:
                    employee.personalEmail || "",

                role:
                    employee.role || "admin",

                password: "",

                isActive:
                    employee.isActive !== undefined
                        ? employee.isActive
                        : true,

                countryCode:
                    employee.countryCode || "IN",

                photo: null,

                photoPreview:
                    employee.photoUrl ||
                    employee.photo ||
                    "",
            });

        } else {

            setForm({

                fullName: "",

                employeeId:
                    generateEmployeeId(),

                designation: "",

                contactNumber: "",

                whatsappNumber: "",

                officialEmail: "",

                personalEmail: "",

                role: "admin",

                password: "",

                isActive: true,

                countryCode: "IN",

                photo: null,

                photoPreview: "",
            });
        }

        setErrors({});

    }, [
        employee,
        generateEmployeeId,
    ]);


    /*
     * HANDLE INPUT CHANGE
     */
    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setForm((current) => ({

            ...current,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));


        setErrors((current) => ({

            ...current,

            [name]: "",
        }));
    };


    /*
     * PHOTO UPLOAD
     */
    const handlePhotoUpload = (event) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        const allowedTypes = [

            "image/jpeg",

            "image/png",
        ];


        if (!allowedTypes.includes(file.type)) {

            setErrors((current) => ({

                ...current,

                photo:
                    "Only JPG and PNG images are allowed.",
            }));

            event.target.value = "";

            return;
        }


        if (
            file.size >
            2 * 1024 * 1024
        ) {

            setErrors((current) => ({

                ...current,

                photo:
                    "Photo size must be less than 2 MB.",
            }));

            event.target.value = "";

            return;
        }


        /*
         * Store actual File
         */
        setForm((current) => ({

            ...current,

            photo: file,
        }));


        /*
         * Create preview
         */
        const reader =
            new FileReader();


        reader.onload = (loadEvent) => {

            setForm((current) => ({

                ...current,

                photoPreview:
                    loadEvent.target.result,
            }));
        };


        reader.readAsDataURL(file);


        setErrors((current) => ({

            ...current,

            photo: "",
        }));
    };


    /*
     * REMOVE PHOTO
     */
    const removePhoto = () => {

        setForm((current) => ({

            ...current,

            photo: null,

            photoPreview: "",
        }));


        if (fileInputRef.current) {

            fileInputRef.current.value = "";
        }
    };


    /*
     * VALIDATION
     */
    const validate = () => {

        const newErrors = {};


        if (!form.fullName.trim()) {

            newErrors.fullName =
                "Full name is required.";
        }


        if (!form.employeeId.trim()) {

            newErrors.employeeId =
                "Employee code is required.";
        }


        if (!form.designation.trim()) {

            newErrors.designation =
                "Designation is required.";
        }


        if (!form.contactNumber.trim()) {

            newErrors.contactNumber =
                "Contact number is required.";

        } else if (
            !/^[+0-9()\-\s]{7,20}$/.test(
                form.contactNumber
            )
        ) {

            newErrors.contactNumber =
                "Enter a valid contact number.";
        }


        if (!form.whatsappNumber.trim()) {

            newErrors.whatsappNumber =
                "WhatsApp number is required.";

        } else if (
            !/^[+0-9()\-\s]{7,20}$/.test(
                form.whatsappNumber
            )
        ) {

            newErrors.whatsappNumber =
                "Enter a valid WhatsApp number.";
        }


        if (!form.officialEmail.trim()) {

            newErrors.officialEmail =
                "Official email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.officialEmail
            )
        ) {

            newErrors.officialEmail =
                "Enter a valid official email.";
        }


        if (!form.personalEmail.trim()) {

            newErrors.personalEmail =
                "Personal email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.personalEmail
            )
        ) {

            newErrors.personalEmail =
                "Enter a valid personal email.";
        }


        /*
         * Password required only when creating
         */
        if (!isEditMode) {

            if (!form.password.trim()) {

                newErrors.password =
                    "Password is required.";

            } else if (
                form.password.length < 8
            ) {

                newErrors.password =
                    "Password must be at least 8 characters.";
            }
        }


        if (!form.role) {

            newErrors.role =
                "Role is required.";
        }


        if (!form.countryCode.trim()) {

            newErrors.countryCode =
                "Country code is required.";
        }


        setErrors(newErrors);


        return (
            Object.keys(newErrors).length === 0
        );
    };


    /*
     * SUBMIT
     */
    const handleSubmit = (event) => {

        event.preventDefault();


        if (!validate()) {

            return;
        }


        /*
         * Send clean data to Employees.jsx
         */
        onSave({

            fullName:
                form.fullName.trim(),

            employeeId:
                form.employeeId.trim(),

            designation:
                form.designation.trim(),

            contactNumber:
                form.contactNumber.trim(),

            whatsappNumber:
                form.whatsappNumber.trim(),

            officialEmail:
                form.officialEmail
                    .trim()
                    .toLowerCase(),

            personalEmail:
                form.personalEmail
                    .trim()
                    .toLowerCase(),

            role:
                form.role,

            password:
                form.password,

            isActive:
                form.isActive,

            countryCode:
                form.countryCode
                    .trim()
                    .toUpperCase(),

            photo:
                form.photo,

            photoPreview:
                form.photoPreview,
        });
    };


    /*
     * INITIALS
     */
    const initials = (name) => {

        if (!name) {
            return "T";
        }


        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (part) => part[0]
            )
            .join("")
            .toUpperCase();
    };


    return (

        <div className="employee-modal-overlay">

            <div className="employee-modal">


                {/* HEADER */}

                <div className="employee-modal-header">

                    <h2>
                        {isEditMode
                            ? "Edit Troy employee"
                            : "Add Troy employee"}
                    </h2>


                    <button
                        type="button"
                        className="employee-modal-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
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

                                    <div className="employee-photo-placeholder">

                                        <i className="bi bi-person-fill"></i>

                                    </div>
                                )}

                            </div>


                            <div className="employee-photo-actions">

                                <button
                                    type="button"
                                    className="upload-photo-btn"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={isSubmitting}
                                >

                                    <i className="bi bi-upload"></i>

                                    Upload photo

                                </button>


                                <span>
                                    JPG / PNG
                                </span>


                                {form.photoPreview && (

                                    <button
                                        type="button"
                                        className="remove-photo-btn"
                                        onClick={
                                            removePhoto
                                        }
                                        disabled={
                                            isSubmitting
                                        }
                                    >
                                        Remove photo
                                    </button>
                                )}


                                {errors.photo && (

                                    <small className="field-error">
                                        {errors.photo}
                                    </small>
                                )}


                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                    hidden
                                    onChange={
                                        handlePhotoUpload
                                    }
                                />

                            </div>

                        </div>


                        {/* FORM GRID */}

                        <div className="employee-form-grid">


                            {/* FULL NAME */}

                            <div className="employee-form-field">

                                <label>
                                    Full name{" "}
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
                                    autoComplete="off"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.fullName && (

                                    <small className="field-error">
                                        {
                                            errors.fullName
                                        }
                                    </small>
                                )}

                            </div>


                            {/* EMPLOYEE CODE */}

                            <div className="employee-form-field">

                                <label>
                                    Employee code{" "}
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
                                    autoComplete="off"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.employeeId && (

                                    <small className="field-error">
                                        {
                                            errors.employeeId
                                        }
                                    </small>
                                )}

                            </div>


                            {/* DESIGNATION */}

                            <div className="employee-form-field">

                                <label>
                                    Designation{" "}
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
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.designation && (

                                    <small className="field-error">
                                        {
                                            errors.designation
                                        }
                                    </small>
                                )}

                            </div>


                            {/* OFFICIAL EMAIL */}

                            <div className="employee-form-field">

                                <label>
                                    Official email{" "}
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
                                    autoComplete="off"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.officialEmail && (

                                    <small className="field-error">
                                        {
                                            errors.officialEmail
                                        }
                                    </small>
                                )}

                            </div>


                            {/* PERSONAL EMAIL */}

                            <div className="employee-form-field">

                                <label>
                                    Personal email{" "}
                                    <span>*</span>
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
                                    autoComplete="off"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.personalEmail && (

                                    <small className="field-error">
                                        {
                                            errors.personalEmail
                                        }
                                    </small>
                                )}

                            </div>


                            {/* PHONE */}

                            <div className="employee-form-field">

                                <label>
                                    Phone{" "}
                                    <span>*</span>
                                </label>

                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={
                                        form.contactNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+91..."
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.contactNumber && (

                                    <small className="field-error">
                                        {
                                            errors.contactNumber
                                        }
                                    </small>
                                )}

                            </div>


                            {/* WHATSAPP */}

                            <div className="employee-form-field">

                                <label>
                                    WhatsApp{" "}
                                    <span>*</span>
                                </label>

                                <input
                                    type="tel"
                                    name="whatsappNumber"
                                    value={
                                        form.whatsappNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+91..."
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.whatsappNumber && (

                                    <small className="field-error">
                                        {
                                            errors.whatsappNumber
                                        }
                                    </small>
                                )}

                            </div>


                            {/* ROLE */}

                            <div className="employee-form-field">

                                <label>
                                    Role{" "}
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

                                    <option value="hr">
                                        HR
                                    </option>

                                    <option value="recruiter">
                                        Recruiter
                                    </option>

                                    <option value="user">
                                        User
                                    </option>

                                </select>


                                {errors.role && (

                                    <small className="field-error">
                                        {
                                            errors.role
                                        }
                                    </small>
                                )}

                            </div>


                            {/* PASSWORD */}

                            {!isEditMode && (

                                <div className="employee-form-field">

                                    <label>
                                        Password{" "}
                                        <span>*</span>
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
                                        autoComplete="new-password"
                                        placeholder="Enter password"
                                        disabled={
                                            isSubmitting
                                        }
                                    />

                                    {errors.password && (

                                        <small className="field-error">
                                            {
                                                errors.password
                                            }
                                        </small>
                                    )}

                                </div>
                            )}


                            {/* COUNTRY CODE */}

                            <div className="employee-form-field">

                                <label>
                                    Country code{" "}
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="countryCode"
                                    value={
                                        form.countryCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={2}
                                    placeholder="IN"
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                {errors.countryCode && (

                                    <small className="field-error">
                                        {
                                            errors.countryCode
                                        }
                                    </small>
                                )}

                            </div>


                            {/* ACTIVE */}

                            <div className="employee-form-field employee-active-field">

                                <label>
                                    Account status
                                </label>

                                <label className="employee-checkbox-label">

                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={
                                            form.isActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            isSubmitting
                                        }
                                    />

                                    <span>
                                        Active employee
                                    </span>

                                </label>

                            </div>


                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="employee-modal-footer">

                        <button
                            type="button"
                            className="employee-cancel-btn"
                            onClick={onClose}
                            disabled={
                                isSubmitting
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="employee-save-btn"
                            disabled={
                                isSubmitting
                            }
                        >

                            {isSubmitting ? (

                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>

                                    Creating...
                                </>

                            ) : (

                                isEditMode
                                    ? "Save changes"
                                    : "Add employee"
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default EmployeeModal;