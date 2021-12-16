import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, TextInput, Switch, FlatList, Platform, Picker, ActivityIndicator } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Button from '../components/Button'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DatePicker from 'react-native-date-picker'
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import MultiOptionsSelect from '../components/MultiOptionsSelect';


export default function AddVisit(props) {

    const { token, currentUser } = useAppContext()
    const [errors, setErrors] = useState()
    const [selectedClient, setSelectedClient] = useState('')
    const [selectedProperties, setSelectedProperties] = useState()
    const [price, setPrice] = useState('')
    const [phone, setPhone] = useState('')
    const [from, setFrom] = useState(new Date())
    const [to, setTo] = useState(new Date())
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [clients, setClients] = useState([])
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState('')

    useEffect(() => {
        getClients()
        getProperties()
    }, [])
    console.log("currentUser = " , currentUser )
    //console.log("biens = " , properties )
    const getClients = () => {
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
                }
            })
            .catch(error => console.log('error', error));
    }
    const getProperties = () => {
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
                //console.log(result)
                setProperties(result.data)
            })
            .catch(error => console.log('error', error));
    }

    const handleOK = () => {
        setLoading(true)
        var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "refernceBien": selectedProperties,
  "frais": price,
  "addresse": address,
  "clientId": selectedClient[0],
  "dateDebut": from,
  "dateFien": to,
  "agent": currentUser,   
//   "statuMarcher": '',
//   "fedbakClient": '',
  "noteVisite": ''
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`${api.url}visite/addVisite`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    setLoading(false)
    if (result?.error?.errors) {
        console.log(result?.error?.errors)
        setErrors(result?.error?.errors)
    }
    else {
        showAlert({message: "Votre visite est ajoutée avec succès"})
    }
})
.catch(error => {
    setLoading(false)
    console.log('error', error)});
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
                    width: width,
                    height: scale(50),
                    backgroundColor: Colors.logo1,
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
                        color: 'white',
                        fontSize: scale(20)
                    }}
                >
                    Add Visit
                </Text>
                <TouchableOpacity
                //onPress={()=>{props.navigation.openDrawer()}}
                >
                    {/* <AntDesign name="inbox" size={30} color={Colors.white} /> */}
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1,
                    width: width,
                    alignItems: 'center',
                }}
            >
                <ScrollView
                    contentContainerStyle={{ alignItems: 'center',width:width }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            paddingVertical: 20,
                            width: scale(280)
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                borderRadius: scale(5),
                                marginVertical:5,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: scale(14),
                                    fontWeight: 'bold',
                                    marginLeft: 10,
                                    marginTop: 5
                                }}
                            >Debut</Text>
                            {/* <TouchableOpacity
                                onPress={() => { setOpenFrom(true) }}
                                style={{
                                    width: scale(100),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'white',
                                    borderBottomWidth: 2,
                                    borderColor: 'grey',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 10
                                }}
                            >
                                <Text>{[from.getHours(),
                                from.getMinutes()].join(':') + ' ' + [from.getMonth() + 1,
                                from.getDate(),
                                from.getFullYear()].join('/')
                                }</Text>
                            </TouchableOpacity> */}
                            
                            <DatePicker 
                                key="from"
                                //modal
                                open={openFrom}
                                date={from}
                                onConfirm={(date) => {
                                    console.log('from')
                                    setOpenFrom(false)
                                    setFrom(date)
                                }}
                                onCancel={() => {
                                    setOpenFrom(false)
                                }} />
                        </View>
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                borderRadius: scale(5),
                                marginVertical:5
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: scale(14),
                                    fontWeight: 'bold',
                                    marginLeft: 10,
                                    marginTop: 5
                                }}
                            >Fin</Text>
                            {/* <TouchableOpacity
                                onPress={() => { setOpenTo(true) }}
                                style={{
                                    width: scale(100),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'white',
                                    borderBottomWidth: 2,
                                    borderColor: 'grey',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 10
                                }}
                            >
                                <Text>{[to.getHours(),
                                to.getMinutes()].join(':') + ' ' + [to.getMonth() + 1,
                                to.getDate(),
                                to.getFullYear()].join('/')
                                }</Text>
                            </TouchableOpacity> */}
                            <DatePicker 
                                key="to"
                                //modal
                                open={openTo}
                                date={to}
                                onConfirm={(date) => {
                                    console.log('to')
                                    setOpenTo(false)
                                    setTo(date)
                                }}
                                onCancel={() => {
                                    setOpenTo(false)
                                }} />
                        </View>
                    </View>
                    <TextInput
                            placeholder="Adresse"
                            placeholderTextColor="grey"
                            value={address}
                            onChangeText={setAddress}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderBottomWidth: 2,
                                borderColor: errors?.adresse ? 'crimson' : 'white',
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: "white"
                            }}
                        />
                    {/* <TextInput
                        keyboardType='numeric'
                        placeholder="Téléphone"
                        placeholderTextColor="grey"
                        value={phone}
                        onChangeText={setPhone}
                        style={{
                            width: scale(250),
                            height: scale(40),
                            borderRadius: scale(5),
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderBottomWidth: 2,
                            borderColor: errors?.numeroTelephone ? 'crimson' : 'white',
                            paddingLeft: 10,
                            marginBottom: 10,
                            color: "white"
                        }}
                    /> */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            alignItems: 'center',
                            width: scale(250),
                            height: scale(40),
                            borderRadius: scale(5),
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderBottomWidth: 2,
                            borderColor: errors?.frais ? 'crimson' : 'white',
                            paddingLeft: 10,
                            marginBottom: 10
                        }}
                    >
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Prix"
                            placeholderTextColor="grey"
                            value={price}
                            onChangeText={setPrice}
                            style={{
                                width: scale(200),
                                height: scale(40),
                                color: "white"
                            }}
                        />
                        <Text
                            style={{
                                color: Colors.white,

                            }}
                        >TND</Text>
                    </View>
                    <MultiOptionsSelect
                        key={"Client"}
                        style={{ marginVertical: 10 }}
                        title="Client"
                        //multiple
                        data={clients} 
                        labelKey="nom"
                        onChange={(l) => { 
                            console.log(l)
                            setSelectedClient(l)
                        }}
                    />
                    <MultiOptionsSelect
                        key={"bien"}
                        style={{ marginVertical: 10 }}
                        title="Liste des biens"
                        //multiple
                        data={properties} 
                        labelKey="reference"
                        onChange={(l) => {  
                            console.log(l)
                            setSelectedProperties(l)
                        }}
                    />
                    <Button
                        onPress={handleOK}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={[Colors.green, Colors.logo1]}
                        style={{
                            width: scale(200),
                            height: scale(35),
                            borderRadius: scale(5),
                            elevation: scale(5),
                            alignSelf: 'center',
                            marginVertical: 20,
                            overflow: 'hidden',
                        }}
                    >
                        {loading ? 
                          <ActivityIndicator size="large" color="white" />  
                        :<Text
                            style={{
                                color: Colors.white,
                                fontSize: scale(20),
                            }}
                        >OK</Text>}
                    </Button>

                </ScrollView>
            </View>
        </ImageBackground>
    )

}



const { height, width } = Dimensions.get('screen');

// const K_OPTIONS = [
//     {
//         name: 'Juventus',
//         _id: 'JUVE',
//     },
//     {
//         name: 'Real Madrid',
//         _id: 'RM',
//     },
//     {
//         name: 'Barcelona',
//         _id: 'BR',
//     },
//     {
//         name: 'PSG',
//         _id: 'PSG',
//     },
//     {
//         name: 'FC Bayern Munich',
//         _id: 'FBM',
//     },
//     {
//         name: 'Manchester United FC',
//         _id: 'MUN',
//     },
//     {
//         name: 'Manchester City FC',
//         _id: 'MCI',
//     },
//     {
//         name: 'Everton FC',
//         _id: 'EVE',
//     },
//     {
//         name: 'Tottenham Hotspur FC',
//         _id: 'TOT',
//     },
//     {
//         name: 'Chelsea FC',
//         _id: 'CHE',
//     },
//     {
//         name: 'Liverpool FC',
//         _id: 'LIV',
//     },
//     {
//         name: 'Arsenal FC',
//         _id: 'ARS',
//     },

//     {
//         name: 'Leicester City FC',
//         _id: 'LEI',
//     },
// ]