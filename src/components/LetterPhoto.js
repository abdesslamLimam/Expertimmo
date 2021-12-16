import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { scale } from "react-native-size-matters";
import { Colors } from "../constants/Colors";
import Button from "./Button";

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}
export default LetterPhoto = ({ width, height, name, style, fontSize }) => {
    if(name){
        var letter = name.split(' ')[0][0]?.toUpperCase() + name.split(' ')[1][0]?.toUpperCase()
        var code1 = "#"+intToRGB(hashCode(name.split(' ')[0]))
        var code2 = "#"+intToRGB(hashCode(name.split(' ')[1]))
}

    
    return (
        <Button
            disabled
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            //colors={name ? [code1, code2] : ['aqua', 'orange']}
            colors={ [Colors.themeColor2, Colors.themeColor1] }
            style={{
                width: width ? width : scale(50),
                height: height ? height : scale(50),
                borderRadius: width ? width : scale(500),
                overflow: 'hidden',
                ...style
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: fontSize ? fontSize : scale(20),
                    fontFamily: 'nexaregular'
                }}
            >{name ? letter : "??"}</Text>
        </Button>
    )
}