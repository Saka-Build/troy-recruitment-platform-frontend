import { BrowserRouter, Routes, Route, Navigate,} from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./Pages/Auth/Login";
import DashboardLayout from "./Layouts/Layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Candidates from "./Pages/Candidate/Candidate";
import JobPage from "./Pages/Jobs/Job";
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
import Roles from "./Pages/RolesPermission/Roles";
import EmployeeDetails from "./Pages/Employees/EmployeeDetails";


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
        <BrowserRouter basename="/ats">

            <Routes>

                {/* Login Page */}
                <Route path="/" element={<Login />}/>

                <Route path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route index element={<Dashboard />}/>
                    <Route path="roles" element={<Roles />} />

                    <Route path="recruitment-Workflow" element={<RecruitmentWorkflow />} />
                    <Route path="recruitment-workflow/:stage" element={<RecruitmentWorkflowDetails />} />

                    <Route path="candidates" element={<Candidates />} />
                    <Route path="candidates/:id" element={<CandidateDetails />} />

                    <Route path="jobs" element={<JobPage />} />
                    <Route path="jobs/:id" element={<JobDetails />} />
                    <Route path="jobs/new" element={<NewJob />} />

                    <Route path="clients" element={<Client />}/>
                    <Route path="employees" element={<Employees />}/>
                    <Route path="employees/:employeeId" element={<EmployeeDetails />}/>

                    <Route path="reports" element={<JobRoleReport />}/>

                </Route>

                <Route path="*" element={<PageNotFound />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;