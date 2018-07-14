import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native';
import mainStyles from '../styles.js'
// import Penzzz


export default class Home extends React.Component {
  constructor(){
    super()
    // title, participants, createdAt, owner, gameStatus-pending,  active, complete
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = ({
      requestsPresent: true,
      pending: ds.cloneWithRows([]),
      active: ds.cloneWithRows([]),
      complete: ds.cloneWithRows([]),
      requests: ds.cloneWithRows([]),
      ds: ds
    })
  }
  static navigationOptions = {
    title: 'Games'
  };

  componentDidMount(){
    let pending = [{title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
    {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
    {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
    {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
    {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},];
    let active = [{title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'active'}];
    let complete = [{title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'complete'}, {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'complete'}];
    let requests = [{title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'requests', _id: 1}, {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'requests', _id: 2}];
    this.setState({
      pending: this.state.ds.cloneWithRows(pending),
      active: this.state.ds.cloneWithRows(active),
      complete: this.state.ds.cloneWithRows(complete),
      requests: this.state.ds.cloneWithRows(requests)
    })
  }

  pending(id){
    this.props.navigation.navigate('Pending', {id: id})
  }

  active(id){
    this.props.navigation.navigate('CurrentGame', {id: id})
  }

  launchGame(id){
    alert('You are going to launch ' + id + '. Get ready to run')
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
          <Text style={mainStyles.textBig}>My Games</Text>
          <View style = {{borderColor: 'black', borderTopWidth:1, borderBottomWidth: 1}}>
            <Text style={mainStyles.textMed}>Active</Text>
            <ListView
              dataSource={this.state.active}
              renderRow={(rowData) => {
                return <View style = {styles.active}>
                  <TouchableOpacity onPress = {()=>{this.active(rowData._id)}}><Text style = {mainStyles.textSmall}>{rowData.title} created {rowData.createdAt} by {rowData.owner}.
                  {rowData.participants.joined} players</Text></TouchableOpacity>
                </View>}}
            />
          </View>
          {(this.state.requestsPresent)?
          <View style = {{borderColor: 'black', borderTopWidth:1, borderBottomWidth: 1}}>
            <Text style={mainStyles.textMed}>Requests</Text>
            <ListView
              dataSource={this.state.requests}
              renderRow={(rowData) => {
                return <View style = {[styles.pending,{flex: 1, alignItems: 'center',  flexDirection: 'row'}]}>
                    <Text style = {[mainStyles.textSmall, {alignSelf: 'flex-start', flex: 3}]}>{rowData.title} created {rowData.createdAt} by {rowData.owner}. Would you like to join?</Text>
                    <TouchableOpacity style = {[mainStyles.button, mainStyles.darkGrey, {alignSelf: 'flex-start', flex: 1, marginBottom: 15}]} onPress={()=>this.accept(rowData._id)}><Text>Accept</Text></TouchableOpacity>
                    <TouchableOpacity style = {[mainStyles.button, mainStyles.darkGrey, {alignSelf: 'flex-start', flex: 1, marginBottom: 15}]} onPress={()=>this.deny(rowData._id)}><Text>Deny</Text></TouchableOpacity>
                </View>}}
            />
          </View>: <View></View>}
          <View style = {{borderColor: 'black', borderTopWidth:1, borderBottomWidth: 1}}>
            <Text style={mainStyles.textMed}>Pending</Text>
            <ListView
              dataSource={this.state.pending}
              renderRow={(rowData) => {
                return <View style = {[styles.pending,{alignItems: 'center'}]}>
                  <TouchableOpacity onPress = {()=>{this.pending(rowData._id)}}>
                    <Text style = {mainStyles.textSmall}>{rowData.title} created {rowData.createdAt} by {rowData.owner}.  {rowData.participants.joined} / {rowData.participants.joined + rowData.participants.invited} players</Text>
                  </TouchableOpacity>
                </View>}}
            />
          </View>
    </View>
    );
  }
}



const styles = StyleSheet.create({
  active: {
    backgroundColor:'#4286f4',
    borderWidth: 2,
    borderColor: 'black'
  },
  pending: {
    backgroundColor:'#b1bed8',
    borderWidth: 2,
    borderColor: 'black'
  }
});
