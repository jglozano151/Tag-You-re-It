import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import mainStyles from '../styles.js'




export default class Home extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  games() {
    this.props.navigation.navigate('Games');
  }

  friends() {
    this.props.navigation.navigate('Friends');
  }

  newGame() {
    this.props.navigation.navigate('AboutGame');
  }

  logout() {
    AsyncStorage.removeItem('token')
    .then(this.props.navigation.navigate('Login')) 
    .catch((err)=>{console.log(err)})
  }


  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flexGrow: 7}}>
        <Text style = {mainStyles.textBig}>Tag</Text>
        <TouchableOpacity onPress={ () => {this.games()} } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Games</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => {this.friends()} } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => {this.newGame()} } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Create Game</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexGrow: 1}}>
        <TouchableOpacity onPress={ () => {this.logout()} } style={[mainStyles.button, mainStyles.black, {alignSelf: 'center'}]}>
          <Text style={mainStyles.buttonLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  }
}



const styles = StyleSheet.create({

});
