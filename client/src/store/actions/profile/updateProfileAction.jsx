import axios from "axios";

import {
    EMAIL,
    FIRST_NAME,
    IMAGE,
    LAST_NAME,
    NEW_PASSWORD,
    OLD_PASSWORD,
    PROFILE_UPDATE_ERROR,
    PROFILE_UPDATED
} from "../../data/mapping/user";

import {DASHBOARD_URL} from "../../data/mapping/URL";
import {UPDATE_PROFILE} from "../../data/mapping/serverURLS";

export const updateProfileAction = (profile, history) => {
    return (dispatch) => {
        const data = new FormData();

        data.append(FIRST_NAME, profile[FIRST_NAME]);
        data.append(LAST_NAME, profile[LAST_NAME]);
        data.append(OLD_PASSWORD, profile[OLD_PASSWORD]);
        data.append(NEW_PASSWORD, profile[NEW_PASSWORD]);
        data.append(EMAIL, profile[EMAIL]);
        data.append(IMAGE, profile[IMAGE].file);

        axios.post(UPDATE_PROFILE, data, {headers: {'Authorization': "bearer " + localStorage.getItem('user')}})
            .then(() => dispatch({type: PROFILE_UPDATED}))
            .then(() => history.push(DASHBOARD_URL))
            .catch((error) => {
                    dispatch({type: PROFILE_UPDATE_ERROR, payload: error.response.data.auth})
                }
            )
    }
};