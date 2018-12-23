import React from 'react';
import { StyleSheet, TouchableOpacity, AsyncStorage, Button, TextInput, Alert, Dimensions, ScrollView } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Facebook } from 'expo';
import Modal from "react-native-modal";
import { ListItem, Slider, CheckBox, SearchBars } from 'react-native-elements'
import { WebBrowser } from 'expo';
import GenerateForm from 'react-native-form-builder';
import { View, Text } from 'native-base';
import { globalStyles } from '../Themes/Styles';
import { Input } from "native-base";

const {width, height} = Dimensions.get('window');

export default class Login extends React.Component {

  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
    this.state = {
      isQuestionModalVisible: true,
      isTopicModalVisible: false,
      postQuestionTopic : 'Select a Question Topic',
      question: '',
      userName: '',
      userPortal: '',
      profileImage: '',
    }
    //see what props App.js is constructed with:
    // console.log(JSON.stringify(props));
  }

  componentDidMount = async() => {
    this.checkIfUserLoggedIn();

    var userUID = firebase.auth().currentUser.uid;
    var name;
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
          that.setState({userName: name, userPortal: childData.portal, profileImage : childData.profilePicture},
             () => console.log("user portal in function " + that.state.userPortal));
        });
        if (that.state.profileImage == null) {
          that.setState({profileImage: Images.profile})
        }
      } else {
        console.log(" User is not signed in.");
      }
    });
  }

  onPressTopic = async () => {
    await this.setState({ isQuestionModalVisible: false });
    console.log("question modal " + this.state.isQuestionModalVisible);
    await this.setState({ isTopicModalVisible: true });
    console.log("topic modal " + this.state.isTopicModalVisible);
  }

  onPressAddQuestion = async () => {
    await this.setState({ isTopicModalVisible: false });
    console.log("topic modal " + this.state.isTopicModalVisible);
    await this.setState({ isQuestionModalVisible: true });
    console.log("question modal " + this.state.isQuestionModalVisible);
  }

  checkIfUserLoggedIn = async () => {
    var _this = this;
    var user = firebase.auth().currentUser;
    if (user) {
      // console.warn('user already logged in');
      await AsyncStorage.setItem("hasLoggedIn", "true");
    } else {
      // console.warn('Prompt log in');
      // _this.logInWithFacebook(); //Change this line to log in with email or use Facebook Login
    }
  }

  onPressPostQuestion = async() => {
    if ((this.state.postQuestionTopic !== 'Select a Question Topic') && (!this.state.question == '')) {
    await this.setState({ isQuestionModalVisible: false});

    console.log("question: ");
    await firebase.database().ref('forum').push({
        question: this.state.question,
        portalQuestion: this.state.userPortal,
        author: this.state.userName,
        topic: this.state.postQuestionTopic,
        profileImage : this.state.profileImage
      });
    } else {
      alert("Please choose the topic and fill the input.");
    }
  }

  onPressCollegeLife = async() => {
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'College Life'});
      await this.setState({isQuestionModalVisible: true});
  }

  onPressCollegeApplications = async() => {
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'College Applications'});
      await this.setState({isQuestionModalVisible: true});
  }

  onPressResources = async() => {
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'Resources'});
      await this.setState({isQuestionModalVisible: true});
  }

  onPressAllTopics = async() => {
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'All Topics'});
      await this.setState({isQuestionModalVisible: true});
  }


  render() {
    const { navigate } = this.props.navigation;

    if (this.state.isTopicModalVisible === true) {
      return (
        <View>
              <CheckBox
                center
                title="Ask a Question"
                iconRight
                iconType='material'
                checkedIcon='clear'
                uncheckedIcon='add'
                checkedColor='red'
                containerStyle={{width: Metrics.screenWidth*.95}}
                checked={this.state.checked}
                onPress={()=> this.onPressAddQuestion()}
              />
              <CheckBox
                center
                title={this.state.postQuestionTopic}
                iconRight
                iconType='material'
                checkedIcon='clear'
                uncheckedIcon='add'
                checkedColor='red'
                containerStyle={{width: Metrics.screenWidth*.95}}
                checked={this.state.checked}
                onPress={()=> this.onPressTopic()}/>
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
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='College Life'
                        onPress={() => this.onPressCollegeLife()}/>
                    <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='College Applications'
                        onPress={() => this.onPressCollegeApplications()}/>
                    <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='Resources'
                        onPress={() => this.onPressResources()}/>
                    <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='All Topics'
                        onPress={() => this.onPressAllTopics()}/>
                </View>
            </Modal>
            </View>

        </View>
      );
    } else {

      return (
        <View style={styles.container}>
              <CheckBox
                center
                title="Ask a Question"
                iconRight
                iconType='material'
                checkedIcon='clear'
                uncheckedIcon='add'
                checkedColor='red'
                containerStyle={{width: Metrics.screenWidth*.95}}
                checked={this.state.checked}
                onPress={()=> this.onPressAddQuestion()}
              />
              <CheckBox
                center
                title={this.state.postQuestionTopic}
                iconRight
                iconType='material'
                checkedIcon='clear'
                uncheckedIcon='add'
                checkedColor='red'
                containerStyle={{width: Metrics.screenWidth*.95}}
                checked={this.state.checked}
                onPress={()=> this.onPressTopic()}/>
                
                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Modal
                      isVisible={this.state.isQuestionModalVisible}
                      onBackdropPress={() => this.setState({ isQuestionModalVisible: false })}
                      backdropColor={'black'}
                      style={{ justifyContent: "flex-start", margin: 0}}>  
                      <View style={styles.modalViewQuestion}> 
                  
                        <View style={{flexDirection : 'row', marginTop : 10}}>
                          <Ionicons style={{ marginLeft: 15, fontWeight : 'bold'}}
                            name="ios-close-circle-outline"
                            size={Metrics.icons.medium}
                            color={'#c77ce8'}
                            onPress={() => this.setState({ isQuestionModalVisible: false })}
                          />
                          <View style={{flex : 1, alignItems: 'center', width : '100%'}}>
                            <Text style={styles.modalText}>
                            Ask a Question!
                            </Text>
                          </View>
                          <FontAwesome style={{ marginRight: 15, fontWeight : 'bold'}}
                            name="send"
                            size={Metrics.icons.medium}
                            color={'#c77ce8'}
                            onPress={() => this.onPressPostQuestion()}
                          />
                        </View>
                        <View 
                        // style={styles.modalViewQuestion}
                          style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            width: "100%"
                          }}
                        >
                        <Input style={{
                            flex: 1,
                            width: "100%",
                            fontSize: 20,
                            alignContent: "flex-start",
                            justifyContent: "flex-start",
                            textAlignVertical: "top",
                            margin: 12
                            }}
                          placeholder="Ex: When are the common app essays released?"
                          underlineColorAndroid="transparent"
                          multiline={true}
                          selectTextOnFocus={true}
                          spellCheck={true}
                          onChangeText={(text) => this.setState({question: text})}
                          onSubmitEditing={(text) => this.setState({question: text})}
                          />
                      </View> 
                      <View style={{flexDirection: "column", margin : 10}}>
                        <Button
                          titleStyle={{color : 'white', fontWeight: '700', fontSize: 25}}
                          buttonStyle={{borderRadius: 20, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#c77ce8'}}
                          title={this.state.postQuestionTopic}
                          onPress={() => this.onPressTopic()}/>
                        <Button
                          titleStyle={{color : 'white', fontWeight: '700', fontSize: 25}}
                          buttonStyle={{borderRadius: 20, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#c77ce8'}}
                          title="Post Question"
                          onPress={() => this.onPressPostQuestion()}/>
                      </View>
                    </View>
              </Modal>
              </View>
            </View>


      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.snow,
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
    height: 150,
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
    // width: Metrics.screenWidth*0.9,
    // height: Metrics.screenHeight * .3,
    flex: .5,
    borderStyle: 'solid',
    borderWidth: .5,
    marginTop: 10,
    // justifyContent: 'flex-end',
    // backgroundColor: 'white',
    marginTop: Metrics.screenWidth*.1,
    marginLeft: 20,
    marginRight: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"

  },
  modalText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: "flex-start",
    position : "absolute",
    // alignItems: "center",
    zIndex: 4,
    elevation: 4,
    width : Metrics.screenWidth,
    height: Metrics.screenHeight,
    marginTop: Expo.Constants.statusBarHeight / 2
  },
  icon: {
    marginLeft: 15,
  },
  footerIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  modalFooter: {
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    height: 54,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5
  },
});