// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../Redux/Slice/authSlice";

// function Sidebar() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // Get logged-in user from Redux
//     const user = useSelector((state) => state.auth?.user);

//     const menuItems = [
//         {
//             name: "Dashboard",
//             path: "/dashboard",
//             icon: "▧",
//         },
//         {
//             name: "Recruitment Workflow",
//             path: "/dashboard/recruitment-Workflow",
//             icon: "▤",
//         },
//         {
//             name: "Candidates",
//             path: "/dashboard/candidates",
//             icon: "◉",
//         },
//         {
//             name: "Jobs",
//             path: "/dashboard/jobs",
//             icon: "▦",
//         },
//         {
//             name: "Clients",
//             path: "/dashboard/clients",
//             icon: "▣",
//         },
//         {
//             name: "Employees",
//             path: "/dashboard/employees",
//             icon: "♟",
//         },
//         {
//             name: "Reports",
//             path: "/dashboard/reports",
//             icon: "▥",
//         },
//     ];

//     const handleSignOut = async () => {
//         try {
//             await dispatch(logoutUser()).unwrap();
//         } catch (error) {
//             console.error("Logout error:", error);
//         }

//         navigate("/", { replace: true });
//     };

//     // Logged-in user information
//     const fullName = user?.fullName || "User";
//     const designation = user?.designation || "User";
//     const role = user?.role || "";

//     // First letter for avatar
//     const avatarLetter = fullName.charAt(0).toUpperCase();

//     return (
//         <aside className="sidebar">
//             {/* Logo */}
//             <div className="sidebar-logo">
//                 <img
//                     src="/Troylogo1.png"
//                     alt="Troy Consultancy"
//                     className="troy-logo-image"
//                 />
//             </div>

//             {/* Navigation */}
//             <nav className="sidebar-nav">
//                 {menuItems.map((item) => (
//                     <NavLink
//                         key={item.name}
//                         to={item.path}
//                         end={item.path === "/dashboard"}
//                         className={({ isActive }) =>
//                             `sidebar-link ${isActive ? "active" : ""}`
//                         }
//                     >
//                         <span className="sidebar-icon">
//                             {item.icon}
//                         </span>

//                         <span className="sidebar-link-text">
//                             {item.name}
//                         </span>
//                     </NavLink>
//                 ))}
//             </nav>

//             {/* Bottom user section */}
//             <div className="sidebar-bottom">
//                 <div className="admin-profile">
//                     <div className="admin-avatar">
//                         {avatarLetter}
//                     </div>

//                     <div className="admin-info">
//                         <div className="admin-name">
//                             {fullName}
//                         </div>

//                         {/* <div className="admin-role">
//                             {designation}
//                         </div> */}
//                         <div className="admin-role">
//                             {role}
//                         </div>
//                     </div>
//                 </div>

//                 <button
//                     className="signout-btn"
//                     onClick={handleSignOut}
//                 >
//                     <span className="signout-icon">◉</span>

//                     <span className="signout-text">
//                         Sign out
//                     </span>
//                 </button>
//             </div>
//         </aside>
//     );
// }

// export default Sidebar;


import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    logoutUser,
    setActiveRole,
} from "../Redux/Slice/authSlice";

import {
    switchRole,
} from "../Redux/Slice/roleSlice";

import {
    FiGrid,
    FiGitBranch,
    FiUsers,
    FiBriefcase,
    FiLayers,
    FiUserCheck,
    FiBarChart2,
    FiShield,
} from "react-icons/fi";


function Sidebar() {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    // =========================================================
    // AUTH STATE
    // =========================================================

    const {
        user,
        activeRole,
        roles = [],
    } = useSelector(
        (state) =>
            state.auth || {}
    );


    // =========================================================
    // ROLE SWITCH STATE
    // =========================================================

    const [
        selectedRoleId,
        setSelectedRoleId,
    ] = useState(
        activeRole?.id || ""
    );


    const [
        switchingRole,
        setSwitchingRole,
    ] = useState(false);


    // =========================================================
    // MENU
    // =========================================================

    const menuItems = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FiGrid />,
        },

        {
            name: "Recruitment Workflow",
            path: "/dashboard/recruitment-Workflow",
            icon: <FiGitBranch />,
        },

        {
            name: "Candidates",
            path: "/dashboard/candidates",
            icon: <FiUsers />,
        },

        {
            name: "Jobs",
            path: "/dashboard/jobs",
            icon: <FiBriefcase />,
        },

        {
            name: "Clients",
            path: "/dashboard/clients",
            icon: <FiLayers />,
        },

        {
            name: "Employees",
            path: "/dashboard/employees",
            icon: <FiUserCheck />,
        },

        {
            name: "Roles",
            path: "/dashboard/roles",
            icon: <FiShield />,
        },

        {
            name: "Reports",
            path: "/dashboard/reports",
            icon: <FiBarChart2 />,
        },

    ];


    // =========================================================
    // NORMALIZE ROLES
    // =========================================================

    const normalizedRoles =
        useMemo(() => {

            return (roles || [])
                .map((roleItem) => {

                    const id =
                        roleItem?.id ||
                        roleItem?.roleId ||
                        roleItem?.role?.id;

                    const name =
                        roleItem?.name ||
                        roleItem?.roleName ||
                        roleItem?.role?.name;

                    if (!id || !name) {
                        return null;
                    }

                    return {
                        id,
                        name,
                    };

                })
                .filter(Boolean);

        }, [
            roles,
        ]);


    // =========================================================
    // SET ACTIVE ROLE FROM LOGIN RESPONSE
    // =========================================================

    useEffect(() => {

        if (activeRole?.id) {

            setSelectedRoleId(
                activeRole.id
            );

        }

    }, [
        activeRole?.id,
    ]);


    // =========================================================
    // CURRENT ROLE
    // =========================================================

    const currentRole =
        normalizedRoles.find(
            (roleItem) =>
                String(roleItem.id) ===
                String(selectedRoleId)
        );


    /*
     * If activeRole is returned by login but is not present
     * inside roles array, still show activeRole.
     */
    const currentRoleName =
        activeRole?.id === selectedRoleId
            ? activeRole?.name
            : currentRole?.name;


    const role =
        currentRoleName ||
        activeRole?.name ||
        user?.role ||
        "";


    // =========================================================
    // SWITCH ROLE
    // =========================================================

    const handleRoleChange =
        async (event) => {

            const newRoleId =
                event.target.value;


            if (
                !newRoleId ||
                newRoleId === selectedRoleId
            ) {

                return;

            }


            const previousRoleId =
                selectedRoleId;


            /*
             * Find selected role from roles
             */
            const selectedRole =
                normalizedRoles.find(
                    (roleItem) =>
                        String(roleItem.id) ===
                        String(newRoleId)
                );


            try {

                setSwitchingRole(true);


                /*
                 * Call switch role API
                 */
                const response =
                    await dispatch(
                        switchRole(
                            newRoleId
                        )
                    ).unwrap();


                console.log(
                    "Switch role response:",
                    response
                );


                /*
                 * Backend may return:
                 *
                 * {
                 *   accessToken,
                 *   refreshToken,
                 *   activeRole,
                 *   roles
                 * }
                 *
                 * OR:
                 *
                 * {
                 *   data: {
                 *      accessToken,
                 *      activeRole
                 *   }
                 * }
                 */

                const newAccessToken =
                    response?.accessToken ||
                    response?.data?.accessToken;


                const newRefreshToken =
                    response?.refreshToken ||
                    response?.data?.refreshToken;


                const newActiveRole =
                    response?.activeRole ||
                    response?.data?.activeRole ||
                    selectedRole;


                /*
                 * Update access token
                 */
                if (newAccessToken) {

                    localStorage.setItem(
                        "accessToken",
                        newAccessToken
                    );

                }


                /*
                 * Update refresh token if backend
                 * sends one
                 */
                if (newRefreshToken) {

                    localStorage.setItem(
                        "refreshToken",
                        newRefreshToken
                    );

                }


                /*
                 * Update active role
                 */
                if (newActiveRole) {

                    dispatch(
                        setActiveRole(
                            newActiveRole
                        )
                    );

                }


                /*
                 * Update selected dropdown value
                 */
                setSelectedRoleId(
                    newRoleId
                );


            } catch (error) {

                console.error(
                    "Role switch failed:",
                    error
                );


                /*
                 * Keep previous role
                 */
                setSelectedRoleId(
                    previousRoleId
                );

            } finally {

                setSwitchingRole(false);

            }

        };


    // =========================================================
    // SIGN OUT
    // =========================================================

    const handleSignOut =
        async () => {

            try {

                await dispatch(
                    logoutUser()
                ).unwrap();

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }


            navigate(
                "/",
                {
                    replace: true,
                }
            );

        };


    // =========================================================
    // USER INFORMATION
    // =========================================================

    const fullName =
        user?.fullName ||
        "User";


    const avatarLetter =
        fullName
            .charAt(0)
            .toUpperCase();


    // =========================================================
    // UI
    // =========================================================

    return (

        <aside className="sidebar">


            {/* =================================================
                LOGO
            ================================================= */}

            <div className="sidebar-logo">

                <img
                    src="/Troylogo1.png"
                    alt="Troy Consultancy"
                    className="troy-logo-image"
                />

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="sidebar-nav">

                {menuItems.map(
                    (item) => (

                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={
                                item.path ===
                                "/dashboard"
                            }
                            className={
                                ({ isActive }) =>
                                    `sidebar-link ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                            }
                        >

                            <span className="sidebar-icon">

                                {item.icon}

                            </span>


                            <span className="sidebar-link-text">

                                {item.name}

                            </span>

                        </NavLink>

                    )
                )}

            </nav>


            {/* =================================================
                BOTTOM USER SECTION
            ================================================= */}

            <div className="sidebar-bottom">


                {/* =================================================
                    USER PROFILE
                ================================================= */}

                <div className="admin-profile">

                    <div className="admin-avatar">

                        {avatarLetter}

                    </div>


                    <div className="admin-info">

                        <div className="admin-name">

                            {fullName}

                        </div>


                        <div className="admin-role">

                            {role}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACTING ROLE
                ================================================= */}

                {normalizedRoles.length > 0 && (

                    <div className="acting-role-wrapper">

                        <div className="acting-role-label">

                            Acting role

                        </div>


                        <select
                            className="acting-role-select"
                            value={
                                selectedRoleId
                            }
                            onChange={
                                handleRoleChange
                            }
                            disabled={
                                switchingRole
                            }
                        >

                            {normalizedRoles.map(
                                (roleItem) => (

                                    <option
                                        key={
                                            roleItem.id
                                        }
                                        value={
                                            roleItem.id
                                        }
                                    >

                                        {
                                            roleItem.name
                                        }

                                    </option>

                                )
                            )}

                        </select>


                    </div>

                )}


                {/* =================================================
                    SIGN OUT
                ================================================= */}

                <button
                    className="signout-btn"
                    onClick={
                        handleSignOut
                    }
                >

                    <span className="signout-icon">

                        ◉

                    </span>


                    <span className="signout-text">

                        Sign out

                    </span>

                </button>


            </div>


        </aside>

    );

}


export default Sidebar;