import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Button from '../components/Button';
import { api } from '../constants/api_config';
import { useAppContext } from '../context/AppContext';
import * as Animatable from "react-native-animatable";
import Swiper from 'react-native-swiper'
import { useSelector } from 'react-redux';


export default function Tasks(props) {

  const {token} = useAppContext()
  const [tasks, setTasks] = useState([])
  const [selectdID, setSelectdID] = useState('')
  const [modal, setModal] = useState('')

  const getTasks = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`${api.url}tache/ListeTacheByAgent/`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    if (result.data) {
      setTasks(result.data)
      read()
    }
  })
  .catch(error => console.log('error', error));
  }
  const moveTask = (id,type) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "statusTache": type
    });
    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

fetch(`${api.url}tache/${id}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    setModal('')
    getTasks()
  })
  .catch(error => console.log('error', error));
  }
  useEffect(()=>{
    getTasks()
  },[token])
  //marke new contents as read
  const agent = useSelector(state=>state.agent)
const read = ()=>{
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`)
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  taskNotif:false
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
        Liste des tâches
        </Text>
        <View
          style={{flexDirection:'row'}}
        >
        <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => { props.navigation.navigate("AddTask") }}
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
  <Button
        onPress={()=>{getTasks()}}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.themeColor9, Colors.themeColor11]}
        style={{
          width: scale(60),
            height: scale(24),
            borderRadius: scale(50),
            elevation: scale(5),
            margin: 10,
            overflow: 'hidden',
            alignSelf: 'flex-end',
            zIndex:1
        }}>
          <MaterialCommunityIcons name="refresh" size={25} color={Colors.themeColor7} />
        </Button>
  <View
  style={{
    width: width,
    height:height*0.8
  }}
  >
    
    <Swiper
    activeDotColor={Colors.themeColor1}
                            loop={false}
                            showsButtons={false}>
      <View
        style={{
          flexDirection:'column',
          alignItems:'flex-start',
          paddingLeft:10,
          height:scale(500)
        }}
      >
        <Button
        disabled
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.themeColor0, Colors.themeColor1]}
        style={{
            height: scale(30),
            borderRadius: scale(50),
            elevation: scale(5),
            marginVertical: 20,
            overflow: 'hidden',
            borderBottomStartRadius: 0
        }}>
          <Text
            style={{
              color:'white',
              fontSize: scale(16),
              marginHorizontal: 20,
              fontFamily: 'nexaregular'
            }}
          >A faire</Text>
        </Button>
        <View
          style={{
            width:width*0.9,
            height:scale(500),
          }}
        >
        <ScrollView>
        {tasks.map((el,index)=> el.statusTache=='À Faire' &&
        <Pressable
        key={index}
        onLongPress={()=> {
          setSelectdID(el._id)
          setModal('1')
        }} 
      style={{
        width:width*0.9,
        height:scale(70),
        backgroundColor: Colors.themeColor0,
        borderRadius:scale(10),
        elevation:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginVertical:5,
        paddingRight:10,
      }}
    >
      <View
        style={{
          width:scale(7),
          height:scale(50),
          borderTopEndRadius:scale(5),
          borderBottomEndRadius: scale(5),
          backgroundColor:Colors.bluesky
        }}
      ></View>
      <View
        style={{}}
      >
        <Text
          style={{color:Colors.themeColor11,fontSize:scale(13),fontFamily:'Nexa Bold'}}
        >{el.nomTache}</Text>
        <Text
          style={{color:Colors.white,fontSize:scale(12),height:scale(50),width:scale(160), fontFamily: 'nexaregular'}}
        >{el.description}</Text>
      </View>
      
      <View
                style={{flexDirection:'column',alignItems: 'center'}}
              >
                <MaterialCommunityIcons name="clock" size={25} color={Colors.themeColor6} />
                <View style={{marginLeft:5}} >
                <Text
                  style={{fontFamily: 'nexaregular', color: 'white'}}
                >
                {new Date(el.dateDebut).getDate()}-{new Date(el.dateDebut).getMonth()+1}-{new Date(el.dateDebut).getFullYear()+1} 
                </Text>
          <Text
                  style={{fontFamily: 'nexaregular', color: 'white'}}
                >
          {new Date(el.dateDebut).getHours()}:{new Date(el.dateDebut).getUTCMinutes()} à {new Date(el.dateFien).getHours()}:{new Date(el.dateFien).getUTCMinutes()} 
          </Text>
              </View>
              </View>
    </Pressable>
        )}
        </ScrollView>
        </View>
      </View>
      <View
        style={{
          flexDirection:'column',
          alignItems:'flex-start',
          paddingLeft:10
        }}
      >
        <Button
        disabled
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.themeColor2, Colors.themeColor3]}
        style={{
            height: scale(30),
            borderRadius: scale(50),
            elevation: scale(5),
            marginVertical: 20,
            overflow: 'hidden',
            borderBottomStartRadius: 0
        }}>
          <Text
            style={{
              color:'white',
              fontSize: scale(16),
              marginHorizontal: 20,
              fontFamily: 'nexaregular'
            }}
          >En cours</Text>
        </Button>
        <View
          style={{
            width:width*0.9,
            height:scale(500),
          }}
        >
        <ScrollView>
        {tasks.map((el,index)=> el.statusTache=='En cours' &&
        <Pressable
        key={index}
        onLongPress={()=> {
          setSelectdID(el._id)
          setModal('2')
        }} 
      style={{
        width:width*0.9,
        height:scale(70),
        backgroundColor:Colors.themeColor0,
        borderRadius:scale(10),
        elevation:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginVertical:5,
        paddingRight:10
      }}
    >
      <View
        style={{
          width:scale(7),
          height:scale(50),
          borderTopEndRadius:scale(5),
          borderBottomEndRadius: scale(5),
          backgroundColor:Colors.yellow
        }}
      ></View>
      <View
        style={{}}
      >
        <Text
          style={{color:Colors.themeColor11,fontSize:scale(13),fontFamily:'Nexa Bold'}}
        >{el.nomTache}</Text>
        <Text
          style={{color:"white",fontSize:scale(12),height:scale(50),width:scale(160),fontFamily:'nexaregular'}}
        >{el.description}</Text>
      </View>
      <View
                style={{flexDirection:'column',alignItems: 'center'}}
              >
                <MaterialCommunityIcons name="clock" size={25} color={Colors.themeColor6} />
                <View style={{marginLeft:5}} >
                <Text
                  style={{fontFamily: 'nexaregular', color: 'white'}}
                >
                {new Date(el.dateDebut).getDate()}-{new Date(el.dateDebut).getMonth()+1}-{new Date(el.dateDebut).getFullYear()+1} 
                </Text>
          <Text
                  style={{fontFamily: 'nexaregular', color: 'white'}}
                >
          {new Date(el.dateDebut).getHours()}:{new Date(el.dateDebut).getUTCMinutes()} à {new Date(el.dateFien).getHours()}:{new Date(el.dateFien).getUTCMinutes()} 
          </Text>
              </View>
              </View>
    </Pressable>
        )}
        </ScrollView>
        </View>
      </View>
      <View
        style={{
          flexDirection:'column',
          alignItems:'flex-start',
          paddingLeft:10
        }}
      >
        <Button
        disabled
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.themeColor10, Colors.themeColor11]}
        style={{
            height: scale(30),
            borderRadius: scale(50),
            elevation: scale(5),
            marginVertical: 20,
            overflow: 'hidden',
            borderBottomStartRadius: 0
        }}>
          <Text
            style={{
              color:'white',
              fontSize: scale(16),
              marginHorizontal: 20,
              fontFamily: 'nexaregular'
            }}
          >Terminée</Text>
        </Button>
        <View
          style={{
            width:width*0.9,
            height:scale(500),
          }}
        >
        <ScrollView>
          {tasks.map((el,index)=> (el.statusTache=='Fini' || el.statusTache=='Reporté') &&
        <Pressable
        key={index}
        onLongPress={()=> {
          setSelectdID(el._id)
          setModal('3')
        }} 
      style={{
        width:width*0.9,
        height:scale(70),
        backgroundColor: Colors.themeColor0,
        borderRadius:scale(10),
        elevation:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginVertical:5,
        paddingRight:10
      }}
    >
      <View
        style={{
          width:scale(7),
          height:scale(50),
          borderTopEndRadius:scale(5),
          borderBottomEndRadius: scale(5),
          backgroundColor: el.statusTache=='Fini' ? Colors.green : 'crimson'
        }}
      ></View>
      <View
        style={{}}
      >
        <Text
          style={{color:Colors.themeColor11,fontSize:scale(13),fontFamily:'Nexa Bold'}}
        >{el.nomTache}</Text>
        <Text
          style={{color:"white",fontSize:scale(12),height:scale(50),width:scale(160),fontFamily:'nexaregular'}}
        >{el.description}</Text>
        {el.statusTache=='Reporté' && 
        <Text
        style={{
          color:'white',
          backgroundColor:"crimson",
          fontSize:scale(12),
          height:scale(20),
          paddingHorizontal:10,
          borderRadius:scale(10),
          position:'absolute',
          left:"70%",
          fontFamily: 'nexaregular'
        }}
      >Reporté</Text>
        }
      </View>
      
      <View
                style={{flexDirection:'column',alignItems: 'center'}}
              >
                <MaterialCommunityIcons name="clock" size={25} color={Colors.themeColor6} />
                <View style={{marginLeft:5}} >
                <Text
                  style={{fontFamily: 'nexaregular', color: 'white'}}
                >
                {new Date(el.dateDebut).getDate()}-{new Date(el.dateDebut).getMonth()+1}-{new Date(el.dateDebut).getFullYear()+1} 
                </Text>
          <Text
                  style={{fontFamily: 'nexaregular', color: 'white'}}
                >
          {new Date(el.dateDebut).getHours()}:{new Date(el.dateDebut).getUTCMinutes()} à {new Date(el.dateFien).getHours()}:{new Date(el.dateFien).getUTCMinutes()} 
          </Text>
              </View>
              </View>
    </Pressable>
        )}
        </ScrollView>
        </View>
      </View>
    </Swiper>

  </View>
  {modal!= '' && <TouchableOpacity
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
   
      <Animatable.View
              animation="zoomIn"
              delay={0}
              style={{
                width: width,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                flexDirection: 'row'
              }}
            >
              
              { modal!='1' && <Button
        onPress= {()=>{moveTask(selectdID,'À Faire')}}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[ Colors.bluesky, Colors.bluesky,Colors.themeColor1]}
        style={{
          width: width*0.4,
          height: scale(60),
          elevation: scale(5),
          overflow: 'hidden',
          borderRadius: scale(10)
        }}>
          
          <View
            style={{
            flexDirection: 'row',
            alignItems: 'center',
            }}
          >
            <AntDesign name="left" size={30} color={Colors.white} style={{marginRight:-16}} />
          <AntDesign name="left" size={30} color={Colors.white} />
          <Text
            style={{
              color:'white',
              fontSize: scale(16),
              fontFamily: 'nexaregular',
              marginHorizontal: 20
            }}
          >A faire</Text>
          </View>
        </Button>}
        { modal!='2' && <Button
        onPress= {()=>{moveTask(selectdID,'En cours')}}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.themeColor1, Colors.yellow, Colors.yellow]}
        style={{
          width: width*0.4,
          height: scale(60),
          elevation: scale(5),
          overflow: 'hidden',
          borderRadius: scale(10)
        }}>
          <View
            style={{
            flexDirection: 'row',
            alignItems: 'center',
            }}
          >
            { modal=='3' && <><AntDesign name="left" size={30} color={Colors.white} style={{marginRight:-16}} />
          <AntDesign name="left" size={30} color={Colors.white} /></>}
          <Text
            style={{
              color:'white',
              fontSize: scale(16),
              fontFamily: 'nexaregular',
              marginHorizontal: 20
            }}
          >En cours</Text>
          { modal=='1' && <><AntDesign name="right" size={30} color={Colors.white} style={{marginRight:-16}} />
          <AntDesign name="right" size={30} color={Colors.white} /></>}
          </View>
          
        </Button>}
        { modal!='3' && <Button
        onPress= {()=>{moveTask(selectdID,'Fini')}}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.themeColor1, Colors.green,Colors.green]}
        style={{
            width: width*0.4,
            height: scale(60),
            elevation: scale(5),
            overflow: 'hidden',
            borderRadius: scale(10)
        }}>
          <View
            style={{
            flexDirection: 'row',
            alignItems: 'center',
            }}
          >
          <Text
            style={{
              color:'white',
              fontSize: scale(16),
              fontFamily: 'nexaregular',
            }}
          >Terminée</Text>
          <AntDesign name="right" size={30} color={Colors.white} style={{marginRight:-16}} />
          <AntDesign name="right" size={30} color={Colors.white} />
          </View>
        </Button>}
            </Animatable.View>
            <Animatable.View
              animation="fadeInUp"
              delay={500}
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row'
              }}
            >
            <TouchableOpacity
                onPress= {()=>{moveTask(selectdID,'Reporté')}}
                style={{
                  width:scale(100),
                  height:scale(25),
                  backgroundColor: 'white',
                  borderBottomEndRadius:scale(10),
                  borderBottomLeftRadius:scale(10),
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  elevation:5,
                  flexDirection:'row',
                  marginTop:10
                }}
              > 
                <AntDesign name="close" size={20} color='crimson' />
                <Text
                  style={{
                    color:'crimson',
                    fontWeight:'bold'
                  }}
                >Reporter?</Text>
              </TouchableOpacity>
              </Animatable.View>
            </TouchableOpacity>
            }
           
    </ImageBackground>
  );
}

const { height, width } = Dimensions.get('screen');