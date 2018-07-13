import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import mainStyles from '../../styles.js'
import Home from '../Home';
import InvitePlayers from './InvitePlayers';


export default class AboutGame extends React.Component {
  static navigationOptions = ({navigation}) => (
    {
      title: 'Create New Game',
      headerLeft: <Button title='Back' onPress={ () => {navigation.state.params.onLeftPress()} } />
    }
  );

  constructor() {
    super();
    this.state = {
      title: '',
      message: ''
    }
  }


  back = () => {
    this.props.navigation.navigate('Home');
  }

  submit() {
    if (this.state.title) {
      // TODO: fetch POST
      console.log('submited details,', this.state.title);
      this.props.navigation.navigate('InvitePlayers');
    } else {
      this.setState({message: 'Server error. Retry'})
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onLeftPress: this.back
    })
  }
  
  render() {
    return (
      <View style={mainStyles.container}>
        <Text style={mainStyles.textAlert}>{this.state.message}</Text>
        <Text style={mainStyles.textBig}>Input Game Details</Text>
        <TextInput
          style={mainStyles.textInput}
          placeholder="Enter game title"
          onChangeText={(text) => this.setState({title: text})}
        />
        <TouchableOpacity onPress={ () => this.submit() } style={[mainStyles.button, mainStyles.blue]}>
          <Text style={mainStyles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}



const styles = StyleSheet.create({

});
