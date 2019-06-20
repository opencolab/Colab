import io from "socket.io-client";

import {
    CONNECT_TO_DEFAULT_SOCKET,
    CONNECT_TO_SESSION_SOCKET,
    DEFAULT_SOCKET,
    DISCONNECT_FROM_DEFAULT_SOCKET,
    DISCONNECT_FROM_SESSION_SOCKET,
    SESSION_SOCKET
} from "../data/mapping/socket";

const initState = {
    [DEFAULT_SOCKET]: null,
    [SESSION_SOCKET]: null
};

const socketReducer = (state = initState, action) => {
    let socket;

    switch (action.type) {
        case CONNECT_TO_DEFAULT_SOCKET:
            socket = io.connect("/", {query: {token: localStorage.getItem('user')}});
            return {...state, [DEFAULT_SOCKET]: socket};
        case DISCONNECT_FROM_DEFAULT_SOCKET:
            return {...state, [DEFAULT_SOCKET]: state[DEFAULT_SOCKET].disconnect()};
        case CONNECT_TO_SESSION_SOCKET:
            socket = io.connect("/" + action.payload, {query: {token: localStorage.getItem('user')}});
            return {...state, [SESSION_SOCKET]: socket};
        case DISCONNECT_FROM_SESSION_SOCKET:
            return {...state, [SESSION_SOCKET]: state[SESSION_SOCKET].disconnect()};
        default:
            return state;
    }
};

export default socketReducer;