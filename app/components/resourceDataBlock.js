import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';

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

navigateResource() {
  WebBrowser.openBrowserAsync(this.props.jedi.item.link);
}

  // componentDidMount() {
  //   // this.setState({ time: this.props.jedi.item.key})
  // }

  render() {
          return (
            <TouchableOpacity onPress={() => this.navigateResource()}>
              <View style={styles.cardView}>
                <Card
                  containerStyle={this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
                  wrapperStyle={this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
                  title={this.props.jedi.item.key}>
                    <Text>
                    summary: {this.props.jedi.item.summary}
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
    height: Metrics.screenHeight* .2,
  },
  cardSelected: {
    backgroundColor: '#c77ce8',
  },
  cardNotSelected: {
    backgroundColor: 'white',
    borderColor: '#c77ce8',
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
