import React from "react";
import { useNavigate } from "react-router-dom";
import "./Common.css";

function PageNotFound() {
    const navigate = useNavigate();

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const handleGoBack = () => {
        if (isLoggedIn) {
            navigate("/dashboard", { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="page-not-found">

            <div className="page-not-found-card">

                <div className="page-not-found-code">
                    404
                </div>

                <h1>
                    Page Not Found
                </h1>

                <p>
                    The page you are looking for does not exist
                    or may have been moved.
                </p>

                <button
                    className="page-not-found-btn"
                    onClick={handleGoBack}
                >
                    {isLoggedIn
                        ? "← Back to Dashboard"
                        : "← Back to Login"}
                </button>

            </div>

        </div>
    );
}

export default PageNotFound;