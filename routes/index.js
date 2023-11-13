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


const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="CreateUser" component={CreateUser}/>
        <Stack.Screen name="CreateClient" component={CreateClient}/>
        <Stack.Screen name="Client_User" component={Client_User}/>
        <Stack.Screen name="ClientCompte" component={ClientCompte}/>
        <Stack.Screen name="UserCompte" component={UserCompte}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="DetailMessages" component={ListMessages}/>
        <Stack.Screen name="Details" component={Details}  options={{ headerShown: true }} />
        <Stack.Screen name="ConfirmationClient" component={ConfirmationClient} />
        <Stack.Screen name="ConfirmationUser" component={ConfirmationUser} />
        <Stack.Screen name="UserParDomaine" component={UserParDomaine}  options={{ headerShown: true }}  />
        <Stack.Screen name="Home" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;
