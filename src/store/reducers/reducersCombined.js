
import { combineReducers } from 'redux';
import AgentReducer from './AgentReducer';
import ChatReducer from './ChatReducer';
import MessagesReducer from './MessagesReducer';

export default combineReducers({
    chats: ChatReducer,
    messages: MessagesReducer,
    agent: AgentReducer
});