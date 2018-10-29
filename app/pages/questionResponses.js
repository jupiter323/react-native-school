import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, AsyncStorage, SectionList, TextInput, Button } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import AnswerBlock from '../components/answerBlock';
import Modal from "react-native-modal";


/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class QuestionResponses extends React.Component {


  static navigationOptions = {
    headerTitle: 'Responses',
  };

  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      profileName: '',
      profileImage : '',
      userID: firebase.auth().currentUser.uid,
      loading: false,
      refreshing: false,
      question: '',
      topic : '',
      answer: '',
      isAnswerModalVisible: false,
      key: '',
      userName: '',
    }
    // console.log("props QuestionResponsesScreen " + JSON.stringify(props));
  }

  componentWillMount= async() => {

  var userUID = firebase.auth().currentUser.uid;
  var name;
  // console.log("uid " + userUID);
  var that = this;

  await firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(" User is signed in.");
      // console.log("name " + firebase.database().ref('users').child(userUID).child('name'));
      firebase.database().ref('users').child(userUID).on('value', function(snapshot) {
        var childKey = snapshot.key;
        var childData = snapshot.val();
        childData.key = childKey;
        name = childData.name;
        that.setState({ userName: name, profileImage : childData.profilePicture});
      });
    } else {
      console.log(" User is not signed in.");
    }
  });
  item = this.props.navigation.state.params.item;

  // console.log("QuestionResponsesScreen item " + JSON.stringify(this.props.navigation.state.params.item));
  // console.log("QuestionResponsesScreen key " + JSON.stringify(this.props.navigation.state.params.item.key));
  await this.setState({profileName: item.author, profileImage : item.profileImage, question: item.question, topic : item.topic, key: this.props.navigation.state.params.item.key });
  // console.log("question key " + this.state.key);
  this.appendJedis(3,1);
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

  async appendJedis(count, start) {

    await this.setState({loading : true, refreshing: true});
    var jedisList = this.state.jedisSectioned[0].data.slice();
    await firebase.database().ref('forum').child(this.state.key).child('answers').on('child_added', async(snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      // questionText = childData.question.toLowerCase();
      // searchTextLowercase = this.state.searchText.toLowerCase();
      // if (questionText.includes(searchTextLowercase)) {
        // if (this.state.currentTopic == "Select a Question Topic" || this.state.currentTopic == "All Topics") {
      await jedisList.push(childData);
        // } else if (childData.topic == this.state.currentTopic) {
        //   jedisList.push(childData);
        // }
    // }
    });

    jedisList.sort(function(a,b) { 
      if(a.totalUpvotes == b.totalUpvotes) return 0;
      var direction = 1;
      return b.totalUpvotes>a.totalUpvotes?direction:-direction;
    });
    console.log("result : " + JSON.stringify(jedisList));
    await this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});

  }

  listItemRenderer(item) {
    return (
      <AnswerBlock
      jedi={item}
      forumLocation={this.state.key}
      purchaseItem={this.purchaseItem}
      messageBlock={this.messageBlock}/>
    );
  }

  purchaseItem= async (item) => {
    this.props.navigation.navigate('AnswerScreen', {item: item, question: this.state.question, topic : this.state.topic});
  }
  resetList = async () => {
    await this.setState({refreshing: true, jedisSectioned: [{title: 'Jedis', data:[]}]});
    this.appendJedis(3,1);
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({loading: true});
      await this.appendJedis(count,start);
    }
  }

  onPressAnswerQuestion() {
    console.log("pressed answer");
    this.setState({ isAnswerModalVisible: true});
  }

  onPressPostAnswer = async() => {
    console.log("pressed answer");
    console.log("author " + JSON.stringify(firebase.auth().currentUser));
    await firebase.database().ref('forum').child(this.state.key).child('answers').push({
        answer: this.state.answer,
        author: this.state.userName,
        downvotes : 0,
        totalUpvotes : 0,
        upvotes : 0,
        profileImage : '',
      });
    this.setState({ isAnswerModalVisible: false});
  }

  myImageButton() {
    if(this.state.profileImage){
      return(
        <Avatar
          size="large"
          source={{uri : this.state.profileImage}}
          activeOpacity={0.7}
          rounded
        />
      );
    } else {
      return(
        <Avatar
          size="large"
          source={Images.profile}
          activeOpacity={0.7}
          rounded
        />);
    }
  }
  _keyExtractor = (item, index) => index;

  render() {

    return (
        <View style={styles.container}>
          <Card style={styles.card}>
              <View style={{flexDirection : 'row', marginBottom : 15}}>
                {this.myImageButton()}
                <Text style={{lineHeight : 30, fontSize :15, marginLeft: 20, fontWeight : '200'}}>
                {this.state.profileName}
                </Text>
              </View>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 18, marginLeft : 15, fontWeight: 'bold'}}>{this.state.question}</Text>
              </View>
              <View style={{marginBottom: 15}}>
                <Text style={{fontSize: 13, marginLeft : 15, color : '#888'}}>Topic : {this.state.topic}</Text>
              </View>
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                title='Answer'
                onPress={() => this.onPressAnswerQuestion()}/>
              </Card>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Modal
                  isVisible={this.state.isAnswerModalVisible}
                  onBackdropPress={() => this.setState({ isAnswerModalVisible: false })}
                  backdropColor={'black'}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                    Ask a Question!
                    </Text>
                    <Text style={styles.modalText}>

                    </Text>
                    <TextInput style={styles.inputText}
                       placeholder="No, you shouldn't wait till the last minute to write your common app essay"
                       underlineColorAndroid="transparent"
                       multiline={true}
                       onChangeText={(text) => this.setState({answer: text})}
                       onSubmitEditing={(text) => this.setState({answer: text})}
                       />
                   <Button
                     color='#9B59B6'
                     buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                     title='Post'
                     onPress={() => this.onPressPostAnswer()}/>
                   <Button
                     color='#9B59B6'
                     buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                     title='Cancel'
                     onPress={() => this.setState({ isAnswerModalVisible: false})}/>
                  </View>
              </Modal>
            </View>

            <View style={styles.itemList}>
              <SectionList
                sections={this.state.jedisSectioned}
                // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                renderItem={({item}) => this.listItemRenderer(item)}
                ItemSeparatorComponent = {() => (<View style={{height: 10}}/>)}
                keyExtractor={this._keyExtractor}
                contentContainerStyle = {{alignItems: 'center'}}
                onRefresh = {() => this.resetList()}
                refreshing = {this.state.refreshing}
                removeClippedSubviews = {true}
              />
              </View>
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
  itemList: {
    height: Metrics.screenHeight*.65,
    width: Metrics.screenWidth,
    paddingTop: 10
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
  modalView: {
    // width: Metrics.screenWidth,
    height: Metrics.screenHeight*.6,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
