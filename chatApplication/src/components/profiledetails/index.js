import React, { useEffect, useReducer, useContext } from 'react'
import { FlatList, SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/dist/Feather';
import ThreeDotsIcon from 'react-native-vector-icons/dist/Entypo';


const ProfileComponent = () => {
    return (
        <View style={{ width: '100%', height: 50, flexDirection: 'row' }}>
            <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', flex: 0.6 }} >
                <Icon name="arrow-left" size={25} color='black' />
            </View>
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', flex: 2, flexDirection: 'row', justifyContent: 'space-around', }} >
                <Image
                    style={{ width: 40, height: 40 }}
                    source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                />
                <View style={{ justifyContent: 'center' }}>
                    <Text>Profile Name</Text>
                    <Text>24 | NewYork</Text>
                </View>
                <Text>Offline</Text>
            </View>

            <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', flex: 1 }} >
                <ThreeDotsIcon name="dots-three-horizontal" size={25} color='#F2EEE7' />
            </TouchableOpacity>
        </View>
    );
}

export default ProfileComponent;