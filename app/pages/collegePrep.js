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
      loading: false,
      refreshing: false,
      subject1 : [],
      searchText: '',
      hasLoggedIn: false,
      userName: '',
      userPortal: '',
    }
    //see what props App.js is constructed with:
    console.log(JSON.stringify(props));
  }

  componentWillMount = async() => {
    this.checkIfUserLoggedIn();
    this.setState({subject1 : subject});
  }


  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
   }



  listItemRenderer(item) {
    return (
      <ResourceDataBlock jedi={item}
      purchaseItem={this.purchaseItem}
      messageBlock={this.messageBlock}/>
    );
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({subject1 : subject.filter((item=>{return item.key.toLowerCase().search(this.state.searchText.toLowerCase())!==-1;}))});
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
                  data={this.state.subject1}
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
