import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, RefreshControl, Linking, Alert } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import { api } from '../constants/api_config';
import Button from '../components/Button';



export default function ClientDetails(props) {

    const client = props.route.params
    const client1={
        _id: "hhfhd",
        nom: 'fhdsh',
        prenon: 'fgsfg'
    }

    return (
        <ImageBackground
        source={Images.background}
        style={{
            flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
        }}
    >
        <View
            style={{
                flexDirection: 'column',
                width: width,
                height: scale(160),
                backgroundColor: Colors.themeColor9,
                paddingHorizontal: 10,
                elevation: scale(5),
                borderBottomEndRadius: scale(100),
                borderBottomStartRadius: scale(100)
            }}
        >
            <TouchableOpacity
                style={{marginVertical:10}}
                onPress={() => { props.navigation.goBack() }}
            >
                <AntDesign name="arrowleft" size={35} color={Colors.white} />
            </TouchableOpacity>
            
            <ImageBackground
              resizeMode="stretch"
              source={Images.avatarBackgroung}
              style={{
                width: scale(92),
                height: scale(92),
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: -scale(30)
              }}>
                <LetterPhoto 
                        width={scale(80)}
                        height={scale(80)}
                        fontSize={scale(24)}
                        name={client?.nom+" "+client?.prenom}
                    />
            </ImageBackground>
            
            <View
            style={{flexDirection: 'row', alignSelf:'center',margin:10}}
        >
            <Text
                style={{color: 'white', fontSize: scale(14), fontFamily: 'nexaregular'}}
            >{client.nom} {client.prenom} | </Text>
            <Text
                style={{color: 'white', fontSize: scale(14),fontFamily: 'nexaregular'}}
            >Demande</Text>
        </View>
        </View>
        {/* <View
            style={{flexDirection: 'row'}}
        >
            
        <View
            style={{flexDirection: 'row'}}
        >

        </View>
        </View> */}
        <Button
                            onPress={() => { Linking.openURL(`tel:${client.numeroTelephone}`) }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={[Colors.themeColor9, Colors.themeColor1]}
                            style={{
                                width: scale(280),
                                height: scale(35),
                                borderRadius: scale(5),
                                elevation: scale(5),
                                alignSelf: 'center',
                                marginVertical: 20,
                                overflow: 'hidden',
                                fontFamily: 'nexaregular'
                            }}
                        >
                            <View style={{flexDirection: 'row',alignItems:'center'}} >
                            <AntDesign name="phone" size={20} color={Colors.themeColor7} />
                            <Text
                                style={{
                                    color: Colors.white,
                                    fontSize: scale(16),
                                    marginLeft:10,
                                    fontFamily: 'Nexa Light'
                                }}
                            >+216 {client.numeroTelephone}</Text>
                            </View>
                        </Button>
                        <View
                            style={{
                                width: scale(280),
                                height: scale(35),
                                borderRadius:scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                marginVertical:5,
                                alignSelf:'center',
                                flexDirection: 'row',
                                alignItems:'center',
                                paddingLeft:10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:scale(14),
                                    color: Colors.themeColor6,
                                    fontFamily:'Nexa Bold',
                                }}
                            >Email: </Text>
                            <Text
                                style={{
                                    fontSize:scale(13),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor0
                                }}
                            >{client.email}</Text>
                        </View>
                        <View
                            style={{
                                width: scale(280),
                                height: scale(35),
                                borderRadius:scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                marginVertical:5,
                                alignSelf:'center',
                                flexDirection: 'row',
                                alignItems:'center',
                                paddingLeft:10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:scale(14),
                                    color: Colors.themeColor6,
                                    fontFamily:'Nexa Bold',
                                }}
                            >Besoin: </Text>
                            <Text
                                style={{
                                    fontSize:scale(13),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor0
                                }}
                            >{types[client.besoin]}</Text>
                        </View>
                        <View
                            style={{
                                width: scale(280),
                                height: scale(35),
                                borderRadius:scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                marginVertical:5,
                                alignSelf:'center',
                                flexDirection: 'row',
                                alignItems:'center',
                                paddingLeft:10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:scale(14),
                                    color: Colors.themeColor6,
                                    fontFamily:'Nexa Bold',
                                }}
                            >Budget: </Text>
                            <Text
                                style={{
                                    fontSize:scale(13),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor0
                                }}
                            >{client.budget}</Text>
                        </View>
                        <View
                            style={{
                                width: scale(280),
                                height: scale(35),
                                borderRadius:scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                marginVertical:5,
                                alignSelf:'center',
                                flexDirection: 'row',
                                alignItems:'center',
                                paddingLeft:10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:scale(14),
                                    color: Colors.themeColor6,
                                    fontFamily:'Nexa Bold',
                                }}
                            >Type de transaction: </Text>
                            <Text
                                style={{
                                    fontSize:scale(13),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor0
                                }}
                            >{client.typeTransaction}</Text>
                        </View>
                        <View
                            style={{
                                width: scale(280),
                                height: scale(35),
                                borderRadius:scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                marginVertical:5,
                                alignSelf:'center',
                                flexDirection: 'row',
                                alignItems:'center',
                                paddingLeft:10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:scale(14),
                                    color: Colors.themeColor6,
                                    fontFamily:'Nexa Bold',
                                }}
                            >Zone:  </Text>
                            <Text
                                style={{
                                    fontSize:scale(13),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor0
                                }}
                            >{client.zone}</Text>
                        </View>
        </ImageBackground>
    )
}

const { height, width } = Dimensions.get('screen');

const types = 
    {
        Maison: "Maison"
    ,
    
        Terrain: "Terrain"
    ,
    
        Appartement: "Appartement"
    ,
    
        etageVilla: "Etage de Villa"
    }
