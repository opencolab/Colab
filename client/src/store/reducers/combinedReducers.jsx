import {combineReducers} from "redux";

import authReducer from "./authReducer";
import sessionReducer from "./sessionReducer";
import profileReducer from "./profileReducer";
import formReducer from "./formReducer";
import socket from "./socketReducer";
import connectedSession from "./connectedSession";


const combinedReducers = combineReducers({
        auth: authReducer,
        sessionStorage: sessionReducer,
        profile: profileReducer,
        forms: formReducer,
        socket: socket,
        connectedSession: connectedSession
    }
);

export default combinedReducers;