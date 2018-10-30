// apikey = AIzaSyAqVJm-bHrvstuAs5IIXjxMSiNSJ4p7Jco

/*SectionList with card component; on click card, the availability is set
*/

//maybe i can store this array on the device, and when i get the key, get tge start time and
//end times too.
//json.stringify -> json.parse.startTime

import React from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableOpacity, StatusBar, Button,
  SectionList, ActivityIndicator, FlatList, TextInput, AsyncStorage} from 'react-native';
import * as firebase from 'firebase'
import TimelineBlock from '../components/timelineBlock';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import Metrics from '../Themes/Metrics';
import { globalStyles } from '../Themes/Styles';


export default class TimelineSheet extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: params.year + " Year",
    title: 'Timeline',
    }
};

  constructor(props) {
     super(props);
     this.state ={
       jedisSectioned: [{title: 'Jedis',data:[]}],
       refreshing: false,
       goalsArray: [],
       isModalVisible: false,
       goalText: '',
       year: '',
     }
     console.log("timeline " + JSON.stringify(props));
   }

   _keyExtractor = (item, index) => item.key;

   componentWillMount =async() => {
     await this.setState({ year: this.props.navigation.state.params.year});
     var goalsArrayRetrieved = await AsyncStorage.getItem(JSON.stringify(this.state.year));
     console.log("goals array retrieved " + goalsArrayRetrieved);
     console.log("type goals array pre " + typeof goalsArrayRetrieved);
     goalsArrayRetrieved = await JSON.parse(goalsArrayRetrieved);
     console.log("type goals array post " + typeof goalsArrayRetrieved);
     if ((goalsArrayRetrieved !== null) && (goalsArrayRetrieved.length !== 0)) {
       await this.setState({goalsArray: goalsArrayRetrieved});
   }
   await console.log("goals array state post " + this.state.goalsArray);
 }

 // componentWillUnmount =async() => {
 //   await AsyncStorage.removeItem(JSON.stringify(this.state.year));
 // }

   toggleModal = async() => {
     this.setState({isModalVisible: !this.state.isModalVisible});
   }

   onPressPushGoal = async() => {
     var goals = this.state.goalsArray;
     goals.push(this.state.goalText);
     await this.setState({ goalsArray: goals});
     console.log("goals array on push" + JSON.stringify(this.state.goalsArray));
     this.setState({isModalVisible: !this.state.isModalVisible});
   }

   onPressSaveGoals = async() => {
     console.log("goals array pre " + JSON.stringify(this.state.goalsArray));
     await AsyncStorage.setItem(JSON.stringify(this.state.year), JSON.stringify(this.state.goalsArray));
     var testArray = await AsyncStorage.getItem(JSON.stringify(this.state.year));
     console.log("goals array post " + JSON.stringify(testArray));
   }

   listItemRenderer =(item) => {
     return (
       <TimelineBlock
       jedi={item}/>
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
                    <Text></Text>
                    <Text></Text>
      </View>
        <FlatList
          data={this.state.goalsArray}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this.listItemRenderer}
        />
        <Feather
          onPress={()=> this.toggleModal()}
          name="plus-circle"
          size={Metrics.icons.medium}
          color={'#e0a8f7'}
        />
        <Button
          color='#e0a8f7'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
          title='Save'
          onPress={() => this.onPressSaveGoals()}/>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Modal
              isVisible={this.state.isModalVisible}
              onBackdropPress={() => this.setState({ isModalVisible: false })}
              backdropColor={'black'}>
              <View style={styles.modalView}>
              <Text style={styles.modalText}>

              </Text>
                <Text style={styles.modalText}>
                Ask a Question!
                </Text>
                <Text style={styles.modalText}>


                </Text>
                <TextInput style={globalStyles.defaultTextInput}
                   placeholder="Ex: When are the common app essays released?"
                   underlineColorAndroid="transparent"
                   multiline={true}
                   onChangeText={(text) => this.setState({goalText: text})}
                   onSubmitEditing={(text) => this.setState({goalText: text})}
                   />
               <Button
                 color='#e0a8f7'
                 buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                 title='Add'
                 onPress={() => this.onPressPushGoal()}/>
              </View>
          </Modal>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalView: {
    // width: Metrics.screenWidth,
    height: Metrics.screenHeight*.6,
    padding: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
