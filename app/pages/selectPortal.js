import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView  } from 'react-native';
import PropTypes from 'prop-types';

import { Button } from 'react-native-elements'
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Onboarding from 'react-native-onboarding-swiper';

export default class OnboardingScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
  };

  static propTypes = {
      selectPortalStudent: PropTypes.func.isRequired,
      selectPortalConsultant: PropTypes.func.isRequired,
      selectPortalSchool: PropTypes.func.isRequired,
      selectPortalParent: PropTypes.func.isRequired,
  };

  _selectPortalStudent = () => {
    if (this.props.selectPortalStudent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalStudent();
      }
  }

  _selectPortalConsultant = () => {
    if (this.props.selectPortalConsultant) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalConsultant();
      }
  }

  _selectPortalSchool = () => {
    if (this.props.selectPortalSchool) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalSchool();
      }
  }

  _selectPortalParent = () => {
    if (this.props.selectPortalParent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalParent();
      }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.feedbackBox}>
          <Text style={styles.textStyles}>Here at MoveItMoveIt, we love to improve.</Text>
          <Text style={styles.textStyles}>Your input can help us do that. :)</Text>
          <Button
          title="Students"
          buttonStyle={{backgroundColor : '#c77ce8', borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={this._selectPortalStudent}/>

          <Button
          title="Consultants"
          buttonStyle={{backgroundColor : '#c77ce8', borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={this._selectPortalConsultant}/>

          <Button
          title="Educators"
          buttonStyle={{backgroundColor : '#c77ce8', borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={this._selectPortalSchool}/>

          <Button
          title="Parents"
          buttonStyle={{backgroundColor : '#c77ce8', borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 15}}
          onPress={this._selectPortalParent}/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentImage: {
    height: Metrics.screenHeight*.35,
    width: Metrics.screenWidth*.5,
    borderRadius: 15
  },
  textStyles : {
    textAlign : 'center',
    fontSize : 20,
    fontWeight : 'bold',
  }
});
