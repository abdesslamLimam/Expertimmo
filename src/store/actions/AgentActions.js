import { api } from "../../constants/api_config";
import ACTIONS from "./ACTIONS"
export const refreshAgent = (token) => {
    console.log("refresh agent")
    return function (dispatch) {
        //dispatch(setChats([]))
        refreshAgentAPI(token)
                .then(response => response.json())
                .then(result => {
                    //console.log("userrrr",result)
                    if(result?.data?.data) {
                        dispatch(setAgent(result?.data?.data))
                    }
                })
                .catch(error => console.log('error', error));
    }
}

export const setAgent = (agent) => {
    return {
        type: ACTIONS.SET_AGENT,
        payload: agent
    }
}


// API
refreshAgentAPI = (token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
   return fetch(`${api.url}users/Me`, requestOptions)
      

}
