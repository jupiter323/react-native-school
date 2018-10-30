import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { material } from 'react-native-typography';
import { Entypo } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import LoggedOut from '../components/loggedOutScreen';

export default class MessagesList extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const {navigate} = navigation;
    return {
      headerTitle: 'Messages',
      headerLeft: (
        <Feather style={styles.icon}
          name="menu"
          size={Metrics.icons.medium}
          color={'#c77ce8'}
          onPress={() => navigate('DrawerToggle')}
        />
        )
    };
  };

  state = {
    text: "",
    rooms: [],
    sellerName: '',
    sellerId: '',
    refreshing: false,
    hasLoggedIn: false,
  }

  componentWillMount() {
    // firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('rooms').on('child_added', (snapshot) => {
    //     var childKey = snapshot.key;
    //     // console.log("messages list key:" + JSON.stringify(childKey));
    //     var childData = snapshot.val();
    //     childData.key = childKey;
    //     var list = this.state.rooms.slice();
    //     list.push(childData);
    //     this.setState({rooms: list});
    //     // console.log("child data: " + childData);
    // });
    this.checkIfUserLoggedIn();
    this.resetList();
  }

  async componentDidMount() {
    // console.log("passing item test: " + this.props.navigation.state.params.item.seller);
    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.item.id !== undefined) {
        await this.setState({sellerName: this.props.navigation.state.params.item.seller, sellerId: this.props.navigation.state.params.item.id});
      }
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


  onProfileRequested = (username) => {
    const { navigate } = this.props.navigation;

    navigate('UserProfileScreen', { username: username });
    console.log("Requested: " + username);
  }

  _renderItem = ({item}) => {
    // console.log(item);
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('MessagesScreen', {name: item.roomName, key: item.key})}>
        <View style={[styles.addChatContainer,{borderTopWidth: 0, borderBottomWidth: 1}]}>
          <Text style={material.subheading}> {item.roomName} </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => item.key;


//its not pushing rooms to the firebase database.

  resetList = async () => {
    await this.setState({refreshing: true, rooms: []});
    firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('rooms').on('child_added', (snapshot) => {
        var childKey = snapshot.key;
        var childData = snapshot.val();
        childData.key = childKey;
        var list = this.state.rooms.slice();
        list.push(childData);
        this.setState({rooms: list});
        // console.log("child data: " + childData);
    });
    this.setState({refreshing: false});
  }

  // if (this.state.rooms.length === 0) {
  //   return (
  //     <View style={styles.messagesContainer}>
  //       <Text>You Have No Messages. Message Some Sellers!</Text>
  //     </View>
  //   )
  // } else {
  // }

    render() {

      if (!this.state.hasLoggedIn) {
          return (<LoggedOut/>);
      } else {
      return (
          <FlatList
            data={this.state.rooms}
            renderItem={this._renderItem}
            style={styles.container}
            onRefresh = {() => this.resetList()}
            refreshing = {this.state.refreshing}
            keyExtractor={this._keyExtractor}/>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#c77ce8',
  },
  messagesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c77ce8',
  },
  addChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    borderTopWidth: Metrics.horizontalLineHeight,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical,
    height: 80,
  },
  newRoom: {
    borderBottomWidth: .5,
    flex: 2,
    borderBottomColor: 'gray',
    marginRight: Metrics.marginHorizontal,
  },
  listItem: {

  },
  icon: {
    marginLeft: 15,
  }
});
