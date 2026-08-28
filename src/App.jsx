
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
//         <BrowserRouter>
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


import PageNotFound from "./Components/PageNotFound";
import JobDetails from "./Pages/Jobs/JobDetails";
import NewJob from "./Pages/Jobs/NewJob";
import CandidateDetails from "./Pages/Candidate/CandidateDetails";
import RecruitmentWorkflow from "./Pages/RecruitmentWorkflow/RecruitmentWorkflow";
import RecruitmentWorkflowDetails from "./Pages/RecruitmentWorkflow/RecruitmentWorkflowDetails";
import JobRoleReport from "./Pages/Reports/JobRoleReport";

import "./app.css";


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
        <BrowserRouter>

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
                    {/* <Route
                        path="pipeline"
                        element={<Pipeline />}
                    /> */}
                    {/* /dashboard/RecruitmentWorkflow */}
                    <Route path="recruitment-Workflow" element={<RecruitmentWorkflow />} />
                    <Route path="recruitment-workflow/:stage" element={<RecruitmentWorkflowDetails />} />

                    {/* /dashboard/candidates */}
                    {/* <Route
                        path="candidates"
                        element={<Candidates />}
                    /> */}
                    <Route path="candidates" element={<Candidates />} />
                    <Route path="candidates/:id" element={<CandidateDetails />} />

                    {/* /dashboard/master-db */}
                    {/* <Route
                        path="master-db"
                        element={<CandidateMasterDB />}
                    /> */}

                    {/* /dashboard/jobs */}
                    {/* <Route
                        path="jobs"
                        element={<JobPage />}
                    /> */}
                    <Route path="jobs" element={<JobPage />} />
                    <Route path="jobs/:id" element={<JobDetails />} />
                    <Route path="jobs/new" element={<NewJob />} />

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

                    {/* <Route
                        path="/dashboard/reports"
                        element={<JobRoleReport />}
                    /> */}

                </Route>


                {/* Invalid URL */}
                {/* <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                /> */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;