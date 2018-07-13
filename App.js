import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import mainStyles from './styles.js'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'

 


//Navigator
export default StackNavigator({
  Login: {
    screen: Login,
  },
  Register: {
    screen: Register,
  },
  Home: {
    screen: Home,
  }
}, {initialRouteName: 'Login'});
