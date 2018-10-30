import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class AvailabilityBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      cardSelected: false,
      time: '',
      userID: '',
    }
    console.log(JSON.stringify("AvailabilityBlock props " + JSON.stringify(props)));
  }

//   componentWillMount= async() => {
//
//   var userUID = firebase.auth().currentUser.uid;
//   var name;
//   console.log("uid " + userUID);
//   var that = this;
//
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       console.log(" User is signed in.");
//       // console.log("name " + firebase.database().ref('users').child(userUID).child('name'));
//       firebase.database().ref('users').child(userUID).on('value', function(snapshot) {
//         var childKey = snapshot.key;
//         var childData = snapshot.val();
//         childData.key = childKey;
//         id = childData.uid;
//         that.setState({ userID: id});
//       });
//     } else {
//       console.log(" User is not signed in.");
//     }
//   });
// }

  componentDidMount() {
    this.setState({ time: this.props.jedi.item.key});
  }

  storeAvailability= async() => {
    if (!this.state.cardSelected) {
    this.setState({ cardSelected: !this.state.cardSelected});
      const date = this.props.date.dateString
      const time = this.state.time
      const user = firebase.auth().currentUser
      const uid = user.uid

      firebase.database().ref('consultants').child(uid).child("availabilities").child(date).push({
        timeSlot: time,
      });
    } else {
      this.setState({ cardSelected: !this.state.cardSelected});
        const date = this.props.date.dateString
        const time = this.state.time
        const user = firebase.auth().currentUser
        const uid = user.uid

        firebase.database().ref('consultants').child(uid).child("availabilities").child(date).remove({
          timeSlot: time,
        });
    }
    console.log('pressed ' + this.state.time);
  }

  render() {
          return (
            <TouchableOpacity onPress={() => this.storeAvailability()}>
              <View style={styles.cardView}>
                <Card
                containerStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
                wrapperStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
                    title={this.props.jedi.item.key}>
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
    backgroundColor: '#e0a8f7',
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
    color: '#e0a8f7',
  },
  buttonNotPressed: {
    color: 'black',
  },
});
