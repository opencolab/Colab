import axios from "axios";

import {IMAGE, PROFILE_RETRIEVAL_ERROR, PROFILE_RETRIEVED, USERNAME} from "../../data/mapping/user";
import {GET_PROFILE_INFO, GET_PROFILE_PIC} from "../../data/mapping/serverURLS";

export const getProfileAction = (callback) => {
    return (dispatch) => {
        axios.get(GET_PROFILE_INFO + localStorage.getItem(USERNAME))
            .then((res) => {
                const user = {
                    ...res.data.user,
                    [IMAGE]: {URL: GET_PROFILE_PIC + localStorage.getItem(USERNAME)}
                };
                dispatch({type: PROFILE_RETRIEVED, payload: user});
            })
            .then(() => { callback() })
            .catch((error) => {
                    dispatch({type: PROFILE_RETRIEVAL_ERROR, payload: error.response.data.auth})
                }
            )
    }
};