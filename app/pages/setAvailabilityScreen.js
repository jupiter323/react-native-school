// apikey = AIzaSyAqVJm-bHrvstuAs5IIXjxMSiNSJ4p7Jco

/*SectionList with card component; on click card, the availability is set
*/

//maybe i can store this array on the device, and when i get the key, get tge start time and
//end times too.
//json.stringify -> json.parse.startTime

import React from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableOpacity, StatusBar, Button,
  SectionList, ActivityIndicator, FlatList} from 'react-native';
import * as firebase from 'firebase'
import AvailabilityBlock from '../components/availabilityBlock';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';

const dataTimes =
[
  {key: '6:00 - 6:30 am', startTime: '6:00 am', endTime: '6:30 am'},
  {key: '6:30 - 7:00 am', startTime: '6:30 am', endTime: '7:00 am'},
  {key: '7:00 - 7:30 am', startTime: '7:00 am', endTime: '7:30 am'},
  {key: '7:30 - 8:00 am', startTime: '7:30 am', endTime: '8:00 am'},
  {key: '8:00 - 8:30 am', startTime: '8:00 am', endTime: '8:30 am'},
  {key: '8:30 - 9:00 am', startTime: '8:30 am', endTime: '9:00 am'},
  {key: '9:00 - 9:30 am', startTime: '9:00 am', endTime: '9:30 am'},
  {key: '9:30 - 10:00 am', startTime: '9:30 am', endTime: '10:00 am'},
  {key: '10:00 - 10:30 am', startTime: '10:00 am', endTime: '10:30 am'},
  {key: '10:30 - 11:00 am', startTime: '10:30 am', endTime: '11:00 am'},
  {key: '11:00 - 11:30 am', startTime: '11:00 am', endTime: '11:30 am'},
  {key: '11:30 - 12:00 pm', startTime: '11:30 am', endTime: '12:00 pm'},
  {key: '12:00 - 12:30 pm', startTime: '12:00 pm', endTime: '12:30 pm'},
  {key: '12:30 - 1:00 pm', startTime: '12:30 pm', endTime: '1:00 pm'},
  {key: '1:00 - 1:30 pm', startTime: '1:00 pm', endTime: '1:30 pm'},
  {key: '1:30 - 2:00 pm', startTime: '1:30 pm', endTime: '2:00 pm'},
  {key: '2:00 - 2:30 pm', startTime: '2:00 pm', endTime: '2:30 pm'},
  {key: '2:30 - 3:00 pm', startTime: '2:30 pm', endTime: '3:00 pm'},
  {key: '3:00 - 3:30 pm', startTime: '3:00 pm', endTime: '3:30 pm'},
  {key: '3:30 - 4:00 pm', startTime: '3:30 pm', endTime: '4:00 pm'},
  {key: '4:00 - 4:30 pm', startTime: '4:00 pm', endTime: '4:30 pm'},
  {key: '4:30 - 5:00 pm', startTime: '4:30 pm', endTime: '5:00 pm'},
  {key: '5:00 - 5:30 pm', startTime: '5:00 pm', endTime: '5:30 pm'},
  {key: '5:30 - 6:00 pm', startTime: '5:30 pm', endTime: '6:00 pm'},
  {key: '6:00 - 6:30 pm', startTime: '6:00 pm', endTime: '6:30 pm'},
  {key: '6:30 - 7:00 pm', startTime: '6:30 pm', endTime: '7:00 pm'},
  {key: '7:00 - 7:30 pm', startTime: '7:00 pm', endTime: '7:30 pm'},
  {key: '7:30 - 8:00 pm', startTime: '7:30 pm', endTime: '8:00 pm'},
  {key: '8:00 - 8:30 pm', startTime: '8:00 pm', endTime: '8:30 pm'},
  {key: '8:30 - 9:00 pm', startTime: '8:30 pm', endTime: '9:00 pm'},
  {key: '9:00 - 9:30 pm', startTime: '9:00 pm', endTime: '9:30 pm'},
  {key: '9:30 - 10:00 pm', startTime: '9:30 pm', endTime: '10:00 pm'},
  {key: '10:00 - 10:30 pm', startTime: '10:00 pm', endTime: '10:30 pm'},
  {key: '10:30 - 11:00 pm', startTime: '10:30 pm', endTime: '11:00 pm'},
  {key: '11:00 - 11:30 pm', startTime: '11:00 pm', endTime: '11:30 pm'},
  {key: '11:30 - 12:00 am', startTime: '11:00 pm', endTime: '12:00 am'},
]


export default class SetAvailabilityScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Set Availability',
    title: 'Set Availability',
    headerLeft: (
      <Feather style={styles.icon}
        name="menu"
        size={Metrics.icons.medium}
        color={'#e0a8f7'}
        onPress={() => navigate('DrawerToggle')}
      />
      )
    }
};

  constructor(props) {
     super(props);
     this.state ={
       bookingDate: this.props.navigation.state.params.bookingDate,
       jedisSectioned: [{title: 'Jedis',data:[]}],
       refreshing: false,
     }
   }

   _keyExtractor = (item, index) => item.key;

   componentWillMount =async() => {
     console.log(JSON.stringify(this.props.navigation.state.params.bookingDate.dateString));
     console.log("book date prop " + this.state.bookingDate);


     // this.setState({ bookingDate: this.props.navigation.state.params.bookingDate })
   }

   listItemRenderer =(item) => {
     return (
       <AvailabilityBlock
       jedi={item}
       date={this.state.bookingDate}/>
     );
   }

  // _onPressBack(){
  //   const {goBack} = this.props.navigation
  //   goBack()
  // }
  //
  // _bookSlot(status,key,value) {
  //   const month = this.state.bookingDate.month
  //   const date = this.state.bookingDate.day
  //   const user = firebase.auth().currentUser
  //   const uid = user.uid
  //   let userDataJson = {}
  //   if(status)
  //   userDataJson[key] = uid
  //   else
  //   userDataJson[key] = null
  //
  //   firebase.database().ref('users').child(uid).child("availabilities").child(month).child(date).update(userDataJson)
  // }

  render() {

    return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <View>
        <TouchableOpacity onPress={() => this._onPressBack() }><Text>Back</Text></TouchableOpacity>
                    <Text>{this.state.bookingDate.dateString}</Text>
                    <Text></Text>
      </View>
        <FlatList
          data={dataTimes}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this.listItemRenderer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
