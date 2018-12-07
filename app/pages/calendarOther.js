import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Metrics from '../Themes/Metrics';


export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
    console.log("calendar screen props " + JSON.stringify(props));

  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    console.log("pressed " + JSON.stringify(this.state));
    this.props.navigation.navigate('MakeAppointmentsScreen', { 
      propsCalendar: this.props.navigation.state.params.item.key, 
      bookingDate : day 
    });
    // this.props.navigation.navigate('MakeAppointmentsScreen', { bookingDate : day })
  }

  _onPressBack(){
    const {goBack} = this.props.navigation
      goBack()
  }
  render() {
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
          minDate={Date()-1}
          markedDates={{[this.state.selected]: {selected: true}}}
          theme={{
            selectedDayBackgroundColor: 'purple',
            todayTextColor: 'purple',
            arrowColor: 'purple',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',

  },
  calendar: {
    borderWidth: 2,
    borderColor: '#c77ce855',
    height: 350
  }
});
