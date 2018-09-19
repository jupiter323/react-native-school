import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class StudentProfileCard extends React.Component {

  static navigationOptions = {
    headerTitle: 'Moving Group',
  };

  constructor(props){
    super(props);
    this.state = {
      cityState: '',
      grade: '',
      profilePicture: '',
      schoolName: '',
      sellerID: '',
      convoKey: '',
      profileName: '',
      userID: firebase.auth().currentUser.uid,
      previousMessage: false,
      photo: null,
    }
    //See what props our StarWarsCard renders with
    console.log(JSON.stringify(props));
  }

  componentWillMount= async() => {
    console.log("current user" + JSON.stringify(firebase.auth().currentUser));
    console.log(JSON.stringify(firebase.database().ref('users').child(firebase.auth().currentUser.uid)));
    var ref = firebase.database().ref("users").child(firebase.auth().currentUser.uid);
    ref.once("value", (snapshot) => {
    const nameProfile = snapshot.child("name").val(); // {first:"Ada",last:"Lovelace"}
    console.log("name " + nameProfile);
    this.setState({profileName: snapshot.child("name").val(), schoolName: snapshot.child("schoolName").val(), grade: snapshot.child("grade").val(),
  cityState: snapshot.child("cityState").val(), profilePicture: snapshot.child("profilePicture").val() });
  });
  }


  // onPressMessageFreelancer = async () => {
  //   const { navigate } = this.props.navigation.navigate;
  //   console.log("testing params" + this.props.navigation.state.params.item.seller);
  //    await this.rememberMessage();
  //    console.log("preAdd: " +JSON.stringify(this.state.previousMessage));
  //    await this.add();
  //    console.log("convokey: " + this.state.convoKey);
  //    console.log("asynckey1: " + JSON.stringify(this.state.userID+this.state.sellerID));
  //    console.log("asynckey2: " + JSON.stringify(this.state.sellerID+this.state.userID));
  //    this.props.navigation.navigate('MessagesScreen', {key: this.state.convoKey});
  //   //query
  // }
  //
  //   rememberMessage = async () => {
  //     try {
  //         const key1 = await AsyncStorage.getItem(this.state.userID+this.state.sellerID);
  //         console.log("key1: " + key1);
  //         const key2 = await AsyncStorage.getItem(this.state.sellerID+this.state.userID);
  //         console.log("key2: " + key2);
  //         if (key1 !== null ) {
  //           this.setState({convoKey: key1, previousMessage: true });
  //         }
  //         if (key2 !== null) {
  //           this.setState({convoKey: key2, previousMessage: true })
  //         }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //
  // add = async () => {
  //   // console.log(firebase.database().ref('users').child(this.state.key).child('rooms').child('roomName');
  //     // console.log("previousMessage: " + this.state.previousMessage);
  //     if (this.state.previousMessage === false) {
  //       console.log("enters if statement");
  //       var roomsList = firebase.database().ref('users').child(this.state.sellerID).child('rooms').push();
  //       console.log("preset rooms list");
  //       await roomsList.set({
  //         roomName: firebase.auth().currentUser.displayName,
  //       }).then(() => this.setState({text: ""}));
  //
  //
  //       roomsList = firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('rooms').child(roomsList.key);
  //       await roomsList.set({
  //         roomName: this.state.sellerName,
  //       }).then(() => this.setState({text: ""}));
  //       await AsyncStorage.setItem(this.state.userID+this.state.sellerID, roomsList.key);
  //       await AsyncStorage.setItem(this.state.sellerID+this.state.userID, roomsList.key);
  //       await this.setState({convoKey: roomsList.key});
  //       return roomsList.key;
  //   } else {
  //     return this.state.convoKey;
  //   }
  // }

  render() {

    return (
        <View style={styles.container}>
          <Card style={styles.card}
              title={this.state.profileName}
              image={{uri: this.state.profilePicture}}
              imageProps={{ resizeMode: 'contain'}}>
              <Text style={styles.textStyles}>
              Hometown: {this.state.cityState}
              </Text>
              <Text style={styles.textStyles}>
              School Name: {this.state.schoolName}
              </Text>
              <Text style={styles.textStyles}>
              Grade: {this.state.grade}th
              </Text>
              </Card>

        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
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
});
