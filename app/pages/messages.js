import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, KeyboardAvoidingView, AlertIOS, Keyboard } from 'react-native';
import { material } from 'react-native-typography';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';


export default class Messages extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: params.name,
    };
  };

  state = {
    text: "",
    rooms: [],
    name: '',
    key: '',
  }

  proceedWithName = async (name) => {
    this.setState({name});
    var params = this.props.navigation.state.params;
    // if (params.key) {
      await this.setState({key: params.key});
    // }
    firebase.database().ref('convos').child(this.state.key).on('child_added', (snapshot) => {
        var childKey = snapshot.key;
        var childData = snapshot.val();
        childData.key = childKey;
        var list = this.state.rooms.slice();
        list.push(childData);
        this.setState({rooms: list});
        console.log(childData);
    });
  }

  getUserName = async () => {
    var user = firebase.auth().currentUser;
    var nameUser = user.displayName;
    await this.setState({name: nameUser});
    await this.proceedWithName(nameUser);
  }

  componentWillMount() {
    this.getUserName();
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    firebase.database().ref('convos').child(this.state.key).off();
    // this.keyboardDidShowListener.remove();
    // this.keyboardDidHideListener.remove();
  }

  send = () => {
    var roomsList = firebase.database().ref('convos').child(this.state.key).push();
    roomsList.set({
      message: this.state.text,
      sender: this.state.name //userID
    });

    firebase.database().ref('rooms').child(this.state.key).child("count").transaction(function(currentCount) {
      return currentCount + 1;
    }).then(() => this.setState({text: ""}));
  }

  _keyboardDidShow () {
    // this.scrollView.scrollToEnd();
}

_keyboardDidHide () {
  // alert('Keyboard Hidden');
}

  _renderItem = ({item}) => {
    if (item.sender === this.state.name) {
    const additionalStyle = {justifyContent: 'flex-end', marginRight: Metrics.doubleBaseMargin, marginLeft: Metrics.doubleBaseMargin*2}
    return (
      <View style={[{flexDirection: 'row', marginTop: Metrics.marginVertical},additionalStyle]}>
        <View style={{flexDirection: 'column'}}>
          <Text> {item.sender} </Text>
          <View style={styles.chatBubbleSender}>
            <Text style={[material.subheading,{color: Colors.silver}]}> {item.message} </Text>
          </View>
        </View>
      </View>
    )
   } else {
     const additionalStyle = {justifyContent: 'flex-start', marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin*2};
     return (
       <View style={[{flexDirection: 'row', marginTop: Metrics.marginVertical},additionalStyle]}>
         <View style={{flexDirection: 'column'}}>
           <Text> {item.sender} </Text>
           <View style={styles.chatBubbleReceiver}>
             <Text style={[material.subheading,{color: Colors.silver}]}> {item.message} </Text>
           </View>
         </View>
       </View>
     )
   }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
        behavior={"padding"}
        keyboardVerticalOffset={Metrics.keyboardOffset}>
            <FlatList
              ref={ ( ref ) => this.scrollView = ref }
              data={this.state.rooms}
              renderItem={this._renderItem}
              style={styles.container}
              />
            <View style={styles.sendChatContainer}>
              <TextInput
                style={styles.newRoom}
                value={this.state.text}
                onChangeText={(text) => this.setState({text})}
                placeholder="Type Message Here..."/>
              <Button
                title="Send"
                onPress={this.send}/>
            </View>
          </KeyboardAvoidingView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sendChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    borderTopWidth: Metrics.horizontalLineHeight,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical,
    height: Metrics.messageInputHeight,
  },
  newRoom: {
    // borderBottomWidth: Metrics.horizontalLineHeight,
    flex: 1,
    borderBottomColor: Colors.border,
    marginRight: Metrics.marginHorizontal
  },
  chatBubbleSender: {
    paddingLeft: Metrics.marginVertical,
    paddingRight: Metrics.marginVertical,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical,
    borderRadius: Metrics.marginVertical,
    backgroundColor: Colors.turquoise,
  },
  chatBubbleReceiver: {
    paddingLeft: Metrics.marginVertical,
    paddingRight: Metrics.marginVertical,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical,
    borderRadius: Metrics.marginVertical,
    backgroundColor: 'lightgray',
  },
});
