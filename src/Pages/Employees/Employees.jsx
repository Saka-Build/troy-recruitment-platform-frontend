// import {
//     useMemo,
//     useRef,
//     useState,
// } from "react";

// import {
//     useDispatch,
//     useSelector,
// } from "react-redux";

// import "./Employees.css";

// import EmployeeModal from "./EmployeeModal";

// import {
//     createEmployee,
//     clearEmployeeError,
// } from "../../Redux/Slice/employeeSlice";


// const INITIAL_EMPLOYEES = [];


// function generateEmployeeId() {

//     return `EMP${Math.floor(
//         100 + Math.random() * 900
//     )}`;
// }


// function Employees() {

//     const dispatch = useDispatch();


//     /*
//      * Redux employee state
//      */
//     const {
//         isLoading,
//         error,
//     } = useSelector(
//         (state) => state.employees
//     );


//     /*
//      * Local employee list
//      *
//      * We keep this for the current UI.
//      */
//     const [
//         employees,
//         setEmployees,
//     ] = useState(INITIAL_EMPLOYEES);


//     const [search, setSearch] =
//         useState("");


//     const [showModal, setShowModal] =
//         useState(false);


//     const [
//         editingEmployee,
//         setEditingEmployee,
//     ] = useState(null);


//     const fileInputRef =
//         useRef(null);


//     /*
//      * SEARCH
//      */
//     const filteredEmployees =
//         useMemo(() => {

//             const query =
//                 search
//                     .trim()
//                     .toLowerCase();


//             if (!query) {
//                 return employees;
//             }


//             return employees.filter(
//                 (employee) => [

//                     employee.fullName,

//                     employee.employeeId,

//                     employee.employeeCode,

//                     employee.designation,

//                     employee.contactNumber,

//                     employee.phone,

//                     employee.whatsappNumber,

//                     employee.whatsapp,

//                     employee.officialEmail,

//                     employee.personalEmail,

//                 ].some((value) =>
//                     String(value || "")
//                         .toLowerCase()
//                         .includes(query)
//                 )
//             );

//         }, [
//             employees,
//             search,
//         ]);


//     /*
//      * DESIGNATIONS
//      */
//     const designations =
//         useMemo(() => {

//             return [
//                 ...new Set(
//                     employees.map(
//                         (employee) =>
//                             employee.designation
//                     )
//                 ),
//             ]
//                 .filter(Boolean)
//                 .sort();

//         }, [employees]);


//     /*
//      * OPEN ADD
//      */
//     const openAddModal = () => {

//         dispatch(
//             clearEmployeeError()
//         );

//         setEditingEmployee(null);

//         setShowModal(true);
//     };


//     /*
//      * OPEN EDIT
//      */
//     const openEditModal =
//         (employee) => {

//             dispatch(
//                 clearEmployeeError()
//             );

//             setEditingEmployee(
//                 employee
//             );

//             setShowModal(true);
//         };


//     /*
//      * CLOSE
//      */
//     const closeModal = () => {

//         if (isLoading) {
//             return;
//         }

//         setShowModal(false);

//         setEditingEmployee(null);
//     };


//     /*
//      * SAVE EMPLOYEE
//      */
//     const handleSaveEmployee =
//         async (employeeData) => {

//             /*
//              * EDIT MODE
//              *
//              * Currently keep your
//              * existing local edit behavior.
//              */
//             if (editingEmployee) {

//                 setEmployees(
//                     (current) =>
//                         current.map(
//                             (employee) =>
//                                 employee.id ===
//                                     editingEmployee.id
//                                     ? {
//                                         ...employee,
//                                         ...employeeData,
//                                     }
//                                     : employee
//                         )
//                 );

//                 closeModal();

//                 return;
//             }


//             /*
//              * CREATE MODE
//              */


//             /*
//              * Convert frontend names
//              * to backend names.
//              */
//             const apiEmployeeData = {

//                 employeeCode:
//                     employeeData.employeeId,

//                 fullName:
//                     employeeData.fullName,

//                 designation:
//                     employeeData.designation,

//                 officialEmail:
//                     employeeData.officialEmail,

//                 personalEmail:
//                     employeeData.personalEmail,

//                 phone:
//                     employeeData.contactNumber,

//                 whatsapp:
//                     employeeData.whatsappNumber,

//                 role:
//                     employeeData.role,

//                 password:
//                     employeeData.password,

//                 isActive:
//                     employeeData.isActive,

//                 countryCode:
//                     employeeData.countryCode,
//             };


//             console.log(
//                 "Employee API Data:",
//                 apiEmployeeData
//             );


//             try {

//                 /*
//                  * CALL CREATE EMPLOYEE API
//                  */
//                 const response =
//                     await dispatch(
//                         createEmployee({

//                             employeeData:
//                                 apiEmployeeData,

//                             photoFile:
//                                 employeeData.photo,
//                         })
//                     ).unwrap();


//                 console.log(
//                     "Employee created successfully:",
//                     response
//                 );


//                 /*
//                  * Add API response
//                  * to local table.
//                  *
//                  * Merge submitted values because
//                  * API response doesn't return
//                  * personalEmail etc.
//                  */
//                 const newEmployee = {

//                     ...employeeData,

//                     ...response,

//                     /*
//                      * Keep frontend field names
//                      */
//                     employeeId:
//                         response.employeeCode ||
//                         employeeData.employeeId,

//                     contactNumber:
//                         response.phone ||
//                         employeeData.contactNumber,

//                     whatsappNumber:
//                         response.whatsapp ||
//                         employeeData.whatsappNumber,

//                     photo:
//                         employeeData.photoPreview,

//                     id:
//                         response.id ||
//                         Date.now(),
//                 };


//                 setEmployees(
//                     (current) => [
//                         ...current,
//                         newEmployee,
//                     ]
//                 );


//                 /*
//                  * Close modal
//                  */
//                 closeModal();


//                 /*
//                  * Optional success message
//                  */
//                 alert(
//                     "Employee created successfully."
//                 );


//             } catch (error) {

//                 /*
//                  * Redux error is already
//                  * stored in state.
//                  */
//                 console.error(
//                     "Create employee failed:",
//                     error
//                 );
//             }
//         };


//     /*
//      * DELETE
//      *
//      * This is still local because
//      * you haven't provided DELETE API yet.
//      */
//     const deleteEmployee =
//         (id) => {

//             const employee =
//                 employees.find(
//                     (currentEmployee) =>
//                         currentEmployee.id === id
//                 );


//             if (!employee) {
//                 return;
//             }


//             const confirmed =
//                 window.confirm(
//                     `Delete ${employee.fullName} from the employee directory?`
//                 );


//             if (!confirmed) {
//                 return;
//             }


//             setEmployees(
//                 (current) =>
//                     current.filter(
//                         (employee) =>
//                             employee.id !== id
//                     )
//             );
//         };


//     /*
//      * EXPORT CSV
//      */
//     const exportCsv = () => {

//         if (employees.length === 0) {

//             alert(
//                 "There are no employees to export."
//             );

//             return;
//         }


//         const headers = [

//             "Full Name",

//             "Employee ID",

//             "Designation",

//             "Contact Number",

//             "WhatsApp Number",

//             "Official Email",

//             "Personal Email",

//         ];


//         const rows =
//             employees.map(
//                 (employee) => [

//                     employee.fullName,

//                     employee.employeeId,

//                     employee.designation,

//                     employee.contactNumber,

//                     employee.whatsappNumber,

//                     employee.officialEmail,

//                     employee.personalEmail,

//                 ]
//             );


//         const csvContent = [

//             headers,

//             ...rows,

//         ]

//             .map((row) =>
//                 row
//                     .map(
//                         (value) =>
//                             `"${String(
//                                 value || ""
//                             ).replace(
//                                 /"/g,
//                                 '""'
//                             )}"`
//                     )
//                     .join(",")
//             )

//             .join("\n");


//         const blob =
//             new Blob(
//                 [csvContent],
//                 {
//                     type:
//                         "text/csv;charset=utf-8;",
//                 }
//             );


//         const url =
//             URL.createObjectURL(
//                 blob
//             );


//         const link =
//             document.createElement(
//                 "a"
//             );


//         link.href = url;

//         link.download =
//             "troy-employees.csv";


//         document.body.appendChild(
//             link
//         );

//         link.click();

//         link.remove();


//         URL.revokeObjectURL(
//             url
//         );
//     };


//     /*
//      * INITIALS
//      */
//     const initials = (name) => {

//         if (!name) {
//             return "T";
//         }


//         return name
//             .split(" ")
//             .filter(Boolean)
//             .slice(0, 2)
//             .map(
//                 (part) =>
//                     part[0]
//             )
//             .join("")
//             .toUpperCase();
//     };


//     return (

//         <div className="employees-page">

//             <div className="employees-content">


//                 {/* HEADER */}

//                 <div className="employees-header">

//                     <div>

//                         <h1>
//                             Troy Employees
//                         </h1>

//                         <p>

//                             {employees.length}{" "}

//                             {employees.length === 1
//                                 ? "team member"
//                                 : "team members"}

//                         </p>

//                     </div>


//                     <div className="employees-header-actions">

//                         <button
//                             type="button"
//                             className="employee-export-btn"
//                             onClick={
//                                 exportCsv
//                             }
//                         >

//                             <i className="bi bi-download"></i>

//                             Export CSV

//                         </button>


//                         <button
//                             type="button"
//                             className="employee-add-btn"
//                             onClick={
//                                 openAddModal
//                             }
//                         >

//                             <i className="bi bi-plus-lg"></i>

//                             Add employee

//                         </button>

//                     </div>

//                 </div>


//                 {/* ERROR FROM API */}

//                 {error && (

//                     <div className="employee-api-error">

//                         {error}

//                     </div>
//                 )}


//                 {/* STATS */}

//                 <div className="employee-stats">

//                     <div className="employee-stat-card">

//                         <div className="employee-stat-value">

//                             {employees.length}

//                         </div>

//                         <div className="employee-stat-label">

//                             Total

//                         </div>

//                     </div>


//                     <div className="employee-stat-card">

//                         <div className="employee-stat-value">

//                             {designations.length}

//                         </div>

//                         <div className="employee-stat-label">

//                             Designations

//                         </div>

//                     </div>

//                 </div>


//                 {/* SEARCH */}

//                 <div className="employee-search-wrapper">

//                     <i className="bi bi-search"></i>

//                     <input
//                         type="text"
//                         value={search}
//                         onChange={(event) =>
//                             setSearch(
//                                 event.target.value
//                             )
//                         }
//                         placeholder="Search name, ID, designation, email..."
//                     />

//                 </div>


//                 {/* TABLE */}

//                 {filteredEmployees.length > 0 ? (

//                     <div className="employees-table-wrapper">

//                         <table className="employees-table">

//                             <thead>

//                                 <tr>

//                                     <th>
//                                         EMPLOYEE
//                                     </th>

//                                     <th>
//                                         EMP ID
//                                     </th>

//                                     <th>
//                                         DESIGNATION
//                                     </th>

//                                     <th>
//                                         CONTACT
//                                     </th>

//                                     <th>
//                                         OFFICIAL EMAIL
//                                     </th>

//                                     <th>
//                                         ACTIONS
//                                     </th>

//                                 </tr>

//                             </thead>


//                             <tbody>

//                                 {filteredEmployees.map(
//                                     (employee) => (

//                                         <tr
//                                             key={
//                                                 employee.id
//                                             }
//                                         >

//                                             {/* EMPLOYEE */}

//                                             <td>

//                                                 <div className="employee-person">

//                                                     {employee.photo ? (

//                                                         <img
//                                                             src={
//                                                                 employee.photo
//                                                             }
//                                                             alt={
//                                                                 employee.fullName
//                                                             }
//                                                             className="employee-avatar employee-avatar-image"
//                                                         />

//                                                     ) : (

//                                                         <div className="employee-avatar">

//                                                             {initials(
//                                                                 employee.fullName
//                                                             )}

//                                                         </div>
//                                                     )}


//                                                     <div className="employee-person-info">

//                                                         <strong>

//                                                             {
//                                                                 employee.fullName
//                                                             }

//                                                         </strong>


//                                                         <span>

//                                                             {
//                                                                 employee.personalEmail ||
//                                                                 "—"
//                                                             }

//                                                         </span>

//                                                     </div>

//                                                 </div>

//                                             </td>


//                                             {/* EMPLOYEE ID */}

//                                             <td>

//                                                 <span className="employee-id">

//                                                     {
//                                                         employee.employeeId ||
//                                                         employee.employeeCode
//                                                     }

//                                                 </span>

//                                             </td>


//                                             {/* DESIGNATION */}

//                                             <td>

//                                                 <span className="designation-text">

//                                                     {
//                                                         employee.designation
//                                                     }

//                                                 </span>

//                                             </td>


//                                             {/* CONTACT */}

//                                             <td>

//                                                 <div className="employee-contact">

//                                                     <span>

//                                                         {
//                                                             employee.contactNumber ||
//                                                             employee.phone
//                                                         }

//                                                     </span>


//                                                     <div className="employee-comms">

//                                                         <a
//                                                             href={`tel:${
//                                                                 employee.contactNumber ||
//                                                                 employee.phone
//                                                             }`}
//                                                             title="Call"
//                                                         >

//                                                             <i className="bi bi-telephone"></i>

//                                                         </a>


//                                                         <a
//                                                             href={`https://wa.me/${(
//                                                                 employee.whatsappNumber ||
//                                                                 employee.whatsapp ||
//                                                                 ""
//                                                             ).replace(
//                                                                 /[^0-9]/g,
//                                                                 ""
//                                                             )}`}
//                                                             target="_blank"
//                                                             rel="noreferrer"
//                                                             title="WhatsApp"
//                                                         >

//                                                             <i className="bi bi-whatsapp"></i>

//                                                         </a>


//                                                         <a
//                                                             href={`mailto:${employee.officialEmail}`}
//                                                             title="Email"
//                                                         >

//                                                             <i className="bi bi-envelope"></i>

//                                                         </a>

//                                                     </div>

//                                                 </div>

//                                             </td>


//                                             {/* EMAIL */}

//                                             <td>

//                                                 <a
//                                                     href={`mailto:${employee.officialEmail}`}
//                                                     className="employee-email"
//                                                 >

//                                                     {
//                                                         employee.officialEmail
//                                                     }

//                                                 </a>

//                                             </td>


//                                             {/* ACTIONS */}

//                                             <td>

//                                                 <div className="employee-actions">

//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             openEditModal(
//                                                                 employee
//                                                             )
//                                                         }
//                                                     >
//                                                         Edit
//                                                     </button>


//                                                     <button
//                                                         type="button"
//                                                         className="employee-delete-action"
//                                                         onClick={() =>
//                                                             deleteEmployee(
//                                                                 employee.id
//                                                             )
//                                                         }
//                                                     >
//                                                         Delete
//                                                     </button>

//                                                 </div>

//                                             </td>

//                                         </tr>

//                                     )
//                                 )}

//                             </tbody>

//                         </table>

//                     </div>

//                 ) : (

//                     <div className="employees-empty-state">

//                         <div className="empty-employee-icon">

//                             <i className="bi bi-person-fill"></i>

//                         </div>


//                         <p>

//                             {search
//                                 ? "No employees found matching your search."
//                                 : 'No employees yet. Click "+ Add employee" to add your team.'}

//                         </p>

//                     </div>
//                 )}

//             </div>


//             {/* MODAL */}

//             {showModal && (

//                 <EmployeeModal
//                     employee={
//                         editingEmployee
//                     }

//                     onClose={
//                         closeModal
//                     }

//                     onSave={
//                         handleSaveEmployee
//                     }

//                     generateEmployeeId={
//                         generateEmployeeId
//                     }

//                     isSubmitting={
//                         isLoading
//                     }
//                 />
//             )}

//         </div>
//     );
// }


// export default Employees;


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
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployee as deleteEmployeeApi,
    clearEmployeeError,
} from "../../Redux/Slice/employeeSlice";


function generateEmployeeId() {

    return `EMP${Math.floor(
        100 + Math.random() * 900
    )}`;
}


function Employees() {

    const dispatch = useDispatch();


    /*
     * =========================================================
     * REDUX STATE
     * =========================================================
     */
    const {
        employees,
        isLoading,
        isFetching,
        isDeleting,
        error,
    } = useSelector(
        (state) => state.employees
    );


    /*
     * =========================================================
     * LOCAL UI STATE
     * =========================================================
     */
    const [search, setSearch] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [
        editingEmployee,
        setEditingEmployee,
    ] = useState(null);


    /*
     * =========================================================
     * GET ALL EMPLOYEES
     *
     * Runs when page opens.
     * =========================================================
     */
    useEffect(() => {

        dispatch(
            getAllEmployees()
        );

    }, [dispatch]);


    /*
     * =========================================================
     * SEARCH
     * =========================================================
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

                    employee.employeeId,

                    employee.employeeCode,

                    employee.designation,

                    employee.contactNumber,

                    employee.phone,

                    employee.whatsappNumber,

                    employee.whatsapp,

                    employee.officialEmail,

                    employee.personalEmail,

                ].some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(query)
                )
            );

        }, [
            employees,
            search,
        ]);


    /*
     * =========================================================
     * DESIGNATIONS
     * =========================================================
     */
    const designations =
        useMemo(() => {

            return [
                ...new Set(
                    employees.map(
                        (employee) =>
                            employee.designation
                    )
                ),
            ]
                .filter(Boolean)
                .sort();

        }, [employees]);


    /*
     * =========================================================
     * OPEN ADD MODAL
     * =========================================================
     */
    const openAddModal = () => {

        dispatch(
            clearEmployeeError()
        );

        setEditingEmployee(null);

        setShowModal(true);
    };


    /*
     * =========================================================
     * OPEN EDIT MODAL
     *
     * First call GET BY ID.
     * =========================================================
     */
    const openEditModal = async (employee) => {

        dispatch(
            clearEmployeeError()
        );

        try {

            const response =
                await dispatch(
                    getEmployeeById(
                        employee.id
                    )
                ).unwrap();


            console.log(
                "Employee By ID:",
                response
            );


            /*
             * Backend response uses:
             *
             * employeeCode
             * phone
             * whatsapp
             *
             * Frontend modal uses:
             *
             * employeeId
             * contactNumber
             * whatsappNumber
             */
            const employeeForModal = {

                ...employee,

                ...response,

                id:
                    response.id ||
                    employee.id,

                employeeId:
                    response.employeeCode ||
                    employee.employeeId,

                contactNumber:
                    response.phone ||
                    employee.contactNumber,

                whatsappNumber:
                    response.whatsapp ||
                    employee.whatsappNumber,

                officialEmail:
                    response.officialEmail ||
                    employee.officialEmail,

                personalEmail:
                    response.personalEmail ||
                    employee.personalEmail,

                photo:
                    response.photoUrl ||
                    employee.photo ||
                    "",
            };


            setEditingEmployee(
                employeeForModal
            );

            setShowModal(true);

        } catch (error) {

            console.error(
                "Unable to get employee:",
                error
            );

            alert(
                error ||
                "Unable to load employee."
            );
        }
    };


    /*
     * =========================================================
     * CLOSE MODAL
     * =========================================================
     */
    const closeModal = () => {

        if (isLoading) {
            return;
        }

        setShowModal(false);

        setEditingEmployee(null);
    };


    /*
     * =========================================================
     * SAVE EMPLOYEE
     * =========================================================
     */
    const handleSaveEmployee =
        async (employeeData) => {


            /*
             * =====================================================
             * EDIT
             *
             * No UPDATE API was provided yet.
             * =====================================================
             */
            if (editingEmployee) {

                alert(
                    "Employee update API is not available yet."
                );

                return;
            }


            /*
             * =====================================================
             * CREATE
             * =====================================================
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

                isActive:
                    employeeData.isActive,

                countryCode:
                    employeeData.countryCode,
            };


            console.log(
                "Employee API Data:",
                apiEmployeeData
            );


            try {

                /*
                 * Create API
                 */
                const response =
                    await dispatch(
                        createEmployee({

                            employeeData:
                                apiEmployeeData,

                            photoFile:
                                employeeData.photo ||
                                null,

                        })
                    ).unwrap();


                console.log(
                    "Employee created successfully:",
                    response
                );


                /*
                 * Close modal
                 */
                closeModal();


                /*
                 * Reload from backend.
                 *
                 * This is better than manually adding
                 * the response because GET ALL gives
                 * us the actual backend list.
                 */
                dispatch(
                    getAllEmployees()
                );


                alert(
                    "Employee created successfully."
                );

            } catch (error) {

                console.error(
                    "Create employee failed:",
                    error
                );
            }
        };


    /*
     * =========================================================
     * DELETE EMPLOYEE
     * =========================================================
     */
    const handleDeleteEmployee =
        async (employee) => {

            if (!employee?.id) {

                alert(
                    "Employee ID not found."
                );

                return;
            }


            const confirmed =
                window.confirm(
                    `Delete ${employee.fullName} from the employee directory?`
                );


            if (!confirmed) {
                return;
            }


            try {

                await dispatch(
                    deleteEmployeeApi(
                        employee.id
                    )
                ).unwrap();


                alert(
                    "Employee deleted successfully."
                );

            } catch (error) {

                console.error(
                    "Delete employee failed:",
                    error
                );

                alert(
                    error ||
                    "Unable to delete employee."
                );
            }
        };


    /*
     * =========================================================
     * EXPORT CSV
     * =========================================================
     */
    const exportCsv = () => {

        if (employees.length === 0) {

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

        ];


        const rows =
            employees.map(
                (employee) => [

                    employee.fullName,

                    employee.employeeCode ||
                    employee.employeeId,

                    employee.designation,

                    employee.phone ||
                    employee.contactNumber,

                    employee.whatsapp ||
                    employee.whatsappNumber,

                    employee.officialEmail,

                    employee.personalEmail,

                ]
            );


        const csvContent = [

            headers,

            ...rows,

        ]

            .map((row) =>
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


        link.href = url;

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
     * =========================================================
     * INITIALS
     * =========================================================
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
                (part) =>
                    part[0]
            )
            .join("")
            .toUpperCase();
    };


    return (

        <div className="page">

            {/* <div className="page-content"> */}


            {/* =================================================
                    HEADER
                ================================================= */}

            <div className="page-header">

                <div>

                    <h1 className="page-title">
                        Troy Employees
                    </h1>

                    <p className="page-subtitle">

                        {employees.length}{" "}

                        {employees.length === 1
                            ? "team member"
                            : "team members"}

                    </p>

                </div>


                <div className="page-header-actions">

                    <button
                        type="button"
                        className="outline-btn"
                        onClick={
                            exportCsv
                        }
                    >

                        <i className="bi bi-download"></i>

                        Export CSV

                    </button>


                    <button
                        type="button"
                        className="primary-btn"
                        onClick={
                            openAddModal
                        }
                    >

                        <i className="bi bi-plus-lg"></i>

                        Add employee

                    </button>

                </div>

            </div>


            {/* =================================================
                    API ERROR
                ================================================= */}

            {error && (

                <div className="employee-api-error">

                    {error}

                </div>

            )}


            {/* =================================================
                    STATS
                ================================================= */}

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


            {/* =================================================
                    SEARCH
                ================================================= */}

            <div className="employee-search-wrapper common-search">

                <i className="bi bi-search"></i>

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder="Search name, ID, designation, email..."
                />

            </div>


            {/* =================================================
                    LOADING
                ================================================= */}

            {isFetching && (

                <div className="employees-loading">

                    Loading employees...

                </div>

            )}


            {/* =================================================
                    TABLE
                ================================================= */}

            {!isFetching &&
                filteredEmployees.length > 0 && (

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
                                    (employee) => {

                                        const employeeId =
                                            employee.id;

                                        const employeeCode =
                                            employee.employeeCode ||
                                            employee.employeeId;

                                        const phone =
                                            employee.phone ||
                                            employee.contactNumber ||
                                            "";

                                        const whatsapp =
                                            employee.whatsapp ||
                                            employee.whatsappNumber ||
                                            "";


                                        return (

                                            <tr
                                                key={
                                                    employeeId
                                                }
                                            >

                                                {/* EMPLOYEE */}

                                                <td>

                                                    <div className="employee-person">

                                                        {employee.photoUrl ||
                                                            employee.photo ? (

                                                            <img
                                                                src={
                                                                    employee.photoUrl ||
                                                                    employee.photo
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
                                                            employeeCode
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
                                                                phone
                                                            }

                                                        </span>


                                                        <div className="employee-comms">

                                                            <a
                                                                href={
                                                                    `tel:${phone}`
                                                                }
                                                                title="Call"
                                                            >

                                                                <i className="bi bi-telephone"></i>

                                                            </a>


                                                            <a
                                                                href={
                                                                    `https://wa.me/${whatsapp.replace(
                                                                        /[^0-9]/g,
                                                                        ""
                                                                    )}`
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="WhatsApp"
                                                            >

                                                                <i className="bi bi-whatsapp"></i>

                                                            </a>


                                                            <a
                                                                href={
                                                                    `mailto:${employee.officialEmail}`
                                                                }
                                                                title="Email"
                                                            >

                                                                <i className="bi bi-envelope"></i>

                                                            </a>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* EMAIL */}

                                                <td>

                                                    <a
                                                        href={
                                                            `mailto:${employee.officialEmail}`
                                                        }
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
                                                            disabled={
                                                                isDeleting ||
                                                                isFetching
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="employee-delete-action"
                                                            onClick={() =>
                                                                handleDeleteEmployee(
                                                                    employee
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                        >
                                                            {isDeleting
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })}

                            </tbody>

                        </table>

                    </div>

                )}


            {/* =================================================
                    EMPTY STATE
                ================================================= */}

            {!isFetching &&
                filteredEmployees.length === 0 && (

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

            {/* </div> */}


            {/* =================================================
                MODAL
            ================================================= */}

            {showModal && (

                <EmployeeModal

                    employee={
                        editingEmployee
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
                        isLoading
                    }

                />

            )}

        </div>
    );
}


export default Employees;