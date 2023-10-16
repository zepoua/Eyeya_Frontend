import React from 'react'
import Home from '../screens/Home';
import Recherche from '../screens/Recherche';
import MonCompte from '../screens/MonCompte';
import Chats from '../screens/Chats';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const BottomTabs = () => {
    
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
          initialRouteName="Accueil"
          screenOptions={{
            tabBarActiveTintColor: '#150347',
          }}
        >
          <Tab.Screen
            name="Accueil"
            component={Home}
            options={{
              tabBarLabel: 'Accueil',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
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
            }}
          />
          <Tab.Screen
            name="Messages"
            component={Chats}
            options={{
              tabBarLabel: 'Messages',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chat" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={MonCompte}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      );
}

export default BottomTabs

