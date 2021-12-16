import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, TextInput, Switch, FlatList, Platform, Picker, ActivityIndicator } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Button from '../components/Button'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
//import DatePicker from 'react-native-date-picker'
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import MultiOptionsSelect from '../components/MultiOptionsSelect';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DatePickerComponent from '../components/DatePickerComponent';

export default function AddTask(props) {

    const { token, currentUser, showAlert } = useAppContext()
    const [errors, setErrors] = useState()
    const [selectedClient, setSelectedClient] = useState('')
    const [selectedProperties, setSelectedProperties] = useState()
    const [price, setPrice] = useState('')
    const [phone, setPhone] = useState('')
    const [from, setFrom] = useState(new Date())
    const [to, setTo] = useState(new Date())
    const [date, setDate] = useState(new Date())
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [openDate, setOpenDate] = useState(false)
    const [clients, setClients] = useState([])
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('Banque')

    // console.log("from = " , openFrom )
    // console.log("to = " , openTo )
   
  

    const handleOK = () => {
        setLoading(true)
        var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "nomTache": title,
  "typeTache": type,
  "description": description,
  "dateDebut": from,
  "dateFien": to,
  "agentID": currentUser,  
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`${api.url}tache/addTache`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    setLoading(false)
    if (result?.error?.errors) {
        console.log(result?.error?.errors)
        setErrors(result?.error?.errors)
    }
    else {
        showAlert({message: "Tâche ajoutée"})
        props.navigation.goBack()
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
                        color: 'white',
                        fontSize: scale(20),
                        fontFamily:'Nexa Light'
                    }}
                >
                    Ajouter une tâche
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
                            width: scale(280),
                        }}
                    >
                        <DatePickerComponent
                            value={date}
                            mode="date"
                            onChange={(ev, date) => {
                                setDate(date)
                                var month = date.getUTCMonth() + 1; //months from 1-12
                                var day = date.getUTCDate();
                                var year = date.getUTCFullYear();
                                let from1 = from
                                from1.setDate(day)
                                from1.setMonth(month)
                                from1.setFullYear(year)
                                setFrom(from1)
                                let to1 = to
                                to1.setDate(day)
                                to1.setMonth(month)
                                to1.setFullYear(year)
                                setTo(to1)
                                
                            }}
                        />
                        <DatePickerComponent
                            value={from}
                            mode="time"
                            onChange={(ev,date)=>{
                                setFrom(date)
                            }}
                            name="Debut"
                        />
                        <DatePickerComponent
                            value={to}
                            mode="time"
                            onChange={(ev,date)=>{
                                setTo(date)
                            }}
                            name="Fin"
                        />
 
                    </View>
                    <TextInput
                            placeholder="Titre"
                            placeholderTextColor={Colors.themeColor0}
                            value={title}
                            onChangeText={setTitle}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.nomTache ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: "white",
                                fontFamily: 'nexaregular'
                            }}
                        />
                        
                        <TextInput
                            placeholder="Description"
                            placeholderTextColor={Colors.themeColor0}
                            value={description}
                            onChangeText={setDescription}
                            maxLength={300}
                            multiline
                            numberOfLines={5}
                            style={{
                                width: scale(250),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.description ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: "white",
                                textAlignVertical: 'top',
                                fontFamily: 'nexaregular'
                            }}/>
              
                    
                    <MultiOptionsSelect
                        //key={"name"}
                        style={{ marginVertical: 10 }}
                        title="Type"
                        //multiple
                        data={TYPES} 
                        //labelKey="name"
                        onChange={(l) => { 
                            console.log(l)
                            setType(l[0])
                        }}
                        style={{
                            backgroundColor: 'rgba(3, 57, 71,0.9)'
                        }}
                        textStyle={{
                            fontFamily: 'nexaregular',
                            color: Colors.themeColor0
                        }}
                    />
                  
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

const TYPES = [
    {_id:"Banque"},
    {_id:"Poste"},
    {_id:"Municipalité"},
    {_id:"Tribunal"},
    {_id:"Autres"},
]