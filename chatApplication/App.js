/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useCallback, useState, useEffect } from 'react'

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
  useColorScheme,
  View,
  TouchableOpacity,

} from 'react-native';
import auth from '@react-native-firebase/auth';
import HooksExample from './src/components/HooksExample';
import { UserContext } from './src/context';
import { firebaseService } from './src/services';
import Button from './src/components/common/Button';

const App = () => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);



  const onPressUser = async (username, password) => {
    firebaseService.signIn(username, password)
      .then(({ user, error }) => {
        if (error) {
          Alert.alert('Something went wrong')
          return
        }
        setUser(user)
      })
  }

  if (!user) {
    console.log("useruuid===>", user)
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity style={{ width: 50, height: 50, margin: 10, backgroundColor: '#52624B', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => onPressUser('srivastan@asahitechnologies.com', 'Geetha18')}>
            <Text style={{ color: '#FFF' }}>User1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 50, height: 50, margin: 10, borderRadius: 10, backgroundColor: '#52624B', justifyContent: 'center', alignItems: 'center' }} onPress={() => onPressUser('vastanece1999@gmail.com', 'Geetha18')}>
            <Text style={{ color: '#FFF' }}>User2</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <UserContext.Provider value={user}>
        <HooksExample />
      </UserContext.Provider>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
