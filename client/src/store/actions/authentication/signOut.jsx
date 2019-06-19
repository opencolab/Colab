import {HOME_URL} from "../../data/mapping/url";
import {DISCONNECT_SOCKET} from "../../data/mapping/socket";

export const UNAUTHENTICATED = 'unauthenticated_user';

export const signOut = (history) => {
    return (dispatch) => {
        localStorage.clear();
        dispatch({type: UNAUTHENTICATED});
        dispatch({type: DISCONNECT_SOCKET});
        history.push(HOME_URL);
    };
};