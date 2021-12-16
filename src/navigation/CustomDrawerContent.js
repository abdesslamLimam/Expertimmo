// import {
//     DrawerContentScrollView,
//     DrawerItem,
//     DrawerItemList,
//   } from '@react-navigation/drawer';
    
import React, { useEffect, useState } from 'react'
import {Text, Dimensions, Image, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native'
import { scale } from 'react-native-size-matters';
import { Images } from '../constants/Images';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Colors } from '../constants/Colors';
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import { useDispatch } from 'react-redux';
import { setAgent } from '../store/actions/AgentActions';
import { useSelector } from 'react-redux';

export default function CustomDrawerContent(props) {
  const {setToken, token, setCurrentUser, setIsWorking} = useAppContext()
  const dispatch = useDispatch()
  const agent = useSelector(state=>state.agent)
  useEffect(()=>{
    
    var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`${api.url}users/Me`, requestOptions)
  .then(response => response.json())
  .then(result => {
    if(result?.data?.data) {
      dispatch(setAgent(result?.data?.data))
  }
  })
  .catch(error => console.log('error', error));
  },[token])
    return (
      <ImageBackground
      resizeMode="cover"
        source={Images.drawerBackground}
        style={{
          flex:1,
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
          <View
            style={{
              paddingTop: 20,
              alignItems: 'center',
              marginBottom: 20
            }}
          >
              <ImageBackground
              resizeMode="stretch"
              source={Images.avatarBackgroung}
              style={{
                width: 95,
                height: 95,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* <LetterPhoto 
                        width={scale(67)}
                        height={scale(67)}
                        fontSize={scale(30)}
                        name={agent?.name+" "+agent?.prenom}
                    /> */}
                    <Image resizeMode="cover" source={{ uri: `${api.url_photo}User/${agent?.photo}` }} 
                    style={{
                      width:scale(70),
                      height: scale(70),
                      borderRadius: scale(70),
                      
                    }} 
                    />
              </ImageBackground>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  height: scale(50)
                }}
              >
                <Text 
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontFamily: 'nexaregular'
                  }}
                >
                  {agent?.name} {agent?.prenom} 
                </Text>
                <Text 
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontFamily: 'nexaregular'
                  }}
                >
                  {agent?.email}
                </Text>
              </View>
          </View>
          <View
            style={{
              height: height*0.4
            }}
          >
          <ScrollView>
            <TouchableOpacity
            onPress={()=>{props.navigation.navigate('Home')}}
              style={{
                width:scale(250),
                height: scale(40),
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.state.index==0 ? 'rgba(255,255,255,0.3)' : null,
                //elevation:props.state.index==0 ? 1 : null,
              }}
            >
              <View style={{width:scale(30)}}>
                <FontAwesome5 name="chart-pie" size={20} color={Colors.themeColor7} />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  marginLeft:20,
                  fontSize: scale(14),
                  fontFamily: 'nexaregular'
                }}
              >
                Accueil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{props.navigation.navigate('PropertyStack')}}
              style={{
                width:scale(250),
                height: scale(40),
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.state.index==1 ? 'rgba(255,255,255,0.1)' : null,
                //elevation:props.state.index==1 ? 1 : null,
              }}
            >
              <View style={{width:scale(30)}}>
                <FontAwesome5 name="home" size={20} color={Colors.themeColor7} />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  marginLeft:20,
                  fontSize: scale(14),
                  fontFamily: 'nexaregular'
                }}
              >
                Biens
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{props.navigation.navigate('ClientsStack')}}
              style={{
                width:scale(250),
                height: scale(40),
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.state.index==2 ? 'rgba(255,255,255,0.3)' : null,
                //elevation:props.state.index==2 ? 1 : null,
              }}
            >
              <View style={{width:scale(30)}}>
                <FontAwesome5 name="users" size={20} color={Colors.themeColor7} />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  marginLeft:20,
                  fontSize: scale(14),
                  fontFamily: 'nexaregular'
                }}
              >
                Demandes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{props.navigation.navigate('VisitsStack')}}
              style={{
                width:scale(250),
                height: scale(40),
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.state.index==3 ? 'rgba(255,255,255,0.3)' : null,
                //elevation: props.state.index==3 ? 1 : null,
              }}
            >
              <View style={{width:scale(30)}}>
                <FontAwesome5 name="shipping-fast" size={20} color={Colors.themeColor7} />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  marginLeft:20,
                  fontSize: scale(14),
                  fontFamily: 'nexaregular'
                }}
              >
                Visites
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={()=>{props.navigation.navigate('Profil')}}
              style={{
                width:scale(250),
                height: scale(40),
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.state.index==4 ? 'rgba(255,255,255,0.3)' : null,
                elevation: props.state.index==4 ? 1 : null,
              }}
            >
              <View style={{width:scale(30)}}>
                <FontAwesome5 name="user-tie" size={20} color={Colors.themeColor7} />
              </View>
              <Text
                style={{
                  color: Colors.themeColor1,
                  marginLeft:20,
                  fontWeight: 'bold',
                  fontSize: scale(14)
                }}
              >
                Profil
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
            onPress={()=>{props.navigation.navigate('TasksStack')}}
              style={{
                width:scale(250),
                height: scale(40),
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.state.index==5 ? 'rgba(255,255,255,0.3)' : null,
                //elevation: props.state.index==5 ? 1 : null,
              }}
            >
              <View style={{width:scale(30)}}>
                <FontAwesome5 name="check" size={20} color={Colors.themeColor7} />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  marginLeft:20,
                  fontSize: scale(14),
                  fontFamily: 'nexaregular',
                }}
              >
                Tâches
              </Text>
            </TouchableOpacity>
          </ScrollView>
          </View>
          {/* <Text
            style={{
              color: Colors.themeColor0,
              paddingBottom:10,
              borderBottomWidth: 1,
              width: scale(240),
              borderColor: Colors.themeColor6,
              marginBottom:scale(5),
              marginLeft:20
            }}
          ></Text> */}
          <TouchableOpacity
            onPress={()=>{
              setToken("")
              setCurrentUser('')
              props.navigation.navigate('Auth')
            }}
              style={{
                width:scale(250),
                height: scale(40),
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{width:scale(30)}}>
                <FontAwesome5 name="sign-out-alt" size={20} color={Colors.themeColor7} />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  marginLeft:20,
                  fontSize: scale(14),
                  fontFamily: 'nexaregular'
                }}
              >
                Se déconnecter
              </Text>
            </TouchableOpacity>
          {/* <DrawerContentScrollView {...props} style={{width:scale(250)}}>
          <DrawerItemList {...props} />
    </DrawerContentScrollView> */}
    <View
      style={{
        position: 'absolute',
        bottom: 10,
        alignItems: 'center'
      }}
    >
      <View
        style={{flexDirection: 'row', alignItems: 'center'}}
      >
      <Text
      style={{
        fontFamily: 'nexaregular',
        fontSize: scale(11),
        color: 'white'
      }}
    >Powered with </Text>
    <Image
    resizeMode='contain'
      source={Images.stars}
      style={{
        width: scale(25),
        height:scale(25),
      }}
    />
    </View>
      <View
        style={{flexDirection: 'row'}}
      >
      <Text
      style={{
        fontFamily: 'nexaregular',
        fontSize: scale(11),
        color: 'white'
      }}
    >By </Text>
    <Text
      style={{
        fontFamily: 'Nexa Bold',
        color: 'white'
      }}
    >
      
      Cube Solutions</Text>
    </View>
      </View>
      
    
    
      </ImageBackground>
    );
  }


const { height, width } = Dimensions.get('screen');
