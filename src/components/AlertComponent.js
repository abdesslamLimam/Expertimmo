import React from 'react'
import {TouchableOpacity, Dimensions, View, Text} from 'react-native'
import { scale } from 'react-native-size-matters';
import { Colors } from '../constants/Colors';
import * as Animatable from "react-native-animatable";


export default AlertComponent = ({message,choice=false, onYes, onNo, hideAction}) => {
    return (
        <TouchableOpacity
            onPress={hideAction}
            activeOpacity={1}
            style={{
                width: width,
                height:height,
                justifyContent:'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
                position: 'absolute',
            }}
        >
            <Animatable.View
                 animation="bounceIn"
                 delay={0}
                style={{
                    width: width*0.9,
                    paddingVertical: 20,
                    paddingHorizontal:10,
                    backgroundColor: Colors.themeColor0,
                    borderRadius: 10,
                    minHeight:scale(60)
                }}
            >
                <Text
                    style={{
                        width:width*0.8,
                        fontFamily: 'nexaregular',
                        textAlign: 'center',
                        fontSize: scale(14),
                        color: Colors.white
                    }}
                >
                    {message}
                </Text>
                <View
                    style={{
                        alignSelf: 'center',
                        marginHorizontal:10,
                        flexDirection: 'row',
                        marginTop:20
                    }}
                >
                    {  choice && <>
                        <TouchableOpacity
                            style={{
                                width: scale(50),
                                paddingVertical:3,
                                borderRadius:5,
                                alignItems:'center',
                                marginHorizontal:10,
                                backgroundColor: Colors.themeColor11,
                            }}
                            onPress={()=>{
                                onYes() 
                                hideAction()
                            }}
                        >
                        <Text
                            style={{
                                fontSize: scale(12),
                                fontFamily: 'nexaregular',
                                color: Colors.white,
                                
                            }}
                        >OUI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{
                        width: scale(50),
                        paddingVertical:3,
                        borderRadius:5,
                        alignItems:'center',
                        marginHorizontal:10,
                        backgroundColor: Colors.themeColor11,
                    }}
                            onPress={()=>{
                                onNo() 
                                hideAction()
                            }}
                        >
                        <Text
                            style={{
                                fontSize: scale(12),
                                fontFamily: 'nexaregular',
                                color: Colors.white,
                            }}
                        >NON</Text>
                    </TouchableOpacity>
                    </>}
                </View>
            </Animatable.View>
        </TouchableOpacity>
    )
}



const { height, width } = Dimensions.get('screen');