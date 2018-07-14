import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button , AsyncStorage} from 'react-native';
import mainStyles from '../../styles.js';


export default class AboutGame extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      message: '',
      userId: ''
    }
  }

  static navigationOptions = ({navigation}) => (
    {
      title: 'Create New Game',
      headerLeft: <Button title='Back' onPress={ () => {navigation.state.params.onLeftPress()} } />
    }
  );


  componentDidMount(){
    console.log("TEST");
    AsyncStorage.getItem('token').then((data) => {
     token = JSON.parse(data);
     let userId = token.userId
     console.log('USer', userId);
     this.setState({
       userId: userId
     })
   })
   .catch(err => {console.log('Error', err);})
  }

  back = () => {
    this.props.navigation.navigate('Home');
  }

  submit() {
    if (this.state.title) {
      fetch(global.NGROK +'/games/creategame/' + this.state.userId, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: this.state.title
        })
      })
      .then((resp) => (resp.json()))
      .then((result) => {

        if (result.status === 200) {
          console.log("success", result);
          let gameId = result.game._id;
          console.log("gameId", gameId);
          this.props.navigation.navigate('InvitePlayers', {
            gameId: gameId
          });

        } else {
          this.setState({
            message: result.message
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

  componentDidMount() {
    this.props.navigation.setParams({
      onLeftPress: this.back
    })

    AsyncStorage.getItem('token').then((data) => {
      token = JSON.parse(data);
      let userId = token.userId
      this.setState({
        userId: userId
      })
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
