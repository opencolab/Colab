import {combineReducers} from "redux";

import authReducer from "./authentication";
import session from "./session";
import profile from "./profile";
import form from "./form";
import socket from "./socket";

const combined = combineReducers({
        auth: authReducer,
        sessionStorage: session,
        profile: profile,
        forms: form,
        socket: socket
    }
);

export default combined;