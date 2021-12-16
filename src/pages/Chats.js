import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Dimensions, TextInput, FlatList, Image, ImageBackground, ScrollView } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { scale } from 'react-native-size-matters'
import { Images } from '../constants/Images'
import { Colors } from '../constants/Colors'
import { useAppContext } from '../context/AppContext'
import { api } from '../constants/api_config'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux'
import { refreshChats } from '../store/actions/ChatActions'

const Chats = ({ navigation }) => {
    const dispatch = useDispatch()
    const { token, currentUser } = useAppContext()
    const [searchText, setSearchText] = useState('')
    const [agents, setAgents] = useState([])
    const [showingAgents, setShowingAgents] = useState([])
    const [conversations, setConversations] = useState([])
    const chats = useSelector(state => state.chats)


  conversations.sort((a, b) => {
        let resultt = new Date(b?.lastMessage?.createdAt).getTime() - new Date(a?.lastMessage?.createdAt).getTime()
       
        return resultt

    })


    useEffect(()=>{
        dispatch(refreshChats(token))
        var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`${api.url}users/listeAgent`, requestOptions)
  .then(response => response.json())
  .then(result => {
      //console.log( "agent",result)
      if (result?.data) {
          setAgents(result.data)
          setShowingAgents(result.data)
      }
    })
  .catch(error => console.log('error', error));
    },[token])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // The screen is focused
          // Call any action
          console.log('refreshing chats')
          dispatch(refreshChats(token))
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);
    useEffect(()=>{
        setConversations(chats)
    },[token,chats])
    useEffect(()=>{
        if (chats) {
            var showconv = chats.filter((conv)=>{
            let username = conv?.participants[0]?._id== currentUser  ?
            conv?.participants[1]?.name+ " " + conv?.participants[1]?.prenom :
            conv?.participants[0]?.name + " " + conv?.participants[0]?.prenom
             return username.toLowerCase().includes(searchText.toLowerCase())
         })
         setConversations(showconv)
        }
        if (agents) {
            var showAgents = agents.filter((agent)=>{
            let username = agent?.name + " " + agent?.prenom
             return username.toLowerCase().includes(searchText.toLowerCase())
         })
         setShowingAgents(showAgents)
        }
    },[searchText])
    const renderItem = ({ item }) => (
        <View key={item?._id}
            style={{
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: width*0.95,
                backgroundColor: Colors.themeColor0,
                alignSelf:'center',
                borderRadius: scale(10),
                marginVertical: 2,
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate('ChatRoom', {
                    user: item?.participants[0]?._id== currentUser  ? item?.participants[1]: item?.participants[0],
                    username: item?.participants[0]?._id== currentUser  ? item?.participants[1]?.name+ " " + item?.participants[1]?.prenom: item?.participants[0]?.name + " " + item?.participants[0]?.prenom
                })}
                style={{
                    flexDirection: 'row',
                    marginVertical: scale(5),
                    width: width,
                    paddingHorizontal:5
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 0.2,
                    }}>
                        <ImageBackground
                        source={Images.user1}
                        style={{
                            width: scale(50),
                            height: scale(50),
                            borderRadius: scale(50),
                            overflow: 'hidden'
                        }}
                        >
                    <Image 
                        resizeMode="cover"
                        source={{ uri: `${api.url_photo}User/${item.participants[0]._id== currentUser  ? item.participants[1].photo : item.participants[0].photo }`} } 
                        style={{
                        width: scale(50),
                        height: scale(50),
                        borderRadius: scale(50),
                    }} />
                    </ImageBackground>
                </View>
                <View
                    style={{
                        flex: 0.6,
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <Text style={{ fontFamily: 'nexaregular', fontSize: scale(14), color: Colors.themeColor11 }}>
                        {
                        item.participants[0]._id== currentUser  ? 
                        item?.participants[1]?.name + " " + item?.participants[1]?.prenom : 
                        item?.participants[0]?.name + " " + item?.participants[0]?.prenom
                        }
                    </Text>
                    <Text style={{ fontSize: scale(13), color: Colors.white,fontFamily: 'nexaregular' }}>{item?.lastMessage?.message}</Text>

                </View>
                <View
                    style={{
                        flex: 0.2,
                        justifyContent: 'flex-start',
                        marginTop: scale(10)
                    }}
                >
                    <Text style={{
                        color: Colors.themeColor10,
                        fontSize: scale(9),
                        fontFamily: 'nexaregular',
                        marginRight:5,
                        width:scale(60)
                    }}>
                        {moment(item?.lastMessage?.createdAt).fromNow()}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={{
                width: scale(320),
                height: 1,
                //marginLeft: scale(30),
                backgroundColor: 'grey',
                alignSelf: 'center'
            }}></View>
        </View>
    );
    return (
        <ImageBackground 
            source={Images.chatBackground}
            style={{  width: width, height: height }}>
            <View style={{
                flexDirection: 'row',
                width: width,
                justifyContent: 'center',
                paddingTop: scale(10),
                paddingBottom: scale(10),
                borderBottomColor: "grey",
                borderBottomWidth: 0.2,
                //backgroundColor: 'rgba(242, 248, 250,1)',
            }}>
               <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ padding: scale(5), flex: 0.125, justifyContent: 'center', alignItems: 'center',
                            position:'absolute',
                            left:scale(10),
                            top: scale(5)
                        }}>
                    <AntDesign name='arrowleft' size={34} color="white" />
                </TouchableOpacity>
                <Text style={{
                    fontSize: scale(20),
                    color: Colors.white,
                    fontFamily: 'Nexa Light'
                }}>
                    Discussions
                </Text>
            </View>
            <View
                style={{
                    width: width*0.85,
                    height: scale(35),
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: scale(30),
                    marginVertical: 10,
                    alignSelf:'center',
                    backgroundColor:'white'
                }}
            >
                <View style={{flex:0.15,alignItems:'center'}}>
                <AntDesign name='search1' size={25} color="black" />
                </View>
                <View style={{
                    flex:0.7,
                    height: scale(35),
                }}>
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        style={{
                            flex: 1,
                            color: "black",
                            fontSize: scale(14),
                            fontFamily: 'nexaregular'
                        }}
                        placeholder="Search..."
                        placeholderTextColor= "grey"
                    />
                </View>
                <TouchableOpacity
                    disabled={searchText == ''}
                    onPress={() => setSearchText('')}
                    style={{
                        flex:0.15,
                        borderRadius: scale(40),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <AntDesign name='closecircle' size={searchText == '' ? 10 : 20} color={searchText == '' ? "grey" : "grey"} />
                </TouchableOpacity>
            </View>
            <View
                style={{height:scale(80),width:width*0.98,alignSelf:'center'}}
            >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                fadingEdgeLength = {10}
            >
                {showingAgents.map((item,ind)=>
                    <View
                        key={ind}
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginHorizontal:5,
                    }}
                >
                <View
                    style={{
                        width: scale(50),
                        height: scale(50),
                        borderColor:'white',
                        borderWidth:3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: scale(40),
                        elevation: 5
                    }}
                >
                <TouchableOpacity
                onPress={() => navigation.navigate('ChatRoom', {
                    user: item,
                    username: item.name+ " " + item.prenom
                })}
                    style={{
                        borderRadius: scale(40),
                        overflow: 'hidden',
                        width: scale(45),
                        height: scale(45),
                        elevation:scale(5),
                    }}
                >
                    <ImageBackground
                        source={Images.user1}
                        style={{
                            width: scale(45),
                            height: scale(45),
                            borderRadius: scale(50),
                            overflow: 'hidden',
                        }}
                        >
                    <Image resizeMode="cover" source={{ uri: `${api.url_photo}User/${item?.photo}` }} style={{width:scale(45),height: scale(45)}} />
                    </ImageBackground>
                </TouchableOpacity>
                </View>
                <Text
                    style={{
                        color: Colors.themeColor11,
                        fontSize: scale(12),
                        fontFamily: 'nexaregular'
                    }}
                >{item.prenom}</Text>
                </View>
                )}
                
            </ScrollView>
            </View>
            <View
            style={{
                backgroundColor:'rgba(3, 57, 71,0.8)',
                    flex: 1,
                    borderTopEndRadius: scale(20),
                    borderTopStartRadius: scale(20)
                }}>
                <FlatList
                    style={{
                        marginTop: scale(5),
                    }}
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}

                />
            </View>
        </ImageBackground>
    )
}

const { width, height } = Dimensions.get('screen')
export default Chats;

const chats = [
    {
        _id: '102',
        username: 'Sarah',
        lastMessage: 'Thanks ! <3',
        date: '10 min ago',
        photo: Images.user2
    },
    {
        _id: '501',
        username: 'Aymen',
        lastMessage: 'where are you?',
        date: '2 hour ago',
        photo: Images.user1
    },
    {
        _id: '330',
        username: 'Anwar',
        lastMessage: 'aymen is looking for you LOL',
        date: '3 hour ago',
        photo: Images.user3
    }
]

const users = [
    {
        id:1,
        username: "Aymen",
        photo: Images.user1
    },
    {
        id:2,
        username: "Sarah",
        photo: Images.user2
    },
    {
        id:3,
        username: "Anwar",
        photo: Images.user3
    },
    {
        id:1,
        username: "Aymen",
        photo: Images.user1
    },
    {
        id:2,
        username: "Sarah",
        photo: Images.user2
    },
    {
        id:3,
        username: "Anwar",
        photo: Images.user3
    },{
        id:1,
        username: "Aymen",
        photo: Images.user1
    },
    {
        id:2,
        username: "Sarah",
        photo: Images.user2
    },
    {
        id:3,
        username: "Anwar",
        photo: Images.user3
    },{
        id:1,
        username: "Aymen",
        photo: Images.user1
    },
    {
        id:2,
        username: "Sarah",
        photo: Images.user2
    },
    {
        id:3,
        username: "Anwar",
        photo: Images.user3
    },

]