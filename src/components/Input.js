import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale } from 'react-native-size-matters';
import CountryPicker from 'react-native-country-picker-modal'

export default function Input(props) {

    const countryCode = props.countryCode != undefined ? props.countryCode : ''
    const setCountryCode = props.setCountryCode
    const setCountryName = props.setCountryName
    const [modal, setModal] = useState(false)
    const textColor = props.textColor ? props.textColor : 'white'
    const containerColor = props.containerColor ? props.containerColor : '#d9d9d9'
    const [flag, setFlag] = useState("tn")
    return (
        <View>
            <View style={[styles.container, { borderColor: props.errorMessage == '' ? containerColor : "crimson" }, props.style]}>
                <Icon name={props.name} size={15} color={textColor} />
                {props.name == 'phone' &&
                    <TouchableOpacity
                        onPress={() => { setModal(true) }}
                        style={{
                            minWidth: scale(50), height: scale(25),
                            alignItems: 'center', justifyContent: 'center',
                            borderRightWidth: 1,
                            borderColor: containerColor,
                        }}>

                            
                        {/* <Text style={{ color: textColor, fontSize: scale(14) }}>
                            {'+' + countryCode}
                        </Text> */}
                        <Image
                            style={{
                                width: scale(25),
                                height: scale(20)
                            }}
                            source={{ uri: `https://www.countryflags.io/${flag}/shiny/64.png` }} />
                        <CountryPicker
                            containerButtonStyle={{ backgroundColor: 'red', width: scale(0), height: scale(0) }}
                            withCallingCode
                            withAlphaFilter
                            withFilter
                            withFlag
                            withFlagButton
                            visible={modal}
                            onSelect={(val) => {
                                setCountryCode(val.callingCode)
                                setCountryName(val.name)
                                setFlag(val.cca2.toLowerCase())
                                console.log(val)
                            }}
                            onClose={() => { setModal(false) }}
                        />
                    </TouchableOpacity>

                }
                <TextInput
                    value={props.value}
                    onChangeText={props.onChangeText}
                    style={[styles.text, props.styleText]}
                    selectionColor={textColor}
                    keyboardType={props.keyboardType}
                    placeholder={props.placeholder}
                    placeholderTextColor={textColor}
                    secureTextEntry={props.secureTextEntry}
                />
            </View>
            {props.errorMessage == '' ?
                <View style={{ marginBottom: scale(17) }}></View> :
                <Text style={{ color: "crimson", marginLeft: scale(10), fontSize: scale(12) }} >{props.errorMessage}</Text>}
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            width: scale(260), height: scale(35), backgroundColor: 'rgba(0, 0, 0,0.22)',
            borderBottomWidth: 1, borderRadius: scale(7),
            flexDirection: "row", alignItems: 'center', paddingHorizontal: scale(10)
        },
        text: {
            flex: 1,
            paddingLeft: scale(10),
            color: 'white',
            fontSize: scale(12),
            height: scale(50)
        }
    }
)