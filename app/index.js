import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActionSheetIOS, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, View, Image, TextInput, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import colors from '../components/colors';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { FoodSheet } from '../components/food';
import { headerStyles, searchStyles, categoryStyles, modalStyles } from '../styling/front';
import { ProfileSheet } from '../components/profile';
import { FoodsList } from '../components/foodsList';
import { MealSheet } from '../components/meal';

const categoryList = [
    { name: 'Gluten-Free', src: require('../assets/breakfast.jpg') },
    { name: 'Vegan', src: require('../assets/lunch.avif') },
    { name: 'Vegetarian', src: require('../assets/dinner.avif') },
    { name: 'Dairy-Free', src: require('../assets/snack.avif') },
]

export default function Home() {
    const [currentSheet, setSheet] = useState([null, null]);
    const [menu, setMenu] = useState('search');
    const [constantSearch, setConstantSearch] = useState('');
    const [search, setSearch] = useState('');
    const [info, setInfo] = useState([]);
    const [categories, setCategories] = useState([]);

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const handlePresentPress = (sheet) => {
        setSheet(sheet)
        bottomSheetRef.current.expand();
    }
    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setSheet([null, null])
        }
    }, []);
    const renderBackdrop = useCallback(
        props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        ),
        []
    )

    const HandleBottomSheet = () => {
        const type = currentSheet[0];
        const data = currentSheet[1];
        if (type === 'search') {
            return <FoodSheet foodData={data} />
        } else if (type === 'meal') {
            return <MealSheet mealId={data} setSearch={setSearch} />
        } else if (type === 'profile') {
            return <ProfileSheet info={info} setInfo={setInfo} />
        } else {
            return <></>
        }
    }

    const getFilters = () => 
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Cancel', 'Show Meals', 'Show Search'],
              cancelButtonIndex: 0,
              userInterfaceStyle: 'dark',
            },
            buttonIndex => {
              if (buttonIndex === 1) {
                setSearch('');
                setConstantSearch('');
                setMenu('meal');
              } else if (buttonIndex === 2) {
                setSearch('');
                setConstantSearch('');
                setMenu('search');
              }
            },
        );
    
    const changeSearch = () => {
        setSearch(constantSearch);
    }

    const changeCategory = (currentCategory) => {
        if (categories.includes(currentCategory)) {
            const newList = categories.filter(c => c !== currentCategory);
            setCategories(newList);
        } else {
            setCategories([...categories, currentCategory]);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.base }}>
            <Stack.Screen
                options={{ headerShown: false }} 
            />
            <View style={headerStyles.container} >
                <View>
                    <Text style={headerStyles.h1} >Welcome 👋</Text>
                    <Text style={headerStyles.subtitle} >What do you want to make today?</Text>
                </View>
                <TouchableOpacity onPress={() => handlePresentPress(['profile', null])}>
                    <Image source={require('../assets/default_pfp.png')} style={headerStyles.pfp} />
                </TouchableOpacity>
            </View>
            <View style={categoryStyles.container} >
                <Text style={categoryStyles.title} >Categories</Text>
                <FlatList 
                    horizontal={true} 
                    style={categoryStyles.list}
                    data={categoryList}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[categoryStyles.category, categories.includes(item.name) ? {backgroundColor: colors.primary} : {}]} onPress={() => changeCategory(item.name)} >
                            <Image source={item.src} style={categoryStyles.categoryImg} />
                            <Text style={categoryStyles.categoryText} >{item.name}</Text>
                        </TouchableOpacity>
                    )}
                >
                </FlatList> 
            </View>
            <View style={searchStyles.container} >
                <View style={searchStyles.search} >
                    <TouchableOpacity onPress={changeSearch}>
                        <Image source={require('../assets/search.png')} style={searchStyles.searchImg} />
                    </TouchableOpacity>
                    <TextInput placeholder='Input foods or ingredients' style={searchStyles.input} onChangeText={(text) => setConstantSearch(text)} value={constantSearch} />
                </View>
                <TouchableOpacity style={searchStyles.filter} onPress={getFilters} >
                    <Image source={require('../assets/filters.png')} style={searchStyles.filterImg} />
                </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'flex-end' ,flexDirection: 'row'}} >
                <Text style={{fontSize: 25, fontWeight: 600, color: 'white'}} >{menu === 'search' ? 'Search' : 'Your Meals'}</Text>
                { menu === 'meal' && (
                    <TouchableOpacity>
                        <View style={modalStyles.btn} >
                            <Image style={modalStyles.btnImage} source={require('../assets/add.png')} />
                            <Text style={modalStyles.btnName} >New Meal</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <FoodsList 
                handlePress={(type, data) => handlePresentPress([type, data])}
                menu={menu}
                search={search}
                info={info}
                categories={categories}
            />
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                backgroundStyle={modalStyles.background}
                handleIndicatorStyle={{backgroundColor: 'white'}}
            >   
                <HandleBottomSheet />
            </BottomSheet>
        </SafeAreaView>
    )
}