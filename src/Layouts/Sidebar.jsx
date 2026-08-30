import { useEffect, useMemo, useState,} from "react";
import { NavLink, useNavigate,} from "react-router-dom";
import { useDispatch, useSelector,} from "react-redux";
import { logoutUser, setActiveRole,} from "../Redux/Slice/authSlice";
import { switchRole,} from "../Redux/Slice/roleSlice";
import { FiGrid, FiGitBranch, FiUsers, FiBriefcase, FiLayers, FiUserCheck, FiBarChart2, FiShield,} from "react-icons/fi";

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user,activeRole,roles = [],} = useSelector((state) =>    state.auth || {});
    const [selectedRoleId,setSelectedRoleId,] = useState(activeRole?.id || "");
    const [switchingRole,setSwitchingRole,] = useState(false);

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <FiGrid />,},
        { name: "Recruitment Workflow", path: "/dashboard/recruitment-Workflow", icon: <FiGitBranch />,},
        { name: "Candidates", path: "/dashboard/candidates", icon: <FiUsers />,},
        { name: "Jobs", path: "/dashboard/jobs", icon: <FiBriefcase />,},
        { name: "Clients", path: "/dashboard/clients", icon: <FiLayers />,},
        { name: "Employees", path: "/dashboard/employees", icon: <FiUserCheck />,},
        { name: "Roles", path: "/dashboard/roles", icon: <FiShield />,},
        { name: "Reports", path: "/dashboard/reports", icon: <FiBarChart2 />,},    
    ];

    const normalizedRoles =
        useMemo(() => {

            return (roles || []).map((roleItem) => {
                    const id = roleItem?.id || roleItem?.roleId || roleItem?.role?.id;
                    const name = roleItem?.name || roleItem?.roleName || roleItem?.role?.name;

                    if (!id || !name) { return null;}
                    return { id, name,};
                }).filter(Boolean);
        }, [roles,]);

    useEffect(() => {
        if (activeRole?.id) {
            setSelectedRoleId(activeRole.id);
        }
    }, [activeRole?.id,]);

    const currentRole = normalizedRoles.find((roleItem) => String(roleItem.id) === String(selectedRoleId));
    const currentRoleName = activeRole?.id === selectedRoleId ? activeRole?.name : currentRole?.name;
    const role = currentRoleName || activeRole?.name || user?.role || "";

    const handleRoleChange =
        async (event) => {
            const newRoleId = event.target.value;

            if ( !newRoleId || newRoleId === selectedRoleId) {
                return;
            }

            const previousRoleId = selectedRoleId;
            const selectedRole = normalizedRoles.find( (roleItem) => String(roleItem.id) === String(newRoleId));

            try {
                setSwitchingRole(true);
                const response = await dispatch(switchRole(newRoleId) ).unwrap();
                console.log( "Switch role response:", response);

                const newAccessToken = response?.accessToken || response?.data?.accessToken;
                const newRefreshToken = response?.refreshToken || response?.data?.refreshToken;
                const newActiveRole = response?.activeRole || response?.data?.activeRole || selectedRole;

                if (newAccessToken) {
                    localStorage.setItem("accessToken",newAccessToken);
                }

                if (newRefreshToken) {
                    localStorage.setItem( "refreshToken", newRefreshToken);
                }

                if (newActiveRole) {
                    dispatch(setActiveRole(newActiveRole));
                }

                setSelectedRoleId(newRoleId);
            } catch (error) {
                console.error("Role switch failed:",error);
                setSelectedRoleId(previousRoleId);
            } finally {setSwitchingRole(false);}
        };

    const handleSignOut =
        async () => {
            try {
                await dispatch(logoutUser()).unwrap();
            } catch (error) {
                console.error("Logout error:",error);
            }
            navigate("/",{replace: true,});
        };

    const fullName = user?.fullName || "User";
    const avatarLetter = fullName.charAt(0).toUpperCase();

    return (

        <aside className="sidebar">

            <div
                className="sidebar-logo"
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
            >
                <img
                    src="/Troylogo1.png"
                    alt="Troy Consultancy"
                    className="troy-logo-image"
                />
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(
                    (item) => (
                        <NavLink key={item.name} to= {item.path} end= {item.path ==="/dashboard" } 
                                className={({isActive }) =>`sidebar-link ${isActive ?"active": ""}` }
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-link-text">{item.name}</span>
                        </NavLink>
                    )
                )}
            </nav>

            <div className="sidebar-bottom">
                <div className="admin-profile">
                    <div className="admin-avatar">{avatarLetter}</div>

                    <div className="admin-info">
                        <div className="admin-name">{fullName} </div>
                        <div className="admin-role">{role} </div>
                    </div>
                </div>

                {normalizedRoles.length > 0 && (
                    <div className="acting-role-wrapper">
                        <div className="acting-role-label">Acting role</div>
                        <select
                            className="acting-role-select"
                            value={ selectedRoleId}
                            onChange={ handleRoleChange}
                            disabled={ switchingRole}
                        >
                            {normalizedRoles.map( (roleItem) => (
                                    <option key={roleItem.id} value={roleItem.id}>
                                        {roleItem.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}

                <button className="signout-btn" onClick={ handleSignOut }>
                    <span className="signout-icon">◉</span>
                    <span className="signout-text">Sign out</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;