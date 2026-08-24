import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get logged-in user from Redux
    const user = useSelector((state) => state.auth?.user);

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "▧",
        },
        {
            name: "Recruitment Workflow",
            path: "/dashboard/recruitment-Workflow",
            icon: "▤",
        },
        {
            name: "Candidates",
            path: "/dashboard/candidates",
            icon: "◉",
        },
        {
            name: "Jobs",
            path: "/dashboard/jobs",
            icon: "▦",
        },
        {
            name: "Clients",
            path: "/dashboard/clients",
            icon: "▣",
        },
        {
            name: "Employees",
            path: "/dashboard/employees",
            icon: "♟",
        },
        {
            name: "Reports",
            path: "/dashboard/reports",
            icon: "▥",
        },
    ];

    const handleSignOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
        } catch (error) {
            console.error("Logout error:", error);
        }

        navigate("/", { replace: true });
    };

    // Logged-in user information
    const fullName = user?.fullName || "User";
    const designation = user?.designation || "User";
    const role = user?.role || "";

    // First letter for avatar
    const avatarLetter = fullName.charAt(0).toUpperCase();

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <img
                    src="/Troylogo1.png"
                    alt="Troy Consultancy"
                    className="troy-logo-image"
                />
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === "/dashboard"}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span className="sidebar-link-text">
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom user section */}
            <div className="sidebar-bottom">
                <div className="admin-profile">
                    <div className="admin-avatar">
                        {avatarLetter}
                    </div>

                    <div className="admin-info">
                        <div className="admin-name">
                            {fullName}
                        </div>

                        {/* <div className="admin-role">
                            {designation}
                        </div> */}
                        <div className="admin-role">
                            {role}
                        </div>
                    </div>
                </div>

                <button
                    className="signout-btn"
                    onClick={handleSignOut}
                >
                    <span className="signout-icon">◉</span>

                    <span className="signout-text">
                        Sign out
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;