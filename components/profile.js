import { profileStyling } from "../styling/profile";
import { modalStyles } from "../styling/front";
import { View, Image, Text, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useState } from "react";
import colors from "./colors";

const tempList = ["High Cholesterol", "High Blood Sugar", "High Blood Pressure", "Low Iron", "Overweight", "Heart Disease", "Cancer", "Osteoporosis"];

const ImageList = {
    "High Cholesterol": require('../assets/cholesterol.png'),
    "High Blood Sugar": require('../assets/blood.png'),
    "High Blood Pressure": require('../assets/blood-pressure.png'),
    "Low Iron": require('../assets/vascular.png'),
    "Overweight": require('../assets/body-scale.png'),
    "Heart Disease": require('../assets/heart-rate.png'),
    "Cancer": require('../assets/lungs.png'),
    "Osteoporosis": require('../assets/x-ray.png'),
}

export const ProfileSheet = ({ info, setInfo }) => {
    const [tempInfo, setTempInfo] = useState(info);
    const [needsSave, setNeedsSave] = useState(false);

    const deleteItem = (item) => {
        const newArr = tempInfo.filter(check => check !== item);
        setTempInfo(newArr);
        setNeedsSave(true);
    }

    const addItem = async (item) => {
        const newArr = [...tempInfo, item];
        setTempInfo(newArr);
        setNeedsSave(true);
    }

    const save = () => {
        setInfo(tempInfo);
        setNeedsSave(false);
    }

    return (
        <SafeAreaView style={{flex: 1}}>

            <FlatList
                style={profileStyling.container}
                numColumns={2}
                ListHeaderComponent={() => <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 10}} >
                    <Text style={profileStyling.titleStyle}>Health Information</Text>
                    <Text style={{marginTop: 10, fontSize: 14, color: 'white', textAlign: 'center', marginBottom: 10}} >Select your health conditions for us to better recommend you foods</Text>
                    <TouchableOpacity onPress={() => needsSave ? save() : null}>
                        <View style={[modalStyles.btn, needsSave ? {backgroundColor: colors.primary, color: 'white'} : {backgroundColor: colors.secondary, color: 'white'}]} >
                            <Image style={modalStyles.btnImage} source={require('../assets/save.png')} />
                            <Text style={modalStyles.btnName} >{needsSave ? 'Save' : 'Saved'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
                data = {tempList}
                renderItem={({item}) => (
                    <TouchableOpacity style={tempInfo.includes(item) ? profileStyling.clickActiveStyle : profileStyling.buttonStyle} onPress={() => tempInfo.includes(item) ? deleteItem(item) : addItem(item)}>
                        <View style={{gap: 10, justifyContent: 'center', alignItems: 'center'}} >
                            <Image style={{width: 60, height: 60 }} source={ImageList[item]} />
                            <Text style={profileStyling.textStyle}>{item}</Text>
                            {tempInfo.includes(item) && <Image style={profileStyling.checkmarkStyle} source={require('../assets/checkmark.png')} />}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}