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
    let animateValues = [];
    let animations = [];


    waveformobj.samples.forEach((_, i) => {
        animateValues[i] = new Animated.Value(0.3)
    });

    async function animate(toValue) {
        console.log(toValue);
        animations = await waveformobj.samples.map((_, i) => {
            return Animated.timing(animateValues[i], {
                toValue,
                duration: 1000,
                useNativeDriver: true
            })
        })
        Animated.stagger(100, animations).start(() => {
            if (props.playing) {
                // animations.reset()
                console.log("Fineshed===>")
            }
        });
    }



    // onPressHandeling
    useImperativeHandle(
        props.playing,
        () => ({
            Progress() {
                animate(1)
            }
        }),
    )



    return (
        <ScrollView
            contentContainerStyle={{
                alignContent: 'center',
                width: '100%',
                height: 20,
                marginTop: '5%',
                flexDirection: 'row',
                borderRadius: 15,
            }}
        >

            {
                waveformobj.samples.map((p, i) => (

                    <Animated.View
                        key={`${p}-${i}`}
                        style={[{
                            alignSelf: 'center',
                            width: 2,
                            borderRadius: 5,
                            height: `${p.amplitude * 2}%`,
                            margin: 1,
                            backgroundColor: props.isLeftSide ? '#FFFF' : "#52624B",
                            opacity: animateValues[i]
                        }]} />

                ))
            }
        </ScrollView>
    );
}

export default WaveformInput;

