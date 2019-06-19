import axios from "axios/index";

import {USERNAME} from "../../data/mapping/user";
import {SIGN_IN} from "../../data/mapping/api";
import {AUTHENTICATED, AUTHENTICATION_ERROR} from "../../data/mapping/authentication";
import {CONNECT_TO_DEFAULT_SOCKET} from "../../data/mapping/socket";

export const signIn = (signInData, callback) => {
    return (dispatch) => {
        axios.post(SIGN_IN, {user: signInData})
            .then((res) => {
                localStorage.setItem(USERNAME, signInData.username);
                localStorage.setItem('user', res.data.token);
                dispatch({type: AUTHENTICATED});
                dispatch({type: CONNECT_TO_DEFAULT_SOCKET})
            })
            .then(() => {
                    callback();
                }
            )
            .catch((error) => dispatch({type: AUTHENTICATION_ERROR, payload: error.response.data.error}))
    };
};