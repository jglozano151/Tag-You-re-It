import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import {
  MapView
} from 'expo';
import mainStyles from '../styles.js'

export default class CurrentGame extends React.Component {
  constructor(props){
    super(props)
    this.state = ({
      lat: 0,
      long: 0,
      latDelta: 150,
      longDelta: 150,
      userLoc: {
        lat:0,
        long:0,
        latDelta:.0125,
        longDelta:.007
      },
      its: [],
      players: [],
      tagged: false,
      currentGame: {}
    })
  }
  static navigationOptions = {
    title: 'Tag Map'
  }



  componentDidMount(){
    this.here();
    this.updateLocation();
    this.watchId = setInterval(()=>this.updateLocation(), 3000)
    AsyncStorage.getItem('token')
    .then((data) => {
      token = JSON.parse(data);
      let userId = token.userId
      this.setState({
        userId: userId
      })
    })
    .catch(err=> {console.log('ERROR', err)})
  }

  componentWillUnmount() {
    clearInterval(this.watchId);
  }

  updateLocation(){
    console.log("test");
    navigator.geolocation.getCurrentPosition(
      (success)=>{
        console.log("test2");
        console.log('WTF');
        console.log("BLANK", this.props.navigation.getParam('id'))
        console.log('WTF2')
        fetch(global.NGROK + '/livegame/' + this.props.navigation.getParam('id'), {
          method: 'post',
          body: JSON.stringify({
            latitude: success.coords.latitude,
            longitude: success.coords.longitude,
            id: this.state.userId
          })
        })
        .then(resp=>(resp.json()))
        .then((result)=> {
          let tagged = false;
          result.itPlayers.forEach((element) => {
            if (element.id === this.state.userId)
              tagged = true;
            return;
          })
          this.setState({
            its:results.itPlayers,
            players: results.notItPlayers,
            tagged: tagged,
            userLoc: {
              lat:success.coords.latitude,
              long:success.coords.longitude
            }
          })
      })},
      (error)=>{},
      {})
  }

  here(){
    navigator.geolocation.getCurrentPosition(
      (success)=>{this.setState({
        lat:success.coords.latitude,
        long:success.coords.longitude,
        latDelta:.0125,
        longDelta:.007
      })},
      (error)=>{},
      {}
    )
  }

  regionChange(region){
    this.setState({
      lat:region.latitude,
      long:region.longitude,
      latDelta:region.latitudeDelta,
      longDelta:region.longitudeDelta
    })
  }


  render() {
    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 7}}
          mapType ={'mutedStandard'}
          region={{
            latitude: this.state.lat,
            longitude:this.state.long,
            latitudeDelta:this.state.latDelta,
            longitudeDelta: this.state.longDelta
          }}
          onRegionChangeComplete={this.regionChange.bind(this)}
          >
          <MapView.Marker
            coordinate={{
              latitude: this.state.userLoc.lat,
              longitude:this.state.userLoc.long
            }}
            title={'Me'}
            pinColor ={'#4286f4'}
            />
            {this.state.its.map((it)=> <MapView.Marker
              key = {it.user}
              coordinate={{
                latitude: it.location.latitude,
                longitude: it.location.longitude
              }}
              title={it.user}
              />)}
              {this.state.players.map((player)=> <MapView.Marker
                key = {player.user}
                coordinate={{
                  latitude: player.location.latitude,
                  longitude: player.location.longitude
                }}
                title={player.user}
                pinColor ={'black'}

                />)}
        </MapView>
          <View style={{flex: 1, flexDirection: 'row'}}>
              {(this.state.tagged)?
                <Text style = {[{flex: 3}, mainStyles.button, mainStyles.blue, mainStyles.buttonLabel, mainStyles.textMed]}>
                Go Get {this.state.players[0]}!</Text>:
                <Text style = {[{flex: 3}, mainStyles.button, mainStyles.blue, mainStyles.buttonLabel, mainStyles.textMed]}>
                Watch Out For {this.state.its[0]}!
              </Text>}
            <TouchableOpacity
              onPress={()=>{this.here()}}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{width: 50, height: 50}}
                source={require('./location-512.png')}
               />
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({

});
