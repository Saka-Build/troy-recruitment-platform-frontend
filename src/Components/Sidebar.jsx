import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "▧",
        },
        {
            name: "Pipeline",
            path: "/dashboard/pipeline",
            icon: "▤",
        },
        {
            name: "Candidates",
            path: "/dashboard/candidates",
            icon: "◉",
        },
        {
            name: "Master DB",
            path: "/dashboard/master-db",
            icon: "▥",
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

    const handleSignOut = () => {
        // Remove login status
        localStorage.removeItem("isLoggedIn");

        // Redirect to login page
        navigate("/", { replace: true });
    };

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
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom user section */}
            <div className="sidebar-bottom">

                <div className="admin-profile">
                    <div className="admin-avatar">
                        A
                    </div>

                    <div>
                        <div className="admin-name">
                            Admin
                        </div>

                        <div className="admin-role">
                            Super Admin
                        </div>
                    </div>
                </div>

                {/* Sign Out */}
                <button
                    className="signout-btn"
                    onClick={handleSignOut}
                >
                    <span>◉</span>
                    Sign out
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;