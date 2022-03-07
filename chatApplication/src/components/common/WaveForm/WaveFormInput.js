import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, View, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
// import { StyleSheet, Dimensions, Animated, } from 'react-native';
import Svg, { Rect, } from 'react-native-svg';
import Message from '../../Message';

const WaveformInput = (props) => {

    const [progressStatus, setprogessStatus] = useState(0)
    const [animatedValue, setanimatedValue] = useState(new Animated.Value(0))

    const animation = () => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false
            }).start(() => {
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 3000
                })
            }),

        ])

    }
    const progress = () => {
        console.log("animate")
        animation()
    };
    useImperativeHandle(
        props.playing,
        () => ({
            showAlert() {
                progress()
            }
        }),
    )

    const waveformobj = {
        width: props.waveform.width, // overall duration to width
        height: props.waveform.height, // overall average to height
        samples: props.waveform.samples, // samples
        color: props.color // colors on different chat
    };

    const interPolateColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(90,210,244)", "rgb(224,82,99)"]
    })
    const animatedStyles = {
        backgroundColor: interPolateColor
    }

    return (
        <View style={{ width: '100%', }}>
            <View
                style={[{
                    height: 30,
                    flexDirection: 'row',
                    borderRadius: 15,
                },

                ]}
            >

                {
                    waveformobj.samples.map((p, i) => (

                        <Animated.View
                            key={`${p}-${i}`}
                            style={[{
                                alignSelf: 'center',
                                width: 3,
                                borderRadius: 10,
                                height: `${p.amplitude * 2}%`,
                                margin: 1
                            }, animatedStyles]} />

                    ))
                }
            </View>
        </View>
    );
}

export default WaveformInput;

