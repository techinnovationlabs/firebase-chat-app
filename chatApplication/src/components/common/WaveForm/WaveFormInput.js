import React from 'react';
import { Text, View, ScrollView } from 'react-native';
// import { StyleSheet, Dimensions, Animated,  } from 'react-native';
import Svg, { Rect, } from 'react-native-svg';

const WaveformInput = (props) => {

    const waveformobj = {
        width: props.waveform.width, // overall duration to width
        height: props.waveform.height, // overall average to height
        samples: props.waveform.samples, // samples 
        color: props.color // colors on different chat
    }

    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ height: 50, display: 'flex', alignItems: 'center', flexDirection: 'row', paddingBottom: 20 }}
        >
            {
                waveformobj.samples.map((p, i) => (
                    <View key={`${p}-${i}`} style={{
                        alignSelf: 'center',
                        width: 3,
                        borderRadius: 10,
                        height: `${p}%`,
                        margin: 1,
                        backgroundColor: '#52624B'
                    }} />
                ))
            }
        </ScrollView>
    );
}

export default WaveformInput;