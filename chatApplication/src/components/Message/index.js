import React, { useState } from 'react'
import { View, Text, Image } from 'react-native'

import { styles, flattenedStyles } from './style';
// import Sound Component
import Sound from 'react-native-sound';
import Button from '../common/Button';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export default function Message({ message, side, imageUri, audiouri }) {

    const [audioPlayed, setaudioPlayed] = useState(true)

    const isLeftSide = side === 'left'

    const containerStyles = isLeftSide ? styles.container : flattenedStyles.container
    const textContainerStyles = isLeftSide ? styles.textContainer : flattenedStyles.textContainer;

    const textStyles = isLeftSide ? flattenedStyles.leftText : flattenedStyles.rightText;
    const imageContainer = isLeftSide ? styles.imageContainer : styles.imageRightContainer

    const audioPlay = (uri) => {
        const sound = new Sound(uri, null, (error) => {
            if (error) {
                // do something
                console.log(error)
            }
            // play when loaded
            setaudioPlayed(true)
            console.log('executed')
            sound.play(() => {
                sound.release();
            })
        });
    };

    const audioPause = (uri) => {
        setaudioPlayed(false);
        const sound = new Sound(uri, null, (error) => {
            if (error) {
                console.log(error)
            }
            return

        })
        sound.pause()
    }
    console.log(message.length)
    return (
        <View style={containerStyles}>
            {
                message.length > 0 ?
                    <View style={textContainerStyles}>

                        <Text style={textStyles}>
                            {message}
                        </Text>
                    </View> : null
            }
            {imageUri ?
                <View >
                    <Image
                        style={imageContainer}
                        source={{
                            uri: imageUri,
                        }}
                    />
                </View> : null
            }
            {
                audiouri ?
                    <View style={textContainerStyles}>
                        {
                            audioPlayed ?
                                <Icon name="play-circle-o" size={20} color={isLeftSide ? '#FFFF' : "#52624B"} style={{ marginRight: '2%', alignSelf: 'flex-end' }} onPress={() => audioPlay(audiouri)} /> :
                                <Icon name="pause-circle-o" size={20} color={isLeftSide ? '#FFFF' : "#52624B"} style={{ marginRight: '2%', alignSelf: 'flex-end' }} onPress={() => audioPause(audiouri)} />
                        }
                    </View>
                    :
                    null
            }
        </View>
    )
}