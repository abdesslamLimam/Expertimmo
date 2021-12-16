import React, { useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Swiper from 'react-native-swiper'
import { api } from '../constants/api_config';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button'
import * as Animatable from "react-native-animatable";


export default function PropertyDetails(props) {

  const [property, setProperty] = useState(props.route.params.item)
  const [ownerDisplay, setOwnerDisplay] = useState(false)
  const [propertyDisplay, setPropertyDisplay] = useState(false)
  const [otherDisplay, setOtherDisplay] = useState(false)
  const [caractéristiques2, setCaractéristiques2] = useState(defaultCarac2)
  const [caractéristiques, setCaractéristiques] = useState(property.typeBien != 'Terrain' ? defaultCarac : defaultCarac2)



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
          flexDirection: 'row',
          width: width,
          height: scale(50),
          backgroundColor: Colors.themeColor9,
          paddingHorizontal: 10,
          alignItems: 'center',
          elevation: scale(5),
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity
          onPress={() => { props.navigation.goBack() }}
        >
          <AntDesign name="arrowleft" size={30} color={Colors.white} />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.white,
                        fontSize: scale(20),
                        fontFamily: 'Nexa Light'
          }}
        >
          Détails du bien
        </Text>
        <TouchableOpacity
        onPress={()=>{props.navigation.navigate('AddProperty',property)}}
        >
          <AntDesign name="edit" size={30} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: width,
          height: scale(150),
        }}
      >
        <Swiper
          dotStyle={{ backgroundColor: 'grey' }}
          activeDotStyle={{ backgroundColor: 'white' }}
          height={scale(250)}
          showsButtons={false}>
          {property.photo.map((item, ind) =>
            <View
              key={ind}
              style={{
                backgroundColor: 'rgba(100,100,100,0.5)',
                width: width,
                height: scale(150),
                //borderRadius: scale(20),
                alignItems: 'center',
                justifyContent: 'center',
                overflow: "hidden",
                //marginLeft:50
              }}
            >
              <Image source={item ? { uri: `${api.url_photo}Categories/${item}` } : Images.empty}
                resizeMode="contain"
                style={{
                  height: scale(150), width: 500
                }}
              />
            </View>
          )}

        </Swiper>
      </View>
      <View
        style={{
          width: scale(250),
          height: scale(40),
          borderTopEndRadius: scale(50),
          borderBottomStartRadius: scale(50),
          backgroundColor: 'white',
          alignSelf: 'center',
          marginTop: 20,
          flexDirection: 'row',
          elevation: scale(0),
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: scale(180),
            height: scale(40),
            borderTopEndRadius: scale(50),
            borderBottomStartRadius: scale(50),
            backgroundColor: Colors.themeColor2,
            elevation: scale(2),
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontSize: scale(13),
              fontFamily:'nexaregular'
            }}
          >{property.prix} TND</Text>
        </View>



        <Text
          style={{
            color: 'black',
            fontSize: scale(13),
            marginLeft: 10,
            marginBottom:scale(-10),
            fontFamily:'nexaregular'
          }}
        >Ref: </Text>
      </View>
      <ScrollView>
      <View
        style={{
          width: scale(250),
          height: scale(40),
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
            height: scale(40),
            borderBottomEndRadius: scale(50),
            borderTopStartRadius: scale(50),
            backgroundColor: Colors.themeColor0,
            elevation: scale(2),
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily:'nexaregular'
          }}
        >
           <Text
            style={{
              color: Colors.white,
              fontSize: scale(13),
              fontFamily:'nexaregular'
            }}
          >{property.typeBien}{property.statu && "/" + property.statu}</Text>
        </View>

        <Text
          style={{
            color: 'black',
            fontSize: scale(13),
            marginLeft: 10,
            marginTop:scale(-20),
            fontFamily:'nexaregular'
          }}
        >{property.reference}</Text>
      </View>
      {/* list of property details */}
      <Button
        onPress={() => { setPropertyDisplay(!propertyDisplay) }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={["rgba(3, 57, 71,0.6)", "rgba(3, 57, 71,0.6)"]}
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
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily:'nexaregular',
              color: Colors.themeColor7
            }}
          >Détails du bien</Text>
          <AntDesign name={ propertyDisplay? "up" : "down"} size={25} color={Colors.themeColor7} />
        </View>

      </Button>
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
            color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
          }}
        ><Text style={{ color: Colors.themeColor11 }} >Adresse:</Text> {property.adresse}</Text>
      </Animatable.View>}
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
            color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
          }}
        ><Text style={{ color: Colors.themeColor11 }} >Surface Total:</Text> {property.surfaceTotale} m²</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
                fontSize: scale(13),
                fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Superfice Couverte:</Text> {property.superficeCouverte}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
                fontSize: scale(13),
                fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Nombre Chambre:</Text> {property.nombreChambre}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
                fontSize: scale(13),
                fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Nombre Salle d'Eau:</Text> {property.nombreSalleEau}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
                fontSize: scale(13),
                fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Nombre Salle de Bain:</Text> {property.nombreSalleBain}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
                fontSize: scale(13),
                fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Annéé du Construction:</Text> {new Date(property.annesConstruction).getDate()}-{new Date(property.annesConstruction).getMonth()+1}-{new Date(property.annesConstruction).getFullYear()+1}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien!="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
                fontSize: scale(13),
                fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Garage:</Text> {property.superfice}{property.garageParking ? " m²":" Non"}</Text>
      </Animatable.View>}
      {/* Terrain */}
      {propertyDisplay && property.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
                fontSize: scale(13),
                fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Superfice Constructible:</Text> {property.superficeConstructible}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
            fontSize: scale(13),
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Form:</Text> {property.forme}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Séparation:</Text> {property.separation}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Façade:</Text> {property.facade}</Text>
      </Animatable.View>}
      {propertyDisplay && property.typeBien=="Terrain" && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Largeur:</Text> {property.largeur}</Text>
      </Animatable.View>}
      
      {/* Terrain */}
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Code Postal:</Text> {property.codePostale}</Text>
      </Animatable.View>}
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
            color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
          }}
        ><Text style={{ color: Colors.themeColor11 }} >Numéro de titre:</Text> {property.numeroTitre}</Text>
      </Animatable.View>} 
      {propertyDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderBottomWidth:0.7,
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={1000}
      >
        <Text
          style={{
            color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
          }}
        ><Text style={{ color: Colors.themeColor11 }} >Form Juridique:</Text> {property.formJuridique}</Text>
      </Animatable.View>} 
        {/* list of owner details */}
      <Button
        onPress={() => { setOwnerDisplay(!ownerDisplay) }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={["rgba(3, 57, 71,0.6)", "rgba(3, 57, 71,0.6)"]}
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
              fontFamily:'nexaregular',
              color: Colors.themeColor7
            }}
          >Vendeur</Text>
          <AntDesign name={ ownerDisplay? "up" : "down"} size={25} color={Colors.themeColor7} />
        </View>

      </Button>
      {ownerDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
            color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
          }}
        ><Text style={{ color: Colors.themeColor11 }} >Nom:</Text> {property.nomPropritaire}</Text>
      </Animatable.View>}
      {ownerDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
            color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
          }}
        ><Text style={{ color: Colors.themeColor11 }} >CIN:</Text> {property.cin}</Text>
      </Animatable.View>}
      {ownerDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
              }}
            ><Text style={{ color: Colors.themeColor11 }} >Address:</Text> {property.adresseProprietaire}</Text>
      </Animatable.View>}
      {ownerDisplay && <Animatable.View
        style={{
          width: scale(250),
          paddingVertical:5,
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderBottomWidth:0.7,
          paddingLeft:10
        }}
        duration={200}
        animation="fadeIn"
        delay={300}
      >
        <Text
          style={{
            color: Colors.themeColor11,
            fontSize: scale(13),
            fontFamily:'nexaregular'
          }}
        ><Text style={{ color: Colors.themeColor11 }} >Téléphone:</Text> {property.phone}</Text>
      </Animatable.View>} 
    
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0)',
            borderRadius: scale(10),
            
            height: scale(30) * caractéristiques.length / 1.5,
            flexWrap: 'wrap',
            marginVertical: 20,
            alignSelf:'center',
            alignItems:'flex-start',
            flexDirection: 'row',
            padding:5
        }}
        >
          {caractéristiques.map((el,index)=>
            <View
            key={index}
              style={{
                paddingHorizontal:10,
                height:scale(30),
                justifyContent: 'center',
                alignItems:'center',
                borderRadius: scale(7),
                borderColor: property[el.apiName] ? Colors.themeColor7 : Colors.themeColor0 ,
                backgroundColor: property[el.apiName] ? Colors.white : Colors.white ,
                borderWidth:3,
                marginHorizontal:2,
                marginVertical:5,
                
              }}
            >
              <Text
                style={{
                  fontSize: scale(12),
                  color: property[el.apiName] ? Colors.themeColor11 : Colors.themeColor0 ,
                  fontFamily:'nexaregular'
                }}
              >{el.name}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
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