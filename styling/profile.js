import colors from "../components/colors"

const profileStyling = {
    container: { paddingHorizontal: 15, marginBottom: 50 },
    titleStyle: {fontSize:25, color:'white', textAlign: "center"},
    textStyle: {fontSize: 16, color:'white'},
    buttonStyle: { width: '46%', margin: 10, backgroundColor: colors.secondary, borderRadius: 10, padding: 10, borderColor:colors.secondary, borderWidth:2},
    clickActiveStyle: {width: '46%', margin: 10, backgroundColor: colors.secondary, borderRadius: 10, padding: 10, borderColor:colors.primary, borderWidth:2, position: 'relative' },
    checkmarkStyle: {position:'absolute', top: -15, left: -15, width: 20, height:20}
}

export {profileStyling}