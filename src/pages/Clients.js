import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, RefreshControl, Linking, Alert } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import Swipeable from 'react-native-swipeable';
import LetterPhoto from '../components/LetterPhoto';
import { useSelector } from 'react-redux';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Clients(props) {

  const { token, showAlert } = useAppContext()
  const [refreshing, setRefreshing] = useState(false)
  const [clients, setClients] = useState([])
  const [deleteActivated, setDeleteActivated] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh()
    console.log('refreshing')
    wait(2000).then(() => { setRefreshing(false) });
  }, []);

  const refresh = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${api.url}client/ListeClientByAgent`, requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result)
        if (result.data) {
          setClients(result.data)
          read()
        }
      })
      .catch(error => console.log('error', error));
  }

  const removeClient = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${api.url}client/${id}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        refresh()
        console.log(result)
      })
      .catch(error => console.log('error', error));
  }
  const createTwoButtonAlert = (id) =>
  showAlert({
    message: 'Supprimer cette demande ?',
    choice: true,
    onYes: ()=>{removeClient(id)},
  })
    // Alert.alert(
    //   "Supprimer",
    //   `Supprimer cette demande ?`,
    //   [
    //     {
    //       text: "Non",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "Oui", onPress: () => { removeClient(id) } }
    //   ]
    // );
      //marke new contents as read
  const agent = useSelector(state=>state.agent)
  const read = ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`)
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({
    clientNotif: false
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

  useEffect(() => {
    refresh()
  }, [token])
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
          onPress={() => { props.navigation.openDrawer() }}
        >
          <AntDesign name="menu-fold" size={30} color={Colors.white} />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.white,
            fontSize: scale(20),
            fontFamily: 'Nexa Light',
          }}
        >
          Liste des demandes
        </Text>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => { props.navigation.navigate("AddClient") }}
          >
            <AntDesign name="plus" size={30} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { props.navigation.navigate('Chat') }}
          >
            <AntDesign name="inbox" size={30} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1
        }}
      >
        <ScrollView
        contentContainerStyle={{flexDirection:'column-reverse'}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />}
        >
          {clients.map((item, index) =>
            <View
              key={index}
              style={{
                width: scale(280),
                height: scale(100),
                borderRadius: scale(5),
                overflow: 'hidden',
                alignSelf: 'center',
                marginTop: 20
              }}
            >
              <Swipeable
                //onSwipeStart={() => {setDeleteActivated(true) }}
                // onSwipeRelease={() => {setDeleteActivated(false) }}
                rightContent={<TouchableOpacity
                  style={{ backgroundColor: Colors.themeColor7, flex: 1, justifyContent: 'center', paddingLeft: 20 }}
                ><AntDesign name="close" size={30} color={Colors.white} /></TouchableOpacity>}
                rightButtonWidth={60}
                onRightActionRelease={() => { createTwoButtonAlert(item._id) }}
              >
                <View
                  style={{
                    width: scale(280),
                    height: scale(100),
                    flexDirection: "row",
                    backgroundColor: 'rgba(3, 57, 71,0.6)'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                    }}
                    onPress={()=>{props.navigation.navigate('ClientDetails', item)}}
                  >
                  <View
                    style={{
                      width: scale(51),
                      height: scale(51),
                      alignItems:'center',
                      justifyContent:'center',
                      margin:10
                    }}
                  >
                    {/* <Image
                      resizeMode='cover'
                      source={{ uri: `${api.url_photo}Client/${item.photo}` }}
                      style={{
                        width: scale(50),
                        height: scale(50),
                        borderRadius: scale(50),
                      }}
                    /> */}
                    <LetterPhoto 
                        width={scale(50)}
                        height={scale(50)}
                        fontSize={scale(20)}
                        name={item?.nom+" "+item?.prenom}
                        style={{
                          borderRadius: 80
                        }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'column', justifyContent: "space-evenly",
                      width: scale(162)
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <AntDesign name="user" size={20} color={Colors.themeColor7} />
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: scale(13),
                          width: scale(130),
                          marginLeft: 5,
                          fontFamily: 'nexaregular'
                        }}
                      >{item.nom} {item.prenom}</Text>
                    </View>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <AntDesign name="mail" size={20} color={Colors.themeColor7} />
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: scale(13),
                          width: scale(130),
                          marginLeft: 5,
                          fontFamily: 'nexaregular'
                        }}
                      >{item.email}</Text>
                    </View>
                    <View
                      style={{ flexDirection: 'row' }}
                    >
                      <AntDesign name="phone" size={20} color={Colors.themeColor7} />
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: scale(12),
                          width: scale(130),
                          marginLeft: 5,
                          fontFamily: 'nexaregular'
                        }}
                      >+216 {item.numeroTelephone}</Text>
                    </View>
                  </View>
                        </TouchableOpacity>
                  <Button
                    onPress={() => { Linking.openURL(`tel:${item.numeroTelephone}`) }}
                    colors={[Colors.themeColor9, Colors.themeColor3]}
                    style={{
                      backgroundColor: Colors.green,
                      height: scale(100),
                      width: scale(50),
                      overflow: 'hidden',
                    }}
                  >
                    <AntDesign name="phone" size={25} color="white" />
                  </Button>
                </View>
              </Swipeable>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const { height, width } = Dimensions.get('screen');