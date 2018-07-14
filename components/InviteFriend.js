import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import mainStyles from '../styles.js'


export default class InviteFriend extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      phone: '',
      message: '',
      userId: ''
    }
  }


  static navigationOptions = {
    title: 'Add Friend'
  };

  componentDidMount() {
    AsyncStorage.getItem('token').then((data) => {
      token = JSON.parse(data);
      let userId = token.userId
      this.setState({
        userId: userId
      })
    })
  }


  add () {
    if (this.state.username && this.state.phone) {
      fetch(global.NGROK + '/friends/addFriend/' + this.state.userId, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          friend: this.state.username
        })
      })

      .then((resp) => {
        if (resp.status === 200) {
          console.log("success sending friend request", resp);
          Alert.alert(
            'Success',
            'Request Sent!',
            [{text: 'Dismiss'}] // Button
          )
          this.props.navigation.navigate('Friends');

        } else {
          this.setState({
            message: resp.message
          })
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
        <TouchableOpacity onPress={ () => this.add() } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Send Request</Text>
        </TouchableOpacity>
      </View>
    )
  }
}



const styles = StyleSheet.create({

});
