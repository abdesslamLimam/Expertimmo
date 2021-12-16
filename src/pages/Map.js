import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, RefreshControl, Linking, Alert, StyleSheet } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import { api } from '../constants/api_config';
import Button from '../components/Button';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import GetLocation from 'react-native-get-location'
import * as Animatable from "react-native-animatable";

const apiKey = 'AIzaSyDfxAFFp8jEZrtWFxr8FTieAsUAlQhFhAs'

export default function Map(props) {
    const bien = props.route.params.refernceBien
    const client = props.route.params.clientId
    //console.log("bien: ",props.route.params)
    const mapRef = React.createRef()
    const [region, setRegion] = useState({
        latitude: bien.lat,
        longitude: bien.lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      })
      const [userLocation, setUserLocation] = useState({
        latitude: 37.78823,
        longitude: -122.4323,
      })
      const [markedLocation, setMarkedLocation] = useState({
        latitude: bien.lat,
        longitude: bien.lng,
        address: '',
        photoRef: '',
      })
      const [ detailsOf, setDetailsOf] = useState('')
      
      const [propertyDisplay, setPropertyDisplay] = useState(false)

const refreshLocation = () => {
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          //console.log(location);
          setUserLocation(location)
          setRegion(location)
        }
        )
    .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
    })
}
      useEffect(()=>{
        refreshLocation()
      },[])

    return (
        
        
        <View
            style={{
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                ...StyleSheet.absoluteFillObject,
            }}
        >
        <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={{
        ...StyleSheet.absoluteFillObject,
       }}
    //    region={{
    //      latitude: 37.78825,
    //      longitude: -122.4324,
    //      latitudeDelta: 0.015,
    //      longitudeDelta: 0.0121,
    //    }}
       ref={mapRef}
        region={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta ? region.latitudeDelta : 0.055,
          longitudeDelta: region.longitudeDelta ? region.longitudeDelta : 0.0121,
        }}

        showUserLocation={true}
            >
                <MapViewDirections
          onStart={(data) => {
            //console.log("waypoints  = ",data.waypoints, markedLocation)
          }}
          timePrecision='now'
        //   mode={types[directionType]}
          origin={userLocation}
          destination={markedLocation}
          apikey={apiKey}
          strokeWidth={4}
          strokeColor='#2ad41e'
        //   onReady={result => {
        //     //console.log("onReady mapVDirections  = ",JSON.stringify(result,null,2))
        //     setWaypoints(result.coordinates)
        //     setDirectionsValues({
        //       distance: result.distance.toFixed(2),
        //       duration: [
        //         Math.trunc(result.duration / 1440),
        //         Math.trunc((result.duration % 1440) / 60),
        //         (result.duration % 60).toFixed(0)
        //       ]
        //     })
        //     try {
        //       mapRef.current.fitToCoordinates(result.coordinates, {
        //         edgePadding: {
        //           right: (width / 20),
        //           bottom: (height / 20),
        //           left: (width / 20),
        //           top: (height / 20),
        //         }
        //       });
        //     }
        //     catch { error => console.log(error) }
        //   }
        // }
        />
                <Marker 
                    coordinate={{
                    latitude: markedLocation.latitude,
                    longitude: markedLocation.longitude,
                }} >
                    <View
                        style={{
                            width:50,
                            height:50
                        }}
                        >
                        <Image  
                            resizeMode="stretch"
                            source={Images.placeLocation}
                            style={{
                                width:50,
                                height:50,
                            }}
                        />
                        </View>
                </Marker>
                <Marker
                    coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                    }} >
                        <View
                        style={{
                            width:50,
                            height:50
                        }}
                        >
                        <Image  
                            resizeMode="stretch"
                            source={Images.userLocation}
                            style={{
                                width:30,
                                height:40,
                                //tintColor: Colors.blue2
                            }}
                        />
                        </View>
                    </Marker>
         
     </MapView>
     <View
            style={{
                flexDirection: 'row',
                width: width,
                height: scale(40),
                backgroundColor: 'rgba(3, 57, 71,0.8)',
                paddingHorizontal: 10,
                position:'absolute',
                alignItems:'center',
                justifyContent: 'center'
            }}
        >
            <TouchableOpacity
                style={{padding:5,position:'absolute',left:0}}
                onPress={() => { props.navigation.goBack() }}
            >
                <AntDesign name="arrowleft" size={35} color={Colors.white} />
            </TouchableOpacity>
            <Text
                style={{
                    color: 'white',
                    fontSize: scale(20),
                    fontFamily: 'nexaregular'
                }}
            >Détails</Text>
           
        </View>
        <TouchableOpacity
        onPress={()=>{refreshLocation()}}
            style={{
                backgroundColor:'white',
                position:'absolute',
                top:100,
                right:10,
                width: scale(40),
                height:scale(40),
                borderRadius:scale(100),
                alignItems:'center',
                justifyContent: 'center',
                elevation:scale(10)
            }}
        >
            <MaterialCommunityIcons name="crosshairs-gps" size={25} color='orange' />
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>{setRegion(markedLocation)}}
            style={{
                backgroundColor:'white',
                position:'absolute',
                top:160,
                right:10,
                width: scale(40),
                height:scale(40),
                borderRadius:scale(100),
                alignItems:'center',
                justifyContent: 'center',
                elevation:scale(10)
            }}
        >
            <MaterialCommunityIcons name="home-map-marker" size={30} color='orange' />
        </TouchableOpacity>
        {detailsOf=='' && <TouchableOpacity
                        onPress={()=>{setDetailsOf('property')}}
                            style={{
                                height:scale(150),
                                width:25,
                                borderTopEndRadius:100,
                                borderBottomEndRadius:100,
                                backgroundColor:'rgba(3, 57, 71,0.8)',
                                position: 'absolute',
                                top: scale(450),
                                left:0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: 'white',
                                borderWidth:1,
                                borderLeftWidth:0
                            }}
                        >
                            <AntDesign name="home" size={25} color="white" />
                        </TouchableOpacity>
}
{detailsOf=='' && <TouchableOpacity
                        onPress={()=>{setDetailsOf('client')}}
                            style={{
                                height:scale(150),
                                width:25,
                                borderTopStartRadius:100,
                                borderBottomStartRadius:100,
                                backgroundColor:'rgba(3, 57, 71,0.8)',
                                position: 'absolute',
                                top: scale(450),
                                right:0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: 'white',
                                borderWidth:1,
                                borderRightWidth:0
                            }}
                        >
                            <AntDesign name="user" size={25} color="white" />
                        </TouchableOpacity>
}
{ detailsOf=='client' &&
        <Animatable.View
                        animation="bounceInRight"
                        delay={0}
                        style={{
                            alignItems: 'center',
                            flexDirection: "row",
                            bottom: 50,
                            position: 'absolute',
                            right:0,
                            
                        }}
                    >
                      
                        <TouchableOpacity
                    onPress={()=>{setDetailsOf('')}}
                        style={{
                            height:scale(150),
                            width:25,
                            borderTopStartRadius:100,
                            borderBottomStartRadius:100,
                            backgroundColor:'rgba(3, 57, 71,0.8)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: 'white',
                            borderWidth:1,
                            borderRightWidth:0
                        }}
                    >
                        <AntDesign name="close" size={20} color="white" />
                    </TouchableOpacity>
                        <View
                            style={{
                                borderWidth:1,
                                backgroundColor: 'rgba(3, 57, 71,0.8)',
                            borderRadius: scale(10),
                            width: scale(300),
                            height: scale(200),
                            borderColor: 'white',
                            borderLeftWidth: 0,
                            padding:5
                        }}
                    >
                      <ScrollView>
                      {/* <LetterPhoto 
                        width={scale(70)}
                        height={scale(70)}
                        fontSize={scale(25)}
                        name={client?.nom+" "+client?.prenom}
                    /> */}
                    <View
                      style={{alignSelf:'flex-start', flexDirection:'row',alignItems:'center'}}
                      
                    >
                    <Text
                        style={{
                          backgroundColor:'white',
                          marginTop:5,
                          color:'rgba(11, 46, 99,1)', 
                          fontFamily: 'nexaregular',
                          alignSelf:'center', 
                          paddingHorizontal:10,
                          paddingVertical:5,
                          borderRadius:5,
                          marginVertical:5
                        }}
                      >{client.nom} {client.prenom}</Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'white', 
                          marginHorizontal:20,
                          width: scale(30),
                          height:scale(25),
                          borderRadius:5,
                          alignItems:'center',
                          justifyContent:'center'
                      }}
                        onPress={() => { Linking.openURL(`tel:${client.numeroTelephone}`) }} >
                          <MaterialIcons name="contact-phone" size={26} color="green" />
                      </TouchableOpacity>
                      </View>
                      <Text
                        style={{color:'white',marginVertical:5,fontFamily: 'nexaregular'}}
                      >Email: {client.email}</Text>
                      <Text
                        style={{color:'white',marginVertical:5,fontFamily: 'nexaregular'}}
                      >Besoin: {client.besoin} / {client.typeTransaction=='vente' ? 'Vente' : 'Louée'}</Text>
                      <Text
                        style={{color:'white',marginVertical:5,fontFamily: 'nexaregular'}}
                      >Budget: {client.budget}</Text>
                      
                      
                      <Text
                        style={{color:'white',marginVertical:5,fontFamily: 'nexaregular'}}
                      >Zone: {client.zone}</Text>
                      
                      </ScrollView>
                        
                     
                    </View>
                    
                </Animatable.View>}
                        { detailsOf=='property' &&
        <Animatable.View
                        animation="bounceInLeft"
                        delay={0}
                        style={{
                            alignItems: 'center',
                            flexDirection: "row",
                            bottom: 10,
                            position: 'absolute',
                            left:0,
                            
                        }}
                    >
                        <View
                            style={{
                                borderWidth:1,
                                backgroundColor: 'rgba(3, 57, 71,0.8)',
                            borderRadius: scale(10),
                            width: scale(300),
                            height: scale(260),
                            borderColor: 'white',
                            borderRightWidth: 0,
                            padding:5
                        }}
                    >
                        <View
                        style={{
                            flex:1,
                            paddingBottom:5
                        }}
                        >
                            <ScrollView>
                        <View
        style={{
          width: scale(220),
          height: scale(140),
          alignSelf: 'center',
        }}
      >
                        <Swiper
                            contentContainerStyle={{alignItems: 'center'}}
                            dotStyle={{ backgroundColor: 'grey' }}
                            activeDotStyle={{ backgroundColor: 'white',}}
                           width={scale(220)}
                            showsButtons={false}>
                            {bien.photo.map((item, ind) =>
                                <View
                                    key={ind}
                                    style={{
                                        backgroundColor: 'rgba(100,100,100,0.2)',
                                        width: scale(220),
                                        height: scale(130),
                                        overflow: "hidden",
                                        borderRadius:10
                                    }}
                                >
                                    <Image source={item ? { uri: `${api.url_photo}Categories/${item}` } : Images.empty}
                                        resizeMode="contain"
                                        style={{
                                            width:scale(220),
                                            height: scale(130),
                                            borderRadius:5
                                        }}
                                    />
                                </View>
                            )}

                        </Swiper>
                        </View>
                        
                        <View
        style={{
          width: scale(250),
          height: scale(30),
          borderTopEndRadius: scale(50),
          borderBottomStartRadius: scale(50),
          backgroundColor: 'white',
          alignSelf: 'center',
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: scale(180),
            height: scale(30),
            borderTopEndRadius: scale(50),
            borderBottomStartRadius: scale(50),
            backgroundColor: Colors.logo1,
            elevation: scale(2),
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: scale(13),
              fontFamily: 'nexaregular'
            }}
          >{bien.prix} TND</Text>
        </View>



        <Text
          style={{
            color: 'black',
            fontSize: scale(13),
            marginLeft: 10,
            marginBottom:scale(-10),
            fontFamily: 'nexaregular'
          }}
        >Ref: </Text>
      </View>
      <View
        style={{
          width: scale(250),
          height: scale(30),
          borderBottomEndRadius: scale(50),
            borderTopStartRadius: scale(50),
          backgroundColor: 'white',
          alignSelf: 'center',
          marginTop: 0,
          flexDirection: 'row',
          elevation: scale(2),
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: scale(180),
            height: scale(30),
            borderBottomEndRadius: scale(50),
            borderTopStartRadius: scale(50),
            backgroundColor: Colors.logo2,
            elevation: scale(2),
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
           <Text
            style={{
              color: 'white',
              fontSize: scale(13),
              fontFamily: 'nexaregular'
            }}
          >{bien.typeBien}{bien.statu && "/" + bien.statu}</Text>
        </View>



        <Text
          style={{
            color: 'black',
            fontSize: scale(13),
            marginLeft: 10,
            marginTop:scale(-20),
            fontFamily: 'nexaregular'
          }}
        >{bien.reference}</Text>
      </View>
                            <Button
        onPress={() => { setPropertyDisplay(!propertyDisplay) }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={["rgba(55,55,55,0.3)", "rgba(255,255,255,0.3)"]}
        style={{
          width: scale(250),
          height: scale(35),
          borderRadius: scale(5),
          borderBottomStartRadius:0,
          borderBottomEndRadius: 0,
          elevation: scale(0),
          alignSelf: 'center',
          marginTop: 20,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: scale(180),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
                color: "white",
                fontSize: scale(12),
                fontFamily: 'nexaregular'
            }}
          >Détails du bien</Text>
          <AntDesign name={ propertyDisplay? "up" : "down"} size={25} color={Colors.white} />
        </View>

      </Button>
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={0}
      >
        <Text
          style={{
            color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
          }}
        ><Text style={{ color: Colors.white, fontFamily: 'nexaregular' }} >Adresse:</Text> {bien.adresse}</Text>
      </Animatable.View>}
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={100}
      >
        <Text
          style={{
            color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
          }}
        ><Text style={{ color: Colors.white, fontFamily: 'nexaregular' }} >Surface Total:</Text> {bien.surfaceTotale} m²</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={200}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Superfice Couverte:</Text> {bien.superficeCouverte}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={300}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Nombre Chambre:</Text> {bien.nombreChambre}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={400}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Nombre Salle d'Eau:</Text> {bien.nombreSalleEau}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={500}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Nombre Salle de Bain:</Text> {bien.nombreSalleBain}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={600}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white,fontFamily: 'nexaregular' }} >
              Annéé du Construction:</Text> 
              {new Date(bien.annesConstruction).getDate()}-{new Date(bien.annesConstruction).getMonth()+1}-{new Date(bien.annesConstruction).getFullYear()+1}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={700}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Garage:</Text> {bien.superfice}{bien.garageParking ? " m²":" Non"}</Text>
      </Animatable.View>}
      {/* Terrain */}
      {propertyDisplay && bien.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={200}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white, fontFamily: 'nexaregular' }} >Superfice Constructible:</Text> {bien.superficeConstructible}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={300}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Form:</Text> {bien.forme}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={400}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Séparation:</Text> {bien.separation}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={500}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white }} >Façade:</Text> {bien.facade}</Text>
      </Animatable.View>}
      {propertyDisplay && bien.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={600}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white, fontFamily: 'nexaregular' }} >Largeur:</Text> {bien.largeur}</Text>
      </Animatable.View>}
      
      {/* Terrain */}
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={800}
      >
        <Text
              style={{
                color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
              }}
            ><Text style={{ color: Colors.white, fontFamily: 'nexaregular' }} >Code Postal:</Text> {bien.codePostale}</Text>
      </Animatable.View>}
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.6,
          borderColor:'white',
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={900}
      >
        <Text
          style={{
            color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
          }}
        ><Text style={{ color: Colors.white , fontFamily: 'nexaregular'}} >Numéro de titre:</Text> {bien.numeroTitre}</Text>
      </Animatable.View>} 
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth:0.7,
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={1000}
      >
        <Text
          style={{
            color: 'white',
            fontSize: scale(13),
            fontFamily: 'nexaregular'
          }}
        ><Text style={{ color: Colors.white, fontFamily: 'nexaregular' }} >Form Juridique:</Text> {formJuridiqueSelect[bien.formJuridique]}</Text>
      </Animatable.View>} 
      <View
          style={{
            backgroundColor: 'rgba(255,255,255,0)',
            borderRadius: scale(10),
            
            // height: scale(30) * caractéristiques.length / 1.5,
            flexWrap: 'wrap',
            marginVertical: 20,
            alignSelf:'center',
            alignItems:'flex-start',
            flexDirection: 'row',
            padding:5
        }}
        >
      {bien.typeBien!="Terrain" && defaultCarac.map((item,index)=>
        <View
            key={index}
        >
            {bien[item.apiName] && <Text
                style={{
                    paddingHorizontal:5,
                    paddingVertical:3,
                    backgroundColor:'white',
                    color:'black',
                    borderRadius:scale(10),
                    elevation:5,
                    margin:5,
                    fontFamily: 'nexaregular'
                }}
            >{item.name}</Text>}
        </View>      
      )}
      </View>
                            </ScrollView>
                            </View>
                        </View>
                        <TouchableOpacity
                        onPress={()=>{setDetailsOf('')}}
                            style={{
                                height:scale(150),
                                width:25,
                                borderTopEndRadius:100,
                                borderBottomEndRadius:100,
                                backgroundColor:'rgba(3, 57, 71,0.8)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: 'white',
                                borderWidth:1,
                                borderLeftWidth:0
                            }}
                        >
                            <AntDesign name="close" size={20} color="white" />
                        </TouchableOpacity>
                    </Animatable.View>}
                    
        </View>
        
    )
}

const { height, width } = Dimensions.get('screen');


const defaultCarac = [
    {
        name: "Climatisation",
        status: false,
        apiName: "climatiseur"
    },
    {
        name: "Chauffage central",
        status: false,
        apiName: "chauffage"
    },
    {
        name: "Piscine",
        status: false,
        apiName: "piscine"
    },
    {
        name: "Interphone",
        status: false,
        apiName: "interphone"
    },
    {
        name: "Balcon",
        status: false,
        apiName: "balcon"
    },
    {
        name: "Douche extérieur",
        status: false,
        apiName: "doucheExterne"
    },
    {
        name: "Caméra surveillance",
        status: false,
        apiName: "cameraServeillance"
    },
    {
        name: "Store électrique",
        status: false,
        apiName: "storeElectrique"
    },
    {
        name: "Gardien",
        status: false,
        apiName: "gardien"
    },
    {
        name: "Terrasse",
        status: false,
        apiName: "terrase"
    },
    {
        name: "Jardin",
        status: false,
        apiName: "jardin"
    },
    {
        name: "Suite",
        status: false,
        apiName: "suite"
    },
    {
        name: "Cuisine équipé",
        status: false,
        apiName: "cuisine"
    },
    {
        name: "Véranda",
        status: false,
        apiName: "veranda"
    },
    {
        name: "Sous-sol",
        status: false,
        apiName: "souSole"
    }
  ]
  const defaultCarac2 = [
    {
        name: "Cloturé",
        status: false,
        apiName: "cloture"
    },
    {
        name: "Permis de batir",
        status: false,
        apiName: "permiBatir"
    },
    {
        name: "Eau",
        status: false,
        apiName: "eau"
    },
    {
        name: "Electricité",
        status: false,
        apiName: "electriciter"
    },
    {
        name: "Gaz de ville",
        status: false,
        apiName: "gaze"
    },
    {
        name: "ONASS",
        status: false,
        apiName: "onasse"
    },
    {
        name: "Commercial",
        status: false,
        apiName: "commerciale"
    },
  ]
  const formJuridiqueSelect = {
    titreBleu: 'Titre Bleu',
    titreColletif: 'Titre Colletif',
    contratDeVente: 'Contrat De Vente',
    SupportPropriété: 'Support Propriété',
  }