import React from 'react';
import { Text, View, ScrollView } from 'react-native';
// import { StyleSheet, Dimensions, Animated,  } from 'react-native';
import Svg, { Rect, } from 'react-native-svg';

const WaveformInput = (props) => {

    const waveformobj = {
        width: props.waveform.width,
        height: props.waveform.height,
        samples: props.waveform.samples,
        color: props.color
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
                    // <View style={{ height: `${p}%`, backgroundColor: 'blue', width: 10 }} key={`${p}-${i}`} />
                ))
            }

        </ScrollView>
    );
}

export default WaveformInput;