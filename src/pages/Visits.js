import  React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, RefreshControl, ScrollView, TextInput } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import { api } from '../constants/api_config';
import { useAppContext } from '../context/AppContext';
import Swipeable from 'react-native-swipeable';
import Button from '../components/Button';
import * as Animatable from "react-native-animatable";
import {Picker} from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import MultiOptionsSelect from '../components/MultiOptionsSelect';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Visits(props) {

  const {token, showAlert} = useAppContext()
  const [refreshing, setRefreshing] = useState(false)
  const [visits, setVisits] = useState([])
  const [modal, setModal] = useState('')
  const [clientSatisfaction, setClientSatisfaction] = useState('clientSatisfait')
  const [ Marché, setMarché] = useState('marcherGagner')
  const [description, setDescription] = useState('')
  const [selectdID, setSelectdID] = useState('')
const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh()
    console.log('refreshing')
    wait(2000).then(() => { setRefreshing(false) });
  }, []);
  
  useEffect(()=>{
    refresh()
  },[token])
  const refresh = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`${api.url}visite/`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log("visits: ",result)
    if (result.data) {
      setVisits(result.data)
      read()
    }
  })
  .catch(error => console.log('error', error));
  }

  const patch = (id,object,message) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify(object);

var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`${api.url}visite/${id}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    if (result?.status=="success") {
      setModal('')
      refresh()
      showAlert({message: message})
    }
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
      visiteNotif:false
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
        Liste des visites
        </Text>
        <TouchableOpacity
            onPress={() => { props.navigation.navigate('Chat') }}
          >
            <AntDesign name="inbox" size={30} color={Colors.white} />
          </TouchableOpacity>
  </View>
  <View
          style={{
            flex:1
          }}
        >
  <ScrollView
      contentContainerStyle={{alignItems: 'center',flexDirection: 'column-reverse', paddingTop:50}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />}
        >
          { visits.map((el,index)=>
            <Animatable.View
            animation="bounceIn"
            delay={200}
              key={index}
              style={{
                width: scale(300),
                borderRadius: scale(10),
                marginVertical:10,
                elevation: scale(5),
                overflow: 'hidden',
                
              }}
            >
              <Swipeable
                //onSwipeStart={() => {setDeleteActivated(true) }}
                // onSwipeRelease={() => {setDeleteActivated(false) }}
                
                rightButtons={ (el.statusVisite=='enattend' || el.statusVisite=='encours') && [
                    <TouchableOpacity
                    onPress= {()=>{setModal('repport') ; setSelectdID(el._id) }}
                  style={{ backgroundColor: Colors.themeColor0, flex: 1, justifyContent: 'center', paddingLeft: 5 }}
                >
                  <AntDesign style={{marginLeft:20}} name="close" size={30} color={Colors.white} />
                  <Text style={{color:'white'}} >Reporter</Text>
                    </TouchableOpacity>,
                    <TouchableOpacity
                    onPress= {()=>{setModal('cancel') ; setSelectdID(el._id) }}
                    style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', paddingLeft: 5 }}
                  >
                    <AntDesign style={{marginLeft:20}} name="close" size={30} color={Colors.white} />
                    <Text style={{color:'white'}} >Annuler</Text>
                      </TouchableOpacity>
                ]}
                leftButtons={ el.statusVisite=='enattend' ? [
                  <TouchableOpacity
                    onPress={() => { setModal('started'); setSelectdID(el._id) }}
                    style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'flex-end', padding: 5 }}
                  >
                    <AntDesign style={{ marginRight: 20 }} name="close" size={30} color={Colors.white} />
                    <Text style={{ color: 'white' }} >Démmarer</Text>
                  </TouchableOpacity>
                ] :
                el.statusVisite=='encours' ?
                [
                  <TouchableOpacity
                    onPress={() => { setModal('finished'); setSelectdID(el._id) }}
                    style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'flex-end', padding: 5 }}
                  >
                    <AntDesign style={{ marginRight: 20 }} name="close" size={30} color={Colors.white} />
                    <Text style={{ color: 'white' }} >Terminer</Text>
                  </TouchableOpacity>
                ] : null
              }
                rightButtonWidth={70}
                onRightActionRelease={() => { 
                  //createTwoButtonAlert(item._id) 
                }}
              >
              <TouchableOpacity
                onPress={ ()=>{ ( el.statusVisite=="encours" || el.statusVisite=="enattend" ) ? props.navigation.navigate('VisitDetails', el) : null } }
                  style={{
                    flex:1,
                    flexDirection: "row",
                    justifyContent:'space-between',
                  }}
                >
                  <View
                style={{
                  //backgroundColor:'white',
                }}
              >
                <Image 
                  resizeMode="cover"
                  source={el?.refernceBien?.photo[0] ? {uri: `${api.url_photo}Categories/${el?.refernceBien?.photo[0]}`} : Images.empty }
                  style={{
                    width: scale(120),
                    height: scale(120),
                    backgroundColor: Colors.themeColor8
                  }}
                />
              
                
              </View>
                  <View
                  style={{
                    backgroundColor:Colors.themeColor11,
                    flex: 1,
                    padding:5
                  }}
                  >
                 
                    {/* <MaterialCommunityIcons name="clock" size={25} color={Colors.themeColor1} /> */}
                    <View style={{flexDirection:'row',marginVertical:2,
                      backgroundColor:Colors.themeColor9,
                      borderRadius:5,
                      justifyContent:'center'
                      }} >
                    <Text
                style={{
                  color:'white',
                  fontFamily: 'nexaregular'
                }}
              >{new Date(el.dateDebut).getDate()}-{new Date(el.dateDebut).getMonth()+1}-{new Date(el.dateDebut).getFullYear()+1} | </Text>
              <Text
                style={{
                  color:'white',
                  fontFamily: 'nexaregular'
                }}
              >{new Date(el.dateDebut).getHours()}:{new Date(el.dateDebut).getUTCMinutes()} à {new Date(el.dateFien).getHours()}:{new Date(el.dateFien).getUTCMinutes()} </Text>
                  </View>
                  
              <View
                    style={{
                      flexDirection:'row',
                      alignItems: 'center',
                      marginVertical:2
                    }}
                  >
                    {/* <MaterialCommunityIcons name="account-circle" size={25} color={Colors.themeColor1} /> */}
                    <Text
                style={{
                  color:Colors.themeColor7,
                  fontSize:scale(13),
                  fontFamily: 'Nexa Bold'
                }}
              >Client: </Text>
              <Text
                style={{
                  color:'white',
                  fontSize:scale(12),
                  fontFamily: 'nexaregular'
                }}
              >{el?.clientId?.nom} {el?.clientId?.prenom}</Text>
              </View>
              <View
                    style={{flexDirection:'row',alignItems: 'center',marginVertical:2}}
                  >
                    {/* <MaterialCommunityIcons name="cash-multiple" size={25} color={Colors.themeColor1} /> */}
                    <Text
                style={{
                  color: Colors.themeColor7,
                  fontSize:scale(13),
                  fontFamily: 'Nexa Bold'
                }}
              >Prix: </Text>
              <Text
                style={{
                  color:'white',
                  fontSize:scale(11),
                  fontFamily: 'nexaregular'
                }}
              >{el.frais} DT </Text>
              </View>
              {/* <View
                    style={{flexDirection:'row',alignItems: 'center'}}
                  >
                    <MaterialCommunityIcons name="phone-classic" size={25} color={"#a83e32"} />
              <Text
                style={{
                  color:'white'
                }}
              >   {el?.clientId?.numeroTelephone}</Text>
              </View> */}
              <Text
                  style={{
                    fontFamily: "nexaregular",
                    backgroundColor: el.statusVisite=='enattend' ? 'green' : 
                    el.statusVisite=='encours' ? 'orange' :
                    el.statusVisite=='terminer' ? 'grey' :
                     'crimson',
                    alignSelf:'center',
                    marginTop: 10,
                    padding:5,
                    borderRadius: scale(10),
                    color: Colors.white,
                  }}
                >{
                  el.statusVisite=='enattend' ? 'En attente' : 
                  el.statusVisite=='encours' ? 'En cours' :
                  el.statusVisite=='anuller' ? 'Annulée' :
                  el.statusVisite=='raporter' ? 'Reportée' :
                  'Terminée' }</Text>
              </View>
              
              </TouchableOpacity>
              </Swipeable>
            </Animatable.View>
          )}
  </ScrollView>
  
  {modal !='' && <TouchableOpacity
  activeOpacity={1}
    onPress= {()=>{setModal('')}}
    style={{
      position: 'absolute',
      width: width,
      height: height,
      backgroundColor: 'rgba(0,0,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {modal=='finished' && 
      <Animatable.View
              animation="bounceIn"
              delay={100}
              style={{
                width: scale(300),
              height: scale(300),
              backgroundColor: Colors.themeColor0,
              borderRadius: scale(10),
              elevation: scale(5),
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
              activeOpacity={1}
            >
              {/* <View
                style={{ borderColor: Colors.themeColor7, borderWidth: 2, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.2)', elevation: 0 }}
              >
                <Picker
                  //mode="dropdown"
                 
                  selectedValue={clientSatisfaction}
                  style={{ height: scale(20), width: scale(250), color: Colors.white }}
                  onValueChange={(itemValue, itemIndex) => setClientSatisfaction(itemValue)}
                >
                  {select1.map((item, index) => <Picker.Item key={index} label={item.id} value={item.value} />)}
                </Picker>
              </View>
              <View
                 style={{ borderColor: Colors.themeColor7, borderWidth: 2, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.2)', elevation: 0 }}
              >
                <Picker
                  //mode="dropdown"
                  selectedValue={Marché}
                  style={{ height: scale(40), width: scale(250), color: Colors.white, fontFamily: 'nexaregular' }}
                  onValueChange={(itemValue, itemIndex) => setMarché(itemValue)}
                >
                  {select2.map((item, index) => <Picker.Item key={index} label={item.id} value={item.value} />)}
                </Picker>
              </View> */}
              
              <MultiOptionsSelect
                        //key={"name"}
                        style={{ marginVertical: 0 }}
                        title="Satisfaction"
                        //multiple
                        data={satisfaction} 
                        showMode="number"
                        //labelKey="name"
                        onChange={(l) => { 
                            console.log(l)
                            setClientSatisfaction(l[0])
                        }}
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.9)',
                            marginTop: 10
                        }}
                        textStyle={{
                            fontFamily: 'nexaregular',
                            color: Colors.themeColor0
                        }}
                    />
                    <MultiOptionsSelect
                        labelKey={"label"}
                        style={{ marginVertical: 0 }}
                        title="Feedback"
                        //multiple
                        data={feedback} 
                        showMode="number"
                        //labelKey="name"
                        onChange={(l) => { 
                            console.log(l)
                            setMarché(l[0])
                        }}
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.9)',
                            marginTop: 10
                        }}
                        textStyle={{
                            fontFamily: 'nexaregular',
                            color: Colors.themeColor0
                        }}
                    />
              <TextInput
                placeholder="Note.."
                placeholderTextColor={Colors.white}
                value={description}
                onChangeText={setDescription}
                maxLength={150}
                multiline
                numberOfLines={4}
                style={{
                  width: scale(250),
                  height: scale(100),
                  borderRadius: scale(5),
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderBottomWidth: 2,
                  borderColor: Colors.themeColor7,
                  paddingLeft: 10,
                  color: "white",
                  textAlignVertical: 'top',
                  fontFamily: 'nexaregular'
                }}
              />
              <Button
                onPress={() => {
                  patch(selectdID, { "noteVisite": description, "statusVisite": 'terminer', "fedbakClient": clientSatisfaction, "statuMarcher": Marché, }, "Visite est terminée")
                }}
                start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={[Colors.themeColor9, Colors.themeColor10]}
                        style={{
                            width: scale(80),
                            height: scale(30),
                            borderRadius: scale(5),
                            elevation: scale(5),
                            overflow: 'hidden',
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: scale(16),
                                fontFamily: 'nexaregular'
                            }}
                        >OK</Text>
                    </Button>
                    </TouchableOpacity>
    </Animatable.View>}
    {(modal=='cancel' || modal == "repport") && 
    
    <Animatable.View
              animation="bounceIn"
              delay={100}
              style={{
                width: scale(300),
                height: scale(300),
                backgroundColor: Colors.themeColor0,
                borderRadius: scale(10),
                elevation: scale(5),
              }}
            >
              <TouchableOpacity
                style={{
                  flex:1,
                  alignItems: 'center',
                  justifyContent: 'space-evenly'
                }}
                activeOpacity={1}
              >
      <TextInput
                            placeholder="Note.."
                            placeholderTextColor={Colors.white}
                            value={description}
                            onChangeText={setDescription}
                            maxLength={150}
                            multiline
                            numberOfLines={4}
                            style={{
                                width: scale(250),
                                height: scale(100),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderBottomWidth: 2,
                                borderColor: Colors.themeColor7,
                                paddingLeft: 10,
                                color: "white",
                                textAlignVertical: 'top'
                            }}
                        />
                        <Button
                        onPress={()=>{
                          patch(selectdID, {"noteVisite": description, "statusVisite": modal == 'cancel' ? 'anuller' : 'raporter'} ,modal == 'cancel' ? "La visite a ete annulée": "La visite a ete raportée")
                        }}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={[Colors.themeColor9, Colors.themeColor10]}
                        style={{
                            width: scale(200),
                            height: scale(35),
                            borderRadius: scale(5),
                            elevation: scale(5),
                            overflow: 'hidden',
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: scale(20),
                            }}
                        >OK</Text>
                    </Button>
      </TouchableOpacity>
      
      </Animatable.View>}
      {modal=='started' && <Animatable.View
              animation="bounceIn"
              delay={100}
              style={{
                width: width*0.9,
            height: scale(140),
            backgroundColor: Colors.themeColor0,
            borderRadius: scale(10),
            elevation: scale(5),
              }}
            >
              <TouchableOpacity
                style={{
                  flex:1,
                  alignItems: 'center',
                  justifyContent: 'space-evenly'
                }}
                activeOpacity={1}
              >
          <Text
            style={{
              textAlign: 'center',
                fontSize: scale(14),
                width: scale(240),
                fontFamily: 'nexaregular',
                color: Colors.white
            }}
          >Voulez vous commencer votre visite maintenant?</Text>
          <Button
            onPress={() => {
              patch(selectdID, { "statusVisite": 'encours' }, "Votre visite a commencée ")
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            colors={[Colors.themeColor9, Colors.themeColor10]}
            style={{
              width: scale(200),
              height: scale(35),
                            borderRadius: scale(5),
                            elevation: scale(5),
                            overflow: 'hidden',
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: scale(20),
                                fontFamily: 'nexaregular'
                            }}
                        >OUI</Text>
                    </Button>
      </TouchableOpacity>
      </Animatable.View>}
      
  </TouchableOpacity>}
  </View>
    </ImageBackground>
  );
}

const { height, width } = Dimensions.get('screen');

const select1 = [
  {
    id: 'Client satisfait',
    value: 'clientSatisfait'
  },
  {
    id: 'Client non satisfait',
    value: 'clientNonSatisfait'
  }
]
const satisfaction = [
  {
    label: 'Client satisfait',
    _id: 'clientSatisfait'
  },
  {
    label: 'Client non satisfait',
    _id: 'clientNonSatisfait'
  }
]
const select2 = [
  {
    id: 'Marché gagné',
    value: 'marcherGagner'
  },
  {
    id: 'Marché perdu',
    value: 'marcherPerdu'
  },
  {
    id: 'Negociation en cours',
    value: 'negociationEnCours'
  },
  {
    id: 'Revisite',
    value: 'revisite'
  },
  {
    id: 'Voir un autre bien',
    value: 'Voir un autre bien'
  },
  {
    id: 'Autre',
    value: 'Autre'
  }
]
const feedback = [
  {
    label: 'Marché gagné',
    _id: 'marcherGagner'
  },
  {
    label: 'Marché perdu',
    _id: 'marcherPerdu'
  },
  {
    label: 'Negociation en cours',
    _id: 'negociationEnCours'
  },
  {
    label: 'Revisite',
    _id: 'revisite'
  },
  {
    label: 'Voir un autre bien',
    _id: 'Voir un autre bien'
  },
  {
    label: 'Autre',
    _id: 'Autre'
  }
]
const minmax = [
  {_id: "0-50"},
  {_id: "50-100"},
  {_id: "100-150"},
  {_id: "150-200"},
  {_id: "200-250"},
  {_id: "250-300"},
  {_id: "300-350"},
  {_id: "350-400"},
  {_id: "400-600"},
  {_id: "600-800"},
  {_id: "+800"},
]