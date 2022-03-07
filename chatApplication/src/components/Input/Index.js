import React, { useCallback, useState, useRef, useContext, useEffect } from 'react'
import { View, TextInput, Text, Alert, PermissionsAndroid, TouchableOpacity, Image, Pressable } from 'react-native'
// State
import { UserContext } from '../../context';
// Services
import { firebaseService } from '../../services';
import storage from '@react-native-firebase/storage';

import styles from './styles';


// Audio Recording
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    PlayBackType,
    RecordBackType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import PushNotification, { Importance } from 'react-native-push-notification';
import Waveform from '../common/WaveForm/WaveForm';
import waveform from '../common/WaveForm/waveform.json'


const audioRecorderPlayer = new AudioRecorderPlayer();

export default function Input() {
    //   Icons
    const MicIcon = '../../../assets/images/Mic.png';
    const MessageIcon = '../../../assets/images/Send.png';
    const PlayIcon = '../../../assets/images/Play.png';


    audioRecorderPlayer.setSubscriptionDuration(0.1);

    const { uid } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(false)
    // TextState
    const [message, setMessage] = useState('');
    // ImageState
    const [imageSource, setImagesource] = useState('');
    // AudioState
    // Refs for the audio

    const [Iconstart, setIconstart] = useState(false)
    const [recording, setRecording] = useState(false);
    const [recordTime, setRecordtime] = useState(0);
    const [recordSecs, setrecordSecs] = useState(0)
    const [audiofile, setaudiofile] = useState('')
    // States for UI
    const [urlCreated, setUrlCreated] = useState(false);
    const [granted, setgranted] = useState(false)

    useEffect(() => {
        PushNotification.createChannel(
            {
                channelId: "channel-id", // (required)
                channelName: "My channel", // (required)
                channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                playSound: false, // (optional) default: true
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },

            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }, []);





    const handlePress = async () => {
        // todo this
        try {
            await firebaseService.createMessage({ message, uid, imageSource, audiofile }).then(function () {
                setMessage('')
                setImagesource('')
                setaudiofile('')
            })

        } catch (err) {
            console.log(err, "Error")
        }


    }


    // AudioFilter

    async function uploadAudioFile(path, name) {
        setIsLoading(true)
        if (path.length > 0) {

            try {
                let reference = storage().ref(name);
                let task = await reference.putFile(path, {
                    contentType: "audio/mpeg",
                });
                console.log("referenceUrl===>", reference.path)
                // geetingUrl
                let url = await storage().ref(reference.path).getDownloadURL();
                setIsLoading(false)
                console.log("url===>", url)
                setaudiofile(url)

            } catch (error) {
                console.log(error)
            }

        }
        console.log(path)
    }


    const checkMicrophone = async () => {
        try {
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);
            console.log(result)
            return result;

        } catch (error) {
            console.log(error)
        }

    };

    useEffect(() => {
        checkMicrophone().then(() => setgranted(true))
    }, [])

    const onStartRecord = async () => {
        setIconstart(true);
        if (Platform.OS === 'android' && granted) {
            try {
                const AudioSet = {
                    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                    AudioSourceAndroid: AudioSourceAndroidType.MIC,
                    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                    AVNumberOfChannelsKeyIOS: 2,
                    AVFormatIDKeyIOS: AVEncodingOption.aac,
                };

                const path = `${Platform.OS === "android" ? "/storage/emulated/0/Download" : RNFS.TemporaryDirectoryPath}/${12}.mp3`;

                const meteringEnabled = true;

                const uri = await audioRecorderPlayer.startRecorder(
                    path,
                    AudioSet,
                    meteringEnabled
                );
                console.log("GivenURI===>", uri)

                audioRecorderPlayer.addRecordBackListener((e) => {
                    // console.log("cureent==>", e)
                    let value = audioRecorderPlayer.mmss(
                        // console.log(e.currentPosition)
                        Math.floor(e.currentPosition)
                    )
                    // console.log("Time==>", value)
                    if (e.currentMetering === -160) {
                        e.currentMetering = 10;
                    }
                    let samples = e.currentMetering * -1
                    let obj = {
                        duration: e.currentPosition,
                        amplitude: samples
                    }
                    console.log(obj)
                    waveform.samples.push(obj)

                    setRecordtime(value)
                    return;

                })
                console.log('permissions granted', uri);

            } catch (err) {
                setIconstart(false)
                console.warn(err);
                return;
            }

        }
    };
    const audioPause = async (uri) => {
        // setaudioPlayed(false);
        await audioRecorderPlayer.pauseRecorder();
    }


    const onStopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setrecordSecs(0)
        setIconstart(!Iconstart)
        // waveform.samples.length = 0;
        uploadAudioFile(result, 'hello').then(() => {
            handlePress()
        })
        console.log("result===>", result);
    };

    const onCancelRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setrecordSecs(0);
        uploadAudioFile('', 'hello')
        waveform.samples.length = 0;
        setIconstart(!Iconstart);
        setaudiofile('');
        if (result) {
            console.log("result===>", result);
            return RNFS.unlink(result)
                .then(() => {
                    console.log('FILE DELETED');
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                    console.log(err.message);
                });
        }

    }





    return (
        <>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: '2%' }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: '3%', borderRadius: 10, borderColor: '#BBBBBB', borderWidth: 1 }} >
                    <Image style={{ width: 25, }} source={require('../../../assets/images/Experience.png')} />
                </View>
                <View style={{ flex: 6 }} >
                    <View style={styles.container}>
                        {
                            !Iconstart ?
                                <View style={{ borderWidth: 1, flexDirection: 'row', alignItems: 'center', width: '90%', borderRadius: 10, paddingHorizontal: '2%', borderColor: '#BBBBBB' }}>
                                    <TextInput
                                        style={[styles.input, { flex: 1 }]}
                                        value={message}
                                        onChangeText={setMessage}
                                        placeholder={"Message"} />
                                </View>
                                :
                                <View style={{ borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '90%', borderRadius: 10, borderColor: '#BBBBBB' }}>
                                    <View >
                                        <Pressable onPress={onCancelRecord}>
                                            <Image style={{ width: 30, height: 30, marginLeft: '5%' }} source={require('../../../assets/images/Close.png')} />
                                        </Pressable>
                                    </View>
                                    <View style={{ flex: 1, }}>
                                        <Waveform color="#52624B"  {...{ waveform }} />
                                    </View>
                                    <View>
                                        <Text>{recordTime}</Text>
                                    </View>
                                </View>
                        }
                    </View>
                </View>
                <View style={{ marginTop: '1%', width: 40, alignItems: 'center', justifyContent: 'center', }}>
                    {
                        message !== '' && !Iconstart ?
                            <View style={{ flex: 1, width: 40, alignSelf: 'center', marginBottom: '10%', borderRadius: 10, borderColor: '#BBBBBB', borderWidth: 1 }}>
                                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: '3%', }} onPress={handlePress}>
                                    <Image style={{ width: 30, height: 30, }} source={require(MessageIcon)} />
                                </TouchableOpacity>
                            </View> : !Iconstart ?
                                <View style={{ flex: 1, width: 40, alignSelf: 'center', marginBottom: '10%', borderRadius: 10, borderColor: '#BBBBBB', borderWidth: 1 }}>
                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: '3%', }} onPress={onStartRecord}>
                                        <Image style={{ width: 30, height: 30, }} source={require(MicIcon)} />
                                    </TouchableOpacity>
                                </View> :
                                <View style={{ flex: 1, alignSelf: 'center', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 70 }}>
                                    <View style={{ width: 40, height: 30, }} >
                                        <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#BBBBBB' }} >
                                            <TouchableOpacity onPress={onStopRecord}>
                                                <Image style={{ width: 30, height: 30, alignSelf: 'center', marginBottom: 5, marginTop: 3 }} source={require(MessageIcon)} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={audioPause}>
                                                <Image style={{ width: 30, height: 30, alignSelf: 'center', marginBottom: 5 }} source={require(PlayIcon)} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                    }
                </View>
            </View>
        </>
    )
}