import React, { useEffect } from 'react'
import {
    View,
    Text,
    ImageBackground,
    Image,
    StatusBar,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { Images } from '../constants/Images'
import * as Animatable from "react-native-animatable";
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';


export default function Welcome({ navigation }) {
    
    
      const checkToken = (token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`${api.url}agence/AllAgence`, requestOptions)
        .then(response => response.json())
        .then(result => {
            //console.log(result)
            if (result?.error?.name == "TokenExpiredError"){
                setTimeout(() => {
                    navigation.navigate("Auth")
            }, 4000);
            }
            else {
                setTimeout(() => {
                    navigation.navigate("Drawer")
            }, 4000);
            }
        })
        .catch(error => console.log('error', error));
}
    useEffect(() => {
        //get token from cache
    AsyncStorage.getItem('token').then(token=>{
        if (token) {
          checkToken(token)
        }
        else {
            setTimeout(() => {
                navigation.navigate("Auth")
        }, 4000);
        }
      }).catch(err => console.log(err))
        
            
    }, [])
    return (
        <ImageBackground
            source={Images.backgroundGif}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <StatusBar hidden />
            <Animatable.View
                animation="fadeIn"
                delay={500}
                    style={{
                    }}>
                    <Image source={Images.logo1} resizeMode="contain" style={{width:scale(100), height:scale(70), marginVertical:40}} />
                </Animatable.View>
        </ImageBackground>
    )
}