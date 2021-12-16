import * as React from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';



export default function Profil(props) {
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
      backgroundColor: Colors.logo1,
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
          fontSize: scale(20)
        }}
      >
        Profil
        </Text>
        <TouchableOpacity
        //onPress={()=>{props.navigation.openDrawer()}}
      >
        <AntDesign name="inbox" size={30} color={Colors.white} />
      </TouchableOpacity>
  </View>
  
    </ImageBackground>
  );
}

const { height, width } = Dimensions.get('screen');