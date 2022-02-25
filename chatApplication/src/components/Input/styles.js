import { StyleSheet } from 'react-native'



export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%'
    },
    inputContainer: {
        width: '70%',
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        height: 40,
        borderRadius: 3,
        flexDirection: 'row',
        paddingHorizontal: 10,

    }
})