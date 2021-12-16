import ACTIONS from "../actions/ACTIONS";

const ChatReducer = (state = [], action) => {
    
        switch (action.type) {
            case ACTIONS.SET_CHATS:
                return action.payload
                break;
            default:
                return state
                break;
        }
    
}
export default ChatReducer


