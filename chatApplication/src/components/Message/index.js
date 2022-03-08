import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, ScrollView, Animated, TouchableOpacity } from 'react-native'

import { styles, flattenedStyles } from './style';
// import Sound Component
import Sound from 'react-native-sound';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// Audio WaveForm
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Waveform from '../common/WaveForm/WaveForm';
import waveform from '../common/WaveForm/waveform.json'
import WaveformInput from '../common/WaveForm/WaveFormInput';



const audioRecorderPlayer = new AudioRecorderPlayer();

export default function Message({ message, side, imageUri, audiouri, post }) {

    const [audioPlayed, setaudioPlayed] = useState(false);
    const [currentduration, setduration] = useState(0)
    const childRef = useRef(null);
    const isLeftSide = side === 'left';


    const containerStyles = isLeftSide ? styles.container : flattenedStyles.container
    const textContainerStyles = !isLeftSide ? styles.textContainer : flattenedStyles.textContainer;
    const imageTextcontainer = isLeftSide ? styles.imageTextcontainer : styles.imageTextRightcontainer
    const textStyles = !isLeftSide ? flattenedStyles.rightText : flattenedStyles.leftText;
    const imageContainer = !isLeftSide ? styles.imageContainer : styles.imageRightContainer


    // Audio Playing Functionality

    useEffect(() => {
        let waveformUrl = 'https://w1.sndcdn.com/PP3Eb34ToNki_m.png'

        fetch(waveformUrl.replace('png', 'json'))
            .then(res => res.json())
            .then(json => {
                // console.log("json==>", json)
            });

    }, [])




    const audioPlay = async (uri) => {


        const msg = await audioRecorderPlayer.startPlayer(uri)

        console.log(msg)
        audioRecorderPlayer.addPlayBackListener(async (e,) => {
            let percent = e.currentPosition / e.duration * 100
            setduration(e.duration)
        })
        childRef.current.Progress()
    };

    const audioPause = async (uri) => {
        setaudioPlayed(false);
        await audioRecorderPlayer.pausePlayer();
    }

    return (
        <View style={containerStyles}>
            {
                message?.length > 0 && imageUri?.length > 0 && post ?
                    <View style={imageTextcontainer} >
                        <View style={{ width: '100%', borderBottomColor: 'black', borderBottomWidth: 1 }}>
                            <Text style={[textStyles, { margin: '2%', fontWeight: 'bold' }]}>Kevin</Text>
                            <Text style={[textStyles, { margin: '2%' }]}>{message}!</Text>
                        </View>
                        <View style={{ padding: '5%' }}>
                            <Image
                                style={{ width: 150, height: 150, alignSelf: 'center', }}
                                source={{
                                    uri: imageUri,
                                }}
                            />
                        </View>

                    </View> :
                    message?.length > 0 ?
                        <View style={textContainerStyles}>
                            <Text style={textStyles}>
                                {message}
                            </Text>
                        </View> : imageUri ? <View style={imageContainer} >
                            <Image
                                style={{ width: 100, height: 100 }}
                                source={{
                                    uri: imageUri,
                                }}
                            />
                            <Text style={textStyles}>Someone Liked !!</Text>
                        </View> : audiouri ?
                            <View style={[textContainerStyles, { alignItems: 'flex-start', justifyContent: 'space-around', flexDirection: 'row', width: '50%' }]}>
                                <View style={{ flex: 1, }} >
                                    <View style={{ flexDirection: 'row', }}>
                                        {
                                            audioPlayed ?

                                                <Icon name="pause-circle-o" size={20} color={!isLeftSide ? '#FFFF' : "#52624B"} style={{ alignSelf: 'flex-end' }} onPress={() => audioPause(audiouri)} />
                                                :
                                                <TouchableOpacity onPress={() => audioPlay(audiouri)} >
                                                    {
                                                        !isLeftSide ?
                                                            <Image style={{ width: 30, height: 30, margin: '1%' }} source={require('../../../assets/images/Play1.png')} />
                                                            :
                                                            <Image style={{ width: 30, height: 30, margin: '1%' }} source={require('../../../assets/images/Play.png')} />
                                                    }
                                                </TouchableOpacity>
                                        }

                                    </View>
                                </View>

                                <View style={{ flex: 3, height: '100%' }} >
                                    <WaveformInput isLeftSide={!isLeftSide} currentdurationPlaying={currentduration} playing={childRef}  {...{ waveform }} />
                                </View>


                            </View> :
                            null
            }
        </View>
    )
}