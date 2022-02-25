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
export default function HooksExample() {
    const { uid } = useContext(UserContext);
    const [messages, dispatchMessages] = useReducer(messagesReducer, [])

    useEffect(
        function () {
            return firebaseService.messageRef
                .orderBy('created_at', 'desc')
                .onSnapshot(function (snapshot) {
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
                        console.log(data)
                        const side = data.user_id === uid ? 'right' : 'left'

                        return (
                            <>
                                <Message side={side} message={data.message} imageUri={data.imageSource} audiouri={data.audiofile} />
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
                paddingVertical: 10,
                paddingLeft: 20,

                borderTopWidth: 1,
                borderTopColor: 'grey'
            }}>
                <Input />
            </View>
        </SafeAreaView>
    )
}


