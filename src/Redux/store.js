import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import employeeReducer from "./Slice/employeeSlice";
import endClientReducer from "./Slice/endClientSlice";
import clientReducer from "./Slice/clientSlice";
import jobReducer from './Slice/jobSlice';
import candidateReducer from './Slice/candidateSlice';
import recruitmentWorkflowReducer from "./Slice/recruitmentWorkflowSlice";

import roleReducer from "./Slice/roleSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeeReducer,
        endClients: endClientReducer,
        clients: clientReducer,
        jobs: jobReducer,
        candidate: candidateReducer,
        recruitmentWorkflow: recruitmentWorkflowReducer,

        role: roleReducer,
    },
});

export default store;