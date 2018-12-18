import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import Modal from "react-native-modal";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ListItem, Slider, CheckBox, SearchBar, Button } from 'react-native-elements'
import Images from '../Themes/Images';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import { Input
} from "native-base";

export default class AddQuestionScreen extends React.Component {
    
  static navigationOptions = {
    headerTitle: 'Ask a Question',
  };

  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.uid,
      question: '',
      postQuestionTopic : 'Select a Question Topic',
      isQuestionModalVisible: true,
      isTopicModalVisible: true,
      userPortal: '',
      userName: '',
      profileImage: '',
    }
  
  }


  componentWillMount = async() => {
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
      } else {
        console.log(" User is not signed in.");
      }
    });

    await console.log("current user " + this.state.userName);
    await console.log("current user portal " + this.state.userPortal);

  }

  onPressTopic = async() => {
    await this.setState({isQuestionModalVisible: false});
    console.log("question modal " + this.state.isQuestionModalVisible);
    this.setState({isPostTopic : false});
    await this.setState({isTopicModalVisible: true});
    console.log("topic modal " + this.state.isTopicModalVisible);
}

  onPressPostQuestion = async() => {
    if ((this.state.postQuestionTopic !== 'Select a Question Topic') && (!this.state.question == '')) {
    await this.setState({ isQuestionModalVisible: false});

    await firebase.database().ref('forum').push({
        question: this.state.question,
        portalQuestion: this.state.userPortal,
        author: this.state.userName,
        topic: this.state.postQuestionTopic,
        profileImage : this.state.profileImage,
      });
    } else {
      alert("Please choose the topic and fill the input.");
    }
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
    }
   }

    render() {
        if (this.state.isQuestionModalVisible === true) {
        return( 
            <View style={styles.container}>
               <KeyboardAvoidingView style={{flex : 1}}>
                      <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <Modal
                            isVisible={this.state.isQuestionModalVisible}
                            onBackdropPress={() => this.setState({ isQuestionModalVisible: false })}
                            backdropColor={'black'}>   
                            <View
                              style={styles.modalViewQuestion}
                            >    
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
                            <View style={{flexDirection: "row", margin : 10}}>
                              <Button
                                titleStyle={{color : 'white', fontWeight: '700', fontSize: 25}}
                                buttonStyle={{borderRadius: 20, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#c77ce8'}}
                                title={this.state.postQuestionTopic}
                                onPress={() => this.onPressTopic()}/>
                            </View>
                        </View>                         
                          
                    </Modal>
                  </View>
                  </KeyboardAvoidingView>
            </View>
        );
         } else {
            return(
                <View>
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
            )
        }
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding : 20,
      backgroundColor : 'white'
      // alignItems: 'center',
    },

    textStyles: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 15,
    },
    buttonPressed: {
    color: '#999999'
    },
    buttonNotPressed: {
    color: '#c77ce8'
    },
    modalViewQuestion: {
        width: Metrics.screenWidth*0.9,
        height: Metrics.screenHeight * .6,
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
        fontSize: 25,
        fontWeight: 'bold',
      },
});