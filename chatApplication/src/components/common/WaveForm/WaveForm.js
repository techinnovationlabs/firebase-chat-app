import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Rect, } from 'react-native-svg';

const Waveform = (props) => {

    const waveformobj = {
        width: props.waveform.width,
        height: props.waveform.height,
        samples: props.waveform.samples,
        color: props.color
    }

    return (
        <View style={{ height: 50, width: '10%', display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
            {
                waveformobj.samples.map((p, i) => (
                    <View key={`${p}-${i}`} style={{
                        width: 2,
                        height: `${p}%`,
                        margin: 2,
                        backgroundColor: '#52624B'
                    }} />
                    // <View style={{ height: `${p}%`, backgroundColor: 'blue', width: 10 }} key={`${p}-${i}`} />
                ))
            }

        </View>
    );
}

export default Waveform;