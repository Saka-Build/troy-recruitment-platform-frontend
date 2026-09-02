// import { useEffect, useMemo, useState,} from "react";
// import { useDispatch, useSelector,} from "react-redux";
// import "./Employees.css";
// import EmployeeModal from "./EmployeeModal";
// import RoleAssignmentModal from "./RoleAssignmentModal";
// import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
// import Pagination from "../../Components/Pagination";
// import { getAllEmployees, getCountries, createEmployee, updateEmployee, clearEmployeeError, deleteEmployee,} from "../../Redux/Slice/employeeSlice";
// import { getAllRoles, getEmployeeRoles, assignRoleToEmployee, removeRoleFromEmployee,} from "../../Redux/Slice/roleSlice";
// import { useNavigate } from "react-router-dom";
// import Toast from "../../Components/Toast";
// import ExcelJS from "exceljs";

// function generateEmployeeId() {
//     return `EMP${Math.floor(100 + Math.random() * 900)}`;
// }

// function Employees() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { employees = [], countries = [], isLoading, isSaving, deleteLoading, countriesLoading, error,} = useSelector((state) =>state.employees);
//     const {roles = [],} = useSelector((state) =>state.role || {});

//     const [ search, setSearch,] = useState("");
//     const [ statusFilter, setStatusFilter] = useState("all");
//     const [ currentPage, setCurrentPage,] = useState(1);
//     const [ showModal, setShowModal,] = useState(false);
//     const [ editingEmployee, setEditingEmployee,] = useState(null);
//     const [ employeeRoleMap, setEmployeeRoleMap,] = useState({});
//     const [ showRoleAssignmentModal, setShowRoleAssignmentModal,] = useState(false);
//     const [ selectedEmployeeForRole, setSelectedEmployeeForRole,] = useState(null);
//     const [ roleAssignmentLoading, setRoleAssignmentLoading,] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
// const [employeeToDelete, setEmployeeToDelete] = useState(null);

// const [toast, setToast] = useState({
//     show: false,
//     type: "success",
//     message: "",
// });
// const showToast = (message, type = "success") => {
//     setToast({
//         show: true,
//         type,
//         message,
//     });
// };

//     const employeesPerPage = 10;

//     useEffect(() => {
//         dispatch(getAllEmployees());
//         dispatch(getCountries());
//         dispatch(getAllRoles());
//     }, [dispatch]);

//     useEffect(() => {setCurrentPage(1);}, [ search, statusFilter]);


//     const filteredEmployees =
//         useMemo(() => {
//             const query = search.trim().toLowerCase();

//             return employees.filter(
//                 (employee) => {

//                     const matchesStatus =   statusFilter === "all" ||
//                                             ( statusFilter === "active" && employee.active === true) ||
//                                             ( statusFilter === "inactive" && employee.active === false);

//                     if (!matchesStatus) {return false;}
//                     if (!query) {return true;}

//                     return [
//                         employee.employeeCode,
//                         employee.fullName,
//                         employee.designation,
//                         employee.phone,
//                         employee.whatsapp,
//                         employee.officialEmail,
//                         employee.personalEmail,
//                         employee.country?.name,
//                         employee.country?.code,
//                         employee.active? "active": "inactive",
//                     ].some((value) => String(value || "").toLowerCase().includes(query));
//                 }
//             );

//         }, [employees,search,statusFilter,]);


//     const totalPages = Math.ceil(filteredEmployees.length /employeesPerPage);


//     const paginatedEmployees =
//         useMemo(() => {
//             const startIndex = (currentPage - 1) * employeesPerPage;
//             const endIndex = startIndex + employeesPerPage;
//             return filteredEmployees.slice( startIndex, endIndex);
//         }, [ filteredEmployees, currentPage, employeesPerPage,]);


//     const designations =
//         useMemo(() => {

//             return [
//                 ...new Set(
//                     employees
//                         .map(
//                             (employee) =>
//                                 employee.designation
//                         )
//                 ),
//             ]
//                 .filter(Boolean)
//                 .sort();

//         }, [
//             employees,
//         ]);


//     const activeEmployees =
//         useMemo(() => {

//             return employees.filter(
//                 (employee) =>
//                     employee.active === true
//             ).length;

//         }, [
//             employees,
//         ]);


//     const inactiveEmployees =
//         useMemo(() => {

//             return employees.filter(
//                 (employee) =>
//                     employee.active === false
//             ).length;

//         }, [
//             employees,
//         ]);

//     const openAddModal = () => {

//         dispatch(
//             clearEmployeeError()
//         );

//         setEditingEmployee(
//             null
//         );

//         setShowModal(
//             true
//         );
//     };


//     const openEditModal =
//         (employee) => {

//             dispatch(
//                 clearEmployeeError()
//             );

//             setEditingEmployee(
//                 employee
//             );

//             setShowModal(
//                 true
//             );
//         };


//     const closeModal = () => {

//         if (isSaving) {
//             return;
//         }

//         setShowModal(
//             false
//         );

//         setEditingEmployee(
//             null
//         );
//     };


//     const handleSaveEmployee =
//         async (
//             employeeData
//         ) => {

//             try {

//                 if (editingEmployee) {

//                     const updateData = {};

//                     if (
//                         employeeData.employeeId !== undefined &&
//                         employeeData.employeeId !== null &&
//                         employeeData.employeeId.trim() !== ""
//                     ) {

//                         updateData.employeeCode =
//                             employeeData.employeeId.trim();
//                     }


//                     if (
//                         employeeData.fullName !== undefined &&
//                         employeeData.fullName !== null &&
//                         employeeData.fullName.trim() !== ""
//                     ) {

//                         updateData.fullName =
//                             employeeData.fullName.trim();
//                     }


//                     if (
//                         employeeData.designation !== undefined &&
//                         employeeData.designation !== null &&
//                         employeeData.designation.trim() !== ""
//                     ) {

//                         updateData.designation =
//                             employeeData.designation.trim();
//                     }


//                     if (
//                         employeeData.officialEmail !== undefined &&
//                         employeeData.officialEmail !== null &&
//                         employeeData.officialEmail.trim() !== ""
//                     ) {

//                         updateData.officialEmail =
//                             employeeData.officialEmail.trim();
//                     }


//                     if (
//                         employeeData.personalEmail !== undefined &&
//                         employeeData.personalEmail !== null &&
//                         employeeData.personalEmail.trim() !== ""
//                     ) {

//                         updateData.personalEmail =
//                             employeeData.personalEmail.trim();
//                     }


//                     if (
//                         employeeData.contactNumber !== undefined &&
//                         employeeData.contactNumber !== null &&
//                         employeeData.contactNumber.trim() !== ""
//                     ) {

//                         updateData.phone =
//                             employeeData.contactNumber.trim();
//                     }


//                     if (
//                         employeeData.whatsappNumber !== undefined &&
//                         employeeData.whatsappNumber !== null &&
//                         employeeData.whatsappNumber.trim() !== ""
//                     ) {

//                         updateData.whatsapp =
//                             employeeData.whatsappNumber.trim();
//                     }


//                     if (
//                         employeeData.role !== undefined &&
//                         employeeData.role !== null &&
//                         employeeData.role.trim() !== ""
//                     ) {

//                         updateData.role =
//                             employeeData.role.trim();
//                     }


//                     if (
//                         employeeData.countryCode !== undefined &&
//                         employeeData.countryCode !== null &&
//                         employeeData.countryCode !== ""
//                     ) {

//                         updateData.countryCode =
//                             employeeData.countryCode;
//                     }


//                     if (
//                         employeeData.isActive !== undefined &&
//                         employeeData.isActive !== null
//                     ) {

//                         updateData.active =
//                             employeeData.isActive;
//                     }


//                     if (
//                         employeeData.password !== undefined &&
//                         employeeData.password !== null &&
//                         employeeData.password.trim() !== ""
//                     ) {

//                         updateData.password =
//                             employeeData.password.trim();
//                     }


//                     console.log(
//                         "UPDATE EMPLOYEE PAYLOAD:",
//                         updateData
//                     );

// await dispatch(
//     updateEmployee({
//         id: editingEmployee.id,
//         employeeData: updateData,
//     })
// ).unwrap();

// closeModal();

// showToast(
//     `${employeeData.fullName.trim()} updated successfully.`
// );

// return;
//                 }


//                 const apiEmployeeData = {

//                     employeeCode:
//                         employeeData.employeeId,

//                     fullName:
//                         employeeData.fullName,

//                     designation:
//                         employeeData.designation,

//                     officialEmail:
//                         employeeData.officialEmail,

//                     personalEmail:
//                         employeeData.personalEmail,

//                     phone:
//                         employeeData.contactNumber,

//                     whatsapp:
//                         employeeData.whatsappNumber,

//                     role:
//                         employeeData.role,

//                     password:
//                         employeeData.password,

//                     countryCode:
//                         employeeData.countryCode,

//                     isActive:
//                         employeeData.isActive,
//                 };


//                 console.log(
//                     "Create Employee:",
//                     apiEmployeeData
//                 );


// await dispatch(
//     createEmployee({
//         employeeData: apiEmployeeData,
//         photoFile: employeeData.photo,
//     })
// ).unwrap();

// closeModal();

// showToast(
//     `${employeeData.fullName} added successfully.`
// );

// dispatch(
//     getAllEmployees()
// );
// } catch (error) {

//     console.error(
//         "Employee save failed:",
//         error
//     );

//     showToast(
//         typeof error === "string"
//             ? error
//             : "Failed to save employee.",
//         "error"
//     );
// }
//         };


// const openDeleteModal = (employee) => {

//     setEmployeeToDelete(employee);

//     setShowDeleteModal(true);
// };


// const closeDeleteModal = () => {

//     if (deleteLoading) {
//         return;
//     }

//     setShowDeleteModal(false);

//     setEmployeeToDelete(null);
// };


// const handleDeleteEmployee = async () => {

//     if (!employeeToDelete?.id) {
//         return;
//     }

//     try {
// await dispatch(
//     deleteEmployee(
//         employeeToDelete.id
//     )
// ).unwrap();

// const deletedEmployeeName =
//     employeeToDelete.fullName;

// closeDeleteModal();

// showToast(
//     `${deletedEmployeeName} deleted successfully.`
// );

// dispatch(
//     getAllEmployees()
// );

// } catch (error) {

//     console.error(
//         "Employee delete failed:",
//         error
//     );

//     showToast(
//         typeof error === "string"
//             ? error
//             : "Failed to delete employee.",
//         "error"
//     );
// }
// };

//     const openRoleAssignmentModal =
//         (employee) => {
//             setSelectedEmployeeForRole(
//                 employee
//             );
//             setShowRoleAssignmentModal(
//                 true
//             );
//         };


//     const closeRoleAssignmentModal =
//         () => {

//             if (roleAssignmentLoading) {
//                 return;
//             }

//             setShowRoleAssignmentModal(
//                 false
//             );

//             setSelectedEmployeeForRole(
//                 null
//             );
//         };

//     const handleAssignRoles =
//         async (
//             selectedRoleIds
//         ) => {

//             if (
//                 !selectedEmployeeForRole?.id ||
//                 !selectedRoleIds?.length
//             ) {
//                 return;
//             }

//             setRoleAssignmentLoading(
//                 true
//             );

//             try {

//                 await Promise.all(
//                     selectedRoleIds.map(
//                         (roleId) =>
//                             dispatch(
//                                 assignRoleToEmployee({
//                                     employeeId:
//                                         selectedEmployeeForRole.id,

//                                     roleId:
//                                         roleId,
//                                 })
//                             ).unwrap()
//                     )
//                 );
//                 const result =
//                     await dispatch(
//                         getEmployeeRoles(
//                             selectedEmployeeForRole.id
//                         )
//                     ).unwrap();


//                 const updatedRoles =
//                     Array.isArray(result)
//                         ? result
//                         : Array.isArray(
//                             result?.roles
//                         )
//                             ? result.roles
//                             : Array.isArray(
//                                 result?.data
//                             )
//                                 ? result.data
//                                 : [];


// setEmployeeRoleMap(
//     (previous) => ({
//         ...previous,

//         [
//             selectedEmployeeForRole.id
//         ]:
//             updatedRoles,
//     })
// );

// const employeeName =
//     selectedEmployeeForRole.fullName;

// closeRoleAssignmentModal();

// showToast(
//     `Role assigned to ${employeeName} successfully.`
// );
// } catch (error) {

//     console.error(
//         "Role assignment failed:",
//         error
//     );

//     showToast(
//         typeof error === "string"
//             ? error
//             : "Failed to assign role.",
//         "error"
//     );

// } finally {

//                 setRoleAssignmentLoading(
//                     false
//                 );
//             }
//         };

// const handleExport = async () => {
//     if (filteredEmployees.length === 0) {
//         alert("There are no employees to export.");
//         return;
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Employees");

//     worksheet.columns = [
//         {
//             header: "Employee ID",
//             key: "employeeId",
//             width: 18,
//         },
//         {
//             header: "Full Name",
//             key: "fullName",
//             width: 28,
//         },
//         {
//             header: "Designation",
//             key: "designation",
//             width: 25,
//         },
//         {
//             header: "Contact Number",
//             key: "contactNumber",
//             width: 20,
//         },
//         {
//             header: "WhatsApp Number",
//             key: "whatsappNumber",
//             width: 20,
//         },
//         {
//             header: "Official Email",
//             key: "officialEmail",
//             width: 32,
//         },
//         {
//             header: "Personal Email",
//             key: "personalEmail",
//             width: 32,
//         },
//         {
//             header: "Country",
//             key: "country",
//             width: 20,
//         },
//         {
//             header: "Status",
//             key: "status",
//             width: 15,
//         },
//     ];

//     filteredEmployees.forEach((employee) => {
//         worksheet.addRow({
//             employeeId: employee.employeeCode || "",
//             fullName: employee.fullName || "",
//             designation: employee.designation || "",
//             contactNumber: employee.phone || "",
//             whatsappNumber: employee.whatsapp || "",
//             officialEmail: employee.officialEmail || "",
//             personalEmail: employee.personalEmail || "",
//             country: employee.country?.name || "",
//             status: employee.active ? "Active" : "Inactive",
//         });
//     });

//     const headerRow = worksheet.getRow(1);

//     headerRow.height = 25;

//     headerRow.eachCell((cell) => {
//         cell.font = {
//             name: "Calibri",
//             size: 11,
//             bold: true,
//             color: {
//                 argb: "FF263B57",
//             },
//         };

//         cell.fill = {
//             type: "pattern",
//             pattern: "none",
//         };

//         cell.alignment = {
//             horizontal: "center",
//             vertical: "middle",
//         };

//         cell.border = {
//             top: {
//                 style: "thin",
//                 color: {
//                     argb: "FFD9E1EB",
//                 },
//             },
//             bottom: {
//                 style: "thin",
//                 color: {
//                     argb: "FFD9E1EB",
//                 },
//             },
//             left: {
//                 style: "thin",
//                 color: {
//                     argb: "FFD9E1EB",
//                 },
//             },
//             right: {
//                 style: "thin",
//                 color: {
//                     argb: "FFD9E1EB",
//                 },
//             },
//         };
//     });

//     worksheet.eachRow((row, rowNumber) => {
//         if (rowNumber === 1) {
//             return;
//         }

//         row.height = 22;

//         row.eachCell((cell, columnNumber) => {
//             cell.font = {
//                 name: "Calibri",
//                 size: 11,
//                 color: {
//                     argb: "FF263B57",
//                 },
//             };

//             cell.alignment = {
//                 vertical: "middle",
//                 horizontal:
//                     columnNumber === 1 ||
//                     columnNumber === 10
//                         ? "center"
//                         : "left",
//             };

//             cell.border = {
//                 top: {
//                     style: "thin",
//                     color: {
//                         argb: "FFE2E6ED",
//                     },
//                 },
//                 bottom: {
//                     style: "thin",
//                     color: {
//                         argb: "FFE2E6ED",
//                     },
//                 },
//                 left: {
//                     style: "thin",
//                     color: {
//                         argb: "FFE2E6ED",
//                     },
//                 },
//                 right: {
//                     style: "thin",
//                     color: {
//                         argb: "FFE2E6ED",
//                     },
//                 },
//             };
//         });
//     });

//     worksheet.views = [
//         {
//             state: "frozen",
//             ySplit: 1,
//         },
//     ];

//     const buffer = await workbook.xlsx.writeBuffer();

//     const blob = new Blob(
//         [buffer],
//         {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         }
//     );

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.download = "troy-employees.xlsx";

//     document.body.appendChild(link);

//     link.click();

//     document.body.removeChild(link);

//     URL.revokeObjectURL(url);
// };


//     const initials = (name) => {
//             if (!name) {return "T";}
//             return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
//         };

//     const capitalizeRole = (role) => {
//             if (!role) {return "—";}
//             return (role.charAt(0).toUpperCase() + role.slice(1));
//         };


//     return (

//         <div className="page">
//             <div className="employees-header">
//                 <div>
//                     <h1> Troy Employees </h1>
//                     <p> {employees.length}{" "}
//                         {employees.length === 1? "team member": "team members"}
//                     </p>
//                 </div>

//                 <div className="employees-header-actions">
//                     <button
//                         type="button"
//                         className="employee-export-btn"
//                         onClick={handleExport}
//                     >
//                         <i className="bi bi-download"></i> Export Employees
//                     </button>
//                     <button
//                         type="button"
//                         className="employee-add-btn"
//                         onClick={openAddModal}
//                     >
//                         <i className="bi bi-plus-lg"></i> Add employee
//                     </button>
//                 </div>
//             </div>

//             <div className="employee-stats">
//                 <div className="employee-stat-card">
//                     <div className="employee-stat-value">{employees.length}</div>
//                     <div className="employee-stat-label">Total Employees</div>
//                 </div>

//                 <div className="employee-stat-card">
//                     <div className="employee-stat-value">{designations.length}</div>
//                     <div className="employee-stat-label">Designations</div>  
//                 </div>

//                 <div className="employee-stat-card employee-stat-active">
//                     <div className="employee-stat-value">{activeEmployees}</div>
//                     <div className="employee-stat-label">Active</div>                
//                 </div>

//                 <div className="employee-stat-card employee-stat-inactive">
//                     <div className="employee-stat-value">{inactiveEmployees}</div>
//                     <div className="employee-stat-label">Inactive</div>                
//                 </div>
//             </div>

//             <div className="employee-filters">
//                 <div className="employee-search-wrapper">
//                     <i className="bi bi-search"></i>

//                     <input
//                         type="text"
//                         value={search}
//                         onChange={(event) =>setSearch(    event.target.value)}
//                         placeholder="Search by ID, name, designation, email..."
//                     />
//                 </div>

//                 <div className="employee-status-filter">
//                     <select
//                         value={statusFilter}
//                         onChange={(event) =>setStatusFilter(event.target.value)}
//                     >
//                         <option value="all">All Status</option>
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                     </select>
//                 </div>
//             </div>

//             {isLoading ? (
//                 <div className="employees-empty-state">
//                     <div className="empty-employee-icon">
//                         <i className="bi bi-arrow-repeat"></i>
//                     </div>
//                     <p>Loading employees...</p>
//                 </div>

//             ) : filteredEmployees.length > 0 ? (
//                 <div className="employees-table-wrapper">
//                     <table className="employees-table">
//                         <thead>
//                             <tr>
//                                 <th>EMP ID</th>
//                                 <th>EMPLOYEE</th>
//                                 <th>DESIGNATION</th>
//                                 <th>CONTACT</th>
//                                 <th>OFFICIAL EMAIL</th>
//                                 <th>ACTIONS</th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {paginatedEmployees.map(
//                                 (employee) => {
//                                     return (
//                                         <tr key={ employee.id }>
//                                             <td>
//                                                 <span className="employee-id">
//                                                     { employee.employeeCode}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 <div className="employee-person">
//                                                     {employee.photoUrl ? (
//                                                         <img src={employee.photoUrl}
//                                                             alt={employee.fullName}
//                                                             className="employee-avatar employee-avatar-image"
//                                                         />
//                                                     ) : (
//                                                         <div className="employee-avatar">
//                                                             {initials(employee.fullName)}
//                                                         </div>
//                                                     )}

//                                                     <div className="employee-person-info">
//                                                         <strong className="employee-name-link"
//                                                                 onClick={() => navigate(`/dashboard/employees/${employee.id}`)}
//                                                         >{employee.fullName}
//                                                         </strong>
//                                                         {employee.personalEmail && (
//                                                             <a href={`mailto:${employee.personalEmail}`} 
//                                                                 className="employee-personal-email"
//                                                             >
//                                                                 {employee.personalEmail}
//                                                             </a>
//                                                         )}

//                                                         <span className={`employee-status-badge ${employee.active? "employee-status-active": "employee-status-inactive"}`}>
//                                                             <span className="employee-status-dot"></span>
//                                                             {employee.active ? "Active" : "Inactive"}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <span className="designation-text">{ employee.designation}</span>
//                                             </td>
//                                             <td>
//                                                 <div className="employee-contact">
//                                                     <span>
//                                                         {
//                                                             employee.phone ||
//                                                             "—"
//                                                         }
//                                                     </span>
//                                                     <div className="employee-comms">
//                                                         {employee.phone && (
//                                                             <a
//                                                                 href={`tel:${employee.phone}`}
//                                                                 title="Call"
//                                                             >
//                                                                 <i className="bi bi-telephone"></i>
//                                                             </a>
//                                                         )}
//                                                         {employee.whatsapp && (

//                                                             <a
//                                                                 href={`https://wa.me/${employee.whatsapp.replace(
//                                                                     /[^0-9]/g,
//                                                                     ""
//                                                                 )}`}
//                                                                 target="_blank"
//                                                                 rel="noreferrer"
//                                                                 title="WhatsApp"
//                                                             >

//                                                                 <i className="bi bi-whatsapp"></i>

//                                                             </a>

//                                                         )}


//                                                         {employee.officialEmail && (

//                                                             <a
//                                                                 href={`mailto:${employee.officialEmail}`}
//                                                                 title="Email"
//                                                             >

//                                                                 <i className="bi bi-envelope"></i>

//                                                             </a>

//                                                         )}

//                                                     </div>

//                                                 </div>

//                                             </td>
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
//                                             <td>
//                                                 <div className="employee-actions">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>openEditModal(employee)}
//                                                     >
//                                                         Edit
//                                                     </button>
// <button
//     type="button"
//     className="employee-delete-action"
//     onClick={() => openDeleteModal(employee)}
//     disabled={deleteLoading}
// >
//     Delete
// </button>
//                                                     <button
//                                                         type="button"
//                                                         className="employee-assign-role-action"
//                                                         onClick={() =>openRoleAssignmentModal(employee)
//                                                         }
//                                                     >
//                                                         <i className="bi bi-person-plus"></i>

//                                                         Assign Role
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 }
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (

//                 <div className="employees-empty-state">
//                     <div className="empty-employee-icon">
//                         <i className="bi bi-person-fill"></i>
//                     </div>
//                     <p>
//                         {search? "No employees found matching your search.": 'No employees yet. Click "+ Add employee" to add your team.'}
//                     </p>
//                 </div>

//             )}

//             <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 totalItems={filteredEmployees.length}
//                 itemsPerPage={employeesPerPage}
//                 onPageChange={setCurrentPage}
//             />

//             {showModal && (
//                 <EmployeeModal
//                     employee={ editingEmployee}
//                     countries={ countries}
//                     countriesLoading={ countriesLoading}
//                     onClose={ closeModal}
//                     onSave={ handleSaveEmployee}
//                     generateEmployeeId={ generateEmployeeId}
//                     isSubmitting={ isSaving}
//                     error={ error}
//                     onClearError={() => dispatch(clearEmployeeError() )}
//                 />
//             )}

//             {showRoleAssignmentModal && (
//                 <RoleAssignmentModal
//                     employee={selectedEmployeeForRole}
//                     roles={roles}
//                     assignedRoles={employeeRoleMap[selectedEmployeeForRole?.id] || []}
//                     onClose={closeRoleAssignmentModal}
//                     onAssign={handleAssignRoles}
//                     isSubmitting={roleAssignmentLoading}
//                 />
//             )}

//             {showDeleteModal && (
//     <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={closeDeleteModal}
//         onConfirm={handleDeleteEmployee}
//         title="Delete employee"
//         itemName={employeeToDelete?.fullName}
//         message={`Are you sure you want to delete ${employeeToDelete?.fullName}?`}
//         deleteText={
//             deleteLoading
//                 ? "Deleting..."
//                 : "Delete"
//         }
//         cancelText="Cancel"
//     />
// )}
// <Toast
//     show={toast.show}
//     type={toast.type}
//     message={toast.message}
//     onClose={() =>
//         setToast((current) => ({
//             ...current,
//             show: false,
//         }))
//     }
// />
//         </div>
//     );
// }


// export default Employees;







import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Employees.css";

import EmployeeModal from "./EmployeeModal";
import RoleAssignmentModal from "./RoleAssignmentModal";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import Pagination from "../../Components/Pagination";
import EmployeeExportModal from "./EmployeeExportModal";

import {
    getAllEmployees,
    getCountries,
    createEmployee,
    updateEmployee,
    clearEmployeeError,
    deleteEmployee,
    getEmployeeFilters,
} from "../../Redux/Slice/employeeSlice";

import {
    getAllRoles,
    getEmployeeRoles,
    assignRoleToEmployee,
} from "../../Redux/Slice/roleSlice";

import { exportEmployees, } from "../../Redux/Slice/jobSlice"

import { useNavigate } from "react-router-dom";
import Toast from "../../Components/Toast";


function generateEmployeeId() {
    return `EMP${Math.floor(100 + Math.random() * 900)}`;
}


function Employees() {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    /*
    |--------------------------------------------------------------------------
    | REDUX
    |--------------------------------------------------------------------------
    */

    const {
        employees = [],
        countries = [],
        employeePagination = {},

        employeeFilters = {
            totalEmployees: 0,
            totalActiveEmployees: 0,
            totalInActiveEmployees: 0,
        },

        isLoading,
        isSaving,
        deleteLoading,
        countriesLoading,
        error,
    } = useSelector(
        (state) => state.employees
    );


    const {
        roles = [],
    } = useSelector(
        (state) => state.role || {}
    );

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");
    const [currentPage, setCurrentPage] =
        useState(0);

    const EMPLOYEES_PER_PAGE = 0;


    const [showModal, setShowModal] =
        useState(false);

    const [editingEmployee, setEditingEmployee] =
        useState(null);


    const [employeeRoleMap, setEmployeeRoleMap] =
        useState({});


    const [
        showRoleAssignmentModal,
        setShowRoleAssignmentModal,
    ] = useState(false);


    const [
        selectedEmployeeForRole,
        setSelectedEmployeeForRole,
    ] = useState(null);


    const [
        roleAssignmentLoading,
        setRoleAssignmentLoading,
    ] = useState(false);


    const [
        showDeleteModal,
        setShowDeleteModal,
    ] = useState(false);


    const [
        employeeToDelete,
        setEmployeeToDelete,
    ] = useState(null);


    const [toast, setToast] = useState({
        show: false,
        type: "success",
        message: "",
    });

    const [
        showExportModal,
        setShowExportModal,
    ] = useState(false);

    const [
        isExporting,
        setIsExporting,
    ] = useState(false);
    /*
    |--------------------------------------------------------------------------
    | TOAST
    |--------------------------------------------------------------------------
    */

    const showToast = (
        message,
        type = "success"
    ) => {

        setToast({
            show: true,
            type,
            message,
        });
    };


    /*
    |--------------------------------------------------------------------------
    | FETCH EMPLOYEES
    |
    | Backend handles:
    | - pagination
    | - search
    | - active/inactive filtering
    |--------------------------------------------------------------------------
    */

    const fetchEmployees = () => {

        let active;


        if (statusFilter === "active") {
            active = true;
        }


        if (statusFilter === "inactive") {
            active = false;
        }


        dispatch(
            getAllEmployees({
                page: currentPage,
                size: EMPLOYEES_PER_PAGE,
                search: search.trim(),
                active,
            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL DATA
    |
    | Countries and roles are fetched once.
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        dispatch(getCountries());

        dispatch(getAllRoles());
        dispatch(getEmployeeFilters());

    }, [dispatch]);


    /*
    |--------------------------------------------------------------------------
    | RESET TO FIRST PAGE WHEN SEARCH / STATUS CHANGES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setCurrentPage(0);

    }, [
        search,
        statusFilter,
    ]);


    /*
    |--------------------------------------------------------------------------
    | FETCH EMPLOYEES WHEN PAGE / SEARCH / STATUS CHANGES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let active;


        if (statusFilter === "active") {
            active = true;
        }


        if (statusFilter === "inactive") {
            active = false;
        }


        dispatch(
            getAllEmployees({
                page: currentPage,
                size: EMPLOYEES_PER_PAGE,
                search: search.trim(),
                active,
            })
        );

    }, [
        dispatch,
        currentPage,
        search,
        statusFilter,
    ]);


    /*
    |--------------------------------------------------------------------------
    | CURRENT PAGE DESIGNATIONS
    |
    | NOTE:
    | Since backend is paginated, this is only based on
    | the currently loaded page.
    |--------------------------------------------------------------------------
    */

    const designations = useMemo(() => {

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
    |--------------------------------------------------------------------------
    | CURRENT PAGE ACTIVE / INACTIVE
    |
    | These are counts from the current backend page only.
    |--------------------------------------------------------------------------
    */

    const activeEmployees = useMemo(() => {

        return employees.filter(
            (employee) =>
                employee.active === true
        ).length;

    }, [
        employees,
    ]);


    const inactiveEmployees = useMemo(() => {

        return employees.filter(
            (employee) =>
                employee.active === false
        ).length;

    }, [
        employees,
    ]);


    /*
    |--------------------------------------------------------------------------
    | ADD EMPLOYEE
    |--------------------------------------------------------------------------
    */

    const openAddModal = () => {

        dispatch(
            clearEmployeeError()
        );

        setEditingEmployee(null);

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | EDIT EMPLOYEE
    |--------------------------------------------------------------------------
    */

    const openEditModal = (
        employee
    ) => {

        dispatch(
            clearEmployeeError()
        );

        setEditingEmployee(employee);

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | CLOSE EMPLOYEE MODAL
    |--------------------------------------------------------------------------
    */

    const closeModal = () => {

        if (isSaving) {
            return;
        }

        setShowModal(false);

        setEditingEmployee(null);
    };


    /*
    |--------------------------------------------------------------------------
    | SAVE EMPLOYEE
    |--------------------------------------------------------------------------
    */

    const handleSaveEmployee = async (
        employeeData
    ) => {

        try {

            /*
            |--------------------------------------------------------------------------
            | UPDATE
            |--------------------------------------------------------------------------
            */

            if (editingEmployee) {

                const updateData = {};


                if (
                    employeeData.employeeId !== undefined &&
                    employeeData.employeeId !== null &&
                    employeeData.employeeId.trim() !== ""
                ) {

                    updateData.employeeCode =
                        employeeData.employeeId.trim();
                }


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
                        id: editingEmployee.id,
                        employeeData: updateData,
                    })
                ).unwrap();


                closeModal();


                showToast(
                    `${employeeData.fullName.trim()} updated successfully.`
                );


                /*
                 * Refresh the current backend page
                 * after update.
                 */
                fetchEmployees();


                return;
            }


            /*
            |--------------------------------------------------------------------------
            | CREATE
            |--------------------------------------------------------------------------
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
                "CREATE EMPLOYEE:",
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


            showToast(
                `${employeeData.fullName} added successfully.`
            );


            /*
             * Refresh current backend page.
             */
            fetchEmployees();

        } catch (error) {

            console.error(
                "Employee save failed:",
                error
            );


            showToast(
                typeof error === "string"
                    ? error
                    : "Failed to save employee.",
                "error"
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    const openDeleteModal = (
        employee
    ) => {

        setEmployeeToDelete(employee);

        setShowDeleteModal(true);
    };


    const closeDeleteModal = () => {

        if (deleteLoading) {
            return;
        }

        setShowDeleteModal(false);

        setEmployeeToDelete(null);
    };


    const handleDeleteEmployee =
        async () => {

            if (!employeeToDelete?.id) {
                return;
            }


            try {

                await dispatch(
                    deleteEmployee(
                        employeeToDelete.id
                    )
                ).unwrap();


                const deletedEmployeeName =
                    employeeToDelete.fullName;


                closeDeleteModal();


                showToast(
                    `${deletedEmployeeName} deleted successfully.`
                );


                /*
                 * Refresh the current backend page.
                 */
                fetchEmployees();

            } catch (error) {

                console.error(
                    "Employee delete failed:",
                    error
                );


                showToast(
                    typeof error === "string"
                        ? error
                        : "Failed to delete employee.",
                    "error"
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | ROLE ASSIGNMENT
    |--------------------------------------------------------------------------
    */

    const openRoleAssignmentModal =
        (employee) => {

            setSelectedEmployeeForRole(
                employee
            );

            setShowRoleAssignmentModal(
                true
            );
        };


    const closeRoleAssignmentModal =
        () => {

            if (roleAssignmentLoading) {
                return;
            }

            setShowRoleAssignmentModal(
                false
            );

            setSelectedEmployeeForRole(
                null
            );
        };


    const handleAssignRoles =
        async (
            selectedRoleIds
        ) => {

            if (
                !selectedEmployeeForRole?.id ||
                !selectedRoleIds?.length
            ) {
                return;
            }


            setRoleAssignmentLoading(
                true
            );


            try {

                await Promise.all(
                    selectedRoleIds.map(
                        (roleId) =>
                            dispatch(
                                assignRoleToEmployee({
                                    employeeId:
                                        selectedEmployeeForRole.id,

                                    roleId:
                                        roleId,
                                })
                            ).unwrap()
                    )
                );


                const result =
                    await dispatch(
                        getEmployeeRoles(
                            selectedEmployeeForRole.id
                        )
                    ).unwrap();


                const updatedRoles =
                    Array.isArray(result)
                        ? result
                        : Array.isArray(
                            result?.roles
                        )
                            ? result.roles
                            : Array.isArray(
                                result?.data
                            )
                                ? result.data
                                : [];


                setEmployeeRoleMap(
                    (previous) => ({
                        ...previous,

                        [
                            selectedEmployeeForRole.id
                        ]:
                            updatedRoles,
                    })
                );


                const employeeName =
                    selectedEmployeeForRole.fullName;


                closeRoleAssignmentModal();


                showToast(
                    `Role assigned to ${employeeName} successfully.`
                );

            } catch (error) {

                console.error(
                    "Role assignment failed:",
                    error
                );


                showToast(
                    typeof error === "string"
                        ? error
                        : "Failed to assign role.",
                    "error"
                );

            } finally {

                setRoleAssignmentLoading(
                    false
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | EXPORT CURRENT BACKEND PAGE
    |--------------------------------------------------------------------------
    */

    const handleExport = async (exportParams) => {

        try {

            setIsExporting(true);

            const result =
                await dispatch(
                    exportEmployees(
                        exportParams
                    )
                ).unwrap();


            const blob =
                new Blob(
                    [result.data],
                    {
                        type:
                            result.headers?.["content-type"] ||
                            "application/octet-stream",
                    }
                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;


            /*
             * You can change this filename
             * if backend sends a specific filename.
             */
            link.download =
                "troy-employees.xlsx";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            window.URL.revokeObjectURL(
                url
            );


            setShowExportModal(false);


            showToast(
                "Employees exported successfully."
            );

        } catch (error) {

            console.error(
                "Employee export failed:",
                error
            );


            showToast(
                typeof error === "string"
                    ? error
                    : "Failed to export employees.",
                "error"
            );

        } finally {

            setIsExporting(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    const initials = (
        name
    ) => {

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
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="page">

            {/* HEADER */}

            <div className="employees-header">

                <div>

                    <h1>
                        Troy Employees
                    </h1>

                    <p>

                        {employeePagination.totalElements || 0}{" "}

                        {employeePagination.totalElements === 1
                            ? "team member"
                            : "team members"}

                    </p>

                </div>


                <div className="employees-header-actions">
                    <button
                        type="button"
                        className="employee-export-btn"
                        onClick={() =>
                            setShowExportModal(true)
                        }
                    >

                        <i className="bi bi-download"></i>

                        {" "}
                        Export Employees

                    </button>


                    <button
                        type="button"
                        className="employee-add-btn"
                        onClick={openAddModal}
                    >

                        <i className="bi bi-plus-lg"></i>

                        {" "}
                        Add employee

                    </button>

                </div>

            </div>


            {/* STATS */}

            <div className="employee-stats">

                <div className="employee-stat-card">

                    <div className="employee-stat-value">

                        {employeeFilters.totalEmployees || 0}

                    </div>

                    <div className="employee-stat-label">

                        Total Employees

                    </div>

                </div>

                <div className="employee-stat-card employee-stat-active">

                    <div className="employee-stat-value">

                        {employeeFilters.totalActiveEmployees || 0}

                    </div>

                    <div className="employee-stat-label">

                        Active

                    </div>

                </div>
                <div className="employee-stat-card employee-stat-inactive">

                    <div className="employee-stat-value">

                        {employeeFilters.totalInActiveEmployees || 0}

                    </div>

                    <div className="employee-stat-label">

                        Inactive

                    </div>

                </div>

            </div>


            {/* FILTERS */}

            <div className="employee-filters">

                <div className="employee-search-wrapper">

                    <i className="bi bi-search"></i>


                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search by ID, name, designation, email..."
                    />

                </div>


                <div className="employee-status-filter">

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>

                </div>

            </div>


            {/* TABLE */}

            {isLoading ? (

                <div className="employees-empty-state">

                    <div className="empty-employee-icon">

                        <i className="bi bi-arrow-repeat"></i>

                    </div>

                    <p>
                        Loading employees...
                    </p>

                </div>

            ) : employees.length > 0 ? (

                <div className="employees-table-wrapper">

                    <table className="employees-table">

                        <thead>

                            <tr>

                                <th>
                                    EMP ID
                                </th>

                                <th>
                                    EMPLOYEE
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

                            {employees.map(
                                (employee) => (

                                    <tr
                                        key={
                                            employee.id
                                        }
                                    >

                                        {/* EMPLOYEE ID */}

                                        <td>

                                            <span className="employee-id">

                                                {
                                                    employee.employeeCode
                                                }

                                            </span>

                                        </td>


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

                                                    <strong
                                                        className="employee-name-link"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/employees/${employee.id}`
                                                            )
                                                        }
                                                    >

                                                        {
                                                            employee.fullName
                                                        }

                                                    </strong>


                                                    {employee.personalEmail && (

                                                        <a
                                                            href={
                                                                `mailto:${employee.personalEmail}`
                                                            }
                                                            className="employee-personal-email"
                                                        >

                                                            {
                                                                employee.personalEmail
                                                            }

                                                        </a>

                                                    )}


                                                    <span
                                                        className={
                                                            `employee-status-badge ${employee.active
                                                                ? "employee-status-active"
                                                                : "employee-status-inactive"
                                                            }`
                                                        }
                                                    >

                                                        <span className="employee-status-dot"></span>

                                                        {
                                                            employee.active
                                                                ? "Active"
                                                                : "Inactive"
                                                        }

                                                    </span>

                                                </div>

                                            </div>

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
                                                            href={
                                                                `tel:${employee.phone}`
                                                            }
                                                            title="Call"
                                                        >

                                                            <i className="bi bi-telephone"></i>

                                                        </a>

                                                    )}


                                                    {employee.whatsapp && (

                                                        <a
                                                            href={
                                                                `https://wa.me/${employee.whatsapp.replace(
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

                                                    )}


                                                    {employee.officialEmail && (

                                                        <a
                                                            href={
                                                                `mailto:${employee.officialEmail}`
                                                            }
                                                            title="Email"
                                                        >

                                                            <i className="bi bi-envelope"></i>

                                                        </a>

                                                    )}

                                                </div>

                                            </div>

                                        </td>


                                        {/* OFFICIAL EMAIL */}

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
                                                >

                                                    Edit

                                                </button>


                                                <button
                                                    type="button"
                                                    className="employee-delete-action"
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            employee
                                                        )
                                                    }
                                                    disabled={
                                                        deleteLoading
                                                    }
                                                >

                                                    Delete

                                                </button>


                                                <button
                                                    type="button"
                                                    className="employee-assign-role-action"
                                                    onClick={() =>
                                                        openRoleAssignmentModal(
                                                            employee
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-person-plus"></i>

                                                    {" "}
                                                    Assign Role

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
                            : "No employees yet. Click \"+ Add employee\" to add your team."
                        }

                    </p>

                </div>

            )}


            {/* BACKEND PAGINATION */}

            {employeePagination.totalPages > 0 && (

                <Pagination

                    /*
                     * Pagination component displays 1-based pages.
                     * Backend uses 0-based pages.
                     */
                    currentPage={
                        currentPage + 1
                    }

                    totalPages={
                        employeePagination.totalPages
                    }

                    totalItems={
                        employeePagination.totalElements || 0
                    }

                    itemsPerPage={
                        employeePagination.pageSize || EMPLOYEES_PER_PAGE
                    }

                    onPageChange={(
                        page
                    ) => {

                        /*
                         * Convert UI page to backend page.
                         *
                         * UI: 1, 2, 3...
                         * API: 0, 1, 2...
                         */
                        setCurrentPage(
                            page - 1
                        );

                    }}

                />

            )}


            {/* EMPLOYEE MODAL */}

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

                    error={
                        error
                    }

                    onClearError={() =>
                        dispatch(
                            clearEmployeeError()
                        )
                    }

                />

            )}


            {/* ROLE ASSIGNMENT MODAL */}

            {showRoleAssignmentModal && (

                <RoleAssignmentModal

                    employee={
                        selectedEmployeeForRole
                    }

                    roles={
                        roles
                    }

                    assignedRoles={
                        employeeRoleMap[
                        selectedEmployeeForRole?.id
                        ] || []
                    }

                    onClose={
                        closeRoleAssignmentModal
                    }

                    onAssign={
                        handleAssignRoles
                    }

                    isSubmitting={
                        roleAssignmentLoading
                    }

                />

            )}


            {/* DELETE MODAL */}

            {showDeleteModal && (

                <DeleteConfirmationModal

                    isOpen={
                        showDeleteModal
                    }

                    onClose={
                        closeDeleteModal
                    }

                    onConfirm={
                        handleDeleteEmployee
                    }

                    title="Delete employee"

                    itemName={
                        employeeToDelete?.fullName
                    }

                    message={
                        `Are you sure you want to delete ${employeeToDelete?.fullName}?`
                    }

                    deleteText={
                        deleteLoading
                            ? "Deleting..."
                            : "Delete"
                    }

                    cancelText="Cancel"

                />

            )}


            {/* TOAST */}

            <Toast

                show={
                    toast.show
                }

                type={
                    toast.type
                }

                message={
                    toast.message
                }

                onClose={() =>
                    setToast(
                        (
                            current
                        ) => ({
                            ...current,
                            show: false,
                        })
                    )
                }

            />

            {showExportModal && (
                <EmployeeExportModal
                    onClose={() =>
                        setShowExportModal(false)
                    }
                    onExport={handleExport}
                    isExporting={isExporting}
                />
            )}

        </div>
    );
}


export default Employees;