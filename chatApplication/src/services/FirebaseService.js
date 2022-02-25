import auth from '@react-native-firebase/auth';
import collection from '../constants/collection';
import firestore from '@react-native-firebase/firestore';


export default class FirebaseService {


    messageRef = firestore().collection(collection.MESSAGES)


    async signIn(email, password) {
        try {
            let response = await auth().signInWithEmailAndPassword(email, password)
            return { user: response.user }
        } catch (error) {
            return { error }
        }
    }

    async fetchMessages() {
        const messages = await this.messageRef
            .orderBy('created_at', 'desc')
            .limit(10)
            .get()

        return messages.docs
    }

    async createMessage({ message, uid, imageSource, audiofile }) {
        await this.messageRef.add({
            message,
            imageSource,
            audiofile,
            user_id: uid,
            created_at: new Date()
        })
    };


}
