import {SESSION_CONNECTED_USERS} from "../data/mapping/session";

const initState = {
    usersFields: {
        [SESSION_CONNECTED_USERS]: [],
        id: 'id',
        parentID: 'pid',
        text: 'name',
        hasChildren: 'hasChild'
    }
};

const connectedSession = (state = initState ,action)=>{

    // REVIEW: switch statement only a single non-default clause
    switch (action.type) {
        case SESSION_CONNECTED_USERS:
            return { ...state,  usersFields: {...state.usersFields,  [SESSION_CONNECTED_USERS]: action.payload } };
        default:
            return state;
    }
};

export default connectedSession;