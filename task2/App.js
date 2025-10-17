
import React from 'react';
import {UserProvider} from './context/UserContext';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {FavoritesProvider} from './context/FavoritesContext';

import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack=createStackNavigator();
const Tab=createBottomTabNavigator();

function HomeTabs(){
  return (
    <Tab.Navigator
        screenOptions={({route}) => ({
        tabBarIcon:({focused,color,size}) => {
          let iconName;

          if (route.name==='Home') {
            iconName = focused ?'home':'home-outline';
          } 
          else if (route.name==='Profile') {
            iconName = focused ?'person':'person-outline';
          } 
          else if (route.name==='EditProfile') {
            iconName = focused ?'pencil':'pencil-outline';
          }
          else if (route.name==='Favorites') {
            iconName = focused ?'heart':'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color}/>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Favorites" component={FavoritesScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
      <Tab.Screen name="EditProfile" component={EditProfileScreen}/>
    </Tab.Navigator>
  );
}

export default function App(){
  return(
    <UserProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Signup">
            <Stack.Screen name="Signup" component={SignupScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{headerShown:false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </UserProvider>
  );
}