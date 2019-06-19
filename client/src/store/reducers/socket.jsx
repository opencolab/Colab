import {CONNECT_SOCKET, DISCONNECT_SOCKET, SOCKET} from "../data/mapping/socket";
import io from "socket.io-client";

const initState = {
    [SOCKET]: null
};

const socket = (state = initState, action) => {
    switch (action.type) {
        case CONNECT_SOCKET:
            let socket = io.connect("/", {query: {token: localStorage.getItem('user')}});
            return {...state, [SOCKET]: socket};
        case DISCONNECT_SOCKET:
            return {...state, [SOCKET]: state[SOCKET].disconnect()};
        default:
            return state;
    }
};

export default socket;