import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, Dimensions, ScrollView, TextInput, Switch, FlatList, Platform, Picker, Modal } from 'react-native';
import { Images } from '../constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../constants/Colors';
import { scale } from 'react-native-size-matters';
import Button from '../components/Button'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DatePicker from 'react-native-date-picker'
import { useAppContext } from '../context/AppContext';
import { api } from '../constants/api_config';
import PropTypes from 'prop-types'

export default function MultiOptionsSelect({title, data, onChange=()=>0, multiple=false, labelKey="_id", style,textStyle, showMode="number"}) {
    const [open, setOpen ] = useState(false)
    const [ _data, _setData ] = useState([])
    const [ renderr, rerenderr ] = useState(false)
    const [ number, setNumber ] = useState(0)
    const [ y, setY ] = useState(0)
    //const [ value, setValue ] = useState("")
    useEffect(()=>{
        let newData = []
        for (let el of data) {
            newData.push({
                _id: el._id,
                name: el[labelKey],
                selected: false
            })
        }
        _setData(newData)
    },[data])
    const toggle = (id) => {
        let newData = _data
        for (let i in newData) {
            if(newData[i]._id == id) {
                newData[i].selected = !newData[i].selected
            }
            else {
                if (!multiple) {
                    newData[i].selected = false
                }
            }
        }
        
        _setData(newData)
        rerenderr(!renderr)
        let selected = getSelected()
        onChange(selected)
        //console.log(selected)
    }
    const getSelected = () => {
        let SelectedData = _data.filter( item => item.selected )
        let newData = []
        //console.log(newData)
        for (let el of SelectedData){
            newData.push(el._id)
        }
        setNumber(SelectedData.length)
        return newData
    }
    // useEffect(()=>{
    //     //console.log(textStyle)
    // },[_data])
    return (
                    <View
                        style={{
                            width:scale(250),
                            borderRadius: 5,
                            overflow:'hidden',
                            minHeight:scale(50)
                        }}
                    >
                        <TouchableOpacity
                            onPress={()=>{setOpen(!open)}}
                            style={{
                                flex:1,
                                height: scale(40),
                                backgroundColor: 'white',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                flexDirection: 'row',
                                ...style
                            }}
                        >
                            {showMode=="number" && <Text
                                style={{
                                    fontSize: scale(14),
                                    color: 'black',
                                    ...textStyle
                                }}
                            >{title} ({number}) ({data.length}) </Text>}
                            {showMode=="text" && <Text
                                style={{
                                    fontSize: scale(14),
                                    color: 'black',
                                    ...textStyle
                                }}
                            >{title}:  </Text>}
                            <AntDesign name={ open ? "up" : "down"} size={20} color={textStyle.color} />
                        </TouchableOpacity>
                        
                        {/* {open && <View
                            style={{
                                flex:1,
                                flexDirection:'row',
                                maxHeight:scale(150)
                            }}
                        >
                            <ScrollView>
                                <View>
                                {_data?.map((el,index)=>
                                
                                    <TouchableOpacity
                                        onPress={()=>{toggle(el._id)}}
                                        key={el._id}
                                        style={{
                                            flex:1,
                                            height:scale(30),
                                            borderBottomColor:'white',
                                            borderBottomWidth:1,
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            flexDirection:'row',
                                            alignItems:'center',
                                            paddingHorizontal: 20,
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Text
                                            style={{color:'white'}}
                                        >{el.name}</Text>
                                        <View>
                                        { el.selected && <MaterialCommunityIcons name="check" size={25} color="white" />}
                                        </View>
                                    </TouchableOpacity>
                                    
                                )}
                                </View>
                            </ScrollView>
                        </View>} */}
                        
                        <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        //   setModalVisible(!modalVisible);
        // }}
        statusBarTranslucent 
        style={{
            width: width,
            height: height
        }}
      >
          <TouchableOpacity
                            onPress={()=>{setOpen(!open)}}
                            style={{
                                width: width,
                                height: height,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <View
                            style={{
                                width:width*0.8,
                                flexDirection:'row',
                                maxHeight:scale(200),
                                backgroundColor: Colors.themeColor0,
                                borderRadius: scale(5),
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical:10
                            }}
                        >
                            <View
                                style={{
                                    width:width*0.7,
                                    maxHeight: scale(150),
                                    overflow:'hidden',
                                    borderRadius: 5
                                }}
                            >
                            <ScrollView
                                onScroll={(ev)=>{setY(ev.nativeEvent.contentOffset.y)}}
                            >
                                
                                {_data?.map((el,index)=>
                                
                                    <TouchableOpacity
                                        onPress={()=>{toggle(el?._id)}}
                                        key={el?._id}
                                        style={{
                                            width: 
                                            //(scale(40)*(index+1)-scale(39))<y ? width*0.65 + width*0.05* ((scale(40)*(index+1)-scale(39))/y) 
                                             //: (scale(40)*(index+2)-scale(39)) > y + scale(150) ? width*0.65 + width*0.05 * (y+scale(150)) / (scale(39)*(index+1)) :
                                             width*0.7  ,
                                            height:scale(40),
                                            borderBottomColor:Colors.themeColor7,
                                            borderBottomWidth:1,
                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                            flexDirection:'row',
                                            alignItems:'center',
                                            paddingHorizontal: 20,
                                            justifyContent: "space-between",
                                            alignSelf:'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color:'white',
                                                fontFamily: 'nexaregular',
                                                fontSize: scale(12)
                                            }}
                                        >{el?.name}</Text>
                                        <View>
                                        { el?.selected && <MaterialCommunityIcons name="check" size={25} color="white" />}
                                        </View>
                                    </TouchableOpacity>
                                    
                                )}
                                
                            </ScrollView>
                            </View>
                        </View>
                        </TouchableOpacity>
      </Modal>
                    </View>
    )
}
// MultiOptionsSelect.propTypes = {
//     labelKey: PropTypes.string,
//     data: PropTypes.array,
//     onChange: PropTypes.func,
//     multiple: PropTypes.bool
//   }
const { height, width } = Dimensions.get('screen');