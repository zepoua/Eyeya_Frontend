/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import CreateUser from './screens/CreateUser';
import Index from './routes';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={{flex:1}}>
     <Index/>
    </View>

  );
}

const styles = StyleSheet.create({
  Container: {
    margin: 0
  },
  libelle: {
    fontSize: 20,
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    color:'black',
  },
  titre: {
    fontSize: 40,
    fontFamily: 'algerian',
    fontWeight: 'bold',
    color:'darkblue',
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 15,
  },
  input:{
    borderWidth: 1,
    height: 35,
    width : 350,
    borderRadius: 6,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 20,
  },
  valider:{
    width: 40,
  },
  annuler:{
    width: 40,
  }
});

export default App;
