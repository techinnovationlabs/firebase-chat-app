import { StyleSheet } from 'react-native'

import { COLORS } from '../../styles'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 3,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    textContainer: {
        width: 160,
        backgroundColor: '#52624B',
        borderRadius: 40,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginLeft: 10
    },
    rightContainer: {
        justifyContent: 'flex-end'
    },
    rightTextContainer: {
        backgroundColor: '#ddd',
        borderColor: '#231B22',
        marginRight: 10,
        borderRadius: 999
    },
    leftText: {
        textAlign: 'left',
        color: '#FFF'

    },
    rightText: {
        textAlign: 'right',
        color: '#231B22'
    },
    text: {
        fontSize: 15,
        fontFamily: "Cochin"
    },
    imageContainer: {
        width: 160,
        height: 150,
        backgroundColor: '#52624B',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginLeft: 10,
        alignItems: 'center'
    },
    imageRightContainer: {
        width: 160,
        height: 150,
        backgroundColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginLeft: 10,
        alignItems: 'center'
    }
})

const flattenedStyles = {
    container: StyleSheet.flatten([styles.container, styles.rightContainer]),
    textContainer: StyleSheet.flatten([styles.textContainer, styles.rightTextContainer]),
    leftText: StyleSheet.flatten([styles.leftText, styles.text]),
    rightText: StyleSheet.flatten([styles.rightText, styles.text]),
    imageContainer: StyleSheet.flatten([styles.imageContainer, styles.imageRightContainer])

}

export {
    styles,
    flattenedStyles
}