import axios from "axios";

import {CREATE_SESSION} from "../../data/mapping/serverURLS";
import {SESSION_CREATED} from "../../data/mapping/session";

export const createSessionAction = (session, callback) => {
    return (dispatch) => {
        axios.post(
            CREATE_SESSION,
            {session: session},
            {headers: {'Authorization': "bearer " + localStorage.getItem('user')}}
        )
            .then((res) => dispatch({type: SESSION_CREATED, payload: res.data.session}))
            .then(() => callback())
            .catch(() => console.log("creation error"));
    };

};