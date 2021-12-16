import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import * as Animatable from "react-native-animatable";
import Button from '../components/Button';
import GetLocation from 'react-native-get-location'
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import { useDispatch, useSelector } from 'react-redux';
import { refreshChats } from '../store/actions/ChatActions';
import { refreshMessages } from '../store/actions/MessagesActions';
import { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

import socket from '../constants/socket'
import { refreshAgent } from '../store/actions/AgentActions';
import OneSignal from 'react-native-onesignal';

const addTraceReq = (token, lat, lng) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "lat": lat,
    "lng": lng
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`${api.url}trace/addTrace`, requestOptions)
    .then(response => response.text())
    .then(result => {
      //console.log(result)
    })
    .catch(error => console.log('error', error));
}

const addTrace = (token) => {
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      addTraceReq(token, location.latitude, location.longitude)
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })
}

const updateLocation = (token, lat, lng) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "lat": lat + "",
    "lng": lng + ""
  });

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`${api.url}users/updateLagLat`, requestOptions)
    .then(response => response.text())
    .then(result => {
      //console.log(result)
    })
    .catch(error => console.log('error', error));
}
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Home(props) {
  const { token, showAlert } = useAppContext()
  const [modal, setModal] = useState('')
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([])
  const [visits, setVisits] = useState([])
  const [clients, setClients] = useState([])
  const [properties, setProperties] = useState([])
  const agent = useSelector(state => state.agent)
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh()
    //console.log('refreshing')
    wait(2000).then(() => { setRefreshing(false) });
  }, []);
  //   navigator.geolocation.watchPosition(
  //     position => {
  //       const location = JSON.stringify(position);
  // console.log(location)
  //     },
  //     error => alert(error.message),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //   );
  useEffect(() => {

    socket.on('connection', data => {
      //console.log("notif socket : ")


    })
    if (agent) {
      socket.emit('joinRoom', {
        "userID": agent._id,
        "username": agent.name
      })
    }
    socket.on("message", (data) => {
      console.log("new message")
      dispatch(refreshMessages(token, agent._id))
      dispatch(refreshChats(token))
      // showMessage({
      //   message: data?.sender?.usename + " : " + data?.message ,
      //   type: "info",
      // });
    })


  }, [agent])
  useEffect(() => {
    let loop = setInterval(() => {

      if (agent.active) {
        // console.log('loop')
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(location => {
            updateLocation(token, location.latitude, location.longitude)
          })
          .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
          })
      }
    }, 30000)

    return () => { clearInterval(loop) }
  }, [])
  const doTheTrace = () => {
    // update trace
    AsyncStorage.getItem('last_trace').then(date => {
      //console.log("hhhhhhhhhhhh", date)
      if (date) {
        //console.log('date exist in storage')
        let margin = new Date() - new Date(parseInt(date))
        //console.log(margin/1000)
        if (margin > 1000 * 60 * 15) {
          addTrace(token)
          AsyncStorage.setItem('last_trace', new Date().valueOf().toString());
        }
      } else {
        //console.log("date don't exist in storage")

        addTrace(token)
        AsyncStorage.setItem('last_trace', new Date().valueOf().toString());
      }
    }).catch(err => console.log(err))
  }
  doTheTrace()
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      //console.log('refreshing messages')
      dispatch(refreshAgent(token))

    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    getClients()
    getProperties()
    getTasks()
    getVisits()
  }, [token])
  // useEffect(()=>{
  //   dispatch(refreshAgent(token))
  // },[token])
  const refresh = () => {
    getClients()
    getProperties()
    getTasks()
    getVisits()
    dispatch(refreshAgent(token))
  }
  useEffect(() => {
    OneSignal.getDeviceState().then(el => {
      if (agent._id) { read({ "notificationID": el.userId }) }
    });
  }, [agent])
  //marke new contents as read
  const read = (body) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`)
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(body);

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${api.url}users/${agent._id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result)
      })
      .catch(error => console.log('error', error));
  }
  // stop working
  const stop = (token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };
    console.log("stopping ")
    fetch(`${api.url}users/stop`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // if (result?.message == "L'agent a terminer sa journées") {
        //   showAlert({message: "votre journée a ete terminée"})
        //   refresh()
        //   //dispatch(refreshAgent(token))
        // }
        // else 
        //console.log("ress " + result)
        if (result.message) {
          showAlert({ message: result.message })
          dispatch(refreshAgent(token))
        }
        else { console.log("stop", result) }
      })
      .catch(error => console.log('error', error));
  }
  // start working after checking position

  const start = (lat, lng, token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "lat": lat,
      "lng": lng
      // "lat": 36.84572668041,
      // "lng": 10.199250693290715
    });
    //console.log(raw)
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    console.log('fdhdg')
    fetch(`${api.url}users/start`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log("gfgf", result)
        // if (result?.message == "L'agent à commencé sa journées") {
        //   showAlert({message: 'Commencer votre journée'})
        //   //refresh()
        //   dispatch(refreshAgent(token))
        //   setModal('')
        // }
        // else 
        if (result?.message) {
          //console.log(result.message)
          showAlert({ message: result?.message })
          dispatch(refreshAgent(token))
          setModal('')
        }
      })
      .catch(error => console.log('error', error));
  }
  const verifyLocation = (token) => {
    console.log('hhhh')
    setLoading(true)
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        //console.log(result)
        if (result == RESULTS.GRANTED) {
          // …
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(location => {
              console.log(location);
              setLoading(false)
              start(location.latitude, location.longitude, token)
            })
            .catch(error => {
              const { code, message } = error;
              console.warn(code, message);
              setLoading(false)
            })
        }
        else {
          console.log('This feature is not available (on this device / in this context)');
          request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => { })
          setLoading(false)
        }
      })
      .catch((error) => {
        // …
      });
  }

  const getProperties = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${api.url}categorie/ListeCategorieByAgent`, requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result)
        setProperties(result.data)
      })
      .catch(error => console.log('error', error));
  }
  const getClients = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${api.url}client/ListeClientByAgent`, requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result)
        if (result.data) {
          setClients(result.data)
        }
      })
      .catch(error => console.log('error', error));
  }
  const getVisits = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${api.url}visite/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result)
        if (result.data) {
          setVisits(result.data)
        }
      })
      .catch(error => console.log('error', error));
  }
  const getTasks = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${api.url}tache/ListeTacheByAgent/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result)
        if (result.data) {
          setTasks(result.data)
        }
      })
      .catch(error => console.log('error', error));
  }
  return (
    <ImageBackground
      source={Images.homeBackground}
      style={{
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
      }}
    >
      <Button
        disabled
        style={{
          width: width,
          height: scale(50),
          overflow: 'hidden',
          elevation: 10
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.themeColor9, Colors.themeColor9]}
      >
        <View
          style={{
            flexDirection: 'row',
            width: width,
            height: scale(50),
            paddingHorizontal: 10,
            alignItems: 'center',
            elevation: scale(5),
            justifyContent: 'space-between'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.openDrawer()
            }}
          >
            <AntDesign name="menu-fold" size={30} color={Colors.themeColor7} />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.white,
              fontSize: scale(20),
              fontFamily: 'Nexa Light',
            }}
          >
            Accueil
          </Text>
          {/* <TouchableOpacity
          onPress={!agent.active ? ()=>{setModal('1')} : ()=>{stop(token)} }
          style={{
            backgroundColor: agent.active ? Colors.green1 : Colors.grey4,
            width: scale(35),
            height: scale(10),
            borderRadius: scale(5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: agent.active ? 'flex-end' : 'flex-start'
          }}
        >
          <View
            style={{
              backgroundColor: agent.active ? Colors.logo1 : Colors.grey1 ,
              width:scale(20),
              height: scale(20),
              borderRadius: scale(20),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Fontisto name={ agent.active ? "pause" : "play" } size={10} color={Colors.white} />
          </View>
        </TouchableOpacity> */}
          {/* <TouchableOpacity
          onPress={() => { props.navigation.navigate('Chat') }}
        >
          <AntDesign name="inbox" size={30} color={Colors.themeColor6} />
        </TouchableOpacity> */}
          <View></View>
        </View>
      </Button>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />}
      >
        <View
          style={{
            flexDirection: "column",
            width: width,
            marginTop: 20
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: "space-evenly",
              marginBottom: 10
            }}
          >
            <Animatable.View
              animation="bounceIn"
              delay={100}
            >
              <Button
                style={{
                  width: width * 0.45,
                  height: height * 0.33,
                  borderRadius: scale(5),
                  overflow: 'hidden'
                }}
                // start={{ x: 0, y: 1 }}
                // end={{ x: 1, y: 1 }}
                colors={['rgba(148, 185, 206,0.6)', 'rgba(148, 185, 206,0.6)']}
                onPress={() => {
                  read({ "bienNotif": false })
                  props.navigation.navigate('PropertyStack')
                }}
              >
                {agent?.bienNotif && <View
                  style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderRadius: 30,
                    backgroundColor: Colors.themeColor7,
                    elevation: 0,
                    left: 7,
                    top: 7,
                    borderWidth: 2,
                    borderColor: 'white'
                  }}
                ></View>}

                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 20
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(20),
                      textAlign: 'center',
                      fontFamily: 'Nexa Light',
                    }}
                  >Biens</Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(40),
                      fontFamily: 'Code Pro W01 Light Lowercase',
                    }}
                  >{properties?.length}</Text>
                  <Image source={Images.b11} style={{ width: scale(60), height: scale(70), resizeMode: "contain" }} />
                </View>
              </Button>
            </Animatable.View>

            <Animatable.View
              animation="bounceIn"
              delay={200}
            >
              <Button
                style={{
                  width: width * 0.45,
                  height: height * 0.26,
                  borderRadius: scale(10),
                  overflow: 'hidden'
                }}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(35, 130, 158,0.6)', 'rgba(35, 130, 158,0.6)']}
                onPress={() => {
                  read({ "clientNotif": false })
                  props.navigation.navigate('ClientsStack')
                }}
              >

                {agent?.clientNotif && <View
                  style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderRadius: 30,
                    backgroundColor: Colors.themeColor7,
                    elevation: 0,
                    left: 7,
                    top: 7,
                    borderWidth: 2,
                    borderColor: 'white'
                  }}
                ></View>}
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(20),
                      textAlign: 'center',
                      fontFamily: 'Nexa Light',
                    }}
                  >Demandes</Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(40),
                      fontFamily: 'Code Pro W01 Light Lowercase',
                    }}
                  >{clients?.length}</Text>

                  <Image source={Images.b22} style={{ width: scale(70), height: scale(70), resizeMode: "contain" }} />
                </View>
              </Button>
            </Animatable.View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: "space-evenly",
              marginBottom: 10
            }}
          >
            <Animatable.View
              animation="bounceIn"
              delay={200}
            >
              <Button
                style={{
                  width: width * 0.45,
                  height: height * 0.26,
                  borderRadius: scale(10),
                  overflow: 'hidden'
                }}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(7, 78, 101,0.6)', 'rgba(7, 78, 101,0.6)']}
                onPress={() => {
                  read({ "taskNotif": false })
                  props.navigation.navigate('TasksStack')
                }}
              >
                {agent?.taskNotif && <View
                  style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderRadius: 30,
                    backgroundColor: Colors.themeColor7,
                    elevation: 0,
                    left: 7,
                    top: 7,
                    borderWidth: 2,
                    borderColor: 'white'
                  }}
                ></View>}
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 15
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(20),
                      textAlign: 'center',
                      fontFamily: 'Nexa Light',
                    }}
                  >Tâches</Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(40),
                      fontFamily: 'Code Pro W01 Light Lowercase',
                    }}
                  >{tasks?.length}</Text>
                  <Image source={Images.b33} style={{ width: scale(70), height: scale(65), resizeMode: "contain" }} />
                </View>
              </Button>
            </Animatable.View>
            <Animatable.View
              animation="bounceIn"
              delay={200}
            >
              <Button
                style={{
                  width: width * 0.45,
                  height: height * 0.33,
                  borderRadius: scale(10),
                  overflow: 'hidden',
                  marginTop: -height * 0.07
                }}
                // start={{ x: 0, y: 1 }}
                // end={{ x: 1, y: 1 }}
                colors={['rgba(3, 57, 71,0.6)', 'rgba(3, 57, 71,0.6)']}
                onPress={() => {
                  read({ "visiteNotif": false })
                  props.navigation.navigate('VisitsStack')
                }}
              >

                {agent?.visiteNotif && <View
                  style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderRadius: 30,
                    backgroundColor: Colors.themeColor7,
                    elevation: 0,
                    left: 7,
                    top: 7,
                    borderWidth: 2,
                    borderColor: 'white'
                  }}
                ></View>}
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 10,
                    paddingTop: 20
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(20),
                      textAlign: 'center',
                      fontFamily: 'Nexa Light',
                    }}
                  >Visites</Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(40),
                      fontFamily: 'Code Pro W01 Light Lowercase',
                    }}
                  >{visits?.length}</Text>
                  <Image source={Images.b44} style={{ width: scale(70), height: scale(70), resizeMode: "contain" }} />
                </View>
              </Button>
            </Animatable.View>
          </View>
          <Animatable.View
            animation="bounceIn"
            delay={200}
            style={{ alignSelf: 'center', marginTop: scale(44) }}
          >
            <Button
              style={{
                width: width * 0.93333,
                height: height * 0.065,
                borderRadius: scale(10),
                overflow: 'hidden',
              }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={['rgba(35, 130, 158,0.6)', 'rgba(35, 130, 158,0.6)']}
              onPress={!agent.active ? () => { setModal('1') } :
                () => {
                  showAlert({
                    message: 'Avez vous fini votre journée?',
                    choice: true,
                    onYes: () => { stop(token) }
                  })
                }}
            >
              <View
                style={{
                  width: width * 0.93333,
                  height: height * 0.065,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly'
                }}
              >
                <Image source={Images.b55} style={{ width: scale(40), height: scale(40), resizeMode: "contain", tintColor: Colors.themeColor6 }} />
                <Text
                  style={{
                    fontSize: scale(12),
                    fontFamily: 'nexaregular',
                    color: Colors.white
                  }}
                >Cliquez pour démarrer votre journée</Text>
                <View

                  style={{
                    backgroundColor: agent.active ? Colors.green1 : Colors.themeColor3,
                    width: scale(35),
                    height: scale(10),
                    borderRadius: scale(5),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: agent.active ? 'flex-end' : 'flex-start'
                  }}
                >
                  <View
                    style={{
                      backgroundColor: agent.active ? Colors.logo1 : Colors.themeColor6,
                      width: scale(20),
                      height: scale(20),
                      borderRadius: scale(20),
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Fontisto name={agent.active ? "pause" : "play"} size={10} color={Colors.white} />
                  </View>
                </View>
              </View>
            </Button>
          </Animatable.View>
          <Animatable.View
            animation="bounceIn"
            delay={200}
            style={{ alignSelf: 'center', marginTop: 10 }}
          >
            <Button
              style={{
                width: width * 0.93333,
                height: height * 0.065,
                borderRadius: scale(10),
                overflow: 'hidden',
              }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={['rgba(3, 57, 71,0.6)', 'rgba(3, 57, 71,0.6)']}
              onPress={() => { props.navigation.navigate('Chat') }}
            >
              <View
                style={{
                  width: width * 0.93333,
                  height: height * 0.065,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 20
                }}
              >
                <Image source={Images.b66} style={{ width: scale(40), height: scale(40), resizeMode: "contain", tintColor: Colors.themeColor6 }} />
                <Text
                  style={{
                    fontSize: scale(12),
                    fontFamily: 'nexaregular',
                    color: Colors.white,
                    paddingLeft: 10
                  }}
                >Cliquez pour aller aux chats</Text>
              </View>
            </Button>
          </Animatable.View>


        </View>
      </ScrollView>
      {modal != '' && <TouchableOpacity
        activeOpacity={1}
        onPress={() => { setModal('') }}
        style={{
          position: 'absolute',
          width: width,
          height: height,
          backgroundColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animatable.View
          animation="bounceIn"
          delay={100}
          style={{
            width: width * 0.9,
            height: scale(140),
            backgroundColor: Colors.themeColor0,
            borderRadius: scale(10),
            elevation: scale(5),
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-evenly'
            }}
            activeOpacity={1}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: scale(14),
                width: scale(200),
                fontFamily: 'nexaregular',
                color: Colors.white
              }}
            >Activer votre GPS et cliquer pour démarrer votre journée</Text>
            <Button
              onPress={() => { verifyLocation(token) }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={[Colors.themeColor9, Colors.themeColor10]}
              style={{
                width: scale(100),
                height: scale(35),
                borderRadius: scale(5),
                elevation: scale(5),
                overflow: 'hidden',
              }}
            >
              {loading ? <ActivityIndicator size="large" color="white" />
                : <FontAwesome5 name="map-marked-alt" size={25} color={Colors.white} />}

            </Button>
          </TouchableOpacity>
        </Animatable.View>
      </TouchableOpacity>}
    </ImageBackground>
  );
}

const { height, width } = Dimensions.get('screen');