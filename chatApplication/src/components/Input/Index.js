import React, { useCallback, useState, useRef, useContext, useEffect } from 'react'
import { View, TextInput, Text, Alert, PermissionsAndroid, TouchableOpacity } from 'react-native'
// State
import { UserContext } from '../../context';
// Services
import { firebaseService } from '../../services';
import storage from '@react-native-firebase/storage';
// Button and Input Component
import Button from '../common/Button';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
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
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
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


    const handlePress = () => {
        // todo this
        setIsLoading(true)
        firebaseService.createMessage({ message, uid, imageSource, audiofile }).then(function () {
            setIsLoading(false)
            setMessage('')
            setImagesource('')
        })
    }


    // AudioFilter

    async function uploadAudioFile(path, name) {
        console.log("value===>", path)
        path.replace('file://', '')
        console.log("uploadAudio===>", path)
        let reference = storage().ref(name);

        let task = await reference.putFile(path, {
            contentType: "audio/mpeg",
        });
        console.log("referenceUrl===>", reference.path)
        let url = await storage().ref(reference.path).getDownloadURL();
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
                    const meteringEnabled = false;
                    console.log("Patyh===>", path)
                    const uri = await audioRecorderPlayer.startRecorder(
                        path,
                        AudioSet,
                        meteringEnabled
                    );
                    audioRecorderPlayer.addRecordBackListener((e) => {
                        console.log(e)
                        setrecordSecs(e.currentPosition)
                        let value = audioRecorderPlayer.mmss(
                            Math.floor(e.currentPosition)
                        )
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
        uploadAudioFile(result, 'hello')
        console.log("result===>", result);
    };


    // ImageSending Package and Functionality

    async function uploadImageToStorage(path, name) {
        setIsLoading(true)
        let reference = storage().ref(name);
        let task = await reference.putFile(path);
        console.log("referenceUrl===>", reference.path)
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
        <>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="Write you message" />
                    <TouchableOpacity style={{ margin: 10 }} onPress={handlePress}>
                        <Text style={{ color: '#52624B', fontWeight: 'bold' }} >Send</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', marginRight: '2%' }}>


                    <Icon name="file-image-o" size={30} color="#52624B" onPress={() => { launchCamera() }} style={{ marginRight: '2%' }} />
                    {
                        !Iconstart ?
                            <TouchableOpacity onPress={onStartRecord}>
                                <Icon name="microphone" size={20} color="#52624B" style={{ marginRight: '2%' }} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={onStopRecord} >
                                <Icon name="microphone" size={40} color="#52624B" style={{ marginRight: '2%' }} />
                            </TouchableOpacity>


                    }
                </View>

                {isLoading ? <Text>isLoading</Text> : null}

            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {
                    Iconstart ?
                        <Text>{recordTime}</Text> : null
                }
            </View>
        </>
    )
}