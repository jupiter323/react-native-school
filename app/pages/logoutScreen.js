import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';





export default class Logout extends React.Component {

  static navigationOptions = {
     title: 'Logout',
   };

    onPressLogout = async() => {
      await AsyncStorage.setItem("hasLoggedIn", "false");
      const logoutCheck = await AsyncStorage.getItem("hasLoggedIn");
      console.log("hasLoggedOut" + logoutCheck);
      console.log("jimmmmmmmmm");
      await firebase.auth().signOut();
      this.props.navigation.navigate('Home');
    }

    render() {
      const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
              <View style={styles.feedbackBox}>
              <Text style={styles.textStyles}>Here at MoveItMoveIt, we appreciate your usage of the app. </Text>

              <View style={styles.buttonsRow}>


                <View>
                  <Button
                  title="Logout"
                  onPress={() => this.onPressLogout()}
                  color="#5A3DC9"/>
                </View>

              </View>

                </View>
            </View>
        );
    }
  }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5A3DC9',
      alignItems: 'center',
      justifyContent: 'center'
    },
    feedbackBox: {
      width: Metrics.screenWidth*.9,
      height: Metrics.screenHeight*.3,
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 10,
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderTopLeftRadius: Metrics.screenWidth*.05,
      borderTopRightRadius: Metrics.screenWidth*.05,
      borderBottomLeftRadius: Metrics.screenWidth*.05,
      borderBottomRightRadius: Metrics.screenWidth*.05,
      backgroundColor: 'white',
    },
    textStyles: {
      fontStyle: 'italic',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: 20,
      // color: 'white',
    },
    logoutButton: {
      width: Metrics.screenWidth*.7,
      height: Metrics.screenHeight*.05,
      borderWidth: 1,
      marginBottom: 55,
      backgroundColor: '#5A3DC9',
      alignItems: 'center',
      justifyContent: 'center',
    },
})
