import ACTIONS from "./ACTIONS"
import { api } from "../../constants/api_config";

export const refreshChats = (token) => {
    return function (dispatch) {
        //dispatch(setChats([]))
                refreshChatsAPI(token)
                    .then(response => response.json())
                    .then(result => {
                        if (result?.count > 0) {
                            const chats = result?.data
                            dispatch(setChats(chats))
                        }
                    })
                    .catch(error => {
                        console.log('error', error)
                        //dispatch([setChats({error: error})])
                    });
    }
}
export const setChats = (chats) => {
    return {
        type: ACTIONS.SET_CHATS,
        payload: chats
    }
}
export const addMessage = (message,token) => {
    return {
        type: ACTIONS.ADD_MESSAGE,
        payload: {token,message}
    }
}



// API
refreshChatsAPI = (token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(`${api.url}chats/listConversations`, requestOptions)

}