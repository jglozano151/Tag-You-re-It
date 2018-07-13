import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import mainStyles from '../styles.js'
import Login from './Login'


export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      phone: '',
      message: ''
    }
  }


  static navigationOptions = {
    title: 'Register'
  };

  register () {
    if (this.state.username && this.state.password) {
      // TODO: fetch call
      console.log("registered:", this.state.username, this.state.password, this.state.phone)
      Alert.alert(
        'Success',
        'Successfully Register! Redirecting to Login',
        [{text: 'Dismiss'}] // Button
      )
      this.props.navigation.navigate('Login');
    } else {
      this.setState({message: 'Server error. Retry'})
    }
  }

  render() {
    return (
      <View style={mainStyles.container}>
        <Text style={mainStyles.textAlert}>{this.state.message}</Text>
        <Text style={mainStyles.textBig}>Register</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Enter your phone"
          onChangeText={(text) => this.setState({phone: text})}
        />
        <TouchableOpacity onPress={ () => this.register() } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}



const styles = StyleSheet.create({

});
