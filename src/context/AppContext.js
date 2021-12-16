import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import AlertComponent from '../components/AlertComponent';
import { api } from '../constants/api_config';

//import RNSimData from 'react-native-sim-data';
const AppContext = React.createContext();

const AppContextProvider = props => {

  const [currentUser, _setCurrentUser] = useState('');
  const [token, _setToken ] = useState('');
  const [isWorking, _setIsWorking ] = useState(false);
  const [alertComp, showAlert ] = useState({
    message: '',
    choice: false,
    onYes: ()=>{console.log('Clicked yes')},
    onNo: ()=>{console.log('Clicked no')}
  });
   
  
  

  useEffect(()=>{
    // check token
    // checkToken()
    //get token from cache
    AsyncStorage.getItem('token').then(token=>{
      if (token) {
        _setToken(token)
      }
    }).catch(err => console.log(err))
    //get user from cache
    AsyncStorage.getItem('user').then(user=>{
      if (user) {
        setCurrentUser(user)
      }
    }).catch(err => console.log(err))
    //get status from cache
    AsyncStorage.getItem('isWorking').then(result=>{
      if (result) {
        setCurrentUser(result)
      }
    }).catch(err => console.log(err))
  },[])

  const setToken = (val) => {
    AsyncStorage.setItem('token',val);
    _setToken(val);
  }
  const setCurrentUser = (val) => {
    AsyncStorage.setItem('user',val);
    _setCurrentUser(val);
  }
  const setIsWorking = (val) => {
    AsyncStorage.setItem('isWorking',val);
    _setIsWorking(val);
  }

//   const checkToken = () => {
//     var myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);

//     var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//     };

//     fetch(`${api.url}agence/AllAgence`, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//             if (result?.error?.name == "TokenExpiredError"){
//                 setToken("TokenExpiredError")
//             }
//         })
//         .catch(error => console.log('error', error));
// }
  return (
    <AppContext.Provider
      value={{
        setCurrentUser,
        currentUser,
        setToken,
        token,
        setIsWorking,
        isWorking,
        showAlert
      }}>
      {props.children}
      
      {(alertComp?.message !='') && 
        <AlertComponent 
        hideAction={()=>{showAlert({message:''})}} 
        choice={alertComp.choice}
        message={alertComp.message}
        onYes={alertComp.onYes ? alertComp.onYes : ()=>{console.log('Clicked yes')}}
        onNo={alertComp.onNo ? alertComp.onNo : ()=>{console.log('Clicked no')}}
      />}
      {/* <PickerSelect
        data={data}
        onChange
        multiSelect
        value
      /> */}
    </AppContext.Provider>
  );
};
const useAppContext = () => React.useContext(AppContext);
export {AppContextProvider, useAppContext};

