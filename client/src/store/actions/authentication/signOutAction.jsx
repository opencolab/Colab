import {HOME_URL} from "../../data/mapping/URL";
import {DISCONNECT_FROM_DEFAULT_SOCKET} from "../../data/mapping/socket";

export const UNAUTHENTICATED = 'unauthenticated_user';

export const signOutAction = (history) => {
    return (dispatch) => {
        localStorage.clear();
        dispatch({type: UNAUTHENTICATED});
        dispatch({type: DISCONNECT_FROM_DEFAULT_SOCKET});
        history.push(HOME_URL);
    };
};