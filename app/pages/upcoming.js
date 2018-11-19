import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SectionList, TextInput, KeyboardAvoidingView,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, AsyncStorage } from 'react-native';

import { Card, Avatar } from 'react-native-elements'
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons';
import UpcomingBlock from '../components/upcomingBlock'
import Metrics from '../Themes/Metrics';
import * as Expo from "expo";
import LoggedOut from '../components/loggedOutScreen';
export default class UpcomingScreen extends React.Component {

    static navigationOptions = {
        headerTitle: 'Upcoming Appointments',
        title: 'Upcoming Appointments',
    };
    constructor(props) {
        super(props);
        this.state = {
            portal : '',
            loading : false,
            refreshing : false,
            userId : '',
            upcomingApts: [{title: 'upcoming',data:[]}],
            hasLoggedIn: false,
        }
    }


    componentWillMount= async() => {
        await this.checkIfUserLoggedIn();
        var userUID = firebase.auth().currentUser.uid;
        var that = this;
        await firebase.auth().onAuthStateChanged(async function(user) {
          if (user) {
            console.log(" User is signed in.");
            // console.log("name " + firebase.database().ref('users').child(userUID).child('name'));
            await firebase.database().ref('users').child(userUID).on('value', async function(snapshot) {
              var childKey = snapshot.key;
              var childData = snapshot.val();
              childData.key = childKey;
              console.log("portal1 : " + childData.portal);
              await that.setState({portal: childData.portal});
              that.appendUpcoming(3,1);
            //   that.setState({ userName: name, profileImage : childData.profilePicture});
            });
          } else {
            console.log(" User is not signed in.");
          }
        });

    }
    checkIfUserLoggedIn = async() => {
        const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
        if (loginCheck === "true") {
          await this.setState({hasLoggedIn: true});
          await this.setState({userId : firebase.auth().currentUser.uid})
          console.log("hasLoggedIn" + this.state.hasLoggedIn);
          console.log("metroooooooo");
        }
    }

    async appendUpcoming(count, start) {

        await this.setState({loading:true, refreshing : true});

        await firebase.database().ref('appointments').on('child_added', async(snapshot) => {
            var childKey = snapshot.key;
            var childData = snapshot.val();
            childData.key = childKey;
            var upcomingList = this.state.upcomingApts[0].data.slice();
            if(this.state.portal == 'student'){
                if(this.state.userId == childData.studentID) {
                    console.log("studentId : " + childData.studentID + " currentID : " + this.state.userId);
                    upcomingList.push(childData);
                }
            } else {
                if(this.state.userId == childData.consultantID){
                    upcomingList.push(childData);
                }
            }
            await this.setState({loading: false, refreshing: false, upcomingApts: [{title: 'upcoming', data:upcomingList}]});
        })

        console.log("result " +  JSON.stringify(this.state.upcomingApts))
        console.log("loading : " + this.state.loading);

        // console.log(childData);
    };


    _keyExtractor = (item, index) => index;
    resetList = async () => {
        await this.setState({refreshing: true, jedisSectioned: [{title: 'upcoming', data:[]}]});
        this.appendUpcoming(3,1);
    }
    listItemRenderer(item) {
        return (
          <UpcomingBlock upcoming={item}
            portal={this.state.portal}/>
        );
    }
    // renderItem = (row) =>{
    //     return(
    //         <View style={styles.cardView}>
    //             <Card>
    //                 <View style={{flexDirection : 'row'}}>
    //                     {/* {this.imageButton()} */}
    //                     <View style={{flexDirection : 'column'}}>
    //                         <Text style={{fontSize : 15, marginLeft :20, fontWeight : '200'}}>{row.item.profileName}</Text>
    //                         <Text style={{fontSize : 13, marginLeft :20}}>{row.item.startTime} - {row.item.endTime}</Text>
    //                     </View>
    //                 </View>
    //             </Card>
    //         </View>
    //     )
    // }
    render() {

        if (!this.state.hasLoggedIn) {
            return (<LoggedOut/>);
        } else {

            return(
                <View style={styles.container}>
                    <View style={styles.itemList}>
                    <SectionList
                    sections={this.state.upcomingApts}
                    // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                    renderItem={({item}) => this.listItemRenderer(item)}
                    // renderItem={this.renderItem}
                    ItemSeparatorComponent = {() => (<View style={{height: 10}}/>)}
                    keyExtractor={this._keyExtractor}
                    contentContainerStyle = {{alignItems: 'center'}}
                    onRefresh = {() => this.resetList()}
                    refreshing = {this.state.refreshing}
                    removeClippedSubviews = {true}
                    />
                </View>
                </View>

        )
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.snow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemList: {
        height: Metrics.screenHeight*.9,
        width: Metrics.screenWidth,
        paddingTop: 10,
    },
    cardView: {
        width: Metrics.screenWidth,
        borderRadius: Metrics.buttonRadius,
      },
});
