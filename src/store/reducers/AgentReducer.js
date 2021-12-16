import ACTIONS from "../actions/ACTIONS";

const AgentReducer = (state = [], action) => {
    
        switch (action.type) {
            case ACTIONS.SET_AGENT:
                return action.payload
                break;
            default:
                return state
                break;
        }
    
}
export default AgentReducer
