import ACTIONS from "../actions/ACTIONS";

const MessagesReducer = (state = [], action) => {
    
        switch (action.type) {
            case ACTIONS.SET_MESSAGES:
                return action.payload
                break;
            default:
                return state
                break;
        }
    
}
export default MessagesReducer


