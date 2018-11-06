import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SectionList, TextInput, FlatList,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Button, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import ResourceDataBlock from '../components/resourceDataBlock';
import { Card, ListItem, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';
import { WebBrowser } from 'expo';

const {width, height} = Dimensions.get('window');

const subject =
[
  {key: 'Calculus', link: 'https://www.khanacademy.org/test-prep/sat/full-length-sat-1', summary: '6:30 am', category:'Math'},
  {key: 'US History', link: 'https://uniontestprep.com/act', summary: '6:30 am', category: 'History'},
  {key: 'World History', link: 'https://members.reasonprep.com/courses/category/SAT', summary: '6:30 am', category: 'History'},
  {key: 'Chemistry', link: 'https://members.reasonprep.com/courses/category/ACT', summary: '6:30 am', category:'Science'},
  {key: 'Physics', link: 'https://www.khanacademy.org/test-prep/sat/full-length-sat-1', summary: '6:30 am', category: 'Science'},
  {key: 'Biology', link: 'https://www.khanacademy.org/test-prep/sat/full-length-sat-1', summary: '6:30 am', category: 'Science'},
  {key: 'General Study Resources', link: 'http://laptopstudy.com/200-most-useful-websites-for-college-students/', summary: '6:30 am', category: 'Study'},
]

/*
  Displays information about Jedi
*/
export default class CollegePrep extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'College Prep',
    title: 'College Prep',
    }
};


  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      loading: false,
      refreshing: false,
      searchText: '',
      hasLoggedIn: false,
      userName: '',
      portalQuestion: '',
      userPortal: '',
    }
    //see what props App.js is constructed with:
    // console.log(JSON.stringify(props));
  }

  async appendJedis(count, start) {

    // firebase.database().ref('forum').on('child_added', (snapshot) => {
    //   var childKey = snapshot.key;
    //   var childData = snapshot.val();
    //   childData.key = childKey;
    //   questionText = childData.question.toLowerCase();
    //   searchTextLowercase = this.state.searchText.toLowerCase();
    //   var jedisList = this.state.jedisSectioned[0].data.slice();
    //   console.log("current topic " + this.state.currentTopic);
    //   console.log("userPortal " + this.state.userPortal);
    //   // if (questionText.includes(searchTextLowercase) && (this.state.userPortal.toLowerCase() == childData.portalQuestion.toLowerCase())) {
    //   if ((questionText.includes(searchTextLowercase)) &&
    //   (this.state.userPortal.toLowerCase() == childData.portalQuestion.toLowerCase() || (this.state.userPortal == 'consultant'))) {
    //     if (this.state.currentTopic == "Select a Question Topic" || this.state.currentTopic == "All Topics") {
    //       jedisList.push(childData);
    //     } else if (childData.topic == this.state.currentTopic) {
    //       jedisList.push(childData);
    //     }
    //  }
    //   this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
    //   // console.log(childData);
    // });

    // console.log("jedis " + JSON.stringify(this.state.jedisSectioned));
    // this.state.jedisSectioned.forEach(function(element) {
    //   console.log("jedi " + element.value)
    // });
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
  //   this.props.navigation.setParams({ createQuestion: this.toggleQuestionModal });
  //
  //   var userUID = firebase.auth().currentUser.uid;
  //   var name;
  //   console.log("uid " + userUID);
  //   var that = this;
  //
  //   await firebase.auth().onAuthStateChanged(function(user) {
  //     if (user) {
  //       console.log(" User is signed in.");
  //       // console.log("name " + firebase.database().ref('users').child(userUID).child('name'));
  //       firebase.database().ref('users').child(userUID).on('value', function(snapshot) {
  //         var childKey = snapshot.key;
  //         var childData = snapshot.val();
  //         childData.key = childKey;
  //         name = childData.name;
  //         console.log("name " + name);
  //         console.log("portal " + childData.portal);
  //         that.setState({userName: name, userPortal: childData.portal},
  //            () => console.log("user portal in function " + that.state.userPortal));
  //       });
  //     } else {
  //       console.log(" User is not signed in.");
  //     }
  //   });
  //
  // await console.log("current user " + this.state.userName);
  // await console.log("current user portal " + this.state.userPortal);
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
      <ResourceDataBlock jedi={item}
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

 

  render() {

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);

  } else {
    return (
          <SafeAreaView style={styles.container}>
                <SearchBar
                  lightTheme
                  round
                  onChangeText={(searchText) => this.setState({searchText})}
                  onClearText={console.log('')}
                  onSubmitEditing={() => this.resetList()}
                  icon={{ type: 'font-awesome', name: 'search' }}
                  containerStyle={{width: Metrics.screenWidth*.95, marginTop: 20, marginBottom: 20}}
                  placeholder='Search For Item...'
                  />

                <FlatList
                  data={subject}
                  extraData={this.state}
                  keyExtractor={this._keyExtractor}
                  renderItem={this.listItemRenderer}
                />
          </SafeAreaView>
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
