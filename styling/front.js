import { withLayoutContext } from "expo-router"
import colors from "../components/colors"

const headerStyles = {
    container: {gap: 5, paddingVertical: 15, paddingHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row' },
    h1: {fontSize: 25, fontWeight: 700, color: 'white'},
    subtitle: {fontSize: 15, color: colors.gray },
    pfp: { width:55, height: 55 }
}

const searchStyles = {
    container: { gap: 5, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'center', marginTop: 5, marginBottom: 5 },
    search: { backgroundColor: colors.secondary, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', gap: 15, flexBasis: '80%', padding: 10 },
    searchImg: { width: 30, height: 30 },
    input: { height: 30, flexBasis: '80%', fontSize: 15, color: 'white' },
    filter: { backgroundColor: colors.secondary, flexBasis: '20%', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    filterImg: { width: 30, height: 30 }
}

const categoryStyles = {
    container: { paddingHorizontal: 20 },
    title: { fontSize: 20, fontWeight: 600, color: 'white' },
    list: { paddingTop: 10, paddingBottom: 15 },
    category: { backgroundColor: 'black', borderRadius: 10, gap: 7, padding: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 },
    categoryImg: { width: 25, height: 25, borderRadius: 5 },
    categoryText: { fontSize: 14, color: 'white' }
}

const foodStyles = {
    list: { paddingHorizontal: 20 },
    container: { width: '46%', margin: 10, backgroundColor: colors.secondary, borderRadius: 15, paddingBottom: 7 },
    foodImg: { width: '100%', height: 150, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    mealImg: { width: '80%', height: 130, alignSelf: 'center', marginVertical: 10 },
    text: { paddingHorizontal: 10 },
    title: { fontSize: 17, color: 'white', fontWeight: 500, marginTop: 5 },
    subtitle: { color: colors.gray },
    details: { flexDirection: 'row', justifyContent: 'space-between', gap: 5, paddingHorizontal: 10, marginTop: 1 },
    calories: { color: 'white' },
    recommended: { backgroundColor: colors.primary, borderRadius: 5, padding: 4 },
    recommendedText: { fontWeight: 600, fontSize: 12 }
}

const modalStyles = {
    background: { backgroundColor: colors.base },
    columnsContainer: { marginTop: 10 , paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 20 },
    descContainer: { flexBasis: '68%' },
    foodImg: { height: 100, width: 100, borderRadius: 10 },
    title: { fontSize: 24, fontWeight: 700, color: 'white' },
    btn: { marginTop: 10  ,flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center', padding: 4, paddingHorizontal: 15, backgroundColor: colors.primary, borderRadius: 10, alignSelf: 'flex-start' },
    btnImage: { height: 25, width: 25 },
    btnName: { fontSize: 17, fontWeight: 500 }, 
    nutritionTitle: { fontSize: 18, fontWeight: 600, color: 'white', paddingHorizontal: 20, marginTop: 7 },
    nutritionDesc: { fontSize: 12, color: colors.lightGray, paddingHorizontal: 20, marginTop: 3 },
    subtitle: { fontSize: 16, color: colors.lightGray },
    topNutrition: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20 },
    labelContainer: { paddingHorizontal: 20, marginTop: 10 },
    labelContainerStyle: {flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center'},
    label: { backgroundColor: colors.secondary, padding: 7, borderRadius: 10 },
    labelText: { fontSize: 13, color: 'white' }
}

const nutritionStyles = {
    container: { marginBottom: 40, backgroundColor: colors.secondary, borderRadius: 15, marginTop: 10, flexDirection: 'column', marginHorizontal: 20 },
    row: { borderBottomWidth: 2, borderColor: colors.base, flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingHorizontal: 20 },
    bold: { fontSize: 16, color: 'white', fontWeight: 'bold' },
    normal: { fontSize: 16, color: 'white', fontWeight: 'normal' },
    light: { fontSize: 16, color: colors.gray, fontWeight: 'light' },  
    chartContainer: { flexDirection: 'row', justifyContent: 'center', margin: 20, gap: 20 },
    chart: { justifyContent: 'center', alignItems: 'center' },
    chartLegend: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 6 },
    chartLegendRow: { flexDirection: 'row', gap: 10 },
    chartLegendColor: { height: 15, width: 15, borderRadius: 10 },
    chartLegendText: { fontSize: 16, color: 'white' },
    calories: { color: 'white', fontSize: 20, fontWeight: 'bold' },
}

const mealStyles = {
    foodContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, marginTop: 10, backgroundColor: colors.secondary, borderRadius: 15 },
    foodRow: { width: '100%' ,borderBottomWidth: 2, borderColor: colors.base, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 20, padding: 10, paddingHorizontal: 20 }, 
    foodImage: { width: 25, height: 25, borderRadius: 10 },
    foodName: { flexBasis: '20%',fontSize: 17, fontWeight: 'bold', color: 'white' },
    foodQuantity: { flexBasis: '30%', fontSize: 17, color: colors.lightGray },
    foodDelete: { width: 20, height: 20, borderRadius: 10, padding: 12 },
    foodNotes: { marginHorizontal: 20, marginTop: 10, backgroundColor: colors.secondary, borderRadius: 10, color: 'white', padding: 10, paddingTop: 10, minHeight: 75 },
}

export { headerStyles, searchStyles, categoryStyles, foodStyles, modalStyles, nutritionStyles, mealStyles };