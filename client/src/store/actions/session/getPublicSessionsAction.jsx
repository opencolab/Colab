import axios from "axios";

import {GET_PUBLIC_SESSIONS} from "../../data/mapping/serverURLS";
import {PUBLIC_SESSIONS_RETRIEVED} from "../../data/mapping/session";

export const getPublicSessionsAction = () => {
    return (dispatch) => {
        axios.get(
            GET_PUBLIC_SESSIONS,
            {headers: {'Authorization': "bearer " + localStorage.getItem('user')}}
        )
            .then((res) => dispatch({type: PUBLIC_SESSIONS_RETRIEVED, payload: res.data.sessions}))
            .catch(() => console.log("public sessions error"))
    };

};