import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import mainStyles from '../styles.js'

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
    title: 'Login',
    headerLeft: null
  };

  login () {
    if (this.state.username && this.state.password) {
      fetch('localhost:1337/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      })
      .then(resp => {
        if (resp.status === 200) {
          console.log('logged in! resp', resp);
          AsyncStorage.setItem('token', JSON.stringify({
            userId: resp.user.id
          }))
          this.props.navigation.navigate('Home');
        } else {
          console.log("error!:", resp);
          this.setState({message: 'Server error. Retry'})
        }
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log("error:", err);
      });
    } else {
      this.setState({message: 'Server error. Retry'})
    }

  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
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
