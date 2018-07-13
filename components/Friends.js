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
      ds: ds,
      refreshing: false
    })
  }
  static navigationOptions = {
    title: 'Friends'
  };

  componentDidMount(){

  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style = {{flex: 7}}>
          <Text style={mainStyles.textBig}>My Friends</Text>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <View style = {styles.friend}>
              <Text style = {mainStyles.textMed}>{rowData.username}</Text>
            </View>}
          />
        </View>
      <View style = {{flex: 1, borderColor: 'black', borderTopWidth:1}}>
        <TouchableOpacity><Text style = {[mainStyles.button, mainStyles.darkGrey, mainStyles.textMed]}> Add Friend </Text></TouchableOpacity>
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
