import React from 'react';
import { Text, View, ScrollView } from 'react-native';
// import { StyleSheet, Dimensions, Animated,  } from 'react-native';
import Svg, { Rect, } from 'react-native-svg';

const Waveform = (props) => {

    const waveformobj = {
        width: props.waveform.width,
        height: props.waveform.height,
        samples: props.waveform.samples,
        color: props.color
    }

    return (
        <ScrollView
            ref={(ref) => flatListRef = ref}
            horizontal={true}
            contentContainerStyle={{ height: 50, display: 'flex', alignItems: 'center', flexDirection: 'row' }}
            onContentSizeChange={(width, height) => flatListRef.scrollToEnd({ animated: false })}
        >
            {
                waveformobj.samples.map((p, i) => (
                    <View
                        key={`${p}-${i}`}
                        style={{
                            alignSelf: 'center',
                            width: 2,
                            borderRadius: 5,
                            height: `${p.amplitude}%`,
                            margin: 1,
                            backgroundColor: '#52624B'
                        }} />
                ))
            }

        </ScrollView>
    );
}

export default Waveform;