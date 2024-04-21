import React from 'react'
import Home from '../screens/Home';
import Recherche from '../screens/Recherche';
import MonCompte from '../screens/MonCompte';
import Chats from '../screens/Chats';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'react-native';

const BottomTabs = () => {
    
    const Tab = createBottomTabNavigator();
    StatusBar.setBackgroundColor('#3792CE'); 
    return (
        <Tab.Navigator
          initialRouteName="Accueil"
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#ADAFB1',            
            tabBarActiveBackgroundColor:'#3792CE',
            tabBarInactiveBackgroundColor:'#3792CE',
            tabBarHideOnKeyboard:true,
            tabBarLabelStyle: {
              "fontWeight": "bold"
            },
          }}
        >
          <Tab.Screen
            name="Accueil"
            component={Home}
            options={{
              tabBarLabel: 'Accueil',
              headerShown:false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
              headerStyle: {
                backgroundColor: '#3792CE', // Couleur de l'en-tête
              },
              headerTitleStyle: {
                color: 'white', // Couleur du texte du titre de l'en-tête
              },
            }}
          />
          <Tab.Screen
            name="Recherche"
            component={Recherche}
            options={{
              tabBarLabel: 'Recherche',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="clipboard-search-outline" color={color} size={size} />
              ),
              headerStyle: {
                backgroundColor: '#3792CE', // Couleur de l'en-tête
              },
              headerTitleStyle: {
                color: 'white', // Couleur du texte du titre de l'en-tête
              },
            }}
          />
          <Tab.Screen
            name="Discussions"
            component={Chats}
            options={{
              tabBarLabel: 'Discussions',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chat" color={color} size={size} />
              ),
              headerStyle: {
                backgroundColor: '#3792CE', // Couleur de l'en-tête
              },
              headerTitleStyle: {
                color: 'white', // Couleur du texte du titre de l'en-tête
              },
            }}
          />
          <Tab.Screen
            name="Profil"
            component={MonCompte}
            options={{
              tabBarLabel: 'Profil',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              ),
              headerStyle: {
                backgroundColor: '#3792CE', // Couleur de l'en-tête
              },
              headerTitleStyle: {
                color: 'white', // Couleur du texte du titre de l'en-tête
              },
            }}
          />
        </Tab.Navigator>
      );
}

export default BottomTabs

