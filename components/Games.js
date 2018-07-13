import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native';
import mainStyles from '../styles.js'


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
              {title: "Tom's Game of Tagactive", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'active'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tagactive", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'active'},
              {title: "Tom's Game of Tag", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'pending'},
              {title: "Tom's Game of Tagactive", participants: [], createdAt: 'TODAY', owner: 'Tom', gameStatus: 'active'},
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Text style={mainStyles.textBig}>My Games</Text>
          <View style = {{flex: 1, borderColor: 'black', borderTopWidth:1, borderBottomWidth: 1}}>
            <Text style={mainStyles.textMed}>Active</Text>
            <ListView
              dataSource={this.state.active}
              renderRow={(rowData) => {
                console.log(rowData);
                return <View style = {styles.game}>
                  <Text style = {mainStyles.textSmall}>{rowData.title} created {rowData.createdAt} by {rowData.owner}</Text>
                </View>}}
            />
          </View>
    </View>
    );
  }
}



const styles = StyleSheet.create({
  game: {
    backgroundColor:'black',
    borderWidth: 2,
    borderColor: '#4286f4'
  }
});
