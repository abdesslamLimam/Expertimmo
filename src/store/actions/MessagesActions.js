import ACTIONS from "./ACTIONS"
import { api } from "../../constants/api_config";

export const refreshMessages = (token, UserId) => {
    return function (dispatch) {
        refreshMessagesAPI(token, UserId)
            .then(response => response.json())
            .then(result => {
                if (result?.conversation) {
                    dispatch(setMessages(result.conversation))
                }
                // else {
                //     dispatch(setMessages([]))
                // }
            })
            .catch(error => console.log('error', error));

    }
}
export const sendMessage = (token, UserId, message, senderName, recieverNotifID) => {
    return function (dispatch) {
        sendMessageAPI(token, UserId, message)
            .then(response => response.json())
            .then(result => {
                if (result?.message == "sent") {
                    dispatch(refreshMessages(token, UserId))
                    sendNotif(token, senderName, recieverNotifID, message)
                }
            })
            .catch(error => console.log('error', error));

    }
}
export const setMessages = (messages) => {
    return {
        type: ACTIONS.SET_MESSAGES,
        payload: messages
    }
}
// export const addMessage = (message,token) => {
//     return {
//         type: ACTIONS.ADD_MESSAGE,
//         payload: {token,message}
//     }
// }



// API
refreshMessagesAPI = (token, UserId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return fetch(`${api.url}chats/GetMessages/${UserId}`, requestOptions)
}

sendMessageAPI = (token, userId, message) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "message": message
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(`${api.url}chats/sendMessage/${userId}`, requestOptions)

}

sendNotif = (token, senderName, recieverNotifID, message) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "title": "Message",
  "body": senderName + ": " + message,
  "recieverID": recieverNotifID
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`${api.url}chats/sendNotification`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}