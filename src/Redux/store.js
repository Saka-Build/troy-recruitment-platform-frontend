import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import employeeReducer from "./Slice/employeeSlice";
import endClientReducer from "./Slice/endClientSlice";
import clientReducer from "./Slice/clientSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeeReducer,
        endClients: endClientReducer,
        clients: clientReducer,
    },
});

export default store;