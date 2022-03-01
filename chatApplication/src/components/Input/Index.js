import React, { useCallback, useState, useRef, useContext, useEffect } from 'react'
import { View, TextInput, Text, Alert, PermissionsAndroid, TouchableOpacity } from 'react-native'
// State
import { UserContext } from '../../context';
// Services
import { firebaseService } from '../../services';
import storage from '@react-native-firebase/storage';
// Button and Input Component
import Button from '../common/Button';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import CancelIcon from 'react-native-vector-icons/dist/MaterialIcons';
import styles from './styles';
// Image Library
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

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
    const [urlCreated, setUrlCreated] = useState(false)

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
    }, [])

    const handlePress = async () => {


        // todo this
        await firebaseService.createMessage({ message, uid, imageSource, audiofile }).then(function () {
            setMessage('')
            setImagesource('')
            setaudiofile('')
        })

    }


    // AudioFilter

    async function uploadAudioFile(path, name) {
        setIsLoading(true)

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
    }


    const onStartRecord = async () => {
        setIconstart(true);
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

                console.log('write external stroage', grants);

                if (

                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    const AudioSet = {
                        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                        AudioSourceAndroid: AudioSourceAndroidType.MIC,
                        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                        AVNumberOfChannelsKeyIOS: 2,
                        AVFormatIDKeyIOS: AVEncodingOption.aac,
                    };
                    console.log(AudioSet)
                    const path = `${Platform.OS === "android" ? "/storage/emulated/0/Download" : RNFS.TemporaryDirectoryPath}/${((Math.random() * 1000) | 0)}.mp3`;
                    console.log("imagePath===>", path)
                    const meteringEnabled = true;
                    console.log("Patyh===>", path)
                    const uri = await audioRecorderPlayer.startRecorder(
                        path,
                        AudioSet,
                        meteringEnabled
                    );
                    audioRecorderPlayer.addRecordBackListener((e) => {
                        // console.log("cureent==>", e)
                        let value = audioRecorderPlayer.mmss(
                            // console.log(e.currentPosition)
                            Math.floor(e.currentPosition)
                        )
                        // console.log("Time==>", value)
                        if (e.currentMetering === -160) {
                            e.currentMetering = 0;
                        }
                        let samples = e.currentMetering * -1
                        waveform.samples.push(samples)
                        setRecordtime(value)
                        return;

                    })
                    console.log('permissions granted', uri);
                } else {
                    console.log('All required permissions not granted');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }

        }
    };

    const onStopRecord = async () => {

        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setrecordSecs(0)
        setIconstart(!Iconstart)
        // waveform.samples.length = 0;
        uploadAudioFile(result, 'hello')
        console.log("result===>", result);
    };
    const onCancelRecord = async () => {
        audioRecorderPlayer.removeRecordBackListener();
        setrecordSecs(0)
        waveform.samples.length = 0;
        setIconstart(!Iconstart);
        setaudiofile('')
    }


    // ImageSending Package and Functionality

    async function uploadImageToStorage(path, name) {
        setIsLoading(true)
        let reference = storage().ref(name);
        let task = await reference.putFile(path);
        console.log("referenceUrl===>", reference.path)
        // geetingUrl
        let url = await storage().ref(reference.path).getDownloadURL();
        console.log("url===>", url)
        setImagesource(url)
        setIsLoading(false)
    }



    function getFileName(response) {
        let path = response.assets.map((item) => item.uri)
        if (Platform.OS === "ios") {
            path = "~" + path[0].substring(path[0].indexOf("/Documents"));
        }
        return path[0].split("/").pop();
    };
    function getPlatformPath(response) {
        console.log("getplatfor===>", response)
        let path = response.assets.map((item) => item.uri)
        return Platform.select({
            android: { "value": path[0] },
            ios: { "value": path[0] }
        })
    }


    //  Image Picker
    const launchCamera = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker', storage());
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let path = getPlatformPath(response).value;
                let fileName = getFileName(response);
                setImagesource(fileName)
                uploadImageToStorage(path, fileName);
            }
        });

    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1, alignItems: 'center' }} >
                <Text>Icon</Text>
            </View>
            <View style={{ flex: 6 }} >
                <View style={styles.container}>
                    {
                        !Iconstart ?
                            <View style={{ borderWidth: 1, flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder={"Message"} />
                                <TouchableOpacity style={{ margin: 10 }} onPress={handlePress}>
                                    <Text style={{ color: '#52624B', fontWeight: 'bold' }} >Send</Text>
                                </TouchableOpacity>

                            </View>
                            :
                            <View style={{ borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
                                <View >
                                    <TouchableOpacity onPress={onCancelRecord}>
                                        <CancelIcon name="cancel" size={35} color="#52624B" />
                                    </TouchableOpacity>
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
            <View style={{ marginTop: '1%' }}>
                {
                    !Iconstart ?
                        <View style={{ flex: 1, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={onStartRecord}>
                                <Icon name="mic-circle" size={35} color="#52624B" style={{ marginRight: '2%' }} />
                            </TouchableOpacity>
                        </View> :
                        <View style={{ flex: 1, }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={onStopRecord} >
                                <Icon name="mic-circle" size={40} color="#52624B" style={{ marginRight: '2%' }} />
                            </TouchableOpacity>
                        </View>
                }

            </View>
        </View>
    )
}