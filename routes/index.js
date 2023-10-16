import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';
import Start from '../screens/Start';
import CreateAccount from '../screens/CreateAccount';
import CreateUser from '../screens/CreateUser';
import CreateClient from '../screens/CreateClient';
import Login from '../screens/Login';
import Details from '../screens/Details';


const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="CreateUser" component={CreateUser}/>
        <Stack.Screen name="CreateClient" component={CreateClient}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Details" component={Details}  options={{ headerShown: true }} />
        <Stack.Screen name="Home" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;
