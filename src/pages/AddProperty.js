import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, TextInput, Switch, Picker, ActivityIndicator } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Button from '../components/Button'
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DatePicker from 'react-native-date-picker'
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import GetLocation from 'react-native-get-location'

export default function AddProperty(props) {


    const [property, setProperty] = useState(props.route.params)
    const { token, currentUser, showAlert } = useAppContext()
    const [errors, setErrors] = useState()
    const [renderCarac, setrenderCarac] = useState(false)
    const [renderCarac2, setrenderCarac2] = useState(false)
    const [picsfromGallery, setpicsfromGallery] = useState(property ? false : true)
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [location, setLocation] = useState(property ? { lat: property.lat, lng: property.lng } : { lat: 0, lng: 0 })

    // useEffect(()=>{
    //     let piicss =[]
    //     if(property) {
    //         property.photo.forEach((item)=>{
    //             piicss.push({ uri: `${api.url_photo}Categories/${item}` })
    //         })
    //     }
    //     setPics(piicss)
    // },[])
    // common input
    const [type, setType] = useState(property ? property?.typeBien == "Terrain" ? "Terrain" : "Maison" : "Maison")
    const [pics, setPics] = useState([])
    const [name, setName] = useState(property ? property.nomPropritaire : '')
    const [CIN, setCIN] = useState(property ? property.cin + "" : '')
    const [phone, setPhone] = useState(property ? property.phone : '')
    const [titleNumber, setTitleNumber] = useState(property ? property.numeroTitre : '')
    const [lawForm, setLawForm] = useState(property ? property.formJuridique : 'titreBleu')
    const [price, setPrice] = useState(property ? property.prix + "" : '')
    const [totalSurface, setTotalSurface] = useState(property ? property.surfaceTotale : '')
    const [address, setAddress] = useState(property ? property.adresse : '')
    const [description, setDescription] = useState(property ? property.description : '')
    const [addressPropritaire, setAddressPropritaire] = useState(property ? property.adresseProprietaire : '')
    const [postal, setPostal] = useState(property ? property.codePostale + "" : "")
    // Maison input
    const [covertSurface, setCovertSurface] = useState(property ? property.superficeCouverte : '')
    const [rooms, setRooms] = useState(property ? property.nombreChambre + "" : '')
    const [toilets, setToilets] = useState(property ? property.nombreSalleEau + "" : '')
    const [bathroom, setBathroom] = useState(property ? property.nombreSalleBain + "" : '')
    const [date, setDate] = useState(property ? new Date(property.annesConstruction) : new Date())
    const [garage, setGarage] = useState(property ? property.garageParking : false)
    const [ownerInfo, setOwnerInfo] = useState(property ? true : false)
    const [garageSurface, setGarageSurface] = useState(property ? property.superfice : "")
    const [category, setCategory] = useState(property ? property.typeBien : "Maison")
    const [status, setStatus] = useState(property ? property.statu : "location")
    const [caractéristiques, setCaractéristiques] = useState(defaultCarac)
    // land input
    const [category2, setCategory2] = useState(property ? property.categorieTerain : "terrainConstructible")
    const [constructibleSurface, setConstructibleSurface] = useState(property ? property.superficeConstructible : "")
    const [form, setForm] = useState(property ? property.forme : "")
    const [separation, setSeparation] = useState(property ? property.separation : "")
    const [facade, setFacade] = useState(property ? property.facade : "")
    const [largeur, setLargeur] = useState(property ? property.largeur : "")
    const [caractéristiques2, setCaractéristiques2] = useState(defaultCarac2)

    const toggle = (name) => {
        let newData = []
        for (let item of caractéristiques) {
            if (item.name == name) {
                newData.push({
                    name: name,
                    status: !item.status,
                    id: item.id
                })
            }
            else { newData.push(item) }
        }
        setCaractéristiques(newData)
    }
    const toggle2 = (name) => {
        let newData = []
        for (let item of caractéristiques2) {
            if (item.name == name) {
                newData.push({
                    name: name,
                    status: !item.status,
                    id: item.id
                })
            }
            else { newData.push(item) }
        }
        setCaractéristiques2(newData)
    }
    const getState = (carac, name) => {
        for (let item of carac) {
            if (item.name == name) {
                return item.status
            }
        }
    }
    useEffect(() => {
        if (property) {
            let cara = []
            caractéristiques.forEach((item) => {
                cara.push({
                    name: item.name,
                    status: property[item.id],
                    id: item.id
                }
                )
            })
            setCaractéristiques(cara)

        }
        setrenderCarac(true)
    }, [])
    useEffect(() => {
        if (property) {
            let cara = []
            caractéristiques2.forEach((item) => {
                cara.push({
                    name: item.name,
                    status: property[item.id],
                    id: item.id
                }
                )
            })
            setCaractéristiques2(cara)

        }
        setrenderCarac2(true)
    }, [])

    const handleOK = () => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("typeBien", type != "Terrain" ? category : "Terrain");
        formdata.append("prix", price);
        if (picsfromGallery) {
            for (pic of pics) {
                formdata.append("photo", {
                    name: pic.path.split('/').pop(),
                    size: pic.size,
                    type: pic.mime,
                    width: pic.widdth,
                    uri: pic.path,
                });
            }
        }
        else {

            for (pic of property.photo) {
                console.log(pic)
                formdata.append("photo", { uri: `${api.url_photo}Categories/${pic}`, type: "image/jpg", name: pic });
            }
        }
        let des = "Ce bien est un " + " " + (type == "Maison" ? category : type) + " " + "existe en" + " " + address + " " +
            "offert en état de" + " " + status + "," + "sa surface totale est" + " " + totalSurface + "m²" + " " + "son propriétaire" + " " +
            name + " " + "titulaire d'une carte d'identité nationale n°" + " " + CIN + " " + "habitant de" + " " +
            addressPropritaire + "," + " " + "code postale" + "" + postal + "" + "et son numéro de téléphone" + "" + phone + " " +
            "." + " " + "La forme juridique du bien est" + " " + lawForm + " " + "son numéro de titre est" + " " + titleNumber
            + " " + "avec un prix de" + price + "DT."
        formdata.append("description", des);
        formdata.append("nomPropritaire", name);
        formdata.append("cin", CIN);
        formdata.append("adresseProprietaire", addressPropritaire);
        formdata.append("lat", location.lat);
        formdata.append("lng", location.lng);
        formdata.append("numeroTitre", titleNumber);
        formdata.append("formJuridique", lawForm);
        formdata.append("surfaceTotale", totalSurface);
        formdata.append("adresse", address);
        formdata.append("codePostale", postal);
        formdata.append("phone", phone);
        formdata.append("agentId", currentUser);
        if (type != "Terrain") {
            formdata.append("superficeCouverte", covertSurface);
            formdata.append("categorieLocale", category);
            formdata.append("statu", status);
            formdata.append("nombreChambre", rooms);
            formdata.append("nombreSalleEau", toilets);
            formdata.append("nombreSalleBain", bathroom);
            formdata.append("annesConstruction", date.toString());
            formdata.append("garageParking", garage);
            formdata.append("superfice", garageSurface);

            formdata.append("climatiseur", getState(caractéristiques, "Climatisation"));
            formdata.append("chauffage", getState(caractéristiques, "Chauffage central"));
            formdata.append("piscine", getState(caractéristiques, "Piscine"));
            formdata.append("interphone", getState(caractéristiques, "Interphone"));
            formdata.append("balcon", getState(caractéristiques, "Balcon"));
            formdata.append("doucheExterne", getState(caractéristiques, "Douche extérieur"));
            formdata.append("cameraServeillance", getState(caractéristiques, "Caméra surveillance"));
            formdata.append("storeElectrique", getState(caractéristiques, "Store électrique"));
            formdata.append("gardien", getState(caractéristiques, "Gardien"));
            formdata.append("terrase", getState(caractéristiques, "Terrasse"));
            formdata.append("jardin", getState(caractéristiques, "Jardin"));
            formdata.append("suite", getState(caractéristiques, "Suite"));
            formdata.append("cuisine", getState(caractéristiques, "Cuisine équipé"));
            formdata.append("veranda", getState(caractéristiques, "Véranda"));
            formdata.append("souSole", getState(caractéristiques, "Sous-sol"));
        }
        else {
            formdata.append("superficeConstructible", constructibleSurface);
            formdata.append("categorieTerain", category2);
            formdata.append("forme", form);
            formdata.append("separation", separation);
            formdata.append("facade", facade);
            formdata.append("largeur", largeur);

            formdata.append("cloture", getState(caractéristiques2, "Cloturé"));
            formdata.append("permiBatir", getState(caractéristiques2, "Permis de batir"));
            formdata.append("eau", getState(caractéristiques2, "Eau"));
            formdata.append("electriciter", getState(caractéristiques2, "Electricité"));
            formdata.append("gaze", getState(caractéristiques2, "Gaz de ville"));
            formdata.append("onasse", getState(caractéristiques2, "ONASS"));
            formdata.append("commerciale", getState(caractéristiques2, "Commercial"));
        }




        let methode = property ? 'PATCH' : 'POST';
        var requestOptions = {
            method: methode,
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        let link = property ? `${api.url}categorie/${property?._id}` : `${api.url}categorie/addCategorie`

        fetch(link, requestOptions)
            .then(response => response.json())
            .then(result => {
                setLoading(false)
                console.log(result)
                if (result?.error?.errors) {
                    console.log(result?.error?.errors)
                    setErrors(result?.error?.errors)
                }
                else if (result?.data?.UserID || result?.data?.data) {
                    showAlert({message: "Bien a ete enregistré"})
                    props.navigation.goBack()
                }
            })
            .catch(error => {
                setLoading(false)
                console.log('error', error)
            });
    }
    const verifyLocation = () => {
        setLoading2(true)
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
                //console.log(result)
                if (result == RESULTS.GRANTED) {
                    // …
                    GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 15000,
                    })
                        .then(location => {
                            //console.log(location);
                            setLoading2(false)
                            setLocation({
                                lat: location.latitude,
                                lng: location.longitude
                            })
                        })
                        .catch(error => {
                            const { code, message } = error;
                            console.warn(code, message);
                            setLoading2(false)
                        })
                }
                else {
                    console.log('This feature is not available (on this device / in this context)');
                    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => { })
                    setLoading2(false)
                }
            })
            .catch((error) => {
                // …
            });
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
                    <AntDesign name="arrowleft" size={30} color={Colors.themeColor7} />
                </TouchableOpacity>
                <Text
                    style={{
                        color: Colors.white,
                        fontSize: scale(20),
                        fontFamily: 'Nexa Light'
                    }}
                >
                    {property ? "Modifier ce bien" : "Ajouter un bien"}
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
                    //onScroll={(ev)=>{console.log(ev.nativeEvent.contentOffset.y)}}
                >
                    <View
                        style={{ padding: 20, width: width }}
                    >
                        {!property && <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly'
                            }}
                        >
                            <Button
                                onPress={() => { setType('Maison') }}
                                colors={type == "Maison" ? [Colors.white, Colors.white] : [Colors.white, Colors.white]}
                                style={{
                                    width: scale(100),
                                    height: scale(80),
                                    borderRadius: scale(10),
                                    elevation: scale(5),
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    elevation: scale(5),
                                    borderWidth: 5,
                                    overflow: 'hidden',
                                    borderColor: type == "Maison" ? Colors.themeColor7 : Colors.themeColor0
                                }}
                            >
                                <ImageBackground
                                    source={Images.house}
                                    style={{
                                        width: scale(100),
                                        height: scale(80),
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    resizeMode="contain" >
                                    {/* <Text
                                        style={{
                                            color: "black",
                                            fontSize: scale(11),
                                            fontWeight: 'bold'
                                        }}
                                    >Maison/Villa</Text> */}
                                </ImageBackground>

                            </Button>
                            <Button
                                onPress={() => { setType('Terrain') }}
                                colors={type == "Terrain" ? [Colors.white, Colors.white] : [Colors.white, Colors.white]}
                                style={{
                                    width: scale(100),
                                    height: scale(80),
                                    borderRadius: scale(10),
                                    elevation: scale(5),
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    elevation: scale(5),
                                    borderWidth: 5,
                                    overflow: 'hidden',
                                    borderColor: type == "Terrain" ? Colors.themeColor7 : Colors.themeColor0
                                }}
                            >
                                <Image source={Images.land} style={{ width: scale(100), height: scale(80) }} resizeMode="contain" />
                                {/* <Text
                                    style={{
                                        color: "black",
                                        fontSize: scale(11),
                                        fontWeight: 'bold'
                                    }}
                                >Terrain/Ferme</Text> */}
                            </Button>
                        </View>}
                        {<ScrollView
                            style={{
                                borderTopWidth: 2,
                                borderBottomWidth: 2,
                                borderColor: Colors.grey4,
                                height: scale(100),
                                marginTop: 20,
                                borderRadius: scale(20)
                            }}
                            // contentContainerStyle={{
                            //     alignItems:"center",
                            //     justifyContent: 'center'
                            // }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <Button
                                onPress={() => {
                                    ImagePicker.openPicker({
                                        multiple: true,
                                        mediaType: 'photo',
                                        maxFiles: 10
                                    }).then(images => {
                                        console.log(images);
                                        setPics(images)
                                        setpicsfromGallery(true)
                                    });
                                }}
                                colors={[Colors.themeColor8, Colors.themeColor0]}
                                style={{
                                    width: pics.length == 0 ? scale(70) : scale(50),
                                    height: pics == 0 ? scale(70) : scale(50),
                                    borderRadius: scale(5),
                                    elevation: scale(5),
                                    alignSelf: 'center',
                                    marginLeft: scale(10),
                                    overflow: 'hidden',
                                }}
                            >
                                <MaterialCommunityIcons name="image-plus" size={30} color={Colors.white} />
                            </Button>
                            {picsfromGallery && pics.map((item, index) =>
                                <Image key={index} source={{ uri: item.path }} resizeMode="cover"
                                    style={{
                                        width: scale(80),
                                        height: scale(80),
                                        marginLeft: scale(10),
                                        borderRadius: scale(10),
                                        alignSelf: 'center',
                                    }} />
                            )}
                            {!picsfromGallery && property.photo.map((item, index) =>
                                <Image key={index} source={{ uri: `${api.url_photo}Categories/${item}` }} resizeMode="cover"
                                    style={{
                                        width: scale(80),
                                        height: scale(80),
                                        marginLeft: scale(10),
                                        borderRadius: scale(10),
                                        alignSelf: 'center',
                                    }} />
                            )}
                        </ScrollView>}

                    </View>
                    {type == "Maison" && <>
                        <Text
                            style={{
                                color: Colors.themeColor7,
                                fontSize: scale(15),
                                marginVertical: 15,
                                fontFamily: 'nexaregular',
                                alignSelf: 'center'
                            }}
                        >Catégorie: </Text>
                        <View
                            style={{
                                width: width,
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'flex-start'
                            }}
                        >

                            <TouchableOpacity
                                onPress={() => { setCategory("Maison") }}
                                style={{
                                    width: scale(90),
                                    height: scale(30),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: 'white',
                                    borderRadius: scale(20),
                                    elevation: category == "Maison" ? scale(3) : 0,
                                    borderWidth: 3,
                                    borderColor: category == "Maison" ? Colors.themeColor7 : Colors.themeColor0
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale(12),
                                        color: category == "Maison" ? Colors.themeColor11 : Colors.themeColor0,
                                        fontFamily: 'nexaregular',
                                    }}
                                >Maison</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setCategory("Appartement") }}
                                style={{
                                    width: scale(90),
                                    height: scale(30),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: 'white',
                                    borderRadius: scale(20),
                                    elevation: category == "Appartement" ? scale(3) : 0,
                                    borderWidth: 3,
                                    borderColor: category == "Appartement" ? Colors.themeColor7 : Colors.themeColor0

                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale(12),
                                        color: category == "Appartement" ? Colors.themeColor11 : Colors.themeColor0,
                                        fontFamily: 'nexaregular',
                                    }}
                                >Appartement</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setCategory("etageVilla") }}
                                style={{
                                    width: scale(90),
                                    height: scale(30),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: 'white',
                                    borderRadius: scale(20),
                                    elevation: category == "etageVilla" ? scale(3) : 0,
                                    borderWidth: 3,
                                    borderColor: category == "etageVilla" ? Colors.themeColor7 : Colors.themeColor0
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale(12),
                                        color: category == "etageVilla" ? Colors.themeColor11 : Colors.themeColor0,
                                        fontFamily: 'nexaregular',
                                    }}
                                >Etage de villa</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                color: Colors.themeColor7,
                                fontSize: scale(15),
                                marginVertical: 15,
                                fontFamily: 'nexaregular',
                                alignSelf: 'center'
                            }}
                        >Statut: </Text>
                        <View
                            style={{
                                width: width,
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                marginBottom: 20
                            }}
                        >

                            <TouchableOpacity
                                onPress={() => { setStatus("location") }}
                                style={{
                                    width: scale(90),
                                    height: scale(30),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: 'white',
                                    borderRadius: scale(20),
                                    elevation: status == "location" ? scale(3) : 0,
                                    borderWidth: 3,
                                    borderColor: status == "location" ? Colors.themeColor7 : Colors.themeColor0
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale(12),
                                        color: status == "location" ? Colors.themeColor11 : Colors.themeColor0,
                                        fontFamily: 'nexaregular',
                                    }}
                                >Location</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setStatus("vente") }}
                                style={{
                                    width: scale(90),
                                    height: scale(30),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: 'white',
                                    borderRadius: scale(20),
                                    elevation: status == "vente" ? scale(3) : 0,
                                    borderWidth: 3,
                                    borderColor: status == "vente" ? Colors.themeColor7 : Colors.themeColor0

                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: scale(12),
                                        color: status == "vente" ? Colors.themeColor11 : Colors.themeColor0,
                                        fontFamily: 'nexaregular',
                                    }}
                                >Vente</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                    onPress={() => { setStatus("tout") }}
                                    style={{
                                        width: scale(90),
                                        height: scale(30),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: 'white',
                                        borderRadius: scale(20),
                                        elevation: status == "tout" ? scale(3) : 0,
                                        borderWidth: 3,
                                        borderColor: status == "tout" ? Colors.logo1 : "grey"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scale(11),
                                            fontWeight: 'bold',
                                            color: status == "tout" ? "black" : "grey"
                                        }}
                                    >Location/Vente</Text>
                                </TouchableOpacity> */}
                        </View>
                    </>}
                    <View
                        style={{
                            alignItems: 'center'
                        }}
                    >

                        <Text
                            style={{
                                color: Colors.themeColor7,
                                fontFamily: 'nexaregular',
                                fontSize: scale(15),
                                marginBottom: 5,
                            }}
                        >Informations du bien</Text>
                        <TextInput
                            placeholder="Adresse du bien"
                            placeholderTextColor={Colors.themeColor0}
                            value={address}
                            onChangeText={setAddress}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.adresse ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                            }}
                        />
                        <Button
                            onPress={() => { verifyLocation() }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={[Colors.themeColor2, Colors.themeColor2]}
                            style={{
                                marginBottom: 10,
                                width: scale(250),
                                height: scale(35),
                                borderRadius: scale(5),
                                elevation: scale(5),
                                overflow: 'hidden',
                                borderBottomWidth: location.lat == 0 ? 2 : 0,
                                borderColor: 'red'
                            }}
                        >
                            {loading2 ? <ActivityIndicator size="large" color="white" />
                                : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: scale(250) }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily: 'nexaregular',
                                        }}
                                    >{location.lat == 0 ? "Cliquer ici pour localiser votre bien" : "Bien localisé"}</Text>
                                    <FontAwesome5 name="map-marked-alt" size={25} color={Colors.white} />
                                </View>}

                        </Button>
                        <View
                            style={{ borderWidth: 1, borderRadius: 5, backgroundColor: 'white', elevation: 5, marginBottom: 10, overflow: 'hidden' }}
                        >
                            <Text
                                style={{
                                    width: scale(250), backgroundColor: Colors.themeColor0, color: Colors.themeColor11, paddingLeft: 10, paddingVertical: 2,
                                    fontFamily: 'nexaregular',
                                }}
                            >Forme Juridique:</Text>
                            <Picker

                                //mode="dropdown"
                                selectedValue={lawForm}
                                style={{ height: scale(35), width: scale(250), color: 'black', }}
                                onValueChange={(itemValue, itemIndex) => setLawForm(itemValue)}
                            >
                                {formJuridiqueSelect.map((item, index) => <Picker.Item key={index} label={item.id} value={item.value} />)}
                            </Picker>
                        </View>
                        {/* <TextInput
                            placeholder="Form juridique"
                            placeholderTextColor={Colors.themeColor0}
                            value={lawForm}
                            onChangeText={setLawForm}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.formJuridique ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: "white"
                            }}
                        /> */}
                        <TextInput
                            keyboardType='numeric'
                            placeholder="Code postale"
                            placeholderTextColor={Colors.themeColor0}
                            value={postal}
                            onChangeText={setPostal}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.codePostale ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular'
                            }}
                        />

                        {typeof (errors?.reference) == "string" && <Text style={{ color: 'crimson' }} >{errors.reference}</Text>}

                            {type == "Maison" && <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Nombre de chambres"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={rooms}
                                    onChangeText={setRooms}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />

                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Nombre de salles d'eau"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={toilets}
                                    onChangeText={setToilets}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />

                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Nombre de salles de bain"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={bathroom}
                                    onChangeText={setBathroom}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />

                            </View>
                            </>}
                        {type == "Terrain" && <>
                            {/* <Text
                                style={{
                                    color: "white",
                                    fontWeight: 'bold',
                                    fontSize: scale(12),
                                    marginVertical: 15
                                }}
                            >Catégorie:</Text>
                            <View
                                style={{
                                    width: width,
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    marginBottom: 20
                                }}
                            >

                                <TouchableOpacity
                                    onPress={() => { setCategory2("terrainConstructible") }}
                                    style={{
                                        width: scale(90),
                                        height: scale(30),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: 'white',
                                        borderRadius: scale(20),
                                        elevation: category2 == "terrainConstructible" ? scale(3) : 0,
                                        borderWidth: 3,
                                        borderColor: category2 == "terrainConstructible" ? Colors.logo1 : "grey"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scale(12),
                                            fontWeight: 'bold',
                                            color: category2 == "terrainConstructible" ? "black" : "grey"
                                        }}
                                    >Terrain</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { setCategory2("ferme") }}
                                    style={{
                                        width: scale(90),
                                        height: scale(30),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: 'white',
                                        borderRadius: scale(20),
                                        elevation: category2 == "ferme" ? scale(3) : 0,
                                        borderWidth: 3,
                                        borderColor: category2 == "ferme" ? Colors.logo1 : "grey"

                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scale(12),
                                            fontWeight: 'bold',
                                            color: category2 == "ferme" ? "black" : "grey"
                                        }}
                                    >Ferme</Text>
                                </TouchableOpacity>
                            </View> */}
                            
                        </>}
                        
                        
                        {type == "Maison" && <>

                            
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: errors?.surfaceTotale ? 'crimson' : Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Superficie total"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={totalSurface}
                                    onChangeText={setTotalSurface}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',

                                    }}
                                >m²</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Superficie couverte"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={covertSurface}
                                    onChangeText={setCovertSurface}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white

                                    }}
                                >m²</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: errors?.prix ? 'crimson' : Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Prix"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={price}
                                    onChangeText={setPrice}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                >TND</Text>
                            </View>
                            <Text
                                style={{
                                    color: Colors.themeColor7,
                                    fontFamily: 'nexaregular',
                                    fontSize: scale(14),
                                    marginVertical: 15
                                }}
                            >Autres caractéristiques: </Text>
                            {type == 'Maison' && <View
                                style={{
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderRadius: scale(10),
                                    width: width * 0.9,
                                    height: scale(30) * caractéristiques.length / 2,
                                    flexWrap: 'wrap',
                                    alignItems: 'flex-start',
                                    marginBottom: 20
                                }}
                            >
                                {renderCarac2 && caractéristiques.map((item, index) =>
                                    <TouchableOpacity
                                        onPress={() => { toggle(item.name) }}
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: "50%",
                                            marginVertical: 5,
                                            marginHorizontal: 5
                                        }}
                                    >
                                        <BouncyCheckbox
                                            size={20}
                                            fillColor={Colors.themeColor11}
                                            unfillColor={Colors.white}
                                            text={item.name}
                                            iconStyle={{ borderColor: Colors.themeColor11 }}
                                            textStyle={{
                                                fontFamily: "nexaregular", color: Colors.themeColor0, fontSize: scale(12


                                                )
                                            }}
                                            onPress={() => { toggle(item.name) }}
                                            isChecked={item.status}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>}
                            {type == 'Terrain' && <View
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: scale(10),
                                    width: width * 0.9,
                                    height: scale(30) * caractéristiques2.length / 1.8,
                                    flexWrap: 'wrap',
                                    alignItems: 'flex-start',
                                    marginBottom: 20
                                }}
                            >
                                {renderCarac2 && caractéristiques2.map((item, index) =>
                                    <TouchableOpacity
                                        onPress={() => { toggle2(item.name) }}
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: "50%",
                                            marginVertical: 5,
                                            marginHorizontal: 5
                                        }}
                                    >
                                        <BouncyCheckbox
                                            size={20}
                                            fillColor={Colors.themeColor11}
                                            unfillColor="white"
                                            text={item.name}
                                            iconStyle={{ borderColor: Colors.themeColor11 }}
                                            textStyle={{
                                                fontFamily: "nexaregular", color: Colors.themeColor0, fontSize: scale(12


                                                )
                                            }}
                                            onPress={() => {
                                                toggle2(item.name)
                                            }}
                                            isChecked={item.status}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>}
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.themeColor7,
                                        fontFamily: 'nexaregular',
                                        fontSize: scale(12),
                                        marginVertical: 15
                                    }}
                                >Garage/Parking: </Text>
                                <Switch
                                    trackColor={{ false: Colors.grey1, true: Colors.grey1 }}
                                    thumbColor={garage ? Colors.themeColor0 : Colors.themeColor2}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={setGarage}
                                    value={garage}
                                />
                                {garage && <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        alignItems: 'center',
                                        width: scale(140),
                                        height: scale(40),
                                        borderRadius: scale(5),
                                        backgroundColor: 'rgba(3, 57, 71,0.6)',
                                        borderBottomWidth: 2,
                                        borderColor: Colors.themeColor0,
                                        paddingLeft: 10,
                                        marginBottom: 10,
                                        marginLeft: 20
                                    }}
                                >
                                    <TextInput
                                        keyboardType="numeric"
                                        placeholder="Superficie"
                                        placeholderTextColor={Colors.themeColor0}
                                        value={garageSurface}
                                        onChangeText={setGarageSurface}
                                        style={{
                                            width: scale(100),
                                            height: scale(40),
                                            color: Colors.white,
                                            fontFamily: 'nexaregular',
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: Colors.white,
                                            fontFamily: 'nexaregular',
                                        }}
                                    >m²</Text>
                                </View>}
                            </View>
                            <Text
                                style={{
                                    color: Colors.themeColor7,
                                    fontFamily: 'nexaregular',
                                    fontSize: scale(14),
                                    marginVertical: 15
                                }}
                            >Année de construction: </Text>
                            <DatePicker
                                mode="date"
                                style={{ marginBottom: 20 }}
                                date={date} onDateChange={setDate}
                                androidVariant='nativeAndroid'
                                textColor={Colors.white}
                            />
                        </>}
                        {type == "Terrain" && <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Superficie totale"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={totalSurface}
                                    onChangeText={setTotalSurface}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',

                                    }}
                                >m²</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Superficie constructible"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={constructibleSurface}
                                    onChangeText={setConstructibleSurface}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',

                                    }}
                                >m²</Text>
                            </View>
                            <TextInput
                                placeholder="Forme"
                                placeholderTextColor={Colors.themeColor0}
                                value={form}
                                onChangeText={setForm}
                                style={{
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10,
                                    color: Colors.white,
                                    fontFamily: 'nexaregular',
                                }}
                            />
                            <TextInput
                                placeholder="Séparation"
                                placeholderTextColor={Colors.themeColor0}
                                value={separation}
                                onChangeText={setSeparation}
                                style={{
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10,
                                    color: Colors.white,
                                    fontFamily: 'nexaregular',
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Façade"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={facade}
                                    onChangeText={setFacade}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',

                                    }}
                                >m²</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Largeur"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={largeur}
                                    onChangeText={setLargeur}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',

                                    }}
                                >m²</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                    width: scale(250),
                                    height: scale(40),
                                    borderRadius: scale(5),
                                    backgroundColor: 'rgba(3, 57, 71,0.6)',
                                    borderBottomWidth: 2,
                                    borderColor: errors?.prix ? 'crimson' : Colors.themeColor0,
                                    paddingLeft: 10,
                                    marginBottom: 10
                                }}
                            >
                                <TextInput
                                    keyboardType="numeric"
                                    placeholder="Prix"
                                    placeholderTextColor={Colors.themeColor0}
                                    value={price}
                                    onChangeText={setPrice}
                                    style={{
                                        width: scale(200),
                                        height: scale(40),
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                    }}
                                />
                                <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',

                                    }}
                                >TND</Text>
                            </View>
                        </>}


                        {
                            property && <>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: scale(12),
                                        marginVertical: 15,
                                        fontFamily: 'nexaregular'
                                    }}
                                >Description: </Text>
                                <Text
                                    // placeholder="Description.."
                                    // placeholderTextColor={Colors.themeColor0}
                                    // value={description}
                                    // onChangeText={setDescription}
                                    maxLength={300}
                                    multiline
                                    numberOfLines={10}
                                    style={{
                                        width: scale(280),
                                        borderRadius: scale(5),
                                        backgroundColor: 'rgba(3, 57, 71,0.6)',
                                        borderBottomWidth: 2,
                                        borderColor: Colors.themeColor0,
                                        paddingLeft: 10,
                                        marginBottom: 40,
                                        color: Colors.white,
                                        fontFamily: 'nexaregular',
                                        textAlignVertical: 'top'
                                    }}
                                >{description}</Text>
                            </>}
                            {type == "Terrain" && <Text
                            style={{
                                color: Colors.themeColor7,
                                fontFamily: 'nexaregular',
                                fontSize: scale(14),
                                marginVertical: 15
                            }}
                        >Autres caractéristiques: </Text>}
                            {type == 'Terrain' && <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: scale(10),
                                width: width * 0.9,
                                height: scale(30) * caractéristiques2.length / 1.8,
                                flexWrap: 'wrap',
                                alignItems: 'flex-start',
                                marginBottom: 20
                            }}
                        >
                            {renderCarac2 && caractéristiques2.map((item, index) =>
                                <TouchableOpacity
                                    onPress={() => { toggle2(item.name) }}
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: "50%",
                                        marginVertical: 5,
                                        marginHorizontal: 5
                                    }}
                                >
                                    <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.themeColor11}
                                        unfillColor="white"
                                        text={item.name}
                                        iconStyle={{ borderColor: Colors.themeColor11 }}
                                        textStyle={{
                                            fontFamily: "nexaregular", color: Colors.themeColor0, fontSize: scale(12


                                            )
                                        }}
                                        onPress={() => {
                                            toggle2(item.name)
                                        }}
                                        isChecked={item.status}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>}
                        <View
                            style={{
                                flexDirection:'row'
                            }}
                        >
                            <Text
                            style={{
                                color: Colors.themeColor7,
                                fontSize: scale(15),
                                marginBottom: 5,
                                fontFamily: 'nexaregular'
                            }}
                        >Informations du propriétaire</Text>
                            <Switch
                                    trackColor={{ false: Colors.grey1, true: Colors.grey1 }}
                                    thumbColor={ownerInfo ? Colors.themeColor0 : Colors.themeColor2}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={setOwnerInfo}
                                    value={ownerInfo}
                                />
                        </View>
                        
                        { ownerInfo && <>
                            <TextInput
                            placeholder="Nom et prénon"
                            placeholderTextColor={Colors.themeColor0}
                            value={name}
                            onChangeText={setName}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.nomPropritaire ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                            }}
                        />
                        <TextInput
                            keyboardType='numeric'
                            placeholder="CIN"
                            placeholderTextColor={Colors.themeColor0}
                            value={CIN}
                            onChangeText={setCIN}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.cin ? 'crimson' : Colors.themeColor0,
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
                                borderColor: errors?.phone ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                            }}
                        />
                        <TextInput
                            placeholder="Numéro de Titre"
                            placeholderTextColor={Colors.themeColor0}
                            value={titleNumber}
                            onChangeText={setTitleNumber}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.numeroTitre ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                            }}
                        />
                        <TextInput
                            placeholder="Adresse du propriétaire"
                            placeholderTextColor={Colors.themeColor0}
                            value={addressPropritaire}
                            onChangeText={setAddressPropritaire}
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: scale(5),
                                backgroundColor: 'rgba(3, 57, 71,0.6)',
                                borderBottomWidth: 2,
                                borderColor: errors?.adresseProprietaire ? 'crimson' : Colors.themeColor0,
                                paddingLeft: 10,
                                marginBottom: 10,
                                color: Colors.white,
                                fontFamily: 'nexaregular',
                            }}
                        />
                        </>}
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
                                : <Text
                                    style={{
                                        color: Colors.white,
                                        fontFamily: 'Nexa Bold',
                                        fontSize: scale(20),
                                    }}
                                >OK</Text>}
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const { height, width } = Dimensions.get('screen');

const formJuridiqueSelect = [
    {
        id: 'Titre Bleu',
        value: 'titreBleu'
    },
    {
        id: 'Titre Collectif',
        value: 'titreColletif'
    },
    {
        id: 'Contrat De Vente',
        value: 'contratDeVente'
    },
    {
        id: 'Support Propriété',
        value: 'SupportPropriété'
    },
]
const defaultCarac = [
    {
        name: "Climatisation",
        status: false,
        id: "climatiseur"
    },
    {
        name: "Chauffage central",
        status: false,
        id: "chauffage"
    },
    {
        name: "Piscine",
        status: false,
        id: "piscine"
    },
    {
        name: "Interphone",
        status: false,
        id: "interphone"
    },
    {
        name: "Balcon",
        status: false,
        id: "balcon"
    },
    {
        name: "Douche extérieur",
        status: false,
        id: "doucheExterne"
    },
    {
        name: "Caméra surveillance",
        status: false,
        id: "cameraServeillance"
    },
    {
        name: "Store électrique",
        status: false,
        id: "storeElectrique"
    },
    {
        name: "Gardien",
        status: false,
        id: "gardien"
    },
    {
        name: "Terrasse",
        status: false,
        id: "terrase"
    },
    {
        name: "Jardin",
        status: false,
        id: "jardin"
    },
    {
        name: "Suite",
        status: false,
        id: "suite"
    },
    {
        name: "Cuisine équipé",
        status: false,
        id: "cuisine"
    },
    {
        name: "Véranda",
        status: false,
        id: "veranda"
    },
    {
        name: "Sous-sol",
        status: false,
        id: "souSole"
    }
]
const defaultCarac2 = [
    {
        name: "Cloturé",
        status: false,
        id: "cloture"
    },
    {
        name: "Permis de batir",
        status: false,
        id: "permiBatir"
    },
    {
        name: "Eau",
        status: false,
        id: "eau"
    },
    {
        name: "Electricité",
        status: false,
        id: "electriciter"
    },
    {
        name: "Gaz de ville",
        status: false,
        id: "gaze"
    },
    {
        name: "ONASS",
        status: false,
        id: "onasse"
    },
    {
        name: "Commercial",
        status: false,
        id: "commerciale"
    },
]