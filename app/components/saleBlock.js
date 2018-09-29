import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, Linking } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { WebBrowser } from 'expo';
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';
import metrics from '../Themes/Metrics';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class SaleBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      image: null,
      itemName: '',
      category: '',
      price: '',
      description: '',
      convoKey: '',
      userName: '',
      sellerName: '',
      previousMessage: false,
      skypeTest: 'amandaorbuch',
      name: '',
      profilePicture: '',
      cityState: '',
      schoolName: '',
      skypeUsername: '',
    }

    console.log(JSON.stringify("saleblock props " + JSON.stringify(props)));
  }

  openConsultantScreen() {
    console.log('pressed ');
    this.props.selectConsultant(this.props.jedi);
  }

  componentWillMount =async() => {
    var that = this;
    await firebase.database().ref('users').child(this.props.jedi.key).on('value', (snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      that.setState({ name: childData.name, cityState: childData.cityState, profilePicture: childData.profilePicture,
        schoolName: childData.schoolName, skypeUsername: childData.skypeUsername});
    });
  }

  onPressMessageSeller = async () => {
    console.log('testing message seller');

    //if has skype get consultant skype name
    //else prompt to download skype
    var url;
    if (this.state.skypeUsername !== "") {
      url = 'skype://' + this.state.skypeUsername + '?chat';
      // console.log("url " + url);

      //actual check for existing url
      // Linking.canOpenURL(url).then(supported => {
      // if (!supported) {
      //   console.log('Can\'t handle url: ' + url);
      // } else {
      //   return Linking.openURL(url);
      // }
      Linking.canOpenURL(url).then(supported => {
      if (supported) {
        alert("Consultant has not set up skype account yet");
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
    } else {
      alert("Consultant has not set up skype account yet");
    }
  }

  onPressBookAppointment(){
    console.log('testing book appointment');
    this.props.bookAppointment(this.props.jedi);
  }

  openMessageScreen() {
    console.log("pressed message: ");
    this.props.messageBlock(this.state.convoKey);
  }


  render() {
    return (
      <TouchableOpacity onPress={() => this.openConsultantScreen()}>
        <View style={styles.cardView}>
          <Card style={styles.card}
              // title={this.state.name}
              image={{uri: this.state.profilePicture}}
              imageStyle={{ flex: 1, height: metrics.screenWidth - 30}}
              imageProps={{ resizeMode: 'cover'}}>
              <Text style={styles.textStyles}>
              Name: {this.state.name}
              </Text>
              <Text style={styles.textStyles}>
              Hometown: {this.state.cityState}
              </Text>
              <Text style={styles.textStyles}>
              Affiliation: {this.state.schoolName}
              </Text>
              <Text style={styles.textStyles}>
              Price: ${this.props.jedi.price}/hr
              </Text>
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                title='Book Appointment'
                onPress={() => this.onPressBookAppointment()}/>
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                title='Message Consultant'
                onPress={() => this.onPressMessageSeller()}/>
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
