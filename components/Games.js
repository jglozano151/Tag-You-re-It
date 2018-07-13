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
      pending: ds.cloneWithRows([]),
      active: ds.cloneWithRows([]),
      complete: ds.cloneWithRows([]),
      ds: ds,
      data: [{title: "Tom's Game of Tagcomplete", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'complete'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tagactive", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'active'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tagcomplete", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'complete'}]
    })
  }
  static navigationOptions = {
    title: 'Games'
  };

  componentDidMount(){
    let data = this.state.data.slice()
    let pending = [];
    let active = [];
    let complete = [];

    for (let i = 0; i < data.length; i ++){
      if (data[i].gameStatus === 'pending') pending.push(data[i]);
      else if (data[i].gameStatus === 'active') active.push(data[i])
      else complete.push(data[i])
    }
    this.setState({
      pending: this.state.ds.cloneWithRows(pending),
      active: this.state.ds.cloneWithRows(active),
      complete: this.state.ds.cloneWithRows(complete),
      data: []
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Text style={mainStyles.textBig}>My Games</Text>
          <View style = {{borderColor: 'black', borderTopWidth:1, borderBottomWidth: 1}}>
            <Text style={mainStyles.textMed}>Active</Text>
            <ListView
              dataSource={this.state.active}
              renderRow={(rowData) => {
                console.log(rowData);
                return <View style = {styles.active}>
                  <TouchableOpacity onPress = {()=>{this.active(rowData._id)}}><Text style = {mainStyles.textSmall}>{rowData.title} created {rowData.createdAt} by {rowData.owner}.
                  {rowData.participants.joined} players</Text></TouchableOpacity>
                </View>}}
            />
          </View>
          <View style = {{borderColor: 'black', borderTopWidth:1, borderBottomWidth: 1}}>
            <Text style={mainStyles.textMed}>Pending</Text>
            <ListView
              dataSource={this.state.pending}
              renderRow={(rowData) => {
                console.log(rowData);
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
