import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, TextInput, FlatList, Image, ScrollView, ImageBackground } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { scale } from 'react-native-size-matters'
import Input from '../components/Input'
import { Images } from '../constants/Images'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import Sound from 'react-native-sound'
import ImageView from 'react-native-image-view';
import { api } from '../constants/api_config'

export default function     Message({ item, me }) {
    const [audio, setAudio] = useState()
    const [audioStatus, setAudioStatus] = useState('off')
    const [audioDur, setAudioDur] = useState(0)
    const [audioDuration, setAudioDuration] = useState(0)
    const [imageViewer, setImageViewer] = useState(false)

    

    // const startCountdown = (audio) => {
    //     console.log('startcountdown', countdown)
    //     if (countdown == true) {
    //         setTimeout(() => {
    //             setAudioDur(audio - 1)
    //             startCountdown(audio - 1)
    //         }, 1000)

    //     }
    // }
    // useEffect(() => {
    //     // console.log('useeffect coundwn:', countdown)
    //     if (audioStatus == 'on') {
    //         console.log('audioStatus on')
    //         audio?.getCurrentTime((sec) => {
    //             console.log('audioStatus on changed time')
    //             setAudioDur(audio.getDuration().toFixed(0) - sec.toFixed(0))
    //         })

    //     } else {
    //         //audio?.stop()
    //         audio?.getCurrentTime((sec) => {
    //             console.log('audioStatus off')
    //             setAudioDur(audio.getDuration().toFixed(0))
    //         })

    //     }
    // }, [audioStatus])

    useEffect(() => {
        //console.log('useeffect audiodur:', countdown, audioDur, audioStatus)
        //console.log('tik tok  audiostate: ', audioStatus)
        if (audioStatus == 'on') {
            //console.log('trueeeeeeeeeeeeee')
            //console.log('tik tok')
            setTimeout(() => {
                audio?.getCurrentTime((sec) => {
                    setAudioDur(audio.getDuration().toFixed(0) - sec.toFixed(0))
                })
            }, 1000)
        }
        else if (audioStatus == 'off') {
            //console.log('off')
        }
        if (audioDur <= 0) {
            //console.log('reached 0')
            setAudioStatus('off')
            setAudioDur(audio?.getDuration().toFixed(0))
        }
    }, [audioDur, audioStatus])

    useEffect(() => {
        //console.log('mesage useEffect started')
        if (item.type == 'audio') {
            //Sound.setCategory('Playback');
            let audio = new Sound(item.data, Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                // loaded successfully
                //console.log('duration in seconds: ' + audio.getDuration() + 'number of channels: ' + audio.getNumberOfChannels() + audio.getDuration());
                setAudioDur(audio.getDuration())
                // Play the sound with an onEnd callback
                // whoosh.play((success) => {
                //     if (success) {
                //         console.log('successfully finished playing');
                //     } else {
                //         console.log('playback failed due to audio decoding errors');
                //     }
                // });
            });
            setAudio(audio)
            setTimeout(() => {
                setAudioDur(audio.getDuration().toFixed(0))
                setAudioDuration(audio.getDuration().toFixed(0))
            }, 2000)
            return () => {
                //console.log('useeffect return')
                audio.stop()
            }
        }

    }, [item])
    return (
        <View key={item.id}
            style={{
                flexDirection: 'row',
                justifyContent: me ? 'flex-end' : 'flex-start',
                alignItems: 'center',
                width: width * 0.97,
                margin: scale(5),
                alignSelf: 'center'
            }}
        >
            {!me && 
            <View
            style={{width: scale(30),height: scale(30),borderRadius:scale(20),marginRight:5,overflow:'hidden'}}
            >
                <ImageBackground
                resizeMode="cover"
                source={Images.empty}
                style={{width: scale(30),height: scale(30),borderRadius:scale(30),}}>
            <Image 
            resizeMode="cover"
                source={{ uri: `${api.url_photo}User/${item?.sender?.photo}`}}
                style={{width: scale(30),height: scale(30),borderRadius:scale(30),}}
            />
            </ImageBackground>
            </View>
            }

            <View
                style={{
                    elevation: scale(5),
                    borderRadius: scale(15),
                    borderBottomRightRadius: me ? scale(0) : scale(15),
                    borderBottomLeftRadius: me ? scale(15) : scale(0),
                    overflow: 'hidden',
                    maxWidth: scale(250)
                }}>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    colors={me ? [Colors.themeColor9, Colors.themeColor10] : [Colors.grey4, Colors.white]}
                    style={{
                        paddingVertical: scale(5),
                        paddingHorizontal: scale(10),
                    }}
                >
                    {item.type == 'text' ?
                        <Text
                            style={{
                                fontSize: scale(16),
                                color: me ? "white" : "black",
                            }}
                        >
                            {item.message}
                        </Text>
                        : item.type == 'audio' ?
                            audioStatus == 'off' ?
                                <TouchableOpacity
                                    disabled={audioDur == 0}
                                    onPress={() => {
                                        audio.play()
                                        setAudioStatus('on')
                                    }}
                                    style={{
                                        padding: scale(5),
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FontAwesome name="play-circle" size={30} color={me ? "white" : "black"} />
                                    <View
                                        style={{
                                            height: scale(4),
                                            width: audioDuration != 0 ? audioDuration * 1.5 : 10,
                                            backgroundColor: me ? "white" : "black",
                                            borderRadius: scale(2),
                                            marginRight: scale(5),
                                            overflow: 'hidden',
                                            flexDirection: 'row-reverse'
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: audioDuration != 0 ? audioDur / audioDuration : 0,
                                                backgroundColor: 'grey'
                                            }}
                                        ></View>
                                    </View>
                                    <Text style={{
                                        color: me ? "white" : "black",
                                        fontSize: scale(14),
                                        paddingLeft: scale(10)
                                    }}>
                                        {audioDur} s</Text>

                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={() => {
                                        audio.pause()
                                        setAudioStatus('off')
                                    }}
                                    style={{
                                        padding: scale(5),
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FontAwesome name="stop-circle" size={30} color={me ? "white" : "black"} />
                                    <View
                                        style={{
                                            height: scale(4),
                                            width: audioDuration != 0 ? audioDuration * 1.5 : 10,
                                            backgroundColor: me ? "white" : "black",
                                            borderRadius: scale(2),
                                            marginRight: scale(5),
                                            overflow: 'hidden',
                                            flexDirection: 'row-reverse'
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: audioDuration != 0 ? audioDur / audioDuration : 0,
                                                backgroundColor: 'grey'
                                            }}
                                        ></View>
                                    </View>
                                    <Text style={{
                                        color: me ? "white" : "black",
                                        fontSize: scale(14),
                                        paddingLeft: scale(10)
                                    }}>
                                        {audioDur} s</Text>
                                </TouchableOpacity>
                            : item.type == 'photo' ?
                                <TouchableOpacity
                                    onPress={() => {
                                        setImageViewer(true)
                                    }}
                                    style={{
                                        borderRadius: scale(15),
                                        width: scale(150),
                                        height: scale(150),
                                        overflow: 'hidden',
                                        elevation: scale(5)
                                    }}>
                                    <Image source={item.data} style={{
                                        width: scale(150),
                                        height: scale(150),
                                        resizeMode: 'cover'
                                    }}
                                    />
                                </TouchableOpacity>
                                : item.type == 'video' ?
                                    <View></View> :
                                    <View></View>

                    }
                </LinearGradient>

            </View>


            <ImageView
                images={[
                    {
                        source: item.data,
                        title: 'Paris',
                        width: 806,
                        height: 720,
                    },
                ]}
                imageIndex={0}
                isVisible={imageViewer}
                renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
                onClose={() => {
                    setImageViewer(false)
                }}
            />

        </View >
    );
}

const { width, heigth } = Dimensions.get('screen')
