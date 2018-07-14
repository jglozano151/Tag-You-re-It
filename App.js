import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import mainStyles from './styles.js'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Pending from './components/Pending'
import InviteFriend from './components/InviteFriend'
import Friends from './components/Friends'
import Games from './components/Games'
import AboutGame from './components/NewGame/AboutGame'
import InvitePlayers from './components/NewGame/InvitePlayers'
import CurrentGame from './components/CurrentGame'

global.NGROK='https://18028512.ngrok.io';

//Navigator
export default createStackNavigator({
  Login: {
    screen: Login,
  },
  Register: {
    screen: Register,
  },
  Home: {
    screen: Home,
  },
  Pending: {
    screen: Pending,
  },
  InviteFriend: {
    screen: InviteFriend,
  },
  Friends: {
    screen: Friends,
  },
  Games: {
    screen: Games,
  },
  AboutGame: {
    screen: AboutGame,
  },
  InvitePlayers: {
    screen: InvitePlayers,
  },
  CurrentGame: {
    screen: CurrentGame,
  }
}, {initialRouteName: 'Home'});
