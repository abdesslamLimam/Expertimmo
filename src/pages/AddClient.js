import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, TextInput, Switch, FlatList, Platform, Picker } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Button from '../components/Button'
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DatePicker from 'react-native-date-picker'
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import LetterPhoto from '../components/LetterPhoto';
import MultiOptionsSelect from '../components/MultiOptionsSelect';
const isEmailValid = (email) => {
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(String(email).toLowerCase())
}
export default function AddClient(props) {



    const { token, currentUser, showAlert } = useAppContext()
    const [errors, setErrors] = useState()
    const [agences, setAgences] = useState([])
    const [selectedValue, setSelectedValue] = useState("");
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [budget, setBudget] = useState('50-100')
    const [besion, setBesion] = useState('Maison')
    const [pic, setPic] = useState('')
    const [transaction, setTransaction] = useState('location')
    const [zone, setZone] = useState('')
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    //console.log(currentUser)
    const checkEmail = (email) => {
        if (email == '') {
            setEmailErrorMessage("Saissisez votre email")
            return false
        }
        else if (!isEmailValid(email)) {
            setEmailErrorMessage("Email non valide")
            return false
        }
        else {
            setEmailErrorMessage('')
            return true
        }
    }
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${api.url}agence/AllAgence`, requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log(result)
                if (result.data) {
                    setAgences(result.data)
                }
            })
            .catch(error => console.log('error', error));
    }, [])


    const handleOK = () => {
        let emailTest = checkEmail(email)
        if(emailTest && zone) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append("nom", firstName);
        formdata.append("prenom", lastName);
        formdata.append("numeroTelephone", phone);
        formdata.append("email", email);
        formdata.append("typeTransaction", transaction);
        formdata.append("agentID", currentUser);
        formdata.append("agence", selectedValue);
        formdata.append("budget", budget);
        formdata.append("besoin", besion);
        formdata.append("zone", zone);
        // if (pic != '') {
        //     formdata.append("photo", {
        //         name: pic.path.split('/').pop(),
        //         size: pic.size,
        //         type: pic.mime,
        //         width: pic.width,
        //         uri: pic.path,
        //     });
        // }

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(`${api.url}client/addClient`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result?.error?.errors) {
                    console.log(result?.error?.errors)
                    setErrors(result?.error?.errors)
                }
                else if(result?.data?.UserID) {
                    showAlert({message: "Votre demande est ajoutée avec succès"})
                    props.navigation.goBack()
                }
            })
            .catch(error => console.log('error', error));
        } else {
            if (!zone) {setErrors({zone:'err'})}
        }
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
            fontFamily: 'Nexa Light',
                    }}
                >
                    Ajouter une demande
                </Text>
                <TouchableOpacity
            onPress={() => { props.navigation.navigate('Chat') }}
          >
            <AntDesign name="inbox" size={30} color={Colors.white} />
          </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <ScrollView
                    style={{width:width}}
                    contentContainerStyle={{alignItems: 'center'}}
                >
                    {/* <Button
                        onPress={() => {
                            ImagePicker.openPicker({
                                multiple: false,
                                mediaType: 'photo'
                            }).then(images => {
                                console.log(images);
                                setPic(images)
                            });
                        }}
                        colors={[Colors.white, Colors.grey2]}
                        style={{
                            width: scale(100),
                            height: scale(100),
                            borderRadius: scale(5),
                            elevation: scale(5),
                            alignSelf: 'center',
                            marginLeft: scale(10),
                            marginVertical: scale(30),
                            borderWidth:2,
                            borderColor: 'white',
                            overflow: 'hidden',
                        }}
                    >
                        {pic == '' ? <MaterialCommunityIcons name="image-plus" size={30} color={Colors.white} /> :
                            <Image source={{ uri: pic.path }} resizeMode="cover"
                                style={{
                                    width: scale(100),
                                    height: scale(100),
                                }} />
                        }
                    </Button> */}
                    {(firstName && lastName) ? <LetterPhoto 
                        width={scale(80)}
                        height={scale(80)}
                        fontSize={scale(24)}
                        name={firstName+" "+lastName}
                        style={{alignSelf: 'center',marginVertical: 20}}
                    /> : 
                    <View
                        style={{
                            alignSelf: 'center',
                            marginVertical: 20,
                            width: scale(80),
                            height: scale(80),
                            borderRadius: scale(80),
                            backgroundColor: Colors.themeColor0,
                            alignItems:'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{color: Colors.white, fontSize: scale(20),
                                    fontFamily: 'nexaregular'}}>Aa</Text>
                    </View>
                }
                    <TextInput
                        placeholder="Nom"
                        placeholderTextColor={Colors.themeColor0}
                        value={firstName}
                        onChangeText={setFirstName}
                        style={{
                            width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.nom ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                        }}
                    />
                    <TextInput
                        placeholder="Prénom"
                        placeholderTextColor={Colors.themeColor0}
                        value={lastName}
                        onChangeText={setLastName}
                        style={{
                            width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.prenom ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                        }}
                    />
                    <TextInput
                        keyboardType='numeric'
                        placeholder="Téléphone"
                        placeholderTextColor={Colors.themeColor0}
                        value={phone}
                        onChangeText={setPhone}
                        style={{
                            width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.numeroTelephone ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                        }}
                    />
                    <TextInput
                        placeholder="email"
                        placeholderTextColor={Colors.themeColor0}
                        value={email}
                        onChangeText={setEmail}
                        style={{
                            width: scale(250),
                            height: scale(40),
                            borderRadius: scale(5),
                            backgroundColor: 'rgba(3, 57, 71,0.6)',
                            borderBottomWidth: 2,
                            borderColor: email && !isEmailValid(email) ? 'crimson' : Colors.themeColor0,
                            paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                        }}
                    />
                    <Text
                        style={{color:'crimson'}}
                    >{emailErrorMessage}</Text>
                    <MultiOptionsSelect
                        //key={"name"}
                        style={{ marginVertical: 10 }}
                        title="Type"
                        //multiple
                        data={transactions} 
                        //labelKey="name"
                        onChange={(l) => { 
                            console.log(l)
                           setTransaction(l[0])
                        }}
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.9)'
                        }}
                        textStyle={{
                            fontFamily: 'nexaregular',
                            color: Colors.themeColor0
                        }}
                    />
                    <MultiOptionsSelect
                        labelKey={"label"}
                        style={{ marginVertical: 10 }}
                        title="Catégorie"
                        //multiple
                        data={types} 
                        //labelKey="name"
                        onChange={(l) => { 
                            console.log(l)
                            setBesion(l[0])
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
                        //key={"name"}
                        style={{ marginVertical: 10 }}
                        title="Budget"
                        //multiple
                        data={minmax} 
                        showMode="number"
                        //labelKey="name"
                        onChange={(l) => { 
                            console.log(l)
                            setBudget(l[0])
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
                        placeholder="Zone"
                        placeholderTextColor={Colors.themeColor0}
                        value={zone}
                        onChangeText={setZone}
                        style={{
                            width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.zone ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginTop: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                        }}
                    />
                     <MultiOptionsSelect
                        labelKey={"nom"}
                        style={{ marginVertical: 10 }}
                        title="Agence"
                        //multiple
                        data={agences} 
                        showMode="number"
                        onChange={(l) => { 
                            console.log(l)
                            setSelectedValue(l[0])
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
                    {/* <View
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.6)',
                            borderColor: Colors.themeColor0,
                            borderBottomWidth: 2,
                            borderRadius: scale(5),
                            marginTop: 10,
                            height: scale(40),
                            width: scale(250),
                        }}
                    >
                        
                   
                        <Picker
                            //mode="dropdown"
                            selectedValue={transaction}
                            style={{ height: scale(40), width: scale(250), color: 'white' }}
                            onValueChange={(itemValue, itemIndex) => setTransaction(itemValue)}
                        >
                            {["location", "vente"].map((item, index) => <Picker.Item style={{ color: "red" }} key={index} label={item} value={item} />)}
                        </Picker>
                    </View> */}
                    {/* <View
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.6)',
                            borderColor: Colors.themeColor0,
                            borderBottomWidth: 2,
                            borderRadius: scale(5),
                            marginTop: 10,
                            height: scale(40),
                            width: scale(250),
                            
                        }}
                    >
                        <Picker
                            //mode="dropdown"
                            selectedValue={besion}
                            style={{ height: scale(40), width: scale(250),color: Colors.white ,fontFamily: 'nexaregular',}}
                            onValueChange={(itemValue, itemIndex) => setBesion(itemValue)}
                        >
                            {types.map((item, index) => <Picker.Item  key={index} label={item.id} value={item.id} />)}
                        </Picker>
                    </View>
                    <View
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.6)',
                            borderColor: Colors.themeColor0,
                            borderBottomWidth: 2,
                            borderRadius: scale(5),
                            marginTop: 10,
                            height: scale(40),
                            width: scale(250),
                        }}
                    >
                        <Picker
                            //mode="dropdown"
                            selectedValue={budget}
                            style={{ height: scale(40), width: scale(250), color: 'white' }}
                            onValueChange={(itemValue, itemIndex) => setBudget(itemValue)}
                        >
                            {minmax.map((item, index) => <Picker.Item  key={index} label={item.id} value={item.id} />)}
                        </Picker>
                    </View> */}
                    
                    
                    
                    {/* <View
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.6)',
                            borderColor: Colors.themeColor0,
                            borderBottomWidth: 2,
                            borderRadius: scale(5),
                            marginTop: 10,
                            height: scale(40),
                            width: scale(250),
                        }}
                    >
                        <Picker
                            //mode="dropdown"
                            selectedValue={selectedValue}
                            style={{ height: scale(40), width: scale(250), color: 'white' }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                            {agences.map((item, index) => <Picker.Item style={{ color: "red" }} key={index} label={item.nom} value={item._id} />)}
                        </Picker>
                    </View> */}
                    <Button
                        onPress={handleOK}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={[Colors.themeColor9, Colors.themeColor10]}
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
                        <Text
                            style={{
                                color: Colors.white,
                                fontSize: scale(20),
                                fontFamily: 'nexaregular'
                            }}
                        >OK</Text>
                    </Button>
                </ScrollView>
            </View>
        </ImageBackground>
    )

}



const { height, width } = Dimensions.get('screen');

const transactions = [
        {_id:"location"},
        {_id:"vente"}
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
const types = [
    {
        _id: "Maison",
        label: "Maison"
    },
    {
        _id: "Terrain",
        label: "Terrain"
    },
    {
        _id: "Appartement",
        label: "Appartement"
    },
    {
        _id: "etageVilla",
        label: "Etage de Villa"
    },
]