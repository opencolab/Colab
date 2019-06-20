import {UNAUTHENTICATED} from "../actions/authentication/signOutAction";

import {
    AUTHENTICATED,
    AUTHENTICATION_ERROR,
    CLEAR_SIGN_IN_ERROR,
    CLEAR_SIGN_UP_ERROR,
    REGISTERED,
    REGISTRATION_ERROR,
} from "../data/mapping/auth";

const initState = {authenticated: false, [AUTHENTICATION_ERROR]: "", [REGISTRATION_ERROR]: ""};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case AUTHENTICATED:
            return ({...state, authenticated: true});
        case UNAUTHENTICATED:
            return ({...state, authenticated: false,});
        case AUTHENTICATION_ERROR:
            return ({...state, [AUTHENTICATION_ERROR]: action.payload});
        case REGISTERED:
            return ({...state, authenticated: true});
        case REGISTRATION_ERROR:
            return ({...state, [REGISTRATION_ERROR]: action.payload});
        case CLEAR_SIGN_IN_ERROR:
            return ({...state, [AUTHENTICATION_ERROR]: ""});
        case CLEAR_SIGN_UP_ERROR:
            return ({...state, [REGISTRATION_ERROR]: ""});
        default:
            return state;
    }
};

export default authReducer;