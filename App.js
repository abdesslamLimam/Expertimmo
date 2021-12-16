
import 'react-native-gesture-handler';

import OneSignal from 'react-native-onesignal';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  LogBox,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppContextProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/store/store';
import FlashMessage from "react-native-flash-message";
import { api } from './src/constants/api_config';
//import BackgroundTask from 'react-native-background-task'
import AlertComponent from './src/components/AlertComponent';

LogBox.ignoreAllLogs()

const App = () => {

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <FlashMessage position="top" /> */}
        <Provider store={store}>
          <AppContextProvider>
            <AppNavigator />
          </AppContextProvider>
        </Provider>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
