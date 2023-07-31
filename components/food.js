import { modalStyles, nutritionStyles } from "../styling/front";
import { View, Image, Text, ScrollView, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PieChart from 'react-native-pie-chart';
import colors from "./colors";
import { useEffect, useState } from "react";

function round(number, decimalPlaces) {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
}

export const FoodSheet = ({ foodData }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            API = 'http://10.0.0.58:5000';
            const response = await fetch(`${API}/foods`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ foodId: foodData[0] })
            });
            const data = await response.json();
            setData(data);
            setLoading(false);
        }
        getData();
    }, [foodData])

    if (loading) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}} >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    const parseInfo = (key) => {
        return data.ingredients[0].parsed[0][key];
    }

    const NutrientNum = ({type}) => {
        if (type in data.totalNutrients) {
            return  <Text style={nutritionStyles.normal} >{round(data.totalNutrients[type].quantity, 2)} <Text style={nutritionStyles.light} >{data.totalNutrients[type].unit}</Text></Text>;
        } else {
            return <></>;
        }
    }

    const NutrientPerc = ({type}) => {
        if (type in data.totalDaily) {
            return <Text style={nutritionStyles.normal} >{round(data.totalDaily[type].quantity, 2)}%</Text>;
        } else {
            return <></>;
        }
    }

    return (
        <ScrollView>
            <View style={modalStyles.columnsContainer} >
                <Image style={modalStyles.foodImg} source={{ uri: foodData[1]}} />
                <View style={modalStyles.descContainer} >
                    <Text style={modalStyles.title} >{parseInfo('food')}</Text>
                    <TouchableOpacity>
                        <View style={modalStyles.btn} >
                            <Image style={modalStyles.btnImage} source={require('../assets/add.png')} />
                            <Text style={modalStyles.btnName} >Add to Meal</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={modalStyles.labelContainer} contentContainerStyle={modalStyles.labelContainerStyle} horizontal={true} >
                <View style={modalStyles.label} >
                    <Text style={modalStyles.labelText} >Low Fat</Text>
                </View>
                <View style={modalStyles.label} >
                    <Text style={modalStyles.labelText} >Low-Carb</Text>
                </View>
            </ScrollView>
            <Text style={modalStyles.nutritionTitle} >Nutrition Claims</Text>
            <Text style={modalStyles.nutritionDesc} >{data.healthLabels.map(label => ` ${label} •`)}</Text>
            <View style={nutritionStyles.chartContainer} >
                <View style={nutritionStyles.chart} >
                    <PieChart
                        widthAndHeight={150}
                        series={[data.totalNutrients.FAT.quantity, data.totalNutrients.PROCNT.quantity, data.totalNutrients.CHOCDF.quantity]}
                        sliceColor={[colors.red, colors.primary, colors.tan]}
                        coverRadius={0.45}
                        coverFill={colors.base}
                    />
                </View>
                <View style={nutritionStyles.chartLegend}>
                    <Text style={nutritionStyles.calories} >{data.calories} Calories</Text>
                    <Text style={{fontSize: 14, color: colors.lightGray}} >% Daily Values</Text>
                    <View style={nutritionStyles.chartLegendRow}>
                        <View style={[nutritionStyles.chartLegendColor, {backgroundColor: colors.red}]} ></View>
                        <Text style={nutritionStyles.chartLegendText} >{Math.round(data.totalDaily.FAT.quantity)}% Fat</Text>
                    </View>
                    <View style={nutritionStyles.chartLegendRow}>
                        <View style={[nutritionStyles.chartLegendColor, {backgroundColor: colors.primary}]} ></View>
                        <Text style={nutritionStyles.chartLegendText} >{Math.round(data.totalDaily.PROCNT.quantity)}% Protein</Text>
                    </View>
                    <View style={nutritionStyles.chartLegendRow}>
                        <View style={[nutritionStyles.chartLegendColor, {backgroundColor: colors.tan}]} ></View>
                        <Text style={nutritionStyles.chartLegendText} >{Math.round(data.totalDaily.CHOCDF.quantity)}% Carbs</Text>
                    </View>
                </View>
            </View>
            <Text style={modalStyles.nutritionTitle} >Nutrition Facts</Text>
            <Text style={[modalStyles.subtitle, {paddingLeft: 20}]} >{parseInfo('servingSizes') ? 'Serving Sizes' : 'Quantity Size'}: {parseInfo('servingSizes') ? parseInfo('servingSizes').map(size => `/ ${size.quantity} ${size.label}(s)` ) : `${parseInfo('quantity')} ${parseInfo('measure')}(s)`}</Text>
            <Text style={[modalStyles.subtitle, {paddingLeft: 20}]} >{Math.round(data.totalDaily.ENERC_KCAL.quantity)}% Total Daily Value</Text>
            <View style={modalStyles.topNutrition} >
                <Text style={modalStyles.subtitle} ></Text>
                <Text style={modalStyles.subtitle} >% Daily Value</Text>    
            </View>
            <View style={nutritionStyles.container} >
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.bold} >Total Fat: <NutrientNum type="FAT" /></Text>
                    <NutrientPerc type="FAT" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={[nutritionStyles.normal, {marginLeft: 40}]} >Saturated Fat: <NutrientNum type="FASAT" /></Text>
                    <NutrientPerc type="FASAT" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={[nutritionStyles.normal, {marginLeft: 40}]} >Trans Fat: <NutrientNum type="FATRN" /></Text>
                    <NutrientPerc type="FATRN" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.normal} >Cholesterol: <NutrientNum type="CHOLE" /></Text>
                    <NutrientPerc type="CHOLE" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.normal} >Sodium: <NutrientNum type="NA" /></Text>
                    <NutrientPerc type="NA" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.bold} >Total Carbohydrate: <NutrientNum type="CHOCDF" /></Text>
                    <NutrientPerc type="CHOCDF" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={[nutritionStyles.normal, {marginLeft: 40}]} >Dietary Fiber: <NutrientNum type="FIBTG" /></Text>
                    <NutrientPerc type="FIBTG" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={[nutritionStyles.normal, {marginLeft: 40}]} >Sugars: <NutrientNum type="SUGAR" /></Text>
                    <NutrientPerc type="SUGAR" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={[nutritionStyles.normal, {marginLeft: 40}]} >Includes {'SUGAR.added' in data.totalNutrients ? data.totalNutrients['SUGAR.added'].quantity : 0}g Added Sugars</Text>
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.bold} >Protein: <NutrientNum type="PROCNT" /></Text>
                    <NutrientPerc type="PROCNT" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.normal} >Vitamin D: <NutrientNum type="VITD" /></Text>
                    <NutrientPerc type="VITD" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.normal} >Calcium: <NutrientNum type="CA" /></Text>
                    <NutrientPerc type="CA" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.normal} >Iron: <NutrientNum type="FE" /></Text>
                    <NutrientPerc type="FE" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.normal} >Potassium: <NutrientNum type="K" /></Text>
                    <NutrientPerc type="K" />
                </View>
                <View style={nutritionStyles.row} >
                    <Text style={nutritionStyles.normal} >Vitamin C: <NutrientNum type="VITC" /></Text>
                    <NutrientPerc type="VITC" />
                </View>
            </View>
        </ScrollView>
    )
}