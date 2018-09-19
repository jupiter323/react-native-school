import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import email from 'react-native-email';
import { Button } from 'react-native-elements';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Stripe from 'firebase';


export default class Feedback extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const {navigate} =  navigation;
    return {
    headerTitle: 'Feedback',
    headerLeft: (
      <Feather style={styles.icon}
        name="menu"
        size={Metrics.icons.medium}
        color={'lightblue'}
        onPress={() => navigate('DrawerToggle')}
      />
      )
    }
  };

    render() {
        return (
            <View style={styles.container}>
              <View style={styles.feedbackBox}>
              <Text style={styles.textStyles}>Here at MoveItMoveIt, we love to improve. Your input can help us do that. :)</Text>
                  <Button
                  title="Give Feedback"
                  onPress={this.handleEmail}
                  backgroundColor="skyblue"/>
                </View>
            </View>
        )
    }

    // handleEmail = () => {
    //     const to = ['moveitmoveitco@gmail.com'] // string or array of email addresses
    //     email(to, {
    //         subject: 'How to Improve',
    //         body: 'You guys should...'
    //     }).catch(console.error)
    // }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'powderblue',
      alignItems: 'center',
      justifyContent: 'center'
    },
    feedbackBox: {
      width: Metrics.screenWidth*.9,
      height: Metrics.screenHeight*.2,
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
      // color: 'white',
    },
    icon: {
      marginLeft: 15,
    }
})
