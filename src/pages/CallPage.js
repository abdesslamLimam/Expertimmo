import React, { useState } from 'react'
import { View, Dimensions, ImageBackground, Image, Text, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Colors } from '../constants/Colors'
import { Images } from '../constants/Images'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Draggable from 'react-native-draggable';



export default CallPage = ({ navigation }) => {

    const [video, setVideo] = useState(false)
    const [mute, setMute] = useState(false)

    return <ImageBackground
        source={video ? Images.calluser1 : Images.callbackground}
        style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>

        {!video
            &&
            <View
                style={{
                    alignItems: 'center'
                }}>
                <View
                    style={{

                        elevation: scale(5),
                        width: scale(105),
                        height: scale(105),
                        borderRadius: scale(100),
                        overflow: 'hidden',
                        marginTop: scale(100),
                        borderColor: 'white',
                        borderWidth: scale(3)

                    }}
                >
                    <Image source={Images.user1} style={{
                        width: scale(100),
                        height: scale(100),
                        borderRadius: scale(100),
                    }} />
                </View>
                <Text
                    style={{
                        color: "black",
                        fontSize: scale(20),
                        marginTop: scale(10)
                    }}
                >Sam Johnson</Text>

                <Text
                    style={{
                        color: "black",
                        fontSize: scale(20),
                        marginTop: scale(50),
                        fontWeight: 'bold'
                    }}>
                    10:23
                </Text>
            </View>}
        {video &&
            <View
                style={{
                    width: width,
                    justifyContent: 'space-between',
                    padding: scale(10),
                    flexDirection: 'row'
                }}
            >
                <TouchableOpacity>
                    <SimpleLineIcons name="arrow-down" size={30} color={'black'} />
                </TouchableOpacity>
                <Draggable
                    touchableOpacityProps={{ activeOpacity: 1 }}
                    x={scale(220)}
                    y={scale(10)}
                >
                    <View style={{
                        width: scale(120),
                        height: scale(200),
                        borderRadius: scale(10),
                        overflow: 'hidden',
                        elevation: scale(5)
                    }}>
                        <Image source={Images.calluser2} style={{
                            width: scale(120),
                            height: scale(200),
                            borderRadius: scale(10)
                        }} />
                    </View>
                </Draggable>
            </View>
        }
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: width,
                marginBottom: scale(20)
            }}
        >
            <TouchableOpacity
                onPress={() => { setMute(!mute) }}
                style={{
                    width: scale(50),
                    height: scale(50),
                    backgroundColor: Colors.grey4,
                    borderRadius: scale(50),
                    elevation: scale(5),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {mute ?
                    <FontAwesome5 name="microphone-alt-slash" size={25} color={'black'} />
                    : <FontAwesome5 name="microphone-alt" size={25} color={'black'} />
                }
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                style={{
                    width: scale(70),
                    height: scale(70),
                    backgroundColor: Colors.red,
                    borderRadius: scale(50),
                    elevation: scale(15),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <FontAwesome5 name="phone-slash" size={25} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { setVideo(!video) }}
                style={{
                    width: scale(50),
                    height: scale(50),
                    backgroundColor: Colors.bluesky,
                    borderRadius: scale(50),
                    elevation: scale(5),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {video ?
                    <FontAwesome5 name="video" size={25} color={'black'} />
                    : <FontAwesome5 name="video-slash" size={25} color={'black'} />
                }
            </TouchableOpacity>

        </View>
    </ImageBackground>
}


const { width, heigth } = Dimensions.get('screen')