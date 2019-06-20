import axios from "axios";

import {GET_MY_SESSIONS} from "../../data/mapping/serverURLS";
import {MY_SESSIONS_RETRIEVED} from "../../data/mapping/session";

export const getMySessionsAction = (callback) => {
    return (dispatch) => {
        axios.get(GET_MY_SESSIONS, {headers: {'Authorization': "bearer " + localStorage.getItem('user')}})

        // REVIEW: Unresolved variable sessions
        .then((res) => dispatch({type: MY_SESSIONS_RETRIEVED, payload: res.data.sessions}))
        .then(()=> callback())
        .catch(() => console.log("my sessions error"))
    };

};