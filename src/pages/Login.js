import React, { useState, useEffect, createRef } from 'react'
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
    ActivityIndicator,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { Images } from '../constants/Images'
import Input from '../components/Input'
import { api } from '../constants/api_config'
import { Colors } from '../constants/Colors'
import { useAppContext } from '../context/AppContext'
import Button from '../components/Button'
import * as Animatable from "react-native-animatable";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import OneSignal from 'react-native-onesignal';

export default function Login({ navigation }) {
    const [newPasswordError, setNewPasswordError] = useState('')
    const [newPassword1, setNewPassword1] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [password, setPassword] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    const [resetEmail, setResetEmail] = useState('')
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [resetEmailErrorMessage, setResetEmailErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [screen, setScreen] = useState('login')
    const { showAlert, setToken, setCurrentUser, setIsWorking } = useAppContext()
    const pinInput = createRef();
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('')

    
    
    // Handle code ++++++++++++
    const _checkCode = code => {
        if (code.length == 4) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "codeVerficationWithEmail": code
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`${api.url}users/veriferCode`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result?.message=="vous pouvez modifier votre mot de passe") {
                        setScreen('new')
                    }
                    else if (result?.error?.statusCode == 400) {
                        setCodeError("Code erroné")
                        pinInput?.current?.shake(this).then(() => setCode(''));
                    }
                })
                .catch(error => {
                    setCodeError("Problème au niveau du server")
                    console.log('error', error)
                });
        }
        else {
            pinInput.current.shake(this).then(() => setCode(''));
        }


    };
    // Handling login button +++++++++++
    const handelLoginBtn = () => {
        setIsLoading(true)
        let passwordTest = checkPassword(password)
        let emailTest = checkEmail(email)

        if (passwordTest && emailTest) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "email": email,
                "password": password
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`${api.url}users/login`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result?.status == "success") {
                        setToken(result.token)
                        setCurrentUser(result.data.user._id)
                        setIsWorking(result.data.user.active)
                        navigation.navigate("Drawer")
                    }
                    else if (result?.error?.statusCode == 400) {
                        setEmailErrorMessage("Compte inéxistant avec cet email")
                    }
                    else if (result?.error?.statusCode == 401) {
                        setEmailErrorMessage("Mot de passe invalide")
                    }
                })
                .catch(error => {
                    setEmailErrorMessage("Probléme au niveau du server")
                    console.log('error', error)
                });
        }
        setIsLoading(false)
    }

    // Sending code to email  +++++++++++++++++++++++++++

    const resetPassword = () => {
        let emailTest = checkResetEmail(resetEmail)
        console.log(emailTest)
        if (emailTest) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "email": resetEmail
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`${api.url}users/forgotPassword`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result?.status == "success") {
                        setScreen('code')
                    }
                    else if (result?.error?.statusCode == 404) {
                        setResetEmailErrorMessage("Compte inéxistant avec cet email")
                    }
                })
                .catch(error => {
                    setResetEmailErrorMessage("Probléme au niveau du server")
                    console.log('error', error)
                });
        }
    }

    // Set new password +++++++++
    const changePassword = () => {
        let passwordTest = checkNewPassword(newPassword1)

        if (passwordTest) {
            if (newPassword1 != newPassword2) {
                setNewPasswordError('Vos mots de passes ne sont pas identiques')
            }
            else {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "email": resetEmail,
                    "password": newPassword1,
                    "passwordConfirm": newPassword2
                });

                var requestOptions = {
                    method: 'PATCH',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(`${api.url}users/resetPassword`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result)
                        if (result?.status == "success") {
                            setScreen('login')
                            showAlert({message: "Votre mot de passe a été changé avec succès, veuillez s'identifier avec votre nouveau mot de passe"})
                        }
                        else {
                            setNewPasswordError("Probléme au niveau du server")
                        }
                    })
                    .catch(error => {
                        setNewPasswordError("Probléme au niveau du server")
                        console.log('error', error)
                    });
            }
        }
    }
    const isEmailValid = (email) => {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(String(email).toLowerCase())
    }



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
    const checkResetEmail = (email) => {
        if (email == '') {
            setResetEmailErrorMessage("Saissisez votre email")
            return false
        }
        else if (!isEmailValid(email)) {
            setResetEmailErrorMessage("Email non valide")
            return false
        }
        else {
            setResetEmailErrorMessage('')
            return true
        }
    }

    const checkPassword = (password) => {
        if (password == '') {
            setPasswordErrorMessage("Ecrire votre mot de passe")
            return false
        }
        else if (password.length < 4) {
            setPasswordErrorMessage("Mot de pass a " + '4 ' + "characters au minimum")
            return false
        }
        else {
            setPasswordErrorMessage('')
            return true
        }
    }
    const checkNewPassword = (password) => {
        if (password == '') {
            setNewPasswordError("Ecrire votre mot de passe")
            return false
        }
        else if (password.length < 4) {
            setNewPasswordError("Mot de pass a " + '4 ' + "characters au minimum")
            return false
        }
        else {
            setNewPasswordError('')
            return true
        }
    }


    return (
        <ImageBackground
            source={Images.loginBackground}
            resizeMode="cover"
            style={{
                //flex: 1,
                height: height,
                width: width,
            }}
        >
            <StatusBar hidden />
            <View
                style={{
                    flex: 1,
                    padding: scale(20),
                    flexDirection: "column",
                    alignItems: 'center',
                    //backgroundColor: 'rgba(255,255,255,0.3)',

                }}
            >
                {/* <View
                    style={{
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        marginVertical: scale(50),
                    }}>
                    <Text
                        style={{
                            color: Colors.themeColor2,
                            fontSize: 30,
                            fontWeight: 'bold',
                            // borderWidth:2,
                            // borderColor:'#a8cfb5',
                            // paddingLeft:5
                        }}
                    >EXPERT</Text>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 30,
                            backgroundColor: Colors.themeColor1,
                            fontWeight: 'bold',
                            // paddingRight:5,
                            // paddingVertical:2
                        }}
                    >IMMO</Text>
                </View> */}
                <Animatable.View
                style={{ marginTop:20, padding:5,borderRadius:10}}
                        animation="bounceIn"
                        delay={500}>
<Image source={Images.logo} resizeMode="contain" style={{width:scale(150), height:scale(150)}} />
                        </Animatable.View>
                
                {screen == "login" &&
                    <Animatable.View
                        animation="bounceInLeft"
                        delay={0}
                        style={{
                            marginTop: '10%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // padding:20,
                            backgroundColor: 'rgba(255,255,255,0)',
                            shadowColor: "purple",
                            shadowOffset: {
                                width: 4,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            overflow: 'hidden',
                            elevation: 0,
                            paddingVertical: scale(40),
                            borderRadius: scale(10),
                            // width: scale(300),
                            // height: scale(260)
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.themeColor7,
                                fontSize: scale(14),
                                width: scale(250),
                                textAlign: 'center',
                                fontFamily: 'nexaregular'
                            }}
                        >Saissisez votre email et mot de passe</Text>
                        <Text
                            style={{
                                width: scale(250),
                                height: scale(20),
                                //backgroundColor:'',
                                paddingHorizontal: 10,
                                color: 'crimson',
                                fontFamily: 'nexaregular'
                            }}
                        >{emailErrorMessage} </Text>
                        <Text
                            style={{
                                width: scale(250),
                                height: scale(20),
                                //backgroundColor:'',
                                paddingHorizontal: 10,
                                color: 'crimson',
                                fontWeight: 'bold'
                            }}
                        >{passwordErrorMessage} </Text>
                        <View
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: Colors.themeColor7,
                                backgroundColor: Colors.themeColor0,
                                marginBottom: 20,
                                elevation: scale(10),
                                overflow: 'hidden'
                            }}
                        >
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                style={{
                                    flex: 1,
                                    color: Colors.themeColor3,
                                    padding: 0,
                                    paddingHorizontal: 10,
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular'

                                }}
                            />
                        </View>
                        <View
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: Colors.themeColor7,
                                backgroundColor: Colors.themeColor0,
                                marginBottom: 10,
                                elevation: scale(10),
                                overflow: 'hidden'
                            }}
                        >
                            <TextInput
                                secureTextEntry
                                placeholder="Mot de passe"
                                value={password}
                                onChangeText={setPassword}
                                style={{
                                    flex: 1,
                                    color: Colors.themeColor3,
                                    padding: 0,
                                    paddingHorizontal: 10,
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular'

                                }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { setScreen('reset') }}
                            style={{
                                alignSelf: 'flex-end',
                                marginBottom: 30,
                                borderRadius: 5,
                                paddingHorizontal: 10,
                                marginRight:scale(30)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale(14),
                                    color: Colors.themeColor7,
                                    fontFamily: 'nexaregular'
                                }}
                            >
                                Mot de passe oublié?
                            </Text>
                        </TouchableOpacity>
                        <Button
                            onPress={() => { handelLoginBtn() }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={[Colors.themeColor9,Colors.themeColor10]}
                            style={{
                                width: scale(150),
                                height: scale(40),
                                borderRadius: 10,
                                overflow: 'hidden',
                            }}
                        >
                            {!isLoading ? <Text
                                style={{
                                    color: 'white',
                                    fontSize: scale(20),
                                    fontFamily: 'nexaregular'
                                }}
                            >S'identifier</Text> :
                                <ActivityIndicator size="large" color="white" />
                            }
                        </Button>
                    </Animatable.View>
                }
                {screen == "reset" &&
                    <Animatable.View
                        animation="bounceInRight"
                        delay={0}
                        style={{
                            marginTop: '10%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // padding:20,
                            shadowColor: "purple",
                            shadowOffset: {
                                width: 4,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            overflow: 'hidden',
                            elevation: 0,
                            paddingVertical: scale(40),
                            borderRadius: scale(10),
                            // width: scale(300),
                            // height: scale(260)
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.themeColor7,
                                fontSize: scale(14),
                                width: scale(250),
                                textAlign: 'center',
                                marginBottom: 5,
                                //backgroundColor: 'rgba(255,255,255,0.7)',
                                //elevation: 1,
                                borderWidth: 0,
                                borderRadius: scale(10),
                                fontFamily: 'nexaregular'
                            }}
                        >Réinitialiser votre mot de passe</Text>
                        <Text
                            style={{
                                width: scale(250),
                                height: scale(20),
                                //backgroundColor:'',
                                paddingHorizontal: 10,
                                color: 'crimson',
                                fontFamily: 'nexaregular'
                            }}
                        >{resetEmailErrorMessage} </Text>
                        <View
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: Colors.themeColor7,
                                backgroundColor: Colors.themeColor0,
                                marginBottom: 20,
                                elevation: scale(10),
                                overflow: 'hidden'
                            }}
                        >
                            <TextInput
                                placeholder="Email"
                                value={resetEmail}
                                onChangeText={setResetEmail}
                                style={{
                                    flex: 1,
                                    color: Colors.themeColor3,
                                    padding: 0,
                                    paddingHorizontal: 10,
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular'

                                }}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => { setScreen('login') }}
                            style={{
                                alignSelf: 'flex-end',
                                marginBottom: 30,
                                borderRadius: scale(10),
                                paddingHorizontal: 10,
                                marginRight:scale(30)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor7
                                }}
                            >
                                Retour
                            </Text>
                        </TouchableOpacity>
                        <Button
                            onPress={() => { resetPassword() }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={[Colors.themeColor9,Colors.themeColor10]}
                            style={{
                                width: scale(150),
                                height: scale(40),
                                borderRadius: 10,
                                overflow: 'hidden',
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: scale(20),
                                    fontFamily: 'nexaregular'
                                }}
                            >Envoyer code</Text>
                        </Button>
                    </Animatable.View>
                }
                {screen == "code" &&
                    <Animatable.View
                        animation="bounceInRight"
                        delay={0}
                        style={{
                            marginTop: '10%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // padding:20,
                            //backgroundColor: 'rgba(255,255,255,0.2)',
                            shadowColor: "purple",
                            shadowOffset: {
                                width: 4,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            overflow: 'hidden',
                            elevation: 0,
                            paddingVertical: scale(40),
                            borderRadius: scale(10),
                            // width: scale(300),
                            // height: scale(260)
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.themeColor7,
                                fontSize: scale(16),
                                width: scale(250),
                                textAlign: 'center',
                                fontFamily: 'nexaregular'
                            }}
                        >Entrer code</Text>
                        <Text
                            style={{
                                width: scale(250),
                                height: scale(20),
                                //backgroundColor:'',
                                paddingHorizontal: 10,
                                color: 'crimson',
                                fontFamily: 'nexaregular',
                                marginLeft:scale(60)
                            }}
                        >{codeError} </Text>
                        <SmoothPinCodeInput
                            placeholder={<View style={{
                                width: 10,
                                height: 10,
                                borderRadius: 25,
                                opacity: 0.3,
                                backgroundColor: Colors.themeColor2,
                            }}></View>}
                            restrictToNumbers
                            containerStyle={{
                                marginBottom: scale(20),
                                //backgroundColor: 'rgba(255,255,255,0.7)'
                            }}
                            textStyle={{
                                color: Colors.themeColor3,
                                fontSize: scale(20),
                                fontFamily: 'nexaregular'
                            }}
                            cellStyle={{
                                borderWidth: 2,
                                borderColor: Colors.themeColor3,
                                backgroundColor: 'white'
                            }}
                            cellStyleFocused={{
                                borderColor: Colors.themeColor7,
                                borderWidth:3
                            }}
                            ref={pinInput}
                            value={code}
                            onTextChange={code => setCode(code)}
                            //onFulfill={_checkCode}
                            codeLength={4}
                        />

                        <TouchableOpacity
                            onPress={() => { setScreen('reset') }}
                            style={{
                                alignSelf: 'flex-end',
                                marginBottom: 30,
                                borderRadius: scale(10),
                                paddingHorizontal: 10,
                                marginRight:scale(55)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor7,
                                }}
                            >
                                Retour
                            </Text>
                        </TouchableOpacity>
                        <Button
                            onPress={() => { _checkCode(code) }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={[Colors.themeColor9,Colors.themeColor10]}
                            style={{
                                width: scale(150),
                                height: scale(40),
                                borderRadius: 10,
                                overflow: 'hidden',
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: scale(20),
                                    fontFamily: 'nexaregular'
                                }}
                            >OK</Text>
                        </Button>
                    </Animatable.View>
                }
                {screen == "new" &&
                    <Animatable.View
                        animation="bounceInRight"
                        delay={0}
                        style={{
                            marginTop: '10%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // padding:20,
                            //backgroundColor: 'rgba(255,255,255,0.2)',
                            shadowColor: "purple",
                            shadowOffset: {
                                width: 4,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            overflow: 'hidden',
                            elevation: 0,
                            paddingVertical: scale(40),
                            borderRadius: scale(10),
                            // width: scale(300),
                            // height: scale(260)
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.themeColor7,
                                fontSize: scale(15),
                                width: scale(250),
                                textAlign: 'center',
                                marginBottom: 10,
                                fontFamily: 'nexaregular'
                            }}
                        >Entrer votre nouveau mot de passe</Text>
                        <Text
                            style={{
                                width: scale(250),
                                height: scale(30),
                                //backgroundColor:'',
                                paddingHorizontal: 10,
                                color: 'crimson',
                                fontFamily: 'nexaregular'
                            }}
                        >{newPasswordError} </Text>

                        <View
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: Colors.themeColor7,
                                backgroundColor: Colors.themeColor0,
                                marginBottom: 10,
                                elevation: scale(10),
                                overflow: 'hidden'
                            }}
                        >
                            <TextInput
                                secureTextEntry
                                placeholder="Mot de passe"
                                value={newPassword1}
                                onChangeText={setNewPassword1}
                                style={{
                                    flex: 1,
                                    color: Colors.themeColor3,
                                    padding: 0,
                                    paddingHorizontal: 10,
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular'

                                }}
                            />
                        </View>
                        <View
                            style={{
                                width: scale(250),
                                height: scale(40),
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: Colors.themeColor7,
                                backgroundColor: Colors.themeColor0,
                                marginBottom: 10,
                                elevation: scale(10),
                                overflow: 'hidden'
                            }}
                        >
                            <TextInput
                                secureTextEntry
                                placeholder="Ressaisir mot de passe"
                                value={newPassword2}
                                onChangeText={setNewPassword2}
                                style={{
                                    flex: 1,
                                    color: Colors.themeColor3,
                                    padding: 0,
                                    paddingHorizontal: 10,
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular'

                                }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { setScreen('code') }}
                            style={{
                                alignSelf: 'flex-end',
                                marginBottom: 30,
                                borderRadius: scale(10),
                                paddingHorizontal: 10,
                                marginRight:scale(25)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: scale(14),
                                    fontFamily: 'nexaregular',
                                    color: Colors.themeColor7
                                }}
                            >
                                Retour
                            </Text>
                        </TouchableOpacity>
                        <Button
                            onPress={() => { changePassword() }}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            colors={[Colors.themeColor9,Colors.themeColor10]}
                            style={{
                                width: scale(150),
                                height: scale(40),
                                borderRadius: 10,
                                overflow: 'hidden',
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: scale(20),
                                    fontFamily: 'nexaregular'
                                }}
                            >Changer</Text>
                        </Button>
                    </Animatable.View>
                }
            </View>

        </ImageBackground>
    )
}

const { height, width } = Dimensions.get('screen');
const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center",
    },
});
