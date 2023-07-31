import { foodStyles } from '../styling/front';
import colors from './colors';
import { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View, Image, Text } from 'react-native';

const MealImages = {
    burger: require('../assets/meal/burger.png'),
    donut: require('../assets/meal/donut.png'),
    friedEgg: require('../assets/meal/fried-egg.png'),
    milkshake: require('../assets/meal/milkshake.png'),
    serving: require('../assets/meal/serving.png'),
}

export const FoodsList = ({ handlePress, menu, search, info, categories }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            API = 'http://10.0.0.58:5000';
            var response;
            if (menu === 'search') {
                response = await fetch(`${API}/foods?` + new URLSearchParams({ingr: search, categories: [...categories, ...info] }));
            } else {
                response = await fetch(`${API}/meals`);
            }
            const data = await response.json();
            setData(menu === 'search' ? data : data.meals);
            setLoading(false);
        }
        getData();
    }, [menu])

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            API = 'http://10.0.0.58:5000';
            const response = await fetch(`${API}/foods?` + new URLSearchParams({ingr: search, categories: [...categories, ...info] }));
            const data = await response.json();
            setData(menu === 'search' ? data : data.meals);
            setLoading(false);
        }
        getData();
    }, [search, info, categories])

    if (loading) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}} >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    return (
        <FlatList 
            numColumns={2} 
            data={data}
            style={foodStyles.list}
            renderItem={({ item }) => {
                const image = menu === 'search' ? { uri: item.image } : MealImages[item.image];
                const imageStyles = [foodStyles.foodImg];
                if (menu === 'meal') {
                    imageStyles.push(foodStyles.mealImg);
                }
                return <TouchableOpacity onPress={() => handlePress(menu, [item.id, item.image])} style={foodStyles.container}>
                    <View >
                        <Image style={imageStyles} source={image} />
                        <View style={foodStyles.text} >
                            <Text style={foodStyles.title} >{item.title}</Text>
                            { item.subtitle && <Text style={foodStyles.subtitle} >By {item.subtitle}</Text>  }
                        </View>
                        <View style={foodStyles.details} >
                            <Text style={foodStyles.calories} >{item.calories} Calories</Text>
                            { item.recommended && <View style={foodStyles.recommended}><Text style={foodStyles.recommendedText} >For You</Text></View> }
                        </View>
                    </View>     
                </TouchableOpacity>
            }}
        />
    )
}