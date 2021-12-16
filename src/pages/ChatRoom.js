import React, { useEffect, useRef, useState } from 'react'
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions, 
    TextInput, 
    FlatList, 
    Image, 
    ScrollView, 
    Platform } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { scale } from 'react-native-size-matters'
import Input from '../components/Input'
import { Images } from '../constants/Images'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import Message from '../components/Message'
import RNFetchBlob from 'rn-fetch-blob'
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from "react-native-animatable";
import socketIOClient from 'socket.io-client';
import { api } from '../constants/api_config'
import { useAppContext } from '../context/AppContext'
import { useDispatch, useSelector } from 'react-redux'
import { refreshMessages, sendMessage, setMessages } from '../store/actions/MessagesActions'

import socket from '../constants/socket'


const audioRecorderPlayer = new AudioRecorderPlayer();

const dirs = RNFetchBlob.fs.dirs;
const path = Platform.select({
    ios: 'hello.m4a',
    android: `${dirs.CacheDir}/hello.mp3`,

});

const ChatRoom = ({ route, navigation }) => {

    const dispatch = useDispatch()
    const messages = useSelector(state => state.messages)
    const agent = useSelector(state=>state.agent)
    const user = route?.params?.user
    const userID = route?.params?.user?._id;
    const username = route?.params?.username;
    //console.log("user",user)
    const { token, currentUser } = useAppContext()
    //const [messages, setMessages] = useState([])
    const [optionsMenu, setOptionsMenu] = useState(false)
    const [inputDisplay, setInputDisplay] = useState('text')
    const [audioRecordDisplay, setAudioRecordDisplay] = useState(false)
    const [startedRecording, setStartedRecording] = useState('no')
    const [sendingPic, setSendingPic] = useState(false)
    const [record, setRecord] = useState({
        recordSecs: 0,
        recordTime: 0
    })
    const [text, setText] = useState('')
    const [file, setFile] = useState({
        fileName: '',
        uri: '',
        type: '',
    })
    // send message +++++++++++++++++++++++++++++++
//     const sendMessage = () => {
        
//         var myHeaders = new Headers();
//         myHeaders.append("Authorization", `Bearer ${token}`);
//         myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify({
//   "message": text
// });

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch(`${api.url}chats/sendMessage/${userID}`, requestOptions)
//   .then(response => response.json())
//   .then(result => {
//       if (result?.message=="sent") {
//           //refresh(userID)
//       }
//   })
//   .catch(error => console.log('error', error));
//     }
// refresh messages ++++++++++++++++++++++++++
//     const refresh = (id) => {
//         var myHeaders = new Headers();
//         myHeaders.append("Authorization", `Bearer ${token}`);
// var requestOptions = {
//   method: 'GET',
//   headers: myHeaders,
//   redirect: 'follow'
// };

// fetch(`${api.url}chats/GetMessages/${id}`, requestOptions)
//   .then(response => response.json())
//   .then(result => {
//       console.log("messages: ",result)
//       if(result.conversation) {
//         setMessages(result.conversation)
//       }
      
//     })
//   .catch(error => console.log('error', error));
//     }
useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log('refreshing messages')
      dispatch(refreshMessages(token,userID))
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

//     useEffect( ()=>{
        
//         //refresh(userID)
//    },[route.params])
//    useEffect( ()=>{
//     setMessages(chat)
    
// },[chat])

    const scrollViewRef = useRef();

    // useEffect(()=>{
    //     const socket = socketIOClient(api.url_SOC);
    //     socket.on('connection', data => {
    //       console.log("notif socket : ")
    //       socket.emit('joinRoom', "sdfsdfsqd")
        
    //     })
    //   },[])
    useEffect(() => {
        //navigation.setParams({ tabBarVisible: false });
        getPermissions()
    }, [])

    const AddMessage = (msg) => {
        let newMessages = messages
        newMessages.push(msg)
        //setMessages(newMessages)
    }
    const stopRecordbtn = async () => {

        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        // setRecord({
        //     recordSecs: 0,
        //     recordTime: record.recordTime
        // });
        //console.log("stopped: ", typeof (result));

    }
    const startRecordbtn = async () => {

        const result = await audioRecorderPlayer.startRecorder(path);
        audioRecorderPlayer.addRecordBackListener((e) => {
            setRecord({
                recordSecs: e.currentPosition,
                recordTime: audioRecorderPlayer.mmss(
                    Math.floor(e.currentPosition),
                ),
            });
            return;
        });
        //console.log("Started: ", result);

    }
    const launchImageLibraryFunction = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                fileData: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                //console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                //console.log('response', JSON.stringify(response));
                setFile(response.assets[0]);
                setSendingPic(true)
            }
        });

    }


    return (
        <View style={{ backgroundColor: "white", width: "100%", height: "100%", flexDirection: 'column' }}>
            <View style={{
                flexDirection: 'row',
                width: width,
                alignItems: 'center',
                borderBottomColor: "grey",
                borderBottomWidth: 0.2,
                backgroundColor: Colors.themeColor9,
                height: scale(50)
            }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                        dispatch(setMessages([]))
                    }}
                    style={{ padding: scale(5), flex: 0.125, justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name='arrowleft' size={34} color="white" />
                </TouchableOpacity>
                <Text style={{
                    fontSize: scale(20),
                    color: 'white',
                    flex: 0.75,
                    paddingLeft: scale(10),
                    fontFamily: 'nexaregular'
                }}>
                    {username}
                </Text>
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('CallPage')}
                    style={{ padding: scale(5), flex: 0.125, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name='video-camera' size={30} color={Colors.blue1} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CallPage')}
                    style={{ padding: scale(5), flex: 0.125, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name='phone' size={30} color={Colors.blue1} />
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                    onPress={() => { setOptionsMenu(true) }}
                    style={{ padding: scale(5), flex: 0.125, justifyContent: 'center', alignItems: 'center' }}>
                    <SimpleLineIcons name='options-vertical' size={30} color={Colors.white} />
                </TouchableOpacity> */}
            </View>
            <View style={{
                flex: 1
            }}>
                {/* <FlatList
                    contentContainerStyle={{ flexDirection: 'column-reverse' }}

                    style={{
                        marginTop: scale(5)
                    }}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                //scrollTo
                /> */}
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                    {messages
                    //.sort(function(a,b){return new Date(a?.createdAt) - new Date(b?.createdAt);})
                        .map((item) => {
                        return <Message key={item?._id} item={item} me={currentUser==item?.sender?._id} />
                    })}
                    {/* <View style={{
                        //width: scale(60),
                        //height: scale(60),
                        backgroundColor: 'orange'
                    }}>
                        <WaveForm
                            style={{
                                flex: 1,
                                margin: 10,
                                backgroundColor: "lightslategray"
                            }}
                            autoPlay={false}
                            source={require('../assets/song1.mp3')}
                            waveFormStyle={{ waveColor: 'red', scrubColor: 'white' }}
                        >
                        </WaveForm>
                    </View> */}
                </ScrollView>
            </View>
            {sendingPic &&
                <View style={{
                    width: width,
                    height: scale(100),
                    elevation: scale(5),
                    backgroundColor: 'rgba(242, 248, 250,1)',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}>
                    <Image
                        source={file.uri != '' ? { uri: file.uri } : null}
                        style={{
                            width: scale(70),
                            height: scale(80),
                            resizeMode: 'stretch',
                            borderWidth: scale(2),
                            borderColor: 'white',
                            borderRadius: scale(20)
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            AddMessage({
                                id: file.uri + '+' + new Date(),
                                sender: "me",
                                type: "photo",
                                data: { uri: file.uri },
                                date: "1 hour ago",
                                photo: Images.use2
                            })
                            setSendingPic(false)
                        }}
                        style={{
                            backgroundColor: Colors.grey4,
                            paddingHorizontal: scale(10),
                            borderRadius: scale(10),
                            paddingVertical: scale(7)
                        }}
                    >
                        <Text>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSendingPic(false)
                            setFile({
                                fileName: '',
                                uri: '',
                                type: '',
                            })
                        }}
                        style={{
                            backgroundColor: Colors.grey4,
                            paddingHorizontal: scale(10),
                            borderRadius: scale(10),
                            paddingVertical: scale(7)
                        }}
                    >
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            }
            <View style={{
                flexDirection: 'row',
                height: scale(50),
                elevation: scale(10),
                backgroundColor: 'white'
            }}>
                {inputDisplay == 'text' ?
                    <>
                    {/* <Animatable.View style={{ flex: 0.18, alignItems: 'center', justifyContent: 'center' }}
                animation="bounceIn"
                delay={100}
            >
                <TouchableOpacity
                onPress={() => {
                    //launchImageLibraryFunction()
                    setInputDisplay('file')
                }}
                            style={{
                                width: scale(35),
                                height: scale(35),
                                borderRadius: scale(40),
                                overflow: 'hidden'
                            }}
                        >
                            <LinearGradient
                            colors={[Colors.red, Colors.purple]}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                                <FontAwesome name='plus' size={20} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                        </Animatable.View> */}
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            style={{
                                flex: 0.8,
                                backgroundColor: 'white',
                                color: 'black',
                                paddingLeft: scale(10),
                                fontSize: scale(16)
                            }}
                            placeholder='Ecrire ici'
                        />
                        {/* <TouchableOpacity
                            onPress={() => { setInputDisplay('audio') }}
                            style={{
                                flex: 0.1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <FontAwesome name='microphone' size={30} color={Colors.grey1} />
                        </TouchableOpacity> */}
                    </>
                    : inputDisplay == 'audio' ?
                    <View
                        style={{
                            flex: 0.8,
                            backgroundColor: 'white',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center'
                        }}
                    >
                        {
                            startedRecording == 'yes' ?
                                <TouchableOpacity
                                    onPress={() => {
                                        setStartedRecording('finished')
                                        stopRecordbtn()
                                    }}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 5
                                    }}
                                >
                                    <FontAwesome name='stop' size={30} color={Colors.red} />
                                </TouchableOpacity>
                                : startedRecording == 'no' ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            setStartedRecording('yes')
                                            startRecordbtn()
                                        }}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 5
                                        }}
                                    >
                                        <FontAwesome name='play' size={30} color={Colors.blue1} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => {
                                            AddMessage({
                                                id: record.recordTime + '1020',
                                                sender: "me",
                                                type: "audio",
                                                data: { uri: `${dirs.CacheDir}/hello.mp3`, type: 'mp3', title: 'hello' },
                                                date: "1 hour ago",
                                                photo: Images.use2
                                            })
                                            setInputDisplay('text')
                                            setStartedRecording('no'),
                                                setRecord({
                                                    recordSecs: 0,
                                                    recordTime: 0,
                                                })
                                        }}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: scale(30),
                                            borderRadius: scale(20)
                                        }}
                                    >
                                        <FontAwesome name='send' size={25} color={Colors.green} />
                                    </TouchableOpacity> 
                                    
                        }
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5,
                                borderWidth: scale(2),
                                height: scale(30),
                                borderRadius: scale(20),
                                width: scale(40),
                                backgroundColor: 'black'
                            }}
                        >
                            <Text style={{
                                color: 'white',
                                fontSize: scale(14)
                            }}>{(record.recordSecs / 1000).toFixed(0)}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setInputDisplay('text')
                                setStartedRecording('no')
                                setRecord({
                                    recordSecs: 0,
                                    recordTime: 0,
                                })
                            }
                            }
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5
                            }}
                        >
                            <FontAwesome name='close' size={30} color={Colors.grey1} />
                        </TouchableOpacity>
                    </View>
                    : <View
                            style={{
                                flex:1,
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                    >
                        <Animatable.View
                animation="bounceIn"
                //  animation="zoomIn"
                delay={100}
            >
                        <TouchableOpacity
                            onPress={()=>{setInputDisplay('text')}}
                            style={{
                                width: scale(35),
                                height: scale(35),
                                borderRadius: scale(40),
                                overflow: 'hidden',
                                elevation: scale(5)
                            }}
                        >
                            <LinearGradient
                            //start={{ x: 0, y: 1 }}
                            //end={{ x: 1, y: 1 }}
                            colors={[Colors.yellow, 'green']}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                                <FontAwesome name='close' size={20} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View
                animation="bounceIn"
                //  animation="zoomIn"
                delay={200}
            >
                        <TouchableOpacity
                            style={{
                                width: scale(35),
                                height: scale(35),
                                borderRadius: scale(40),
                                overflow: 'hidden'
                            }}
                        >
                            <LinearGradient
                            colors={[Colors.bluesky, Colors.purple]}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                                <FontAwesome name='camera-retro' size={20} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View
                animation="bounceIn"
                //  animation="zoomIn"
                delay={300}
            >
                        <TouchableOpacity
                        onPress={() => {
                            launchImageLibraryFunction()
                        }}
                            style={{
                                width: scale(35),
                                height: scale(35),
                                borderRadius: scale(40),
                                overflow: 'hidden'
                            }}
                        >
                            <LinearGradient
                            colors={[Colors.green2, 'aqua']}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                                <FontAwesome name='picture-o' size={20} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View
                animation="bounceIn"
                //  animation="zoomIn"
                delay={400}
            >
                        <TouchableOpacity
                        onPress={() => { setInputDisplay('audio') }}
                            style={{
                                width: scale(35),
                                height: scale(35),
                                borderRadius: scale(40),
                                overflow: 'hidden'
                            }}
                        >
                            <LinearGradient
                            colors={['orange', Colors.red]}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                                <FontAwesome5 name='microphone-alt' size={20} color={Colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                        </Animatable.View>
                    </View>
                }
                <TouchableOpacity
                    onPress={() => {
                        // AddMessage({
                        //     id: new Date().getMilliseconds(),
                        //     sender: "me",
                        //     type: "text",
                        //     data: text,
                        //     date: "1 hour ago",
                        //     photo: Images.use2
                        // })
                        //sendMessage()
                        dispatch(sendMessage(token, userID, text, agent?.name, user?.notificationID))
                        setText('')
                        socket.emit('chat:add', {
                            "senderID": agent._id,
                            "receiverID": userID,
                            "message": text
                        })
                    }}
                    style={{
                        flex: 0.2,
                        borderTopLeftRadius: scale(45),
                        overflow: 'hidden'
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={[Colors.themeColor9, Colors.themeColor10    ]}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <FontAwesome name='send' size={30} color={Colors.white} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            {optionsMenu && <TouchableOpacity
                activeOpacity={0}
                onPress={() => { setOptionsMenu(false) }}
                style={{
                    position: 'absolute',
                    width: width,
                    height: scale(800),
                    top: 0,
                    left: 0
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        right: scale(5),
                        backgroundColor: 'white',
                        marginTop: scale(50),
                        elevation: scale(5),
                        borderRadius: scale(10),
                        borderTopEndRadius: 0,
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ChatSetting', { username: userID })}
                        style={{
                            width: scale(150),
                            height: scale(50),
                            justifyContent: 'center',
                            paddingLeft: scale(10)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: scale(16)
                            }}
                        >
                            Paramètres
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: scale(150),
                            height: scale(50),
                            justifyContent: 'center',
                            paddingLeft: scale(10)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: scale(16)
                            }}
                        >
                            Voir profil
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: scale(150),
                            height: scale(50),
                            justifyContent: 'center',
                            paddingLeft: scale(10)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: scale(16)
                            }}
                        >
                            Effacer discussion
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>}
        </View >
    )
}

// permission
const getPermissions = () => {
    check(PERMISSIONS.ANDROID.RECORD_AUDIO)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    //console.log('This feature is not available (on this device / in this context)');
                    request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.DENIED:
                    //console.log('The permission has not been requested / is denied but requestable');
                    request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.LIMITED:
                    //console.log('The permission is limited: some actions are possible');
                    break;
                case RESULTS.GRANTED:
                    //console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    //console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            // …
        });
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    //console.log('This feature is not available (on this device / in this context)');
                    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.DENIED:
                    //console.log('The permission has not been requested / is denied but requestable');
                    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.LIMITED:
                    //console.log('The permission is limited: some actions are possible');
                    break;
                case RESULTS.GRANTED:
                    //console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    //console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            // …
        });
    check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    //console.log('This feature is not available (on this device / in this context)');
                    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
                        // …
                        console.log(result)
                    });
                    break;
                case RESULTS.DENIED:
                    //console.log('The permission has not been requested / is denied but requestable');
                    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.LIMITED:
                    //console.log('The permission is limited: some actions are possible');
                    break;
                case RESULTS.GRANTED:
                    //console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    //console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            // …
        });
    check(PERMISSIONS.ANDROID.CAMERA)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    //console.log('This feature is not available (on this device / in this context)');
                    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.DENIED:
                    //console.log('The permission has not been requested / is denied but requestable');
                    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.LIMITED:
                    //console.log('The permission is limited: some actions are possible');
                    break;
                case RESULTS.GRANTED:
                    //console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    //console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            // …
        });
    check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    //console.log('This feature is not available (on this device / in this context)');
                    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.DENIED:
                    //console.log('The permission has not been requested / is denied but requestable');
                    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
                        // …
                        //console.log(result)
                    });
                    break;
                case RESULTS.LIMITED:
                    //console.log('The permission is limited: some actions are possible');
                    break;
                case RESULTS.GRANTED:
                    //console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    //console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch((error) => {
            // …
        });
}


// permission
const { width, heigth } = Dimensions.get('screen')

export default ChatRoom;

const _messages = [
    {
        id: '1',
        sender: "Sarah",
        type: "text",
        data: "hiiiiiiiiiiiiiiii!",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '2',
        sender: "me",
        type: "text",
        data: "How you doing? i went yesterday to the club you've told me about , it was fun",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '3',
        sender: "Sarah",
        type: "text",
        data: "okay then, next time we'll go together haha",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '4',
        sender: "me",
        type: "text",
        data: "available for tonight? 8:00 PM",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '5',
        sender: "Sarah",
        type: "text",
        data: "yes, I'll be there at 8",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '6',
        sender: "me",
        type: "text",
        data: "I'll call jane too",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '7',
        sender: "Sarah",
        type: "text",
        data: "good idea, i was thinking the same thing",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '8',
        sender: "me",
        type: "text",
        data: "haha okay, i'll call her and back to you",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '9',
        sender: "Sarah",
        type: "text",
        data: "okay, see ya",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '10',
        sender: "me",
        type: "text",
        data: "bye",
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '11',
        sender: "Sarah",
        type: "audio",
        data: require('../assets/song1.mp3'),
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '12',
        sender: "me",
        type: "audio",
        data: require('../assets/song2.mp3'),
        date: "1 hour ago",
        photo: Images.use2
    },
    {
        id: '13',
        sender: "me",
        type: "photo",
        data: Images.registerBackground,
        date: "1 hour ago",
        photo: Images.use2
    },


]