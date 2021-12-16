import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducersCombined from "./reducers/reducersCombined";


export default store = createStore(reducersCombined, applyMiddleware(thunk))