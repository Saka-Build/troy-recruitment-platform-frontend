
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./Pages/Auth/Login";
// import DashboardLayout from "./Layouts/Layout";
// import Dashboard from "./Pages/Dashboard/Dashboard";
// import Pipeline from "./Pages/Pipeline/Pipeline";

// import "./app.css";
// import Candidates from "./Pages/Candidate/Candidate";
// import JobPage from "./Pages/Jobs/Job";
// import CandidateMasterDB from "./Pages/CandidateMasterDB/CandidateMasterDB";
// import Client from "./Pages/Clients/Clients";
// import Employees from "./Pages/Employees/Employees";
// // Protect dashboard pages
// function ProtectedRoute({ children }) {
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

//     if (!isLoggedIn) {
//         return <Navigate to="/" replace />;
//     }

//     return children;
// }

// function App() {
//     return (
//         <BrowserRouter basename={import.meta.env.BASE_URL}>
//             <Routes>

//                 {/* Login Page */}
//                 <Route path="/" element={<Login />} />

//                 {/* Protected Application */}
//                 <Route
//                     path="/dashboard"
//                     element={
//                         <ProtectedRoute>
//                             <DashboardLayout />
//                         </ProtectedRoute>
//                     }
//                 >
//                     {/* Dashboard */}
//                     <Route index element={<Dashboard />} />

//                     {/* Pipeline */}
//                     <Route path="pipeline" element={<Pipeline />} />
//                     <Route path="candidates" element={<Candidates />} />
//                     <Route
//                         path="master-db"
//                         element={<CandidateMasterDB />}
//                     />
//                     <Route path="jobs" element={<JobPage />} />
//                     <Route
//                         path="/dashboard/clients"
//                         element={<Client />} />
//                     <Route
//                         path="/dashboard/employees"
//                         element={<Employees />}
//                     />

//                 </Route>

//                 {/* Any invalid URL */}
//                 <Route
//                     path="*"
//                     element={<Navigate to="/" replace />}
//                 />

//             </Routes>
//         </BrowserRouter>
//     );
// }

// export default App;


import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import Login from "./Pages/Auth/Login";
import DashboardLayout from "./Layouts/Layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Pipeline from "./Pages/Pipeline/Pipeline";
import Candidates from "./Pages/Candidate/Candidate";
import JobPage from "./Pages/Jobs/Job";
import CandidateMasterDB from "./Pages/CandidateMasterDB/CandidateMasterDB";
import Client from "./Pages/Clients/Clients";
import Employees from "./Pages/Employees/Employees";

import "./App.css";


function ProtectedRoute({ children }) {

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}


function App() {

    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>

            <Routes>

                {/* Login Page */}
                <Route
                    path="/"
                    element={<Login />}
                />


                {/* Protected Application */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* /dashboard */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* /dashboard/pipeline */}
                    <Route
                        path="pipeline"
                        element={<Pipeline />}
                    />

                    {/* /dashboard/candidates */}
                    <Route
                        path="candidates"
                        element={<Candidates />}
                    />

                    {/* /dashboard/master-db */}
                    <Route
                        path="master-db"
                        element={<CandidateMasterDB />}
                    />

                    {/* /dashboard/jobs */}
                    <Route
                        path="jobs"
                        element={<JobPage />}
                    />

                    {/* /dashboard/clients */}
                    <Route
                        path="clients"
                        element={<Client />}
                    />

                    {/* /dashboard/employees */}
                    <Route
                        path="employees"
                        element={<Employees />}
                    />

                </Route>


                {/* Invalid URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;