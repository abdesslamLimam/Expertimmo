import React from 'react'
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions, 
    TextInput, 
    FlatList, 
    Image, 
    ScrollView, 
    Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'


export default function Button (props) {


    return(
        <TouchableOpacity
        style={{
            overflow: 'hidden',
            ...props.style
        }}
        {...props}
        >
            <LinearGradient
            start={props.start}
            end={props.end}
            angle={props.angle}
            useAngle={props.useAngle}
            colors={props.colors}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}>
                {props.children}
            </LinearGradient>
        </TouchableOpacity>
        )
}