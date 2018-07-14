import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button, ListView} from 'react-native';
import mainStyles from '../../styles.js'


export default class InvitePlayers extends React.Component {

  static navigationOptions = (props) => (
    {
      title: 'Invite Friends',
    }
  );

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      message: '',
      friends: [],
      selected: [],
      gameId: '',
      userId: ''
    }
  }

  componentDidMount () {

    let gameId = this.props.navigation.getParam('gameId');
    AsyncStorage.getItem('token')
    .then((data) => {
      token = JSON.parse(data);
      let userId = token.userId
      this.setState({
        userId: userId,
        gameId: gameId
      })
    })
    .then(()=>{
    fetch(global.NGROK + '/friends/' + this.state.userId)
    .then((resp) => (resp.json())
    .then((result)=> {
      if (result.status === 200) {
        console.log("success", result);
        this.setState({
          friends: result.friends
        })
      } else {
        console.log("error!:", result.message);
        this.setState({message: 'Server error. Retry'})
      }
    })
    )})
    .catch((err) => {
      console.log("error:", err);
    })
  }

  press(item) {
    let index = this.state.selected.indexOf(item.id);
    console.log("item", item);
    console.log("index", index);
    console.log("array", this.setState.selected);
    if (index === -1) {
      // only push if item not selected yet
      this.setState({
        selected: this.state.selected.concat(item.id)
      })
    } else {
      // if item selected, remove it (deselect)
      let copy = this.state.selected.slice();
      console.log("copy", copy);
      copy.splice(index, 1);
      console.log("spliced", copy);
      this.setState({
        selected: copy
      })
    }
  }

  _renderRow = (item) => {
    let style;
    if (this.state.selected.indexOf(item.id) > -1) {
      style = styles.friendSelected;
    } else {
      style = styles.friend;
    }
    return (
      <View style = {style}>
        <TouchableOpacity onPress={() => this.press(item)}>
          <Text style = {mainStyles.textMed}>{item.username}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  submit () {
    console.log("invite selected Array:", this.state.selected);
    // must invite at least 2 people
    if (this.state.selected.length >= 2) {
      fetch(global.NGROK + '/games/inviteplayers', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          game: gameId,
          players: selected
        })
      })
      .then((resp) => {
        if (resp.status === 200) {
          console.log("success:", resp);
          this.props.navigation.navigate('Pending');
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
      this.setState({
        message: 'Must invite at least 2 friends'
      })
    }
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>

        <Text style={mainStyles.textAlert}>{this.state.message}</Text>

        <Text style={mainStyles.textMed}>Click on names of friends you wish to invite</Text>


        <View style = {{flex: 7}}>
          <ListView
            dataSource={ds.cloneWithRows(this.state.friends)}
            renderRow={this._renderRow}
          />

        </View>

        <View style = {{flex: 1}}>
          <TouchableOpacity onPress={ () => this.submit() } style={[mainStyles.button, mainStyles.black]}>
            <Text style={mainStyles.buttonLabel}>Invite</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}



const styles = StyleSheet.create({
  friend: {
    backgroundColor:'#b1bed8',
    borderWidth: 2,
    borderColor: '#848a96'
  },
  friendSelected: {
    backgroundColor:'#4286f4',
    borderWidth: 2,
    borderColor: 'black'
  }
});
