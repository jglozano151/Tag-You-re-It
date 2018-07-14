import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button, ListView, AsyncStorage } from 'react-native';
import mainStyles from '../styles.js'


export default class Pending extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      message: '',
      ownerName: '',
      ownerId: '',
      pJoined: [],
      pInvited:[],
      gameId: '',
      userId: ''
    }
  }

  static navigationOptions = (props) => (
    {
      title: 'Game Pending...',
      headerLeft: <Button title='Home' onPress={ () => {props.navigation.state.params.onLeftPress()} } />
    }
  );

  back = () => {
    this.props.navigation.navigate('Home');
  }


  componentDidMount () {
    this.props.navigation.setParams({
      onLeftPress: this.back
    })

    let gameId = this.props.navigation.getParam('id');
    console.log("gameId", gameId);

    AsyncStorage.getItem('token').then((data) => {
      token = JSON.parse(data);
      let userId = token.userId
      this.setState({
        userId: userId
      })
    })

    if (gameId) {
      this.setState({
        gameId: gameId
      })
    } else {
      console.log("no gameId?", gameId);
    }
    

    // TODO: fetch GET game based on Id
    let result = {
      title: 'Test Game',
      participants: {
        'joined': [{username: 'Tom', id: '1'}, {
          username: 'bob', id: '2'},
          {username: 'Tommy', id: '3'}, 
          {username: 'bb', id: '4'}, 
          {username: 'Tomaa', id: '5'}, 
          {username: 'Tom!?', id: '6'}, 
          {username: 'Tomaba', id: '7'}, 
          {username: 'Tom!?', id: '8'}, 
        ],
        'invited':[{username: 'bill', id: '9'}, 
        {username: 'sally', id: '10'}, 
        {username: 'nick', id: '11'}, 
        {username: 'joseph', id: '12'}, 
        {username: 'demi', id: '13'}]
      },
      owner: '2',
      ownerName: 'sally' // TODO: fetch user baesd on owner
    }

    this.setState({
      title: result.title,
      pJoined: result.participants.joined,
      pInvited: result.participants.invited,
      ownerId: result.owner,
      ownerName: result.ownerName
    })
  }

  _renderRow1 = (item) => {
    return (
      <View style = {styles.friendSelected}>       
        <Text style = {mainStyles.textSmall}>{item.username}</Text>
        
      </View>
    )
  }

  _renderRow2 = (item) => {
    return (
      <View style = {styles.friend}>        
        <Text style = {mainStyles.textSmall}>{item.username}</Text>
      </View>
    )
  }

  start () {
    // TODO: navigate to CurrentGame; notify everyone?
    console.log("started game:", this.state.gameId);
  }

  delete() {
    Alert.alert(
      'Warning',
      'Are you sure you want to delete the game?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Proceed', onPress: () => {
          // TODO fetch delete the game; navigate to Games
          
        }},
      ]
    )
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        
        <Text style={mainStyles.textAlert}>{this.state.message}</Text>

        <Text style={[mainStyles.textMed, {fontWeight: 'bold'}]}>Game title: {this.state.title}</Text>

        <Text style={[mainStyles.textSmall, {fontWeight: 'bold', fontStyle: 'italic'}]}>Created by {this.state.ownerName}</Text>

        <View style={{flex: 4}}>
          <Text style={[mainStyles.textSmall, {fontWeight: 'bold'}]}>Participants joined:</Text>

          <ListView
            dataSource={ds.cloneWithRows(this.state.pJoined)}
            renderRow={this._renderRow1}
          />   
        </View>

        <View style={{flex: 4}}>
          <Text style={[mainStyles.textSmall, {fontWeight: 'bold'}]}>Participants invited:</Text>

          <ListView
            dataSource={ds.cloneWithRows(this.state.pInvited)}
            renderRow={this._renderRow2}
          />  
        </View>
        {console.log("ownerId and userId:", this.state.ownerId, this.state.userId)}

        { (this.state.ownerId === this.state.userId) ? 
            <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>         
              <TouchableOpacity onPress={ () => this.start() } style={[mainStyles.button, mainStyles.black, {flex: 1}]}>
                <Text style={mainStyles.buttonLabel}>Start Game</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => this.delete() } style={[mainStyles.button, mainStyles.darkGrey, {flex: 1}]}>
                <Text style={mainStyles.buttonLabel}>Delete Game</Text>
              </TouchableOpacity>
            </View>
            :
            <Text style={[mainStyles.textSmall, {fontStyle: 'italic'}]}>
              Waiting for creater to start the game
            </Text> 
          
        }

      </View>
    );
  }
}



const styles = StyleSheet.create({
  friend: {
    backgroundColor:'#b1bed8',
    borderWidth: 0.5,
    borderColor: '#848a96'
  },
  friendSelected: {
    backgroundColor:'#4286f4',
    borderWidth: 0.5,
    borderColor: 'black'
  }

});
