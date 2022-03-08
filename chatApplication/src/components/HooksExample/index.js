import React, { useEffect, useReducer, useContext } from 'react'
import { FlatList, SafeAreaView, View, Text, Image } from 'react-native'
import { UserContext } from '../../context'
import { firebaseService } from '../../services'
import firestore from '@react-native-firebase/firestore';
import Input from '../Input/Index'
import Message from '../Message'
import { messagesReducer } from './reducer';

import Icon from 'react-native-vector-icons/dist/Feather';
import ProfileComponent from '../profiledetails';

import { LocalNotification } from '../common/pushController';


export default function HooksExample() {
    const { uid } = useContext(UserContext);
    const [messages, dispatchMessages] = useReducer(messagesReducer, [])




    useEffect(

        function () {
            return firebaseService.messageRef
                .orderBy('created_at', 'desc')
                .onSnapshot(function (snapshot) {
                    LocalNotification()
                    dispatchMessages({ type: 'add', payload: snapshot.docs })
                })
        },
        [false]
    )
    return (
        <SafeAreaView>
            <View style={{
                height: '100%',
                paddingBottom: 100
            }}>
                <ProfileComponent />
                <FlatList
                    inverted
                    data={messages}
                    keyExtractor={function (item) {
                        return item.id
                    }}
                    renderItem={function ({ item }) {
                        const data = item.data()
                        // console.log("item===>", data)
                        const side = data.user_id === uid ? 'right' : 'left'

                        return (
                            <>
                                <Message side={side} message={data.message} imageUri={data.imageSource} audiouri={data.audiofile} waveFile={data.waveFile} post={data.post} />
                            </>

                        )
                    }}
                />
            </View>

            <View style={{
                width: '100%',
                height: 100,
                position: 'absolute',
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingVertical: 10,
            }}>
                <Input />
            </View>
        </SafeAreaView>
    )
}


