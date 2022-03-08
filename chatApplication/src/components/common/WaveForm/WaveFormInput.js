import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, View, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
// import { StyleSheet, Dimensions, Animated, } from 'react-native';
import Svg, { Rect, } from 'react-native-svg';
import Message from '../../Message';

const WaveformInput = (props) => {

    const waveformobj = {
        width: props.waveform.width, // overall duration to width
        height: props.waveform.height, // overall average to height
        samples: props.waveform.samples, // samples
        color: props.color // colors on different chat
    };
    //    AnimatedValuesArray
    var animateValues = [];


    waveformobj.samples.forEach((_, i) => {
        animateValues[i] = new Animated.Value(0.3)
    });




    // onPressHandeling
    useImperativeHandle(
        props.playing,
        () => ({
            Progress(toValue = 1) {
                console.log(toValue);
                const animations = waveformobj.samples.map((_, i) => {
                    console.log(i)
                    return Animated.timing(animateValues[i], {
                        toValue,
                        duration: 500,
                        useNativeDriver: true
                    })
                })
                Animated.stagger(100, animations).start(() => {
                    if (props.playing) {
                        console.log("Fineshed===>")
                    }
                });
            }
        }),
    )




    return (
        <View style={{ width: 100, }}>
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
                                margin: 1,
                                backgroundColor: props.isLeftSide ? '#FFFF' : "#52624B",
                                opacity: animateValues[i]
                            }]} />

                    ))
                }
            </View>
        </View>
    );
}

export default WaveformInput;

