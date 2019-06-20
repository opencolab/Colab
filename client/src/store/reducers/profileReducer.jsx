import {
    CONFIRM_PASSWORD,
    EMAIL,
    FIRST_NAME,
    IMAGE,
    LAST_NAME,
    NEW_PASSWORD,
    OLD_PASSWORD,
    PROFILE_RETRIEVAL_ERROR,
    PROFILE_RETRIEVED,
    PROFILE_UPDATE_ERROR,
    PROFILE_UPDATED
} from "../data/mapping/user";

const initState = {profile: null};

const profileReducer = (state = initState, action) => {
    switch (action.type) {
        case PROFILE_UPDATED:
            return {...state, profile: null};
        case PROFILE_UPDATE_ERROR:
            return {...state, error: "ERROR"};
        case PROFILE_RETRIEVED:
            return {...state, profile: action.payload};
        case PROFILE_RETRIEVAL_ERROR:
            return {...state, profileError: action.payload};
        case FIRST_NAME:
            return {...state, profile: {...state.profile, [FIRST_NAME]: action.value}};
        case LAST_NAME:
            return {...state, profile: {...state.profile, [LAST_NAME]: action.value}};
        case OLD_PASSWORD:
            return {...state, profile: {...state.profile, [OLD_PASSWORD]: action.value}};
        case NEW_PASSWORD:
            return {...state, profile: {...state.profile, [NEW_PASSWORD]: action.value}};
        case CONFIRM_PASSWORD:
            return {...state, profile: {...state.profile, [CONFIRM_PASSWORD]: action.value}};
        case EMAIL:
            return {...state, profile: {...state.profile, [EMAIL]: action.value}};
        case IMAGE:
            return {...state, profile: {...state.profile, [IMAGE]: action.value}};
        default:
            return state;
    }
};

export default profileReducer;