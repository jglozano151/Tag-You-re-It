import React from 'react';
import { StyleSheet } from 'react-native';



const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    alignSelf: 'stretch'
  },
  blue: {
    backgroundColor: '#4286f4'
  },
  black: {
    backgroundColor: '#000000'
  },
  lightGrey: {
    backgroundColor: '#b1bed8'
  },
  darkGrey: {
    backgroundColor: '#848a96'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  textBig: {
    fontFamily: 'Baskerville',
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  textMed: {
    fontFamily: 'Baskerville',
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  textAlert: {
    fontFamily: 'Baskerville',
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    color: 'orange'
  },
  textSmall: {
    fontFamily: 'Baskerville',
    fontSize: 12,
    textAlign: 'center',
    margin: 10,
  },
});

export default mainStyles
