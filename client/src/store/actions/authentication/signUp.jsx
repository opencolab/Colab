import axios from "axios/index";

import {USERNAME} from "../../data/mapping/user";
import {SIGN_UP} from "../../data/mapping/api";
import {REGISTERED, REGISTRATION_ERROR} from "../../data/mapping/authentication";

export const signUp = (signUpData, callback) => {
    return (dispatch) => {
        console.log(signUpData);
        axios.post(SIGN_UP, {user: signUpData})
            .then((res) => {
                localStorage.setItem(USERNAME, signUpData.username);
                localStorage.setItem('user', res.data.token);
                dispatch({type: REGISTERED});
            })
            .then(() => callback())
            .catch((error) => dispatch({type: REGISTRATION_ERROR, payload: error.response.data.error}))
    }
};