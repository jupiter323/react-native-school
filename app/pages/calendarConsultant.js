import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Metrics from '../Themes/Metrics';
import LoggedOut from '../components/loggedOutScreen';
import firebase from 'firebase';

export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoggedIn: false,
      emailVerification: true,
    };
    this.onDayPress = this.onDayPress.bind(this);
    console.log("calendar consultant props " + JSON.stringify(props));
  }

  componentDidMount =async() => {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn = async () => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({ hasLoggedIn: true });
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
    const emailVerification = firebase.auth().currentUser.emailVerified;
    if (emailVerification == true) {
      await this.setState({ emailVerified: true});
    }
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    console.log("pressed " + JSON.stringify(this.state));
    this.props.navigation.navigate('SetAvailabilityScreen', { bookingDate : day })
  }
  _onPressBack(){
    const {goBack} = this.props.navigation
      goBack();
  }
  render() {
    if (!this.state.hasLoggedIn || !this.state.emailVerified) {
      return (<LoggedOut />);
    } else {
    return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      {/* <View>
        <TouchableOpacity onPress={() => this._onPressBack() }><Text>Back</Text></TouchableOpacity>
                    <Text></Text>
                    <Text></Text>
      </View> */}
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          markedDates={{[this.state.selected]: {selected: true}}}
          theme={{
            selectedDayBackgroundColor: 'green',
            todayTextColor: 'green',
            arrowColor: 'green',
          }}
        />
      </View>
    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#c77ce8',
    height: 350
  }
});
