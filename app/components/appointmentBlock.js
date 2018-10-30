import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import DataTimes from '../Themes/DataTimes'
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class AppointmentBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      cardSelected: false,
      timeSlot: '',
      currentUserID: '',
      consultantID: '',
      dateString: '',
    }
    console.log(JSON.stringify("AppointmentBlock props " + JSON.stringify(props)));
  }

  componentWillMount= async() => {

  var userUID = firebase.auth().currentUser.uid;
  var name;
  console.log("uid " + userUID);
  await this.setState({ currentUserID: userUID});
  // var that = this;
  // var dataTimes = DataTimes['6:00 - 6:30 am'].startTime;
  // await console.log("time string " + JSON.stringify(dataTimes));
  // // await firebase.auth().onAuthStateChanged(function(user) {
  // //   if (user) {
  // //     console.log(" User is signed in.");
  // //     // console.log("name " + firebase.database().ref('users').child(userUID).child('name'));
  // //     firebase.database().ref('users').child(userUID).on('value', function(snapshot) {
  // //       var childKey = snapshot.key;
  // //       var childData = snapshot.val();
  // //       childData.key = childKey;
  // //       userUID = childData.uid;
  // //       that.setState({ currentUserID: userUID});
  // //     });
  // //   } else {
  // //     console.log(" User is not signed in.");
  // //   }
  // // });

  await this.setState({ currentUserID: userUID});
  await this.setState({ consultantID: this.props.consultantKey});
  await this.setState({ dateString: this.props.dateString });
  await this.setState({ timeSlot: this.props.jedi.timeSlot})
}

  componentDidMount() {
    // this.setState({ time: this.props.jedi.item.key})
  }

  storeAppointment= async() => {
    //i want to store the appointment under appointments (for both the student and consultant), remove the
    //availability from the consultant
    //maybe the push id can be stored?
    if (!this.state.cardSelected) {
    this.setState({ cardSelected: !this.state.cardSelected});
      const date = this.state.dateString
      const timeSlot = this.state.timeSlot

      // firebase.database().ref('users').child(uid).child("availabilities").child(date).push({
      //   timeSlot: timeSlot,
      // });
      console.log("date string " + this.state.dateString);
      console.log("timeSlot " + this.state.timeSlot);
      console.log("currentID " + this.state.currentUserID);
      var timeSlotArray = await AsyncStorage.getItem('selectedTimeslots');
      timeSlotArray = JSON.parse(timeSlotArray);
      console.log("test " + JSON.stringify(timeSlotArray));
        if ((await AsyncStorage.getItem("selectedTimeslots") == null) || (timeSlotArray.length == 0)) {
          var selectedTimeslots = [];
          selectedTimeslots.push(timeSlot);
          await AsyncStorage.setItem('selectedTimeslots', JSON.stringify(selectedTimeslots));
        } else {
          var selectedTimeslots = await AsyncStorage.getItem('selectedTimeslots');
          console.log("time slots retrieved " +  JSON.stringify(selectedTimeslots));
          selectedTimeslots = JSON.parse(selectedTimeslots);
            if (!selectedTimeslots.includes(timeSlot)) {
              selectedTimeslots.push(timeSlot);
              await AsyncStorage.setItem('selectedTimeslots', JSON.stringify(selectedTimeslots));
            }
          var selectedTimeslots = await AsyncStorage.getItem('selectedTimeslots');
          console.log("time slots pushed " +  JSON.stringify(selectedTimeslots));
        }
    }  else {
      var selectedTimeslots = await AsyncStorage.getItem('selectedTimeslots');
      selectedTimeslots = JSON.parse(selectedTimeslots);
      var index = selectedTimeslots.indexOf(this.state.timeSlot);
      if (index > -1) {
        selectedTimeslots.splice(index, 1);
      }
      await AsyncStorage.setItem('selectedTimeslots', JSON.stringify(selectedTimeslots));
      console.log("time slots retrieved else" +  JSON.stringify(selectedTimeslots));
      await this.setState({ cardSelected: !this.state.cardSelected});
    }
    console.log('pressed ' + this.state.timeSlot);
  }

  render() {
          return (
            <TouchableOpacity onPress={() => this.storeAppointment()}>
              <View style={styles.cardView}>
                <Card
                containerStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
                wrapperStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
                title={this.state.dateString}>
                <Text>
                {this.props.jedi.timeSlot}
                </Text>
                    </Card>

              </View>
            </TouchableOpacity>
            );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
    height: Metrics.screenHeight* .1,
  },
  cardSelected: {
    backgroundColor: '#c77ce8',
  },
  cardNotSelected: {
    backgroundColor: 'white',
  },
  pictureView: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  picture: {
    height: Metrics.images.large,
    width: Metrics.images.large,
    borderRadius: Metrics.images.large * 0.5
  },
  pictureDetails: {
    flexDirection: 'column',
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  jediRowItem: {
    marginTop: Metrics.marginVertical,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  ratingButtons: {
    flexDirection: 'row',
  },
  buttonPressed: {
    color: '#c77ce8',
  },
  buttonNotPressed: {
    color: 'black',
  },
});
