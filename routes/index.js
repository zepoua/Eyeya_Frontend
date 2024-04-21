import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';
import Start from '../screens/Start';
import CreateAccount from '../screens/CreateAccount';
import CreateUser from '../screens/CreateUser';
import CreateClient from '../screens/CreateClient';
import Login from '../screens/Login';
import Details from '../screens/Details';
import ConfirmationClient from '../screens/ConfirmationClient';
import ConfirmationUser from '../screens/ConfirmationUser';
import UserParDomaine from '../screens/UserParDomaine';
import Client_User from '../screens/Client_User';
import ClientCompte from '../screens/ClientCompte';
import UserCompte from '../screens/UserCompte';
import ListMessages from '../screens/ListMessages';
import LoginType from '../screens/LoginType';
import LoginClient from '../screens/LoginClient';
import LoginCode from '../screens/LoginCode';
import { StatusBar } from 'react-native';
import ImageUploadScreen from '../screens/image';


const Stack = createNativeStackNavigator();

const Index = () => {
  StatusBar.setBackgroundColor('#3792CE'); 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start' screenOptions={{headerShown: false, gestureEnabled:true, gestureDirection:'horizontal'}}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Image" component={ImageUploadScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="CreateUser" component={CreateUser}/>
        <Stack.Screen name="CreateClient" component={CreateClient}/>
        <Stack.Screen name="Client_User" component={Client_User}/>
        <Stack.Screen name="ClientCompte" component={ClientCompte}/>
        <Stack.Screen name="UserCompte" component={UserCompte}/>
        <Stack.Screen name="LoginType" component={LoginType}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="LoginClient" component={LoginClient}/>
        <Stack.Screen name="LoginCode" component={LoginCode}/>
        <Stack.Screen name="DetailMessages" component={ListMessages}/>
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="ConfirmationClient" component={ConfirmationClient} />
        <Stack.Screen name="ConfirmationUser" component={ConfirmationUser} />
        <Stack.Screen name="UserParDomaine" component={UserParDomaine} 
          options={{  headerShown: true, 
                      headerTitle: 'Professionels',
                      headerStyle:{
                                    backgroundColor: '#3792CE',
                                  },
                      headerTitleStyle:{
                                        color: 'white',
                                      },
                      headerTintColor:'white'
                    }}/>
        <Stack.Screen name="Details" component={Details}   
          options={{  headerShown: true, 
                      headerStyle:{
                                    backgroundColor: '#3792CE',
                                  },
                      headerTitleStyle:{
                                        color: 'white',
                                      },
                      headerTintColor:'white'
                    }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;
