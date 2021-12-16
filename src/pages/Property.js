import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import { api } from '../constants/api_config';
import { useAppContext } from '../context/AppContext';
import { useSelector } from 'react-redux';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Property(props) {
  const {token} = useAppContext()
  const [ properties, setProperties ] = useState([])
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh()
    console.log('refreshing')
    wait(2000).then(() => {setRefreshing(false)});
  }, []);

  const refresh = () => {
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
    console.log(result)
    setProperties(result.data)
    read()
  })
  .catch(error => console.log('error', error));
  }

  //marke new contents as read
  const agent = useSelector(state=>state.agent)
const read = ()=>{
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`)
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  bienNotif:false
});

var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`${api.url}users/${agent._id}`, requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

  useEffect(()=>{
    refresh()
  },[token])

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
      width:width,
      height: scale(50),
      backgroundColor: Colors.themeColor9,
      paddingHorizontal: 10,
      alignItems: 'center',
      elevation: scale(5),
      justifyContent: 'space-between'
    }}
  >
    <TouchableOpacity
        onPress={()=>{props.navigation.openDrawer()}}
      >
        <AntDesign name="menu-fold" size={30} color={Colors.white} />
      </TouchableOpacity>
      <Text
        style={{
          color:'white',
          fontSize: scale(20),
          fontFamily: 'Nexa Light'
        }}
      >
        Liste des biens
        </Text>
        <View
          style={{
            flexDirection:'row',
          }}
        >
        <TouchableOpacity
        style={{marginRight:20}}
        onPress={()=>{props.navigation.navigate("AddProperty")}}
      >
        <AntDesign name="plus" size={30} color={Colors.white} />
      </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>{props.navigation.navigate('Chat')}}
      >
        <AntDesign name="inbox" size={30} color={Colors.white} />
      </TouchableOpacity>
      </View>
  </View>
        <View
          style={{
            flex:1
          }}
        >
        <ScrollView
        contentContainerStyle={{flexDirection:"column-reverse"}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />}
        >
          { properties && properties.map((item,ind)=>
            <TouchableOpacity
            key={ind}
              onPress={()=>{props.navigation.navigate("PropertyDetails",{"item":item})}}
              style={{
                width:scale(280),
                height: scale(180),
                borderRadius:scale(10),
                marginVertical:10,
                alignSelf: 'center',
                overflow: 'hidden'
              }}
            >
              <ImageBackground 
                resizeMode="cover"
                source={item.photo[0] ? {uri: `${api.url_photo}Categories/${item.photo[0]}`} : Images.empty } 
                style={{
                  width:scale(280),
                  height: scale(180),
                  flexDirection:'column',
                  justifyContent:'flex-end'
                  //paddingTop: scale(135)
                }}
                >
                  <ImageBackground
                  resizeMode="stretch"
                  source={Images.textBackground}
                  style={{
                    width: scale(280),
                    height:scale(110),
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'space-between',
                    marginBottom: scale(-25),
                    paddingHorizontal:scale(20)
                  }} >
                    <View
                      style={{
                        flexDirection:'column',
                        justifyContent: 'center',
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                      style={{
                        color: Colors.white,
                        fontSize: scale(12),
                      }}
                    >
                      <Text style={{fontFamily:'nexaregular'}}>Type:</Text> {item.typeBien}
                    </Text>
                    
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: scale(12),
                        fontFamily:'nexaregular'
                      }}
                    >
                     <Text style={{fontWeight:'bold'}}>Lieu:</Text> {item.adresse}
                    </Text>
                    
                    </View>
                    <View
                      style={{
                        flexDirection:'column',
                        justifyContent: 'center',
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                      style={{
                        color: Colors.white,
                        fontSize: scale(12),
                        fontFamily:'nexaregular'
                      }}
                    >
                      <Text style={{fontFamily:'nexaregular'}}>Prix:</Text> {item.prix} DNT
                    </Text>
                      <Text
                      style={{
                        color: Colors.white,
                        fontSize: scale(12),
                        fontFamily:'nexaregular'
                      }}
                    >
                      <Text style={{fontFamily:'nexaregular'}}>Ref:</Text> {item.reference}
                    </Text>
                    
                    </View>
                    </ImageBackground>
                  {/* <View
                    style={{
                      width: scale(280),
                      height: scale(50),
                      flexDirection: 'row',
                      justifyContent:'space-between'
                    }}
                  >
                    <View
                      style={{
                        flexDirection:'column',
                        flex:0.9,
                        justifyContent: 'space-evenly',
                        backgroundColor:'rgba(255,255,255,1)',
                        alignItems: "flex-start",
                        borderTopEndRadius: scale(60),
                      }}
                    >
                    <Text
                      style={{
                        color: Colors.logo1,
                        fontSize: scale(14),
                        paddingLeft: scale(10)
                      }}
                    >
                      {item.prix} DNT
                    </Text>
                    <Text
                      style={{
                        color: Colors.grey2,
                        fontSize: scale(10),
                        height:scale(25),
                        paddingLeft: scale(10),
                        width:scale(100),
                        marginBottom:5
                      }}
                    >
                      {item.adresse}
                    </Text>
                    
                    </View>
                    <View
                      style={{flex:0.2}}
                    ></View>
                    <View
                      style={{
                        flexDirection:'column',
                        flex:0.9,
                        justifyContent: 'space-evenly',
                        backgroundColor:'rgba(255,255,255,1)',
                        alignItems: "flex-end",
                        borderTopStartRadius: scale(60),
                      }}
                    >
                      <Text
                      style={{
                        color: Colors.logo1,
                        fontSize: scale(14),
                        paddingRight: scale(10)
                      }}
                    >
                      Ref: {item.reference}
                    </Text>
                    <Text
                      style={{
                        color: Colors.grey2,
                        fontSize: scale(10),
                        height:scale(25),
                        
                        paddingRight: scale(10)
                      }}
                    >
                      {item.typeBien}
                    </Text>
                    </View>
                  </View> */}
              </ImageBackground>
            </TouchableOpacity>
          )}
        </ScrollView>
        </View>
    </ImageBackground>
  );
}

const { height, width } = Dimensions.get('screen');


const _properties = [
  {
    price: 500000,
    description:"The Hollywood Reporter Marshmello Purchased Mulholland Estates Mansion for $10.8 Million",
    photo: Images.mansion1
  },
  {
    price: 600000,
    description:"The Hollywood Reporter Marshmello Purchased Mulholland Estates Mansion for $10.8 Million",
    photo: Images.mansion2
  },
  {
    price: 400000,
    description:"The Hollywood Reporter Marshmello Purchased Mulholland Estates Mansion for $10.8 Million",
    photo: Images.mansion3
  },
  {
    price: 500000,
    description:"The Hollywood Reporter Marshmello Purchased Mulholland Estates Mansion for $10.8 Million",
    photo: Images.mansion1
  },
  {
    price: 600000,
    description:"The Hollywood Reporter Marshmello Purchased Mulholland Estates Mansion for $10.8 Million",
    photo: Images.mansion2
  },
  {
    price: 400000,
    description:"The Hollywood Reporter Marshmello Purchased Mulholland Estates Mansion for $10.8 Million",
    photo: Images.mansion3
  },
]