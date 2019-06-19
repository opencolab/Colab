import {
    MY_SESSIONS,
    MY_SESSIONS_RETRIEVED,
    PUBLIC_SESSIONS,
    PUBLIC_SESSIONS_RETRIEVED,
    SESSION,
    SESSION_CREATED
} from "../data/mapping/session";

const initState = {
    [SESSION]: null,
    [PUBLIC_SESSIONS]: null,
    [MY_SESSIONS]: null,
};

const session = (state = initState, action) => {
    switch (action.type) {
        case SESSION_CREATED:
            return {...state, [SESSION]: action.payload};
        case PUBLIC_SESSIONS_RETRIEVED:
            return {...state, [PUBLIC_SESSIONS]: action.payload};
        case MY_SESSIONS_RETRIEVED:
            return {...state, [MY_SESSIONS]: action.payload};
        default:
            return state;
    }
};

export default session;