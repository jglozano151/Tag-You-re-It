import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import mainStyles from '../styles.js'


export default class InviteFriend extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      phone: '',
      message: ''
    }
  }


  static navigationOptions = {
    title: 'Add Friend'
  };

  add () {
    if (this.state.username && this.state.phone) {
      // TODO: fetch call - check if user exists
      Alert.alert(
        'Success',
        'Request Sent!',
        [{text: 'Dismiss'}] // Button
      )
      this.props.navigation.navigate('Friends');
    } else {
      this.setState({message: 'Server error. Retry'})
    }
  }

  render() {
    return (
      <View style={mainStyles.container}>
        <Text style={mainStyles.textAlert}>{this.state.message}</Text>
        <Text style={mainStyles.textBig}>Add Friend</Text>
        <TextInput
          style={mainStyles.textInput}
          placeholder="Enter friend username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={mainStyles.textInput}
          secureTextEntry={true}
          placeholder="Enter friend phone"
          onChangeText={(text) => this.setState({phone: text})}
        />
        <TouchableOpacity onPress={ () => this.add() } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Send Request</Text>
        </TouchableOpacity>
      </View>
    )
  }
}



const styles = StyleSheet.create({

});
