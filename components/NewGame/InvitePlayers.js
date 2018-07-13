import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button, ListView} from 'react-native';
import mainStyles from '../../styles.js'


export default class InvitePlayers extends React.Component {

  static navigationOptions = (props) => (
    {
      title: 'Invite Friends',
    }
  );

  constructor() {
    super();
    this.state = {
      title: '',
      message: '',
      friends: [{username: 'Tom', id: '1'}, {
        username: 'bob', id: '2'},
        {username: 'Tommy', id: '3'}, 
        {username: 'bb', id: '4'}, 
        {username: 'Tomaa', id: '5'}, 
        {username: 'Tom!?', id: '6'}, 
        {username: 'Tomaba', id: '7'}, 
        {username: 'Tom!?', id: '8'}, 
        {username: 'bill', id: '9'}, 
        {username: 'sally', id: '10'}, 
        {username: 'nick', id: '11'}, 
        {username: 'joseph', id: '12'}, 
        {username: 'demi', id: '13'}],
      selected: []
    }
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
