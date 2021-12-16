import RNDateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";
import { Colors } from "../constants/Colors";



export default DatePickerComponent = ({ onChange, value = new Date(), mode, name = "Date" }) => {
    const [open, setOpen] = useState(false)
    return (
        <View>
            <View
                style={{
                    backgroundColor: 'rgba(3, 57, 71,0.9)',
                    borderRadius: scale(5),
                    marginVertical: 5
                }}
            >
                <Text
                    style={{
                        color: Colors.themeColor6,
                        fontSize: scale(14),
                        marginLeft: 10,
                        marginTop: 5,
                        fontFamily: 'nexaregular'
                    }}
                >{name}</Text>
                <TouchableOpacity
                    onPress={() => { setOpen(!open) }}
                    style={{
                        width: scale(100),
                        height: scale(40),
                        borderRadius: scale(5),
                        backgroundColor: 'rgba(3, 57, 71,0.9)',
                        borderBottomWidth: 2,
                        borderColor: Colors.themeColor0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10
                    }}
                >
                    {mode == "date" &&
                        <Text
                            style={{ fontSize: scale(12), color: Colors.themeColor0,fontFamily: 'nexaregular' }}
                        >
                            {
                                value.toLocaleDateString("en-US")
                            }
                        </Text>}
                    {mode == "time" &&
                        <Text
                            style={{ fontFamily: 'nexaregular', fontSize: scale(12), color: Colors.themeColor0 }}
                        >
                            {
                                [value?.getHours(),
                                value?.getMinutes()<10 ? "0"+value?.getMinutes() : value?.getMinutes() ].join(':')
                            }
                        </Text>}
                </TouchableOpacity>

                {open && <RNDateTimePicker
                themeVariant ="dark"
                    onChange={(ev, date) => {
                        onChange(ev, date)
                        setOpen(false)
                    }}
                    value={value}
                    mode={mode}

                />}
            </View>
        </View>
    )
}