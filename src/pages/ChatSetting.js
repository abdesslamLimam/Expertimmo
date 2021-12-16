import React, { useState } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StatusBar,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { Colors } from '../constants/Colors';
import { Images } from '../constants/Images'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'




export default function ChatSetting({ navigation, route }) {

    const { username } = route.params;
    const [blockSwitch, setBlockSwitch] = useState(false)
    const [muteSwitch, setMuteSwitch] = useState(false)

    return (
        <View style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
            <View style={{
                flexDirection: 'row',
                width: width,
                justifyContent: 'center',
                paddingTop: scale(10),
                paddingBottom: scale(10),
                borderBottomColor: "grey",
                borderBottomWidth: 0.2,
                backgroundColor: Colors.logo1,
            }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ padding: scale(5), justifyContent: 'center', alignItems: 'center', position: 'absolute', left: scale(5),top: scale(5) }}>
                    <AntDesign name='arrowleft' size={34} color={Colors.white} />
                </TouchableOpacity>

                <Text style={{
                    fontSize: scale(25),
                    color: Colors.white
                }}>
                    Paramètres
                </Text>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: scale(30),
                        paddingVertical: scale(20)
                    }}
                >
                    <View
                        style={{
                            width: scale(80),
                            height: scale(80),
                            borderRadius: scale(50),
                            marginRight: scale(20),
                            elevation: scale(5)
                        }}
                    >
                        <Image
                            source={Images.user2}
                            style={{
                                width: scale(80),
                                height: scale(80),
                                borderRadius: scale(50),
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            fontSize: scale(20),
                            color: Colors.logo1,
                            marginTop: scale(10)
                        }}
                    >
                        {username}
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        width: width,
                        height: scale(50),
                        flexDirection: 'row',
                        paddingHorizontal: scale(20),
                        alignItems: 'center',
                        borderBottomWidth: scale(0.2),
                        borderBottomColor: Colors.logo1
                    }}
                >
                    <FontAwesome name="user" size={27} color={Colors.logo1} />
                    <Text
                        style={{
                            fontSize: scale(18),
                            marginLeft: scale(50)
                        }}
                    >Voir profil</Text>
                </TouchableOpacity>
                <View
                    style={{
                        width: width,
                        height: scale(50),
                        flexDirection: 'row',
                        paddingHorizontal: scale(20),
                        alignItems: 'center',
                        borderBottomWidth: scale(0.2),
                        borderBottomColor: Colors.logo1
                    }}
                >
                    <AntDesign name="minuscircle" size={25} color={Colors.logo1} />
                    <Text
                        style={{
                            width: scale(200),
                            fontSize: scale(18),
                            marginLeft: scale(50)
                        }}
                    >Bloquer</Text>
                    <Switch
                        trackColor={{ false: Colors.grey3, true: Colors.logo1 }}
                        thumbColor={blockSwitch ? Colors.bluesky : Colors.grey1}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setBlockSwitch}
                        value={blockSwitch}
                    />
                </View>
                <View
                    style={{
                        width: width,
                        height: scale(50),
                        flexDirection: 'row',
                        paddingHorizontal: scale(20),
                        alignItems: 'center',
                        borderBottomWidth: scale(0.2),
                        borderBottomColor: Colors.logo1
                    }}
                >
                    <Ionicons name="volume-mute" size={25} color={Colors.logo1} />
                    <Text
                        style={{
                            width: scale(200),
                            fontSize: scale(18),
                            marginLeft: scale(50)
                        }}
                    >Mute</Text>
                    <Switch
                        trackColor={{ false: Colors.grey3, true: Colors.logo1 }}
                        thumbColor={muteSwitch ? Colors.bluesky : Colors.grey1}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setMuteSwitch}
                        value={muteSwitch}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        width: width,
                        height: scale(50),
                        flexDirection: 'row',
                        paddingHorizontal: scale(20),
                        alignItems: 'center'
                    }}
                >
                    <MaterialCommunityIcons name="delete" size={27} color={Colors.logo1} />
                    <Text
                        style={{
                            fontSize: scale(18),
                            marginLeft: scale(50)
                        }}
                    >Effacer discussion</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const { height, width } = Dimensions.get('screen');
const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center",
    },
});
