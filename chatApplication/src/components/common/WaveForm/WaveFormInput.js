import React, { useRef } from 'react';
import {
    Text,
    View,
    Animated,
    TouchableOpacity,
} from 'react-native';
// import { StyleSheet, Dimensions, Animated, } from 'react-native';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();
const WaveformInput = props => {
    const playIcon = useRef(false);
    const waveformobj = {
        width: props.waveform.width, // overall duration to width
        height: props.waveform.height, // overall average to height
        samples: props.waveform.samples, // samples
        color: props.color, // colors on different chat
    };
    //    AnimatedValuesArray
    let animateValues = [];
    let animations = [];

    waveformobj.samples.forEach((_, i) => {
        animateValues[i] = new Animated.Value(0.3);
    });

    async function animate(toValue) {
        console.log(toValue);
        animations = await waveformobj.samples.map((_, i) => {
            return Animated.timing(animateValues[i], {
                toValue,
                duration: 1000,
                useNativeDriver: true,
            });
        });
        Animated.stagger(100, animations).start(() => {
            if (props.playing) {
                // animations.reset()
                console.log('Fineshed===>');
            }
        });
    }

    const audioPlay = async uri => {
        playIcon.current.value = true;
        playIcon.current.focus();
        // console.log("msg==>", msg)
        audioRecorderPlayer.addPlayBackListener(async e => {
            // eslint-disable-next-line no-undef
            setduration(e.duration);
        });
    };

    async function audioPause(uri) {
        // eslint-disable-next-line no-undef
        setaudioPlayed(false);
        await audioRecorderPlayer.pausePlayer();
    }

    // onPressHandeling
    // useImperativeHandle(
    //     props.playing,
    //     () => ({
    //         Progress() {
    //             animate(1)
    //         }
    //     }),
    // )

    console.log(playIcon);
    return (
        <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
                alignContent: 'center',
                width: '100%',
                height: 20,
                marginTop: '5%',
                flexDirection: 'row',
                // eslint-disable-next-line prettier/prettier
                borderRadius: 15,
            }}>
            <TouchableOpacity
                ref={playIcon}
                onPress={() => {
                    audioPlay();
                    animate(1);
                }}>
                <Text>Hello</Text>
            </TouchableOpacity>
            {waveformobj.samples.map((p, i) => (
                <Animated.View
                    key={`${p}-${i}`}
                    style={[
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                            alignSelf: 'center',
                            width: 2,
                            borderRadius: 5,
                            height: `${p.amplitude * 2}%`,
                            margin: 1,
                            backgroundColor: props.isLeftSide ? '#FFFF' : '#52624B',
                            opacity: animateValues[i],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

export default WaveformInput;
