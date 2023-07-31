import { modalStyles, nutritionStyles, mealStyles } from "../styling/front";
import { View, Image, Text, ScrollView, ActivityIndicator, TextInput, ActionSheetIOS } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PieChart from 'react-native-pie-chart';
import colors from "./colors";
import { useState, useEffect } from 'react'; 

const MealImages = {
    burger: require('../assets/meal/burger.png'),
    donut: require('../assets/meal/donut.png'),
    friedEgg: require('../assets/meal/fried-egg.png'),
    milkshake: require('../assets/meal/milkshake.png'),
    serving: require('../assets/meal/serving.png'),
}

function round(number, decimalPlaces) {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
}

export const MealSheet = ({ mealId, setSearch }) => {
    const [data, setData] = useState({});
    const [ogName, setOgName] = useState('');
    const [needsSave, setNeedsSave] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            API = 'http://10.0.0.58:5000';
            const response = await fetch(`${API}/meal?` + new URLSearchParams({ mealId: mealId[0] }));
            const data = await response.json();
            setData(data);
            setOgName(data.meal.title);
            setLoading(false);
        }
        getData();
    }, [mealId])

    if (loading) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}} >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    const NutrientNum = ({type}) => {
        if (type in data.nutrients.totalNutrients) {
            return  <Text style={nutritionStyles.normal} >{round(data.nutrients.totalNutrients[type].quantity, 2)} <Text style={nutritionStyles.light} >{data.nutrients.totalNutrients[type].unit}</Text></Text>;
        } else {
            return <></>;
        }
    }

    const NutrientPerc = ({type}) => {
        if (type in data.nutrients.totalDaily) {
            return <Text style={nutritionStyles.normal} >{round(data.nutrients.totalDaily[type].quantity, 2)}%</Text>;
        } else {
            return <></>;
        }
    }

    const changeNotes = (newNotes) => {
        setData(prev => {
            const newState = {...prev};
            newState.meal.notes = newNotes;
            return newState;
        });
        setNeedsSave(true);
    }

    const changeTitle = (newTitle) => {
        setData(prev => {
            const newState = {...prev};
            newState.meal.title = newTitle;
            return newState;
        })
        setNeedsSave(true);
    }

    const deleteIngredient = (oldFoodId) => {
        setData(prev => {
            const newState = {...prev};
            newState.foods = newState.foods.filter(food => food.food_id !== oldFoodId);
            return newState;
        })
        setNeedsSave(true);
    }

    const actionHandler = (foodId) => 
        ActionSheetIOS.showActionSheetWithOptions(
            {
            options: ['Cancel', 'Delete'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 0,
            userInterfaceStyle: 'dark',
            },
            buttonIndex => {
                if (buttonIndex === 1) {
                    deleteIngredient(foodId);
                }
            },
        );

    const saveMeal = async () => {
        const sendingData = {
            id: mealId[0],
            name: data.meal.title === ogName ? null : data.meal.title,
            notes: data.meal.notes,
            image_url: data.meal.image,
            foods: data.foods
        }
        API = 'http://10.0.0.58:5000';
        await fetch(`${API}/meals`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendingData)
        });
        setSearch('-');
        setNeedsSave(false);
    }

    return (
        <ScrollView>
            <View style={modalStyles.columnsContainer} >
                <Image style={modalStyles.foodImg} source={MealImages[data.meal.image]} />
                <View style={modalStyles.descContainer} >
                    <TextInput style={modalStyles.title} onChangeText={(text) => changeTitle(text)} value={data.meal.title} ></TextInput>
                    <TouchableOpacity onPress={() => needsSave ? saveMeal() : null}>
                        <View style={[modalStyles.btn, needsSave ? {backgroundColor: colors.primary, color: 'white'} : {backgroundColor: colors.secondary, color: 'white'}]} >
                            <Image style={modalStyles.btnImage} source={require('../assets/save.png')} />
                            <Text style={modalStyles.btnName} >{needsSave ? 'Save' : 'Saved'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={modalStyles.nutritionTitle} >Notes</Text>
            <TextInput value={data.meal.notes}  onChangeText={(text) => changeNotes(text)} multiline={true} placeholder="Write your notes here..." placeholderTextColor={colors.lightGray} style={mealStyles.foodNotes}  />
            <View style={{paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'flex-end' ,flexDirection: 'row'}} >
                <Text style={{fontSize: 23, fontWeight: 600, color: 'white'}} >Ingredients</Text>
                <TouchableOpacity>
                    <View style={[modalStyles.btn, {padding: 3}]} >
                        <Image style={modalStyles.btnImage} source={require('../assets/add.png')} />
                        <Text style={modalStyles.btnName} >Find More</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={mealStyles.foodContainer} >
                {data.foods.map((food, i) => (
                    <View key={i} style={mealStyles.foodRow} >
                        <Image source={{ uri: food.image }} style={mealStyles.foodImage} />
                        <Text style={mealStyles.foodName } >{food.name}</Text>
                        <Text style={mealStyles.foodQuantity} >100 Gram(s)</Text>
                        <TouchableOpacity onPress={() => actionHandler(food.food_id)}>
                            <Image source={require('../assets/filters.png')} style={mealStyles.foodDelete}  />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={nutritionStyles.chartContainer} >
                <View style={nutritionStyles.chart} >
                    <PieChart
                        widthAndHeight={150}
                        series={[data.nutrients.totalNutrients.FAT.quantity || 0, data.nutrients.totalNutrients.PROCNT.quantity || 0, data.nutrients.totalNutrients.CHOCDF.quantity || 0]}
                        sliceColor={[colors.red, colors.primary, colors.tan]}
                        coverRadius={0.45}
                        coverFill={colors.base}
                    />
                </View>
                <View style={nutritionStyles.chartLegend}>
                    <Text style={nutritionStyles.calories} >{data.meal.calories || 0} Calories</Text>
                    <Text style={{fontSize: 14, color: colors.lightGray}} >% Daily Values</Text>
                    <View style={nutritionStyles.chartLegendRow}>
                        <View style={[nutritionStyles.chartLegendColor, {backgroundColor: colors.red}]} ></View>
                        <Text style={nutritionStyles.chartLegendText} >{Math.round(data.nutrients.totalDaily.FAT.quantity || 0)}% Fat</Text>
                    </View>
                    <View style={nutritionStyles.chartLegendRow}>
                        <View style={[nutritionStyles.chartLegendColor, {backgroundColor: colors.primary}]} ></View>
                        <Text style={nutritionStyles.chartLegendText} >{Math.round(data.nutrients.totalDaily.PROCNT.quantity || 0)}% Protein</Text>
                    </View>
                    <View style={nutritionStyles.chartLegendRow}>
                        <View style={[nutritionStyles.chartLegendColor, {backgroundColor: colors.tan}]} ></View>
                        <Text style={nutritionStyles.chartLegendText} >{Math.round(data.nutrients.totalDaily.CHOCDF.quantity || 0)}% Carbs</Text>
                    </View>
                </View>
            </View>
            <Text style={modalStyles.nutritionTitle} >Nutrition Facts</Text>
            <Text style={[modalStyles.subtitle, {paddingLeft: 20}]} >{Math.round(data.nutrients.totalDaily.ENERC_KCAL.quantity || 0)}% Total Daily Value</Text>
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
                    <Text style={[nutritionStyles.normal, {marginLeft: 40}]} >Includes {'SUGAR.added' in data.nutrients.totalNutrients ? data.nutrients.totalNutrients['SUGAR.added'].quantity : 0}g Added Sugars</Text>
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