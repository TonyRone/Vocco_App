import { setNotificationId } from '../actions';
import { SETUSER, SETVOICESTATE, SETSOCKETINSTANCE, SETREFRESHSTATE, SETNOTIFICATIONID } from '../constants';
const initialState = {
    user: null,
    voiceState: 0,
    socketInstance:null,
    refreshState:false,
    notificationId:null
};
const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case SETUSER:
            return {
                ...state,
                user:action.payload
            };
        case SETVOICESTATE:
            return {
                ...state,
                voiceState:action.payload
            };
        case SETSOCKETINSTANCE:
            return {
                ...state,
                socketInstance:action.payload
            };
        case SETREFRESHSTATE:
            return {
                ...state,
                refreshState:action.payload
            };
        case SETNOTIFICATIONID:
            return {
                ...state,
                notificationId:action.payload
            };
        default:
            return state;
    }
}
export default userReducer;