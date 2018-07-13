import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import mainStyles from '../styles.js'
import Register from './Register'
import Home from './Home'


export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  login () {
    if (this.state.username && this.state.password) {
      // TODO: fetch
      console.log('loggedin,', this.state.username, this.state.password);
      this.props.navigation.navigate('Home');
    } else {
      this.setState({message: 'Server error. Retry'})
    }

  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    // TODO: issue displaying input
    return (
      <View style={mainStyles.container}>
        <Text style={mainStyles.textAlert}>{this.state.message}</Text>
        <Text style={mainStyles.textBig}>Welcome to Tag!</Text>
        <TextInput
          style={mainStyles.textInput}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={mainStyles.textInput}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => this.login() } style={[mainStyles.button, mainStyles.black]}>
          <Text style={mainStyles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this.register() } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}



const styles = StyleSheet.create({

});
