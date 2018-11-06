import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements'
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';


export default class Home extends React.Component {


  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Four Year Plan',
    title: 'Four Year Plan',
    }
};

constructor(props) {
  super(props);
  this.state = {
  }
  //see what props App.js is constructed with:
  console.log("goals timeline " + JSON.stringify(props));
}

navigateFreshmanYear= async() =>{
  this.props.navigation.navigate("TimelineSheet", {year: 'Freshman'});
}

navigateSophomoreYear= async() =>{
  this.props.navigation.navigate("TimelineSheet", {year: 'Sophomore'});
}

navigateJuniorYear= async() =>{
  this.props.navigation.navigate("TimelineSheet", {year: 'Junior'});
}

navigateSeniorYear= async() =>{
  this.props.navigation.navigate("TimelineSheet", {year: 'Senior'});
}


  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >

        {/* <View style = {{flex: 1}}> */}

        <Button
          buttonStyle={{backgroundColor : '#c77ce8', width : 200, borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={() => this.navigateFreshmanYear()}
          title='Freshman Year'>
        </Button>

        <Button
          buttonStyle={{backgroundColor : '#c77ce8', width : 200, borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={() => this.navigateSophomoreYear()}
          title='Sophomore Year'>
        </Button>

        <Button
          buttonStyle={{backgroundColor : '#c77ce8', width : 200, borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={() => this.navigateJuniorYear()}
          title='Junior Year'>
        </Button>

        <Button
          buttonStyle={{backgroundColor : '#c77ce8', width : 200, borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={() => this.navigateSeniorYear()}
          title='Senior Year'>
        </Button>

        {/* </View> */}
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  movingView: {
    flex: 1,
    backgroundColor: '#c77ce8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movingText: {
    color: 'white',
    fontSize: 40,
    alignItems: 'center',
    padding: 26,
  },
  buyingView: {
    flex: 1,
    backgroundColor: '#c77ce8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyingText: {
    color: 'white',
    fontSize: 40,
    //fontFamily: 'lucida grande',
    padding: 26,
  },
  sellingView: {
    flex: 1,
    backgroundColor: 'steelblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellingText: {
    color: 'white',
    fontSize: 40,
    padding: 26,
  },
});
