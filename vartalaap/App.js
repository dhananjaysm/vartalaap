import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native' ;
import {createStackNavigator} from '@react-navigation/stack' ;
import {LOGIN_SCREEN,FRIEND_SCREEN,CHAT_SCREEN,FIND_FRIENDS,REQUEST_SCREEN} from './components/routeNames';
import {LoginScreen,FriendScreen,ChatScreen,FindFriends,RequestScreen} from './screens/index'


const Stack = createStackNavigator();

export default function App (){

  return (
   <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: true }}  initialRouteName={LOGIN_SCREEN} >
        <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} options={{ title: 'Vartalaap' }} />
         <Stack.Screen name={FRIEND_SCREEN} component={FriendScreen} options={{ title: 'Friends' }}/>
       <Stack.Screen name={CHAT_SCREEN} component={ChatScreen} options={{ title: '' }}/>
              
              <Stack.Screen name={FIND_FRIENDS} component={FindFriends} options={{ title: 'Find Friends' }}/>
            <Stack.Screen name={REQUEST_SCREEN} component={RequestScreen} options={{ title: 'Requests' }}/>




       
    </Stack.Navigator>
</NavigationContainer>
  );
}

