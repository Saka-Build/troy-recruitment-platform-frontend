import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import "./Employees.css";

import EmployeeModal from "./EmployeeModal";

import {
    getAllEmployees,
    getCountries,
    createEmployee,
    updateEmployee,
    clearEmployeeError,
} from "../../Redux/Slice/employeeSlice";


function generateEmployeeId() {

    return `EMP${Math.floor(
        100 + Math.random() * 900
    )}`;
}


function Employees() {

    const dispatch =
        useDispatch();


    /*
     * ---------------------------------------------------------------
     * REDUX STATE
     * ---------------------------------------------------------------
     */

    const {
        employees = [],
        countries = [],
        isLoading,
        isSaving,
        countriesLoading,
        error,
    } = useSelector(
        (state) =>
            state.employees
    );


    /*
     * ---------------------------------------------------------------
     * LOCAL STATE
     * ---------------------------------------------------------------
     */

    const [
        search,
        setSearch,
    ] = useState("");


    const [
        showModal,
        setShowModal,
    ] = useState(false);


    const [
        editingEmployee,
        setEditingEmployee,
    ] = useState(null);


    /*
     * ---------------------------------------------------------------
     * INITIAL API CALLS
     * ---------------------------------------------------------------
     */

    useEffect(() => {

        dispatch(
            getAllEmployees()
        );

        dispatch(
            getCountries()
        );

    }, [dispatch]);


    /*
     * ---------------------------------------------------------------
     * SEARCH
     * ---------------------------------------------------------------
     */

    const filteredEmployees =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {

                return employees;
            }


            return employees.filter(
                (employee) => [

                    employee.fullName,

                    employee.employeeCode,

                    employee.designation,

                    employee.phone,

                    employee.whatsapp,

                    employee.officialEmail,

                    employee.personalEmail,

                    employee.role,

                    employee.country?.name,

                    employee.country?.code,

                ].some(
                    (value) =>
                        String(
                            value || ""
                        )
                            .toLowerCase()
                            .includes(
                                query
                            )
                )
            );

        }, [
            employees,
            search,
        ]);


    /*
     * ---------------------------------------------------------------
     * DESIGNATIONS
     * ---------------------------------------------------------------
     */

    const designations =
        useMemo(() => {

            return [
                ...new Set(
                    employees
                        .map(
                            (employee) =>
                                employee.designation
                        )
                ),
            ]
                .filter(Boolean)
                .sort();

        }, [
            employees,
        ]);


    /*
     * ---------------------------------------------------------------
     * ADD
     * ---------------------------------------------------------------
     */

    const openAddModal = () => {

        dispatch(
            clearEmployeeError()
        );

        setEditingEmployee(
            null
        );

        setShowModal(
            true
        );
    };


    /*
     * ---------------------------------------------------------------
     * EDIT
     * ---------------------------------------------------------------
     */

    const openEditModal =
        (employee) => {

            dispatch(
                clearEmployeeError()
            );

            setEditingEmployee(
                employee
            );

            setShowModal(
                true
            );
        };


    /*
     * ---------------------------------------------------------------
     * CLOSE MODAL
     * ---------------------------------------------------------------
     */

    const closeModal = () => {

        if (isSaving) {

            return;
        }


        setShowModal(
            false
        );

        setEditingEmployee(
            null
        );
    };


    /*
     * ---------------------------------------------------------------
     * SAVE EMPLOYEE
     * ---------------------------------------------------------------
     */

    const handleSaveEmployee =
        async (
            employeeData
        ) => {

            try {

                /*
                 * ===================================================
                 * EDIT
                 * ===================================================
                 */

              if (editingEmployee) {

    const updateData = {};

    /*
     * -----------------------------------------------------------
     * PARTIAL UPDATE
     *
     * PUT behaves like PATCH in this API.
     * Send any fields that are provided by the modal.
     * -----------------------------------------------------------
     */


    if (
        employeeData.fullName !== undefined &&
        employeeData.fullName !== null &&
        employeeData.fullName.trim() !== ""
    ) {

        updateData.fullName =
            employeeData.fullName.trim();
    }


    if (
        employeeData.designation !== undefined &&
        employeeData.designation !== null &&
        employeeData.designation.trim() !== ""
    ) {

        updateData.designation =
            employeeData.designation.trim();
    }


    if (
        employeeData.officialEmail !== undefined &&
        employeeData.officialEmail !== null &&
        employeeData.officialEmail.trim() !== ""
    ) {

        updateData.officialEmail =
            employeeData.officialEmail.trim();
    }


    if (
        employeeData.personalEmail !== undefined &&
        employeeData.personalEmail !== null &&
        employeeData.personalEmail.trim() !== ""
    ) {

        updateData.personalEmail =
            employeeData.personalEmail.trim();
    }


    if (
        employeeData.contactNumber !== undefined &&
        employeeData.contactNumber !== null &&
        employeeData.contactNumber.trim() !== ""
    ) {

        updateData.phone =
            employeeData.contactNumber.trim();
    }


    if (
        employeeData.whatsappNumber !== undefined &&
        employeeData.whatsappNumber !== null &&
        employeeData.whatsappNumber.trim() !== ""
    ) {

        updateData.whatsapp =
            employeeData.whatsappNumber.trim();
    }


    if (
        employeeData.role !== undefined &&
        employeeData.role !== null &&
        employeeData.role.trim() !== ""
    ) {

        updateData.role =
            employeeData.role.trim();
    }


    if (
        employeeData.countryCode !== undefined &&
        employeeData.countryCode !== null &&
        employeeData.countryCode !== ""
    ) {

        updateData.countryCode =
            employeeData.countryCode;
    }


    /*
     * IMPORTANT:
     *
     * Frontend modal uses isActive,
     * backend update API expects active.
     */
    if (
        employeeData.isActive !== undefined &&
        employeeData.isActive !== null
    ) {

        updateData.active =
            employeeData.isActive;
    }


    if (
        employeeData.password !== undefined &&
        employeeData.password !== null &&
        employeeData.password.trim() !== ""
    ) {

        updateData.password =
            employeeData.password.trim();
    }


    console.log(
        "UPDATE EMPLOYEE PAYLOAD:",
        updateData
    );


    await dispatch(
        updateEmployee({

            id:
                editingEmployee.id,

            employeeData:
                updateData,

        })
    ).unwrap();


    closeModal();


    alert(
        "Employee updated successfully."
    );


    return;
}

                /*
                 * ===================================================
                 * CREATE
                 * ===================================================
                 */

                const apiEmployeeData = {

                    employeeCode:
                        employeeData.employeeId,

                    fullName:
                        employeeData.fullName,

                    designation:
                        employeeData.designation,

                    officialEmail:
                        employeeData.officialEmail,

                    personalEmail:
                        employeeData.personalEmail,

                    phone:
                        employeeData.contactNumber,

                    whatsapp:
                        employeeData.whatsappNumber,

                    role:
                        employeeData.role,

                    password:
                        employeeData.password,

                    countryCode:
                        employeeData.countryCode,
                    isActive:
                        employeeData.isActive,
                };


                console.log(
                    "Create Employee:",
                    apiEmployeeData
                );


                await dispatch(
                    createEmployee({

                        employeeData:
                            apiEmployeeData,

                        photoFile:
                            employeeData.photo,

                    })
                ).unwrap();


                closeModal();


                alert(
                    "Employee created successfully."
                );


                /*
                 * Fetch again so table contains
                 * the exact backend data.
                 */

                dispatch(
                    getAllEmployees()
                );

            } catch (error) {

                console.error(
                    "Employee save failed:",
                    error
                );
            }
        };


    /*
     * ---------------------------------------------------------------
     * DELETE
     *
     * NO DELETE API PROVIDED YET
     * ---------------------------------------------------------------
     */

    const deleteEmployee =
        (employee) => {

            alert(
                `Delete API is not available yet for ${employee.fullName}.`
            );
        };


    /*
     * ---------------------------------------------------------------
     * EXPORT CSV
     * ---------------------------------------------------------------
     */

    const exportCsv = () => {

        if (
            employees.length === 0
        ) {

            alert(
                "There are no employees to export."
            );

            return;
        }


        const headers = [

            "Full Name",

            "Employee ID",

            "Designation",

            "Contact Number",

            "WhatsApp Number",

            "Official Email",

            "Personal Email",

            "Role",

            "Country",

            "Status",

        ];


        const rows =
            employees.map(
                (employee) => [

                    employee.fullName,

                    employee.employeeCode,

                    employee.designation,

                    employee.phone,

                    employee.whatsapp,

                    employee.officialEmail,

                    employee.personalEmail,

                    employee.role,

                    employee.country?.name,

                    employee.active
                        ? "Active"
                        : "Inactive",

                ]
            );


        const csvContent = [

            headers,

            ...rows,

        ]

            .map(
                (row) =>
                    row
                        .map(
                            (value) =>
                                `"${String(
                                    value || ""
                                ).replace(
                                    /"/g,
                                    '""'
                                )}"`
                        )
                        .join(",")
            )

            .join("\n");


        const blob =
            new Blob(
                [csvContent],
                {
                    type:
                        "text/csv;charset=utf-8;",
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;

        link.download =
            "troy-employees.csv";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );
    };


    /*
     * ---------------------------------------------------------------
     * INITIALS
     * ---------------------------------------------------------------
     */

    const initials =
        (name) => {

            if (!name) {

                return "T";
            }


            return name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map(
                    (part) =>
                        part[0]
                )
                .join("")
                .toUpperCase();
        };


    /*
     * ---------------------------------------------------------------
     * RENDER
     * ---------------------------------------------------------------
     */

    return (

        <div className="employees-page">

            <div className="employees-content">

                {/* HEADER */}

                <div className="employees-header">

                    <div>

                        <h1>
                            Troy Employees
                        </h1>

                        <p>

                            {employees.length}{" "}

                            {employees.length === 1
                                ? "team member"
                                : "team members"}

                        </p>

                    </div>


                    <div className="employees-header-actions">

                        <button
                            type="button"
                            className="employee-export-btn"
                            onClick={
                                exportCsv
                            }
                        >

                            <i className="bi bi-download"></i>

                            Export CSV

                        </button>


                        <button
                            type="button"
                            className="employee-add-btn"
                            onClick={
                                openAddModal
                            }
                        >

                            <i className="bi bi-plus-lg"></i>

                            Add employee

                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="employee-api-error">

                        {error}

                    </div>

                )}


                {/* STATS */}

                <div className="employee-stats">

                    <div className="employee-stat-card">

                        <div className="employee-stat-value">

                            {employees.length}

                        </div>

                        <div className="employee-stat-label">

                            Total

                        </div>

                    </div>


                    <div className="employee-stat-card">

                        <div className="employee-stat-value">

                            {designations.length}

                        </div>

                        <div className="employee-stat-label">

                            Designations

                        </div>

                    </div>

                </div>


                {/* SEARCH */}

                <div className="employee-search-wrapper">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        value={
                            search
                        }
                        onChange={
                            (event) =>
                                setSearch(
                                    event.target.value
                                )
                        }
                        placeholder="Search name, ID, designation, email..."
                    />

                </div>


                {/* LOADING */}

                {isLoading ? (

                    <div className="employees-empty-state">

                        <div className="empty-employee-icon">

                            <i className="bi bi-arrow-repeat"></i>

                        </div>

                        <p>
                            Loading employees...
                        </p>

                    </div>

                ) : filteredEmployees.length > 0 ? (

                    <div className="employees-table-wrapper">

                        <table className="employees-table">

                            <thead>

                                <tr>

                                    <th>
                                        EMPLOYEE
                                    </th>

                                    <th>
                                        EMP ID
                                    </th>

                                    <th>
                                        DESIGNATION
                                    </th>

                                    <th>
                                        CONTACT
                                    </th>

                                    <th>
                                        OFFICIAL EMAIL
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredEmployees.map(
                                    (employee) => (

                                        <tr
                                            key={
                                                employee.id
                                            }
                                        >

                                            {/* EMPLOYEE */}

                                            <td>

                                                <div className="employee-person">

                                                    {employee.photoUrl ? (

                                                        <img
                                                            src={
                                                                employee.photoUrl
                                                            }
                                                            alt={
                                                                employee.fullName
                                                            }
                                                            className="employee-avatar employee-avatar-image"
                                                        />

                                                    ) : (

                                                        <div className="employee-avatar">

                                                            {initials(
                                                                employee.fullName
                                                            )}

                                                        </div>

                                                    )}


                                                    <div className="employee-person-info">

                                                        <strong>

                                                            {
                                                                employee.fullName
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                employee.personalEmail ||
                                                                "—"
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMPLOYEE ID */}

                                            <td>

                                                <span className="employee-id">

                                                    {
                                                        employee.employeeCode
                                                    }

                                                </span>

                                            </td>


                                            {/* DESIGNATION */}

                                            <td>

                                                <span className="designation-text">

                                                    {
                                                        employee.designation
                                                    }

                                                </span>

                                            </td>


                                            {/* CONTACT */}

                                            <td>

                                                <div className="employee-contact">

                                                    <span>

                                                        {
                                                            employee.phone ||
                                                            "—"
                                                        }

                                                    </span>


                                                    <div className="employee-comms">

                                                        {employee.phone && (

                                                            <a
                                                                href={`tel:${employee.phone}`}
                                                                title="Call"
                                                            >

                                                                <i className="bi bi-telephone"></i>

                                                            </a>

                                                        )}


                                                        {employee.whatsapp && (

                                                            <a
                                                                href={`https://wa.me/${employee.whatsapp.replace(
                                                                    /[^0-9]/g,
                                                                    ""
                                                                )}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="WhatsApp"
                                                            >

                                                                <i className="bi bi-whatsapp"></i>

                                                            </a>

                                                        )}


                                                        {employee.officialEmail && (

                                                            <a
                                                                href={`mailto:${employee.officialEmail}`}
                                                                title="Email"
                                                            >

                                                                <i className="bi bi-envelope"></i>

                                                            </a>

                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td>

                                                <a
                                                    href={`mailto:${employee.officialEmail}`}
                                                    className="employee-email"
                                                >

                                                    {
                                                        employee.officialEmail
                                                    }

                                                </a>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="employee-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                employee
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="employee-delete-action"
                                                        onClick={() =>
                                                            deleteEmployee(
                                                                employee
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="employees-empty-state">

                        <div className="empty-employee-icon">

                            <i className="bi bi-person-fill"></i>

                        </div>


                        <p>

                            {search
                                ? "No employees found matching your search."
                                : 'No employees yet. Click "+ Add employee" to add your team.'}

                        </p>

                    </div>

                )}

            </div>


            {/* MODAL */}

            {showModal && (

                <EmployeeModal

                    employee={
                        editingEmployee
                    }

                    countries={
                        countries
                    }

                    countriesLoading={
                        countriesLoading
                    }

                    onClose={
                        closeModal
                    }

                    onSave={
                        handleSaveEmployee
                    }

                    generateEmployeeId={
                        generateEmployeeId
                    }

                    isSubmitting={
                        isSaving
                    }

                />

            )}

        </div>
    );
}


export default Employees;