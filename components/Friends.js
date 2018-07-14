import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native';
import mainStyles from '../styles.js'


export default class Friends extends React.Component {
  constructor(){
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = ({
      dataSource: ds.cloneWithRows([{username:'Tom'}, {username:'Tom'}, {username:'Tom'}, {username:'Tom'}, {username:'Tom'},
      {username:'Tom'},{username:'Tom'}, {username:'Tom'}, {username:'Tom'},{username:'Tom'},{username:'Tom'}, {username:'Tom'}, {username:'Tom'}]),
      requests: ds.cloneWithRows([{username:'Tim', _id: 1}, {username:'Tim', _id: 1}, {username:'Tim', _id: 1}]),
      requestsPresent: true
    })
  }
  static navigationOptions = {
    title: 'Friends'
  };

  componentDidMount(){

  }

  addFriend(){
    this.props.navigation.navigate('InviteFriend');
  }

  accept(id){
    alert("You've Accepted" + id)
  }

  deny(id){
    alert("You've Denied" + id)
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={mainStyles.textBig}>My Friends</Text>
        {(this.state.requestsPresent)?
        <View style = {{flex: 2}}>
          <Text style={mainStyles.textMed}>Friends Requests</Text>
          <ListView
            dataSource={this.state.requests}
            renderRow={(rowData) => <View style = {[styles.friend, {flex: 1, flexDirection: 'row'}]}>
              <Text style = {[mainStyles.textMed, {alignSelf: 'flex-start', flex: 3}]}>{rowData.username}</Text>
              <TouchableOpacity style = {[mainStyles.button, mainStyles.lightGrey, {flex: 1, marginBottom: 15}]} onPress={()=>this.accept(rowData._id)}><Text>Accept</Text></TouchableOpacity>
              <TouchableOpacity style = {[mainStyles.button, mainStyles.lightGrey, {flex: 1, marginBottom: 15}]} onPress={()=>this.deny(rowData._id)}><Text>Deny</Text></TouchableOpacity>
            </View>}
          />
        </View>:<View></View>}
        <View style = {{flex: 6}}>
          <Text style={mainStyles.textMed}>Current Friends</Text>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <View style = {styles.friend}>
              <Text style = {mainStyles.textMed}>{rowData.username}</Text>
            </View>}
          />
        </View>
      <View style = {{flex: 1, borderColor: 'black', borderTopWidth:1}}>
        <TouchableOpacity onPress={()=>this.addFriend()}><Text style = {[mainStyles.button, mainStyles.darkGrey, mainStyles.textMed]}> Add Friend </Text></TouchableOpacity>
      </View>
    </View>
    );
  }
}



const styles = StyleSheet.create({
  friend: {
    backgroundColor:'#4286f4',
    borderWidth: 2,
    borderColor: 'black'
  }
});
