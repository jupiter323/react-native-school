import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SectionList, TextInput,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import QuestionBlock from '../components/questionBlock';
import { Card, ListItem, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';

const {width, height} = Dimensions.get('window');

/*
  Displays information about Jedi
*/
export default class Forum extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Forum',
    title: 'Forum',
    headerLeft: (
      <Feather style={{ marginLeft: 15}}
        name="menu"
        size={Metrics.icons.medium}
        color={'#5A3DC9'}
        onPress={() => navigate('DrawerToggle')}
      />
    ),
    headerRight: (
      <Feather style={{ marginRight: 15}}
        name="plus-circle"
        size={Metrics.icons.medium}
        color={'#5A3DC9'}
        onPress={params.createQuestion}
      />
    ),
    }
};


  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      buttonText: 'Show me your ID Card!',
      loading: false,
      refreshing: false,
      price: 140,
      description: '',
      searchText: '',
      isTopicModalVisible: false,
      isQuestionModalVisible: false,
      currentTopic: 'Select a Question Topic',
      hasLoggedIn: false,
      question: '',
      userName: '',
      portalQuestion: '',
      userPortal: '',
    }
    //see what props App.js is constructed with:
    // console.log(JSON.stringify(props));
  }

  async appendJedis(count, start) {

    firebase.database().ref('forum').on('child_added', (snapshot) => {
    var childKey = snapshot.key;
    var childData = snapshot.val();
    childData.key = childKey;
    questionText = childData.question.toLowerCase();
    searchTextLowercase = this.state.searchText.toLowerCase();
    var jedisList = this.state.jedisSectioned[0].data.slice();
    console.log("current topic " + this.state.currentTopic);
    console.log("userPortal " + this.state.userPortal);
    // if (questionText.includes(searchTextLowercase) && (this.state.userPortal.toLowerCase() == childData.portalQuestion.toLowerCase())) {
    if (questionText.includes(searchTextLowercase)) {
    //   &&
    // (this.state.userPortal.toLowerCase() == childData.portalQuestion.toLowerCase() || (this.state.userPortal == 'consultant'))) {
      if (this.state.currentTopic == "Select a Question Topic" || this.state.currentTopic == "All Topics") {
        jedisList.push(childData);
      } else if (childData.topic == this.state.currentTopic) {
        jedisList.push(childData);
      }
  }
    this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
    // console.log(childData);
});

  console.log("jedis " + JSON.stringify(this.state.jedisSectioned));
  this.state.jedisSectioned.forEach(function(element) {
    console.log("jedi " + element.value)
  });
    // var jedisList = this.state.jedisSectioned[0].data.slice();
    // this.setState({loading: true});
    // for(i=start; i < count+start; i++) {
    //   await this.getJedi(i, jedisList);
    // }
    // this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
    //do i need a for loop right here to check to see if there are duplicate values
  }

  componentWillMount = async() => {
    this.checkIfUserLoggedIn();
    this.props.navigation.setParams({ createQuestion: this.toggleQuestionModal });

    var userUID = firebase.auth().currentUser.uid;
    var name;
    console.log("uid " + userUID);
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
          console.log("name " + name);
          console.log("portal " + childData.portal);
          that.setState({userName: name, userPortal: childData.portal},
             () => console.log("user portal in function " + that.state.userPortal));
        });
      } else {
        console.log(" User is not signed in.");
      }
    });

  await console.log("current user " + this.state.userName);
  await console.log("current user portal " + this.state.userPortal);
  this.appendJedis(3,1);

  }

  onPressPostQuestion = async() => {
    if ((this.state.currentTopic !== 'Select a Question Topic') && (!this.state.question == '')) {
    await this.setState({ isQuestionModalVisible: false});

    await firebase.database().ref('forum').push({
        question: this.state.question,
        portalQuestion: this.state.userPortal,
        author: this.state.userName,
        topic: this.state.currentTopic,
      });
    } else {
      alert("Please Fill in All Categories");
    }
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
   }

  toggleTopicModal = async() => {
    await this.setState({isTopicModalVisible: true});
    console.log("topic " + this.state.isTopicModalVisible);
  }


  toggleQuestionModal = async() => {
    this.setState({isQuestionModalVisible: !this.state.isQuestionModalVisible});
  }

  onPressTopic = async() => {
    await this.setState({isQuestionModalVisible: false});
    console.log("question modal " + this.state.isQuestionModalVisible);
    await this.setState({isTopicModalVisible: true});
    console.log("topic modal " + this.state.isTopicModalVisible);
  }

  listItemRenderer(item) {
    return (
      <QuestionBlock jedi={item}
      purchaseItem={this.purchaseItem}
      messageBlock={this.messageBlock}/>
    );
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({loading: true});
      await this.appendJedis(count,start);
    }
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({refreshing: true, jedisSectioned: [{title: 'Jedis', data:[]}]});
    this.appendJedis(3,1);
  }

  onPressCollegeLife = async() => {
    await this.setState({ isTopicModalVisible: false, currentTopic: 'College Life'});
    console.log(this.state.currentTopic);

    this.resetList();
  }

  onPressCollegeApplications = async() => {
    await this.setState({ isTopicModalVisible: false, currentTopic: 'College Applications'});
    console.log(this.state.currentTopic);

    this.resetList();
  }

  onPressResources = async() => {
    await this.setState({ isTopicModalVisible: false, currentTopic: 'Resources'});
    console.log(this.state.currentTopic);

    this.resetList();
  }

  onPressAllTopics = async() => {
    await this.setState({ isTopicModalVisible: false, currentTopic: 'All Topics'});
    console.log(this.state.currentTopic);

    this.resetList();
  }

  purchaseItem= async (item) => {
    this.props.navigation.navigate('QuestionResponsesScreen', {item: item});
  }

  messageBlock= async (key) => {
    this.props.navigation.navigate('MessagesScreen', {key: key});
  }

  render() {

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else if (this.state.isQuestionModalVisible == true) {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>

                <View style={styles.purchaseBox}>

                <SearchBar
                  lightTheme
                  round
                  onChangeText={(searchText) => this.setState({searchText})}
                  onClearText={console.log('')}
                  onSubmitEditing={() => this.resetList()}
                  icon={{ type: 'font-awesome', name: 'search' }}
                  containerStyle={{width: Metrics.screenWidth*.95, marginBottom: 10}}
                  placeholder='Search For Item...'
                  />

                    <CheckBox
                      center
                      title={this.state.currentTopic}
                      iconRight
                      iconType='material'
                      checkedIcon='clear'
                      uncheckedIcon='add'
                      checkedColor='red'
                      containerStyle={{width: Metrics.screenWidth*.95}}
                      checked={this.state.checked}
                      onPress={()=> this.onPressTopic()}
                    />

                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Modal
                        isVisible={this.state.isQuestionModalVisible}
                        onBackdropPress={() => this.setState({ isQuestionModalVisible: false })}
                        backdropColor={'black'}>
                        <View style={styles.modalViewQuestion}>
                        <Text style={styles.modalText}>

                        </Text>
                          <Text style={styles.modalText}>
                          Ask a Question!
                          </Text>
                          <Text style={styles.modalText}>


                          </Text>
                          <TextInput style={styles.inputText}
                             placeholder="Ex: When are the common app essays released?"
                             underlineColorAndroid="transparent"
                             multiline={true}
                             onChangeText={(text) => this.setState({question: text})}
                             onSubmitEditing={(text) => this.setState({question: text})}
                             />
                         <Button
                           color='#5A3DC9'
                           buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                           title={this.state.currentTopic}
                           onPress={() => this.onPressTopic()}/>
                         <Button
                           color='#5A3DC9'
                           buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                           title='Post'
                           onPress={() => this.onPressPostQuestion()}/>
                        </View>
                    </Modal>
                  </View>

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
                    ListFooterComponent = {<ActivityIndicator />}
                  />
                </View>
          </View>
      </TouchableWithoutFeedback>
    );

  } else {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>

                <View style={styles.purchaseBox}>

                <SearchBar
                  lightTheme
                  round
                  onChangeText={(searchText) => this.setState({searchText})}
                  onClearText={console.log('')}
                  onSubmitEditing={() => this.resetList()}
                  icon={{ type: 'font-awesome', name: 'search' }}
                  containerStyle={{width: Metrics.screenWidth*.95, marginBottom: 10}}
                  placeholder='Search For Item...'
                  />

                    <CheckBox
                      center
                      title={this.state.currentTopic}
                      iconRight
                      iconType='material'
                      checkedIcon='clear'
                      uncheckedIcon='add'
                      checkedColor='red'
                      containerStyle={{width: Metrics.screenWidth*.95}}
                      checked={this.state.checked}
                      onPress={()=> this.onPressTopic()}
                    />

                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Modal
                        isVisible={this.state.isTopicModalVisible}
                        onBackdropPress={() => this.setState({ isTopicModalVisible: false })}
                        backdropColor={'black'}>
                        <View style={styles.modalViewTopic}>
                          <Text style={styles.modalText}>
                          Pick a Category!
                          </Text>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='College Life'
                              onPress={() => this.onPressCollegeLife()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='College Applications'
                              onPress={() => this.onPressCollegeApplications()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='Resources'
                              onPress={() => this.onPressResources()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='All Topics'
                              onPress={() => this.onPressAllTopics()}/>
                        </View>
                    </Modal>
                  </View>

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
                    ListFooterComponent = {<ActivityIndicator />}
                  />
                </View>
          </View>
      </TouchableWithoutFeedback>
    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    backgroundColor: Colors.snow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    width: width,
    backgroundColor: "#ff8080",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    color: 'white',
    fontSize: 24
  },
  purchaseBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 200,
    width: Metrics.width*.9,
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemList: {
  height: Metrics.screenHeight*.6,
  width: Metrics.screenWidth,
  paddingTop: 10,
},
modalViewTopic: {
  // width: Metrics.screenWidth,
  height: Metrics.screenHeight*.6,
  borderStyle: 'solid',
  borderWidth: .5,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  borderBottomLeftRadius: 15,
  borderBottomRightRadius: 15,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
},
modalViewQuestion: {
  // width: Metrics.screenWidth,
  height: Metrics.screenHeight*.6,
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
modalText: {
  fontSize: 24,
  fontWeight: 'bold',
},
icon: {
  marginLeft: 15,
}
});
