import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
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
      its: [{user: 'Tom', lat: 37.773, long: -122.4073}, {user: 'Tom2', lat: 37.777, long: -122.4077}],
      players: [{user: 'Tim', lat: 37.771, long: -122.4071}, {user: 'Tam', lat: 37.774, long: -122.4078}, {user: 'Tum', lat: 37.778, long: -122.4073}],
      tagged: true
    })
  }
  static navigationOptions = {
    title: 'Tag Map'
  }



  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (success)=>{
        this.setState({
          lat:success.coords.latitude,
          long:success.coords.longitude,
          latDelta:.0125,
          longDelta:.007
      })},
      (error)=>{},
      {});
    this.watchId = setInterval(()=>{navigator.geolocation.getCurrentPosition(
      (success)=>{
        this.setState({
          userLoc: {
            lat:success.coords.latitude,
            long:success.coords.longitude
          }
      })},
      (error)=>{},
      {})}, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.watchId);
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
                latitude: it.lat,
                longitude: it.long
              }}
              title={it.user}
              />)}
              {this.state.players.map((player)=> <MapView.Marker
                key = {player.user}
                coordinate={{
                  latitude: player.lat,
                  longitude: player.long
                }}
                title={player.user}
                pinColor ={'black'}

                />)}
        </MapView>
          <View style={{flex: 1, flexDirection: 'row'}}>
              {(this.state.tagged)?
                <Text style = {[{flex: 3}, mainStyles.button, mainStyles.blue, mainStyles.buttonLabel, mainStyles.textMed]}>
                Go Get {this.state.players[0].user}!</Text>:
                <Text style = {[{flex: 3}, mainStyles.button, mainStyles.blue, mainStyles.buttonLabel, mainStyles.textMed]}>
                Watch Out For {this.state.its[0].user}!
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
